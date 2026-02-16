const fs = require('fs');
const zlib = require('zlib');
const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeUrl(url) {
  try {
    const u = new URL(String(url || ''));
    return `${u.origin}${u.pathname}`;
  } catch {
    return String(url || '');
  }
}

function pathOf(url) {
  try {
    return new URL(String(url || '')).pathname;
  } catch {
    return String(url || '');
  }
}

function originOf(url) {
  try {
    return new URL(String(url || '')).origin;
  } catch {
    return null;
  }
}

function b64ToBytesMaybe(data) {
  try {
    return Buffer.from(String(data || ''), 'base64');
  } catch {
    return null;
  }
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

function encodeVarint(value) {
  let v = BigInt(Math.max(0, Number(value || 0)));
  const out = [];
  while (v >= 0x80n) {
    out.push(Number((v & 0x7Fn) | 0x80n));
    v >>= 7n;
  }
  out.push(Number(v));
  return Buffer.from(out);
}

function encodeFieldVarint(fieldNo, value) {
  const tag = (Number(fieldNo) << 3) | 0;
  return Buffer.concat([encodeVarint(tag), encodeVarint(value)]);
}

function encodeFieldBytes(fieldNo, payload) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload || []);
  const tag = (Number(fieldNo) << 3) | 2;
  return Buffer.concat([encodeVarint(tag), encodeVarint(data.length), data]);
}

function buildGatewayActionPacket(handler, action, payload, timestampMs) {
  const parts = [];
  parts.push(encodeFieldVarint(1, handler));
  parts.push(encodeFieldVarint(2, action));
  parts.push(encodeFieldBytes(3, payload || Buffer.alloc(0)));
  parts.push(encodeFieldVarint(4, timestampMs));
  parts.push(encodeFieldVarint(5, 0));
  const msg = Buffer.concat(parts);
  return Buffer.concat([encodeVarint(msg.length), msg]);
}

