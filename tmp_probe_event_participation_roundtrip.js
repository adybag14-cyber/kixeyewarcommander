const fs = require('fs');
const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readVarint(buf, start) {
  let shift = 0n;
  let val = 0n;
  let i = start;
  while (i < buf.length) {
    const b = BigInt(buf[i]);
    i += 1;
    val |= (b & 0x7Fn) << shift;
    if ((b & 0x80n) === 0n) return { val: Number(val), next: i };
    shift += 7n;
    if (shift > 63n) break;
  }
  return null;
}

function decodeActionMessage(msg) {
  const out = { handler: null, action: null };
  let i = 0;
  while (i < msg.length) {
    const tag = readVarint(msg, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 0) {
      const v = readVarint(msg, i);
      if (!v) break;
      i = v.next;
      if (field === 1) out.handler = v.val;
      else if (field === 2) out.action = v.val;
    } else if (wt === 2) {
      const ln = readVarint(msg, i);
      if (!ln) break;
      i = ln.next + ln.val;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }
  if (out.handler == null || out.action == null) return null;
  return out;
}

function decodeDelimitedActions(buf) {
  const rows = [];
  let i = 0;
  while (i < buf.length) {
    if (buf[i] === 0) {
      i += 1;
      continue;
    }
    const ln = readVarint(buf, i);
    if (!ln) break;
    i = ln.next;
    const end = i + ln.val;
    if (end > buf.length) break;
    const row = decodeActionMessage(buf.subarray(i, end));
    if (row) rows.push(row);
    i = end;
  }
  return rows;
}

function extractU8Payload(text) {
  const m = String(text || '').match(/u8\s*:\s*([0-9,\s-]+)/i);
  if (!m) return Buffer.alloc(0);
  const vals = [];
  for (const part of m[1].split(',')) {
    const n = Number(String(part || '').trim());
    if (Number.isFinite(n)) vals.push((n | 0) & 255);
  }
  return vals.length ? Buffer.from(vals) : Buffer.alloc(0);
}

(async () => {
  const out = {
    startedAt: new Date().toISOString(),
    steps: [],
    pageErrors: [],
    console: [],
    sentMessages: [],
    gatewaySentActions: [],
    snapshots: [],
    summary: {},
  };

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  page.on('console', (m) => out.console.push({ t: Date.now(), type: m.type(), text: m.text() }));
  page.on('pageerror', (e) => out.pageErrors.push({ t: Date.now(), text: String(e) }));
  page.on('request', (req) => {
    try {
      const url = req.url();
      if (!url.includes('/gateway/action')) return;
      const body = req.postData() || '';
      const u8 = extractU8Payload(body);
      const rows = decodeDelimitedActions(u8);
      for (const row of rows) {
        out.gatewaySentActions.push({ t: Date.now(), key: `${row.handler}:${row.action}` });
      }
    } catch {}
  });

  await page.goto('http://127.0.0.1:8089/index.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(90000);

  await page.evaluate(() => {
    const hx = window._hx_classes || {};
    const W = hx['com.cc.worldmap.Worldmap'];
    const c = W && W._controller ? W._controller : null;
    const m = c && c._mapService ? c._mapService : null;
    const conn = m && m.connection ? m.connection : null;
    window.__eventParticipationProbe = window.__eventParticipationProbe || { sent: [] };
    if (conn && typeof conn.sendMessage === 'function' && !conn.__eventParticipationPatched) {
      const originalSend = conn.sendMessage;
      conn.sendMessage = function (handler, action, payload) {
        window.__eventParticipationProbe.sent.push({ t: Date.now(), handler, action });
        return originalSend.apply(this, arguments);
      };
      conn.__eventParticipationPatched = true;
    }
  });

  async function snapshot(label) {
    const snap = await page.evaluate((labelArg) => {
      const hx = window._hx_classes || {};
      const W = hx['com.cc.worldmap.Worldmap'];
      const c = W && W._controller ? W._controller : null;
      const m = c && c._mapService ? c._mapService : null;

      function grab(obj, prefix) {
        const rows = {};
        if (!obj) return rows;
        try {
          for (const key of Object.keys(obj)) {
            if (!/particip/i.test(key)) continue;
            try {
              const v = obj[key];
              if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string' || v == null) {
                rows[`${prefix}.${key}`] = v;
              }
            } catch {}
          }
        } catch {}
        try {
          const proto = Object.getPrototypeOf(obj);
          if (proto) {
            for (const key of Object.getOwnPropertyNames(proto)) {
              if (!/particip/i.test(key)) continue;
              try {
                const fn = obj[key];
                if (typeof fn === 'function' && fn.length === 0) {
                  const v = fn.call(obj);
                  if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string' || v == null) {
                    rows[`${prefix}.${key}()`] = v;
                  }
                }
              } catch {}
            }
          }
        } catch {}
        return rows;
      }

      return {
        label: labelArg,
        t: Date.now(),
        controller: grab(c, 'controller'),
        mapService: grab(m, 'mapService'),
      };
    }, label);
    out.snapshots.push(snap);
    return snap;
  }

  out.steps.push({ t: Date.now(), step: 'open_worldmap' });
  await page.mouse.click(1314, 583);
  await sleep(10000);
  await snapshot('world_before_toggle');

  out.steps.push({ t: Date.now(), step: 'toggle_true' });
  const toggleTrue = await page.evaluate(() => {
    const hx = window._hx_classes || {};
    const W = hx['com.cc.worldmap.Worldmap'];
    const c = W && W._controller ? W._controller : null;
    const m = c && c._mapService ? c._mapService : null;
    const res = { controller: false, mapService: false, errors: [] };
    try {
      if (c && typeof c.toggleBaseEventParticipation === 'function') {
        c.toggleBaseEventParticipation(true);
        res.controller = true;
      }
    } catch (e) {
      res.errors.push('controller:true:' + String(e));
    }
    try {
      if (m && typeof m.updateBaseEventParticipation === 'function') {
        m.updateBaseEventParticipation(true);
        res.mapService = true;
      }
    } catch (e) {
      res.errors.push('mapService:true:' + String(e));
    }
    return res;
  });
  out.steps.push({ t: Date.now(), step: 'toggle_true_result', result: toggleTrue });
  await sleep(3000);
  await snapshot('world_after_toggle_true');

  out.steps.push({ t: Date.now(), step: 'roundtrip_to_base' });
  await page.mouse.click(1314, 583);
  await sleep(9000);
  out.steps.push({ t: Date.now(), step: 'roundtrip_back_worldmap' });
  await page.mouse.click(1314, 583);
  await sleep(10000);
  await snapshot('world_after_roundtrip');

  out.steps.push({ t: Date.now(), step: 'toggle_false' });
  const toggleFalse = await page.evaluate(() => {
    const hx = window._hx_classes || {};
    const W = hx['com.cc.worldmap.Worldmap'];
    const c = W && W._controller ? W._controller : null;
    const m = c && c._mapService ? c._mapService : null;
    const res = { controller: false, mapService: false, errors: [] };
    try {
      if (c && typeof c.toggleBaseEventParticipation === 'function') {
        c.toggleBaseEventParticipation(false);
        res.controller = true;
      }
    } catch (e) {
      res.errors.push('controller:false:' + String(e));
    }
    try {
      if (m && typeof m.updateBaseEventParticipation === 'function') {
        m.updateBaseEventParticipation(false);
        res.mapService = true;
      }
    } catch (e) {
      res.errors.push('mapService:false:' + String(e));
    }
    return res;
  });
  out.steps.push({ t: Date.now(), step: 'toggle_false_result', result: toggleFalse });
  await sleep(3000);
  await snapshot('world_after_toggle_false');

  out.sentMessages = await page.evaluate(() => {
    return (window.__eventParticipationProbe && Array.isArray(window.__eventParticipationProbe.sent))
      ? window.__eventParticipationProbe.sent.slice(-400)
      : [];
  });

  await page.screenshot({ path: 'tmp_probe_event_participation_roundtrip.png' });

  const sentCounts = {};
  for (const row of out.sentMessages) {
    const key = `${row.handler}:${row.action}`;
    sentCounts[key] = (sentCounts[key] || 0) + 1;
  }
  const gatewaySentCounts = {};
  for (const row of out.gatewaySentActions) {
    const key = String(row.key || '');
    if (!key) continue;
    gatewaySentCounts[key] = (gatewaySentCounts[key] || 0) + 1;
  }

  out.summary = {
    pageErrors: out.pageErrors.length,
    sentCounts,
    gatewaySentCounts,
    toggleRequestsSent: Number(gatewaySentCounts['3:28'] || 0),
    toggleTrueCalled: !!(toggleTrue && (toggleTrue.controller || toggleTrue.mapService)),
    toggleFalseCalled: !!(toggleFalse && (toggleFalse.controller || toggleFalse.mapService)),
    snapshotCount: out.snapshots.length,
    pass: Number(gatewaySentCounts['3:28'] || 0) >= 2 &&
      !!(toggleTrue && (toggleTrue.controller || toggleTrue.mapService)) &&
      !!(toggleFalse && (toggleFalse.controller || toggleFalse.mapService)),
  };

  out.endedAt = new Date().toISOString();
  fs.writeFileSync('tmp_probe_event_participation_roundtrip.json', JSON.stringify(out, null, 2));
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(
    'tmp_probe_event_participation_roundtrip.json',
    JSON.stringify({ startedAt: new Date().toISOString(), error: String(err), endedAt: new Date().toISOString() }, null, 2)
  );
  process.exitCode = 1;
});
