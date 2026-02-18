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
    if ((b & 0x80n) === 0n) {
      return { val: Number(val), next: i };
    }
    shift += 7n;
    if (shift > 63n) break;
  }
  return null;
}

function parseWireShallow(buf, maxFields = 80) {
  const out = [];
  let i = 0;
  while (i < buf.length && out.length < maxFields) {
    const key = readVarint(buf, i);
    if (!key) break;
    i = key.next;
    const field = key.val >> 3;
    const wt = key.val & 0x7;
    if (wt === 0) {
      const v = readVarint(buf, i);
      if (!v) break;
      i = v.next;
      out.push({ field, wt, val: v.val });
    } else if (wt === 2) {
      const ln = readVarint(buf, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > buf.length) break;
      const chunk = buf.subarray(start, end);
      out.push({
        field,
        wt,
        len: ln.val,
        ascii: chunk.slice(0, 40).toString('utf8').replace(/[^\x20-\x7E]/g, '.'),
      });
      i = end;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }
  return out;
}

function decodeActionMessage(msg) {
  const out = {
    handler: null,
    action: null,
    payload: Buffer.alloc(0),
    timestamp: null,
    compressed: 0,
  };
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
      else if (field === 4) out.timestamp = v.val;
      else if (field === 5) out.compressed = v.val;
    } else if (wt === 2) {
      const ln = readVarint(msg, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > msg.length) break;
      if (field === 3) out.payload = Buffer.from(msg.subarray(start, end));
      i = end;
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

(async () => {
  const out = {
    startedAt: new Date().toISOString(),
    steps: [],
    notes: [],
    pageErrors: [],
    console: [],
    sentMessages: [],
    pollPackets: [],
    pollActions: [],
    summary: {},
  };

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  page.on('console', (m) => out.console.push({ t: Date.now(), type: m.type(), text: m.text() }));
  page.on('pageerror', (e) => out.pageErrors.push({ t: Date.now(), text: String(e) }));

  page.on('response', async (resp) => {
    try {
      const url = resp.url();
      if (!url.includes('/gateway/poll')) return;
      const body = await resp.buffer();
      const decoded = decodeDelimitedActions(body);
      out.pollPackets.push({
        t: Date.now(),
        status: resp.status(),
        bytes: body.length,
        decoded: decoded.length,
      });
      for (const row of decoded) {
        const key = `${row.handler}:${row.action}`;
        out.pollActions.push({
          t: Date.now(),
          key,
          payloadLen: row.payload.length,
          compressed: Number(row.compressed || 0),
          wire: (key === '3:4' || key === '2:1104') ? parseWireShallow(row.payload, 80) : [],
        });
      }
    } catch (e) {
      out.pageErrors.push({ t: Date.now(), text: 'poll decode error: ' + String(e) });
    }
  });

  await page.goto('http://127.0.0.1:8089/index.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(90000);

  await page.evaluate(() => {
    const hx = window._hx_classes || {};
    const W = hx['com.cc.worldmap.Worldmap'];
    const c = W && W._controller ? W._controller : null;
    const m = c && c._mapService ? c._mapService : null;
    const conn = m && m.connection ? m.connection : null;
    window.__localCombatProbe = window.__localCombatProbe || { sent: [] };
    if (conn && typeof conn.sendMessage === 'function' && !conn.__localCombatPatched) {
      const originalSend = conn.sendMessage;
      conn.sendMessage = function (handler, action, payload) {
        window.__localCombatProbe.sent.push({
          t: Date.now(),
          handler,
          action,
        });
        return originalSend.apply(this, arguments);
      };
      conn.__localCombatPatched = true;
    }
  });

  out.steps.push({ t: Date.now(), step: 'open_worldmap' });
  await page.mouse.click(1314, 583);
  await sleep(10000);

  out.steps.push({ t: Date.now(), step: 'prime_and_attack' });
  const actionResult = await page.evaluate(() => {
    const hx = window._hx_classes || {};
    const W = hx['com.cc.worldmap.Worldmap'];
    const c = W && W._controller ? W._controller : null;
    const m = c && c._mapService ? c._mapService : null;
    const result = {
      targetId: null,
      nearbyCalls: 0,
      canScoutCalls: 0,
      startAttackCalls: 0,
      errors: [],
    };

    function toArray(v, max = 200) {
      const arr = [];
      if (v == null) return arr;
      try {
        if (Array.isArray(v)) return v.slice(0, max);
        if (typeof v.length === 'number') {
          for (let i = 0; i < Math.min(v.length, max); i += 1) arr.push(v[i]);
          return arr;
        }
        if (typeof v.get_length === 'function' && typeof v.get === 'function') {
          const n = v.get_length();
          for (let i = 0; i < Math.min(n, max); i += 1) arr.push(v.get(i));
          return arr;
        }
        if (typeof v.iterator === 'function') {
          const it = v.iterator();
          while (it && typeof it.hasNext === 'function' && it.hasNext() && arr.length < max) {
            arr.push(it.next());
          }
          return arr;
        }
      } catch {}
      return arr;
    }

    function callFirst(obj, names) {
      if (!obj) return null;
      for (const n of names) {
        try {
          if (typeof obj[n] === 'function') return obj[n]();
        } catch {}
        try {
          if (obj[n] !== undefined) return obj[n];
        } catch {}
      }
      return null;
    }

    try {
      if (m && typeof m.getVisibleEntities === 'function') m.getVisibleEntities(0);
      if (m && typeof m.getBlockedRfBases === 'function') m.getBlockedRfBases(0);
    } catch (e) {
      result.errors.push('prime-getVisible/getBlocked: ' + String(e));
    }

    for (const typeId of [6, 7, 8, 10, 5]) {
      try {
        if (m && typeof m.nearby === 'function') {
          m.nearby(1, 0, 10, 10, typeId, null, null, null);
          result.nearbyCalls += 1;
        }
      } catch (e) {
        result.errors.push('nearby:' + typeId + ':' + String(e));
      }
    }

    try {
      const vals = (c && c._visibleEntityMap && typeof c._visibleEntityMap.getValues === 'function')
        ? toArray(c._visibleEntityMap.getValues(), 220)
        : [];
      for (const e of vals) {
        const t = Number(callFirst(e, ['get_type', 'type', '_type']));
        const id = callFirst(e, ['get_entityId', 'get_ID', 'entityId', '_entityId', 'id']);
        if (t === 3 && id != null) {
          result.targetId = String(id);
          break;
        }
      }
    } catch (e) {
      result.errors.push('target-resolve:' + String(e));
    }

    try {
      if (result.targetId && m) {
        if (typeof m.canScout === 'function') {
          m.canScout(result.targetId, false, false, false);
          m.canScout(result.targetId, false, true, false);
          result.canScoutCalls += 2;
        } else if (typeof m.canScoutBase === 'function') {
          m.canScoutBase(result.targetId, false, false, false);
          m.canScoutBase(result.targetId, false, true, false);
          result.canScoutCalls += 2;
        }
      }
    } catch (e) {
      result.errors.push('canScout:' + String(e));
    }

    try {
      if (c && typeof c.startEventRfAttack === 'function') {
        c.startEventRfAttack();
        result.startAttackCalls += 1;
      }
      if (m && typeof m.beginEventRfAttack === 'function' && result.targetId) {
        m.beginEventRfAttack(result.targetId);
        result.startAttackCalls += 1;
      }
    } catch (e) {
      result.errors.push('startAttack:' + String(e));
    }

    return result;
  });
  out.notes.push('actionResult=' + JSON.stringify(actionResult));

  await sleep(12000);
  await page.screenshot({ path: 'tmp_probe_local_gateway_combat_envelope.png' });

  out.sentMessages = await page.evaluate(() => {
    return (window.__localCombatProbe && Array.isArray(window.__localCombatProbe.sent))
      ? window.__localCombatProbe.sent.slice(-400)
      : [];
  });

  const sentCounts = {};
  for (const row of out.sentMessages) {
    const key = `${row.handler}:${row.action}`;
    sentCounts[key] = (sentCounts[key] || 0) + 1;
  }

  const recvCounts = {};
  for (const row of out.pollActions) {
    recvCounts[row.key] = (recvCounts[row.key] || 0) + 1;
  }

  const sentCanScout = Number(sentCounts['2:104'] || 0);
  const recvScout = Number(recvCounts['2:1104'] || 0);
  const sentStartAttack = Number(sentCounts['3:3'] || 0);
  const recvStartAttack = Number(recvCounts['3:4'] || 0);

  out.summary = {
    pageErrors: out.pageErrors.length,
    sentCounts,
    recvCounts,
    sentCanScout,
    recvScout,
    sentStartAttack,
    recvStartAttack,
    hasCombatRoundtrip: sentStartAttack > 0 && recvStartAttack > 0,
    hasScoutRoundtrip: sentCanScout === 0 ? null : recvScout > 0,
    pass: out.pageErrors.length === 0 && sentStartAttack > 0 && recvStartAttack > 0,
  };

  out.endedAt = new Date().toISOString();
  fs.writeFileSync('tmp_probe_local_gateway_combat_envelope.json', JSON.stringify(out, null, 2));
  await browser.close();
})().catch((err) => {
  fs.writeFileSync(
    'tmp_probe_local_gateway_combat_envelope.json',
    JSON.stringify({ startedAt: new Date().toISOString(), error: String(err), endedAt: new Date().toISOString() }, null, 2)
  );
  process.exitCode = 1;
});