function parseGatewayPacketFromWsFramePayload(payloadData) {
  const raw = b64ToBytesMaybe(payloadData);
  if (!raw || raw.length < 4) return null;

  const lenRead = readVarint(raw, 0);
  if (!lenRead) return null;
  const msgStart = lenRead.next;
  let msg = raw.subarray(msgStart);
  if (lenRead.val >= 0 && msgStart + lenRead.val <= raw.length) {
    msg = raw.subarray(msgStart, msgStart + lenRead.val);
  }

  let i = 0;
  let handler = null;
  let action = null;
  let payload = Buffer.alloc(0);
  let compressed = 0;
  let timestamp = null;

  while (i < msg.length) {
    const key = readVarint(msg, i);
    if (!key) break;
    i = key.next;
    const field = key.val >> 3;
    const wt = key.val & 0x7;

    if (wt === 0) {
      const v = readVarint(msg, i);
      if (!v) break;
      i = v.next;
      if (field === 1) handler = v.val;
      else if (field === 2) action = v.val;
      else if (field === 4) timestamp = v.val;
      else if (field === 5) compressed = v.val;
    } else if (wt === 2) {
      const ln = readVarint(msg, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > msg.length) break;
      const chunk = msg.subarray(start, end);
      if (field === 3) payload = Buffer.from(chunk);
      i = end;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }

  if (handler == null || action == null) return null;
  return {
    handler,
    action,
    payload,
    compressed,
    timestamp,
    frameLen: raw.length,
  };
}

function maybeInflate(payload, compressed) {
  if (!payload || !payload.length) return Buffer.alloc(0);
  if (Number(compressed || 0) !== 1) return payload;
  try {
    return zlib.inflateRawSync(payload);
  } catch {}
  try {
    return zlib.inflateSync(payload);
  } catch {}
  try {
    return zlib.gunzipSync(payload);
  } catch {}
  return payload;
}

function parseKeyValueMessage(buf) {
  let i = 0;
  let key = '';
  let value = '';
  while (i < buf.length) {
    const tag = readVarint(buf, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 2) {
      const ln = readVarint(buf, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > buf.length) break;
      const chunk = buf.subarray(start, end);
      if (field === 1) key = chunk.toString('utf8');
      else if (field === 2) value = chunk.toString('utf8');
      i = end;
    } else if (wt === 0) {
      const v = readVarint(buf, i);
      if (!v) break;
      i = v.next;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }
  return { key, value };
}

function parseCoordMessage(buf) {
  const out = { sector: null, x: null, y: null, region: null };
  let i = 0;
  while (i < buf.length) {
    const tag = readVarint(buf, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 0) {
      const v = readVarint(buf, i);
      if (!v) break;
      i = v.next;
      if (field === 1) out.sector = v.val;
      else if (field === 2) out.x = v.val;
      else if (field === 3) out.y = v.val;
      else if (field === 4) out.region = v.val;
    } else if (wt === 2) {
      const ln = readVarint(buf, i);
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
  return out;
}

function parseMapEntity(buf) {
  const out = {
    id: '',
    type: null,
    status: null,
    owner: null,
    coord: null,
    attributes: {},
  };
  let i = 0;
  while (i < buf.length) {
    const tag = readVarint(buf, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 0) {
      const v = readVarint(buf, i);
      if (!v) break;
      i = v.next;
      if (field === 2) out.type = v.val;
      else if (field === 4) out.status = v.val;
      else if (field === 6) out.owner = v.val;
    } else if (wt === 2) {
      const ln = readVarint(buf, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > buf.length) break;
      const chunk = buf.subarray(start, end);
      if (field === 1) out.id = chunk.toString('utf8');
      else if (field === 3) out.coord = parseCoordMessage(chunk);
      else if (field === 5) {
        const kv = parseKeyValueMessage(chunk);
        if (kv.key) out.attributes[kv.key] = kv.value;
      }
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

function parseVisibleEntitiesPayload(payloadBytes) {
  const entities = [];
  let i = 0;
  while (i < payloadBytes.length) {
    const tag = readVarint(payloadBytes, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 2) {
      const ln = readVarint(payloadBytes, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > payloadBytes.length) break;
      if (field === 1) entities.push(parseMapEntity(payloadBytes.subarray(start, end)));
      i = end;
    } else if (wt === 0) {
      const v = readVarint(payloadBytes, i);
      if (!v) break;
      i = v.next;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }
  return entities;
}

function extractLatestVisibleEntities(wsFrames) {
  for (let i = (wsFrames || []).length - 1; i >= 0; i -= 1) {
    const fr = wsFrames[i];
    if (!fr || fr.dir !== 'recv' || fr.action !== '2:1102') continue;
    const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
    if (!parsed) continue;
    const payload = maybeInflate(parsed.payload, parsed.compressed);
    const entities = parseVisibleEntitiesPayload(payload);
    if (entities.length > 0) return entities;
  }
  return [];
}

function inferSelfOwner(entities) {
  const counts = {};
  for (const row of entities || []) {
    if (Number(row.type) !== 1 || row.owner == null) continue;
    const owner = String(row.owner);
    const dmg = String((row.attributes || {}).damage || '');
    const weight = dmg === '0' ? 4 : 1;
    counts[owner] = (counts[owner] || 0) + weight;
  }
  let best = null;
  let bestScore = -1;
  for (const [owner, score] of Object.entries(counts)) {
    if (score > bestScore) {
      bestScore = score;
      best = owner;
    }
  }
  return best;
}

function pickSelfWorldPlatoonEntity(entities, selfOwner) {
  const type2 = (entities || []).filter((e) => Number(e.type) === 2 && e.id);
  if (!type2.length) return null;
  if (selfOwner != null) {
    for (const e of type2) {
      if (String(e.owner) === String(selfOwner)) return e;
    }
  }
  return type2[0];
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
        ascii: chunk.slice(0, 36).toString('utf8').replace(/[^\x20-\x7E]/g, '.'),
      });
      i = end;
    } else if (wt === 5) {
      if (i + 4 > buf.length) break;
      out.push({ field, wt, val: 'fixed32' });
      i += 4;
    } else if (wt === 1) {
      if (i + 8 > buf.length) break;
      out.push({ field, wt, val: 'fixed64' });
      i += 8;
    } else {
      break;
    }
  }
  return out;
}

function countFieldOneLenDelimited(buf) {
  let count = 0;
  let i = 0;
  while (i < buf.length) {
    const key = readVarint(buf, i);
    if (!key) break;
    i = key.next;
    const field = key.val >> 3;
    const wt = key.val & 0x7;
    if (wt === 2) {
      const ln = readVarint(buf, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > buf.length) break;
      if (field === 1) count += 1;
      i = end;
    } else if (wt === 0) {
      const v = readVarint(buf, i);
      if (!v) break;
      i = v.next;
    } else if (wt === 5) {
      i += 4;
    } else if (wt === 1) {
      i += 8;
    } else {
      break;
    }
  }
  return count;
}

function nowMs() {
  return Date.now();
}

(async () => {
  const liveUrl = process.env.LIVE_CAPTURE_URL || 'https://prod-kx-vip.sjc.kixeye.com/canvas';
  const out = {
    startedAt: new Date().toISOString(),
    startUrl: safeUrl(liveUrl),
    notes: [],
    pageErrors: [],
    console: [],
    requestEvents: [],
    responseEvents: [],
    loadingFailed: [],
    wsActions: [],
    wsFrames: [],
    screenshots: [],
    snapshots: [],
    cycle: {},
    summary: {},
    endedAt: null,
  };

  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1365, height: 768 } });
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    try {
      if (window.__wsProbeInstalled) return;
      window.__wsProbeInstalled = true;
      window.__wsProbeRows = [];
      const NativeWS = window.WebSocket;
      function WrappedWS(url, protocols) {
        const ws = protocols !== undefined ? new NativeWS(url, protocols) : new NativeWS(url);
        try {
          window.__wsProbeRows.push({
            createdAt: Date.now(),
            url: String(url || ''),
            readyState: ws.readyState,
            ws,
          });
          if (window.__wsProbeRows.length > 30) {
            window.__wsProbeRows.splice(0, window.__wsProbeRows.length - 20);
          }
        } catch {}
        return ws;
      }
      WrappedWS.prototype = NativeWS.prototype;
      Object.setPrototypeOf(WrappedWS, NativeWS);
      for (const k of Object.getOwnPropertyNames(NativeWS)) {
        try {
          if (!(k in WrappedWS)) WrappedWS[k] = NativeWS[k];
        } catch {}
      }
      window.WebSocket = WrappedWS;

      window.__wsProbeSendPackets = function (packets) {
        const rows = Array.isArray(window.__wsProbeRows) ? window.__wsProbeRows : [];
        const openRows = rows.filter((r) => r && r.ws && r.ws.readyState === 1);
        let chosen = null;
        for (const r of openRows) {
          const u = String(r.url || '').toLowerCase();
          if (u.includes('websocket') || u.includes(':4443')) {
            chosen = r;
            break;
          }
        }
        if (!chosen && openRows.length) chosen = openRows[0];
        if (!chosen || !chosen.ws) return { ok: false, reason: 'no-open-ws', openCount: openRows.length };
        const sent = [];
        for (const row of Array.isArray(packets) ? packets : []) {
          const bytes = Array.isArray(row && row.bytes) ? row.bytes : [];
          const label = String((row && row.label) || '');
          try {
            chosen.ws.send(Uint8Array.from(bytes).buffer);
            sent.push({ ok: true, label, len: bytes.length, t: Date.now() });
          } catch (e) {
            sent.push({ ok: false, label, len: bytes.length, error: String(e), t: Date.now() });
          }
        }
        return {
          ok: true,
          chosenUrl: String(chosen.url || ''),
          sent,
        };
      };
    } catch {}
  });

  page.on('console', (m) => {
    out.console.push({ t: nowMs(), type: m.type(), text: m.text() });
    if (out.console.length > 2400) out.console.splice(0, out.console.length - 1800);
  });
  page.on('pageerror', (e) => {
    out.pageErrors.push({ t: nowMs(), text: String(e) });
  });

  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Page.enable').catch(() => {});

  cdp.on('Network.requestWillBeSent', (e) => {
    const url = e.request && e.request.url ? e.request.url : '';
    out.requestEvents.push({
      t: nowMs(),
      requestId: e.requestId,
      method: e.request && e.request.method ? e.request.method : null,
      url: safeUrl(url),
      fullUrl: url,
      host: originOf(url),
      path: pathOf(url),
      type: e.type || null,
    });
    if (out.requestEvents.length > 8000) out.requestEvents.splice(0, out.requestEvents.length - 6000);
  });

  cdp.on('Network.responseReceived', (e) => {
    const url = e.response && e.response.url ? e.response.url : '';
    out.responseEvents.push({
      t: nowMs(),
      requestId: e.requestId,
      status: e.response && e.response.status ? e.response.status : null,
      url: safeUrl(url),
      fullUrl: url,
      host: originOf(url),
      path: pathOf(url),
      mimeType: e.response && e.response.mimeType ? e.response.mimeType : null,
    });
    if (out.responseEvents.length > 8000) out.responseEvents.splice(0, out.responseEvents.length - 6000);
  });

  cdp.on('Network.loadingFailed', (e) => {
    out.loadingFailed.push({
      t: nowMs(),
      requestId: e.requestId,
      errorText: e.errorText,
      blockedReason: e.blockedReason || null,
      canceled: !!e.canceled,
    });
  });

  function onWsFrame(dir, e) {
    const payloadData = e.response && typeof e.response.payloadData === 'string' ? e.response.payloadData : '';
    const parsed = parseGatewayPacketFromWsFramePayload(payloadData);
    if (!parsed) return;
    const actionKey = `${parsed.handler}:${parsed.action}`;
    out.wsActions.push({
      t: nowMs(),
      dir,
      requestId: e.requestId,
      action: actionKey,
      frameLen: parsed.frameLen,
      payloadLen: parsed.payload ? parsed.payload.length : 0,
      compressed: Number(parsed.compressed || 0),
    });
    out.wsFrames.push({
      t: nowMs(),
      dir,
      requestId: e.requestId,
      action: actionKey,
      frameLen: parsed.frameLen,
      compressed: Number(parsed.compressed || 0),
      payloadB64: payloadData,
    });
    if (out.wsFrames.length > 3000) out.wsFrames.splice(0, out.wsFrames.length - 2400);
  }

  cdp.on('Network.webSocketFrameSent', (e) => onWsFrame('sent', e));
  cdp.on('Network.webSocketFrameReceived', (e) => onWsFrame('recv', e));

  async function snapshot(label) {
    const snap = await page.evaluate((labelArg) => {
      const hx = window._hx_classes || {};
      const W = hx['com.cc.worldmap.Worldmap'];
      const c = W && W._controller ? W._controller : null;
      const PM = hx['com.cc.units.PlatoonManager'] || hx['PlatoonManager'];
      const pm = PM ? ((typeof PM.get_Instance === 'function' ? PM.get_Instance() : null) || PM._Instance || null) : null;

      function toArray(v, max = 180) {
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

      function platoonSummary(p) {
        return {
          id: callFirst(p, ['get_ID', 'id', '_ID']),
          entityId: callFirst(p, ['get_EntityID', 'get_entityId', 'entityId', '_EntityID']),
          state: callFirst(p, ['get_state', 'state', '_state']),
        };
      }

      const result = {
        label: labelArg,
        t: Date.now(),
        worldCount: 0,
        deployableCount: 0,
        undeployedCount: 0,
        worldSample: [],
      };

      try {
        if (pm) {
          const world = typeof pm.GetWorldMapPlatoonList === 'function' ? toArray(pm.GetWorldMapPlatoonList(true, false), 180) : [];
          const dep = typeof pm.GetDeployablePlatoonList === 'function' ? toArray(pm.GetDeployablePlatoonList(1), 180) : [];
          const und = typeof pm.GetUndeployedPlatoonList === 'function' ? toArray(pm.GetUndeployedPlatoonList(), 180) : [];
          result.worldCount = world.length;
          result.deployableCount = dep.length;
          result.undeployedCount = und.length;
          result.worldSample = world.slice(0, 8).map(platoonSummary);
        }
      } catch {}

      try {
        result.hasController = !!c;
      } catch {}
      return result;
    }, label);
    out.snapshots.push(snap);
    return snap;
  }

  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    out.notes.push('domcontentloaded');
    await sleep(35000);

    await page.screenshot({ path: 'tmp_live_ws_store_cycle_t0.png' });
    out.screenshots.push('tmp_live_ws_store_cycle_t0.png');

    try {
      await page.mouse.click(1295, 635); // world map tab
      out.notes.push('click:worldmap_tab');
    } catch (e) {
      out.notes.push(`click_fail:worldmap_tab:${String(e)}`);
    }

    await sleep(9000);
    await snapshot('baseline');

    const deployResult = await page.evaluate(() => {
      const hx = window._hx_classes || {};
      const W = hx['com.cc.worldmap.Worldmap'];
      const c = W && W._controller ? W._controller : null;
      const m = c && c._mapService ? c._mapService : null;
      const PM = hx['com.cc.units.PlatoonManager'] || hx['PlatoonManager'];
      const pm = PM ? ((typeof PM.get_Instance === 'function' ? PM.get_Instance() : null) || PM._Instance || null) : null;

      function toArray(v, max = 180) {
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

      const result = {
        ok: false,
        deployAttempted: false,
        sourcePlatoonId: null,
        homeEntityId: null,
        error: null,
      };

      try {
        if (!c || !m || !pm) {
          result.error = 'missing controller/mapService/platoonManager';
          return result;
        }

        const deployable = typeof pm.GetDeployablePlatoonList === 'function' ? toArray(pm.GetDeployablePlatoonList(1), 180) : [];
        const undeployed = typeof pm.GetUndeployedPlatoonList === 'function' ? toArray(pm.GetUndeployedPlatoonList(), 180) : [];
        const source = deployable[0] || undeployed[0] || null;
        const sourceId = callFirst(source, ['get_ID', 'id', '_ID']);
        result.sourcePlatoonId = sourceId != null ? String(sourceId) : null;

        let homeEntityId = null;
        try {
          const pb = c._playerBases;
          const home = pb && typeof pb.getHomeBase === 'function' ? pb.getHomeBase() : null;
          homeEntityId = callFirst(home, ['get_entityId', 'get_ID', 'entityId', '_entityId', 'id']);
        } catch {}
        if (homeEntityId == null && c._visibleEntityMap && typeof c._visibleEntityMap.getValues === 'function') {
          const entities = toArray(c._visibleEntityMap.getValues(), 240);
          for (const e of entities) {
            const t = callFirst(e, ['get_type', 'type', '_type']);
            if (Number(t) === 1) {
              homeEntityId = callFirst(e, ['get_entityId', 'get_ID', 'entityId', '_entityId', 'id']);
              if (homeEntityId != null) break;
            }
          }
        }
        result.homeEntityId = homeEntityId != null ? String(homeEntityId) : null;

        if (sourceId != null && homeEntityId != null && typeof m.deployPlatoon === 'function') {
          m.deployPlatoon(sourceId, homeEntityId, null, [], []);
          result.deployAttempted = true;
          result.ok = true;
        } else {
          result.error = 'missing sourceId/homeEntityId/deployFn';
        }
      } catch (e) {
        result.error = String(e);
      }
      return result;
    });
    out.cycle.deploy = deployResult;
    out.notes.push(`deploy=${JSON.stringify(deployResult)}`);

    await sleep(5000);
    await snapshot('after_deploy');

    const storeResult = await page.evaluate(() => {
      const hx = window._hx_classes || {};
      const W = hx['com.cc.worldmap.Worldmap'];
      const c = W && W._controller ? W._controller : null;
      const m = c && c._mapService ? c._mapService : null;
      const PM = hx['com.cc.units.PlatoonManager'] || hx['PlatoonManager'];
      const pm = PM ? ((typeof PM.get_Instance === 'function' ? PM.get_Instance() : null) || PM._Instance || null) : null;

      function toArray(v, max = 180) {
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

      const result = {
        ok: false,
        sendHomeAttempted: false,
        entityId: null,
        error: null,
      };
      try {
        if (!m || !pm) {
          result.error = 'missing mapService/platoonManager';
          return result;
        }
        const world = typeof pm.GetWorldMapPlatoonList === 'function' ? toArray(pm.GetWorldMapPlatoonList(true, false), 180) : [];
        const first = world[0] || null;
        const entityId = callFirst(first, ['get_EntityID', 'get_entityId', 'entityId', '_EntityID']);
        result.entityId = entityId != null ? String(entityId) : null;
        if (entityId != null && typeof m.sendPlatoonHome === 'function') {
          m.sendPlatoonHome(entityId);
          result.sendHomeAttempted = true;
          result.ok = true;
        } else {
          result.error = 'missing entityId/sendHomeFn';
        }
        if (typeof m.getVisibleEntities === 'function') {
          try {
            m.getVisibleEntities(0);
          } catch {}
        }
        if (typeof m.getBlockedRfBases === 'function') {
          try {
            m.getBlockedRfBases(0);
          } catch {}
        }
      } catch (e) {
        result.error = String(e);
      }
      return result;
    });
    out.cycle.store = storeResult;
    out.notes.push(`store=${JSON.stringify(storeResult)}`);

    if (!storeResult.ok) {
      const visible = extractLatestVisibleEntities(out.wsFrames);
      const selfOwner = inferSelfOwner(visible);
      const selfPlatoonEntity = pickSelfWorldPlatoonEntity(visible, selfOwner);
      if (selfPlatoonEntity && selfPlatoonEntity.id) {
        const rawPayload = encodeFieldBytes(1, Buffer.from(String(selfPlatoonEntity.id), 'utf8'));
        const rawPacket = buildGatewayActionPacket(2, 202, rawPayload, Date.now());
        const rawSend = await page.evaluate((rows) => {
          if (typeof window.__wsProbeSendPackets === 'function') return window.__wsProbeSendPackets(rows);
          return { ok: false, reason: 'ws-send-helper-missing' };
        }, [{ label: 'raw_store_home_from_visible_type2', bytes: Array.from(rawPacket) }]);
        out.cycle.rawStore = {
          ok: true,
          source: 'ws_raw_fallback',
          targetEntityId: String(selfPlatoonEntity.id),
          targetOwner: selfPlatoonEntity.owner != null ? String(selfPlatoonEntity.owner) : null,
          inferredSelfOwner: selfOwner != null ? String(selfOwner) : null,
          visibleType2Count: visible.filter((e) => Number(e.type) === 2).length,
          sendResult: rawSend,
        };
        out.notes.push(`raw_store=${JSON.stringify(out.cycle.rawStore)}`);
        await sleep(5000);
        await snapshot('after_raw_store');
      } else {
        out.cycle.rawStore = {
          ok: false,
          source: 'ws_raw_fallback',
          reason: 'no_visible_type2_entity',
          visibleCount: visible.length,
          inferredSelfOwner: selfOwner != null ? String(selfOwner) : null,
        };
        out.notes.push(`raw_store=${JSON.stringify(out.cycle.rawStore)}`);
      }
    }

    await sleep(15000);
    await snapshot('after_store');

    await page.screenshot({ path: 'tmp_live_ws_store_cycle_t1.png' });
    out.screenshots.push('tmp_live_ws_store_cycle_t1.png');
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    const wsActionCounts = {};
    for (const row of out.wsActions) {
      const key = `${row.dir}:${row.action}`;
      wsActionCounts[key] = (wsActionCounts[key] || 0) + 1;
    }

    const sentStore = out.wsActions.filter((r) => r.dir === 'sent' && r.action === '2:202');
    const storeWindows = sentStore.map((s) => {
      const windowRows = out.wsActions
        .filter((r) => r.t >= s.t && r.t <= s.t + 4000)
        .map((r) => ({ dt: r.t - s.t, dir: r.dir, action: r.action }));
      return { t: s.t, window: windowRows };
    });

    const recv1202 = [];
    const recv1102AroundStore = [];
    for (const fr of out.wsFrames) {
      if (fr.dir !== 'recv') continue;
      const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
      if (!parsed) continue;
      const action = `${parsed.handler}:${parsed.action}`;
      if (action === '2:1202') {
        const payload = maybeInflate(parsed.payload, parsed.compressed);
        recv1202.push({
          t: fr.t,
          payloadLen: payload.length,
          wire: parseWireShallow(payload, 40),
        });
      } else if (action === '2:1102') {
        let nearStore = false;
        for (const s of sentStore) {
          if (fr.t >= s.t - 300 && fr.t <= s.t + 2500) {
            nearStore = true;
            break;
          }
        }
        if (nearStore) {
          const payload = maybeInflate(parsed.payload, parsed.compressed);
          recv1102AroundStore.push({
            t: fr.t,
            payloadLen: payload.length,
            entityCountField1: countFieldOneLenDelimited(payload),
            wire: parseWireShallow(payload, 20),
          });
        }
      }
    }

    out.summary = {
      requestCount: out.requestEvents.length,
      responseCount: out.responseEvents.length,
      failedCount: out.loadingFailed.length,
      wsCapturedFrames: out.wsFrames.length,
      wsActionCounts,
      sentStoreCount: sentStore.length,
      sentDeployCount: out.wsActions.filter((r) => r.dir === 'sent' && r.action === '2:200').length,
      recvStoreAckCount: recv1202.length,
      recvVisibleAroundStoreCount: recv1102AroundStore.length,
      storeWindows,
      recv1202,
      recv1102AroundStore,
      cycle: out.cycle,
      snapshots: out.snapshots,
    };

    out.endedAt = new Date().toISOString();
    fs.writeFileSync('tmp_live_capture_ws_store_cycle_signed.json', JSON.stringify(out, null, 2));
    await browser.close();
  }
})();
