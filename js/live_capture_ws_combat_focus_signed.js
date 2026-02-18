const fs = require('fs');
const zlib = require('zlib');
const puppeteer = require('puppeteer');

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    if ((b & 0x80n) === 0n) {
      return { val: Number(val), next: i };
    }
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

function encodeFieldBool(fieldNo, value) {
  return encodeFieldVarint(fieldNo, value ? 1 : 0);
}

function buildCoordPayload(sector, x, y, region) {
  const parts = [];
  parts.push(encodeFieldVarint(1, sector));
  parts.push(encodeFieldVarint(2, x));
  parts.push(encodeFieldVarint(3, y));
  parts.push(encodeFieldVarint(4, region));
  return Buffer.concat(parts);
}

function buildGatewayActionPacket(handler, action, payload, timestampMs) {
  const parts = [];
  parts.push(encodeFieldVarint(1, handler));
  parts.push(encodeFieldVarint(2, action));
  parts.push(encodeFieldBytes(3, payload || Buffer.alloc(0)));
  parts.push(encodeFieldVarint(4, timestampMs));
  parts.push(encodeFieldVarint(5, 0)); // compressed=false
  const msg = Buffer.concat(parts);
  return Buffer.concat([encodeVarint(msg.length), msg]);
}

function buildGetVisibleEntitiesPayload(regionId) {
  return encodeFieldVarint(1, regionId);
}

function buildCanScoutPayload(entityId, advanced = false, invadeHex = false, directDeploy = false) {
  const parts = [];
  parts.push(encodeFieldBytes(1, Buffer.from(String(entityId || ''), 'utf8')));
  parts.push(encodeFieldBool(2, !!advanced));
  parts.push(encodeFieldBool(3, !!invadeHex));
  parts.push(encodeFieldBool(4, !!directDeploy));
  return Buffer.concat(parts);
}

function buildKVMessage(key, value) {
  const parts = [];
  parts.push(encodeFieldBytes(1, Buffer.from(String(key || ''), 'utf8')));
  parts.push(encodeFieldBytes(2, Buffer.from(String(value || ''), 'utf8')));
  return Buffer.concat(parts);
}

function buildBattleEntityPayload(npcType = null) {
  const parts = [];
  if (npcType != null && Number.isFinite(Number(npcType))) {
    parts.push(encodeFieldVarint(1, Number(npcType)));
  }
  return Buffer.concat(parts);
}

function buildStartAttackPayload(target, baseId = null, gameData = [], attackers = []) {
  const parts = [];
  for (const attacker of Array.isArray(attackers) ? attackers : []) {
    if (!attacker || !Buffer.isBuffer(attacker) || !attacker.length) continue;
    parts.push(encodeFieldBytes(1, attacker));
  }
  parts.push(encodeFieldBytes(2, Buffer.from(String(target || ''), 'utf8')));
  if (baseId != null && Number.isFinite(Number(baseId))) {
    parts.push(encodeFieldVarint(3, Number(baseId)));
  }
  for (const row of Array.isArray(gameData) ? gameData : []) {
    if (!row || typeof row !== 'object') continue;
    const key = String(row.key || '').trim();
    const value = String(row.value || '').trim();
    if (!key) continue;
    parts.push(encodeFieldBytes(4, buildKVMessage(key, value)));
  }
  return Buffer.concat(parts);
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
      const val = readVarint(msg, i);
      if (!val) break;
      i = val.next;
      if (field === 1) handler = val.val;
      else if (field === 2) action = val.val;
      else if (field === 4) timestamp = val.val;
      else if (field === 5) compressed = val.val;
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
      if (field === 1) {
        out.id = chunk.toString('utf8');
      } else if (field === 3) {
        out.coord = parseCoordMessage(chunk);
      } else if (field === 5) {
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
      if (field === 1) {
        entities.push(parseMapEntity(payloadBytes.subarray(start, end)));
      }
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

function parseNearbyEntitiesPayload(payloadBytes) {
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
      // Nearby payload shape: field(1)=typeId, repeated field(2)=MapEntity bytes.
      if (field === 2) {
        entities.push(parseMapEntity(payloadBytes.subarray(start, end)));
      }
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
        ascii: chunk.slice(0, 28).toString('utf8').replace(/[^\x20-\x7E]/g, '.'),
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

function extractLargestVisibleEntitySet(wsFrames) {
  let best = [];
  for (const fr of wsFrames || []) {
    if (fr.dir !== 'recv') continue;
    if (fr.action !== '2:1102' && fr.action !== '2:1103') continue;
    const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
    if (!parsed) continue;
    const payload = maybeInflate(parsed.payload, parsed.compressed);
    const entities = fr.action === '2:1103'
      ? parseNearbyEntitiesPayload(payload)
      : parseVisibleEntitiesPayload(payload);
    if (entities.length > best.length) best = entities;
  }
  return best;
}

function inferSelfOwner(entities) {
  const counts = {};
  for (const row of entities || []) {
    if (row.type !== 1 || row.owner == null) continue;
    const owner = String(row.owner);
    const damage = String((row.attributes || {}).damage || '');
    const weight = damage === '0' ? 4 : 1;
    counts[owner] = (counts[owner] || 0) + weight;
  }
  let bestOwner = null;
  let bestScore = -1;
  for (const [owner, score] of Object.entries(counts)) {
    if (score > bestScore) {
      bestScore = score;
      bestOwner = owner;
    }
  }
  return bestOwner;
}

function pickAttackTargets(entities, selfOwner) {
  const out = [];
  const seen = new Set();
  const priority = (row) => {
    const attrs = row.attributes || {};
    const tag = String(attrs.analyticsTag || '').toLowerCase();
    if (tag === 'retaliation') return 1;
    if (tag === 'event') return 2;
    if (tag === 'faction') return 3;
    return 10;
  };

  const isForeign = (row) => {
    if (selfOwner == null || row.owner == null) return true;
    return String(row.owner) !== String(selfOwner);
  };

  const type3 = (entities || [])
    .filter((e) => e && e.type === 3 && e.id && isForeign(e))
    .sort((a, b) => priority(a) - priority(b));

  for (const row of type3) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
    if (out.length >= 4) return out;
  }

  const type1 = (entities || [])
    .filter((e) => e && e.type === 1 && e.id && isForeign(e))
    .sort((a, b) => priority(a) - priority(b));

  for (const row of type1) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    out.push(row);
    if (out.length >= 4) return out;
  }

  return out;
}

async function main() {
  const liveUrl = process.env.LIVE_CAPTURE_URL;
  if (!liveUrl) {
    console.error('Missing env var LIVE_CAPTURE_URL');
    process.exit(2);
  }

  const out = {
    startedAt: new Date().toISOString(),
    startUrl: safeUrl(liveUrl),
    notes: [],
    pageErrors: [],
    console: [],
    requestEvents: [],
    responseEvents: [],
    loadingFailed: [],
    wsFrames: [],
    wsActions: [],
    probeSends: [],
    screenshots: [],
    summary: {},
  };

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--ignore-certificate-errors',
      '--allow-insecure-localhost',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

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

      window.__wsProbeList = function () {
        const rows = Array.isArray(window.__wsProbeRows) ? window.__wsProbeRows : [];
        return rows.map((r, idx) => {
          const ws = r && r.ws ? r.ws : null;
          return {
            idx,
            url: r ? r.url : '',
            createdAt: r ? r.createdAt : 0,
            readyState: ws ? ws.readyState : null,
          };
        });
      };

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
        if (!chosen || !chosen.ws) {
          return { ok: false, reason: 'no-open-ws', openCount: openRows.length };
        }

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
    out.console.push({ t: Date.now(), type: m.type(), text: m.text() });
    if (out.console.length > 2500) out.console.splice(0, out.console.length - 1900);
  });
  page.on('pageerror', (e) => {
    out.pageErrors.push({ t: Date.now(), text: String(e) });
    if (out.pageErrors.length > 800) out.pageErrors.splice(0, out.pageErrors.length - 700);
  });

  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Page.enable').catch(() => {});

  cdp.on('Network.requestWillBeSent', (e) => {
    const url = e.request && e.request.url ? e.request.url : '';
    out.requestEvents.push({
      t: Date.now(),
      requestId: e.requestId,
      method: e.request && e.request.method,
      url: safeUrl(url),
      fullUrl: url,
      host: originOf(url),
      path: pathOf(url),
      type: e.type || null,
    });
    if (out.requestEvents.length > 9000) out.requestEvents.splice(0, out.requestEvents.length - 7000);
  });

  cdp.on('Network.responseReceived', (e) => {
    const url = e.response && e.response.url ? e.response.url : '';
    out.responseEvents.push({
      t: Date.now(),
      requestId: e.requestId,
      status: e.response && e.response.status,
      url: safeUrl(url),
      fullUrl: url,
      host: originOf(url),
      path: pathOf(url),
      mimeType: e.response && e.response.mimeType ? e.response.mimeType : null,
    });
    if (out.responseEvents.length > 9000) out.responseEvents.splice(0, out.responseEvents.length - 7000);
  });

  cdp.on('Network.loadingFailed', (e) => {
    out.loadingFailed.push({
      t: Date.now(),
      requestId: e.requestId,
      errorText: e.errorText,
      blockedReason: e.blockedReason || null,
      canceled: !!e.canceled,
    });
  });

  function onWsFrame(dir, e) {
    const payload = e.response && typeof e.response.payloadData === 'string' ? e.response.payloadData : '';
    const prefix = parseGatewayPacketFromWsFramePayload(payload);
    if (!prefix) return;
    const actionKey = `${prefix.handler}:${prefix.action}`;
    out.wsActions.push({
      t: Date.now(),
      dir,
      requestId: e.requestId,
      action: actionKey,
      frameLen: prefix.frameLen,
      payloadLen: prefix.payload ? prefix.payload.length : 0,
      compressed: Number(prefix.compressed || 0),
    });
    out.wsFrames.push({
      t: Date.now(),
      dir,
      requestId: e.requestId,
      action: actionKey,
      frameLen: prefix.frameLen,
      compressed: Number(prefix.compressed || 0),
      payloadB64: payload,
    });
    if (out.wsFrames.length > 2400) out.wsFrames.splice(0, out.wsFrames.length - 1800);
  }

  cdp.on('Network.webSocketFrameSent', (e) => onWsFrame('sent', e));
  cdp.on('Network.webSocketFrameReceived', (e) => onWsFrame('recv', e));

  let combatSendEpoch = 0;
  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    out.notes.push('domcontentloaded');
    await sleep(32000);

    await page.screenshot({ path: 'tmp_live_ws_combat_focus_t0.png' });
    out.screenshots.push('tmp_live_ws_combat_focus_t0.png');

    try {
      await page.mouse.click(1295, 635); // world map tab
      out.notes.push('click:worldmap_tab');
    } catch (e) {
      out.notes.push(`click_fail:worldmap_tab:${String(e)}`);
    }
    await sleep(9000);

    // Prime map entity state.
    const tPrime = Date.now();
    const primePackets = [
      {
        label: 'visible_entities_region_0',
        bytes: Array.from(buildGatewayActionPacket(2, 102, buildGetVisibleEntitiesPayload(0), tPrime)),
      },
      {
        label: 'blocked_rf_bases_region_0',
        bytes: Array.from(buildGatewayActionPacket(2, 106, encodeFieldVarint(1, 0), tPrime + 1)),
      },
    ];
    const nearbyTypeIds = [5, 6, 7, 8, 10];
    for (let i = 0; i < nearbyTypeIds.length; i += 1) {
      const typeId = nearbyTypeIds[i];
      primePackets.push({
        label: `nearby_type_${typeId}`,
        bytes: Array.from(
          buildGatewayActionPacket(
            2,
            103,
            Buffer.concat([
              encodeFieldBytes(1, buildCoordPayload(199, 268, 377, 0)),
              encodeFieldVarint(2, typeId),
            ]),
            tPrime + 2 + i
          )
        ),
      });
    }
    const primeSend = await page.evaluate((rows) => {
      if (typeof window.__wsProbeSendPackets === 'function') return window.__wsProbeSendPackets(rows);
      return { ok: false, reason: 'ws-send-helper-missing' };
    }, primePackets);
    out.probeSends.push({ t: Date.now(), phase: 'prime', sendResult: primeSend });
    await sleep(10000);

    const visibleEntities = extractLargestVisibleEntitySet(out.wsFrames);
    const selfOwner = inferSelfOwner(visibleEntities);
    const targets = pickAttackTargets(visibleEntities, selfOwner);
    const target = targets.length ? targets[0] : null;
    const selfBase = (visibleEntities || []).find(
      (row) => row && row.type === 1 && row.id && selfOwner != null && row.owner != null && String(row.owner) === String(selfOwner)
    ) || null;

    let chosenPlatoon = '';
    for (const row of visibleEntities) {
      if (!row || row.type !== 2) continue;
      const pid = String((row.attributes || {}).platoonId || '').trim();
      if (pid) {
        chosenPlatoon = pid;
        break;
      }
    }

    out.notes.push(`visible_entities=${visibleEntities.length}`);
    out.notes.push(`self_owner=${selfOwner || ''}`);
    out.notes.push(`target_candidates=${targets.map((t) => `${t.id}:${t.type}`).join(',')}`);
    out.notes.push(`self_base=${selfBase && selfBase.id ? selfBase.id : ''}`);
    out.notes.push(`chosen_platoon=${chosenPlatoon || ''}`);

    if (target && target.id) {
      const baseIdRaw = (target.attributes || {}).baseId;
      let baseId = null;
      if (baseIdRaw != null && String(baseIdRaw).trim() !== '') {
        const n = Number(baseIdRaw);
        if (Number.isFinite(n) && n >= 0) baseId = Math.trunc(n);
      }

      const attackPackets = [];
      const t0 = Date.now();
      combatSendEpoch = t0;

      // Scout checks first.
      attackPackets.push({
        label: `can_scout_basic:${target.id}`,
        bytes: Array.from(buildGatewayActionPacket(2, 104, buildCanScoutPayload(target.id, false, false, false), t0)),
      });
      attackPackets.push({
        label: `can_scout_invade:${target.id}`,
        bytes: Array.from(buildGatewayActionPacket(2, 104, buildCanScoutPayload(target.id, false, true, false), t0 + 1)),
      });

      // Start-attack payload variants.
      attackPackets.push({
        label: `start_attack_target_only:${target.id}`,
        bytes: Array.from(buildGatewayActionPacket(3, 3, buildStartAttackPayload(target.id, null, []), t0 + 2)),
      });

      if (baseId != null) {
        attackPackets.push({
          label: `start_attack_with_baseid:${target.id}:${baseId}`,
          bytes: Array.from(buildGatewayActionPacket(3, 3, buildStartAttackPayload(target.id, baseId, []), t0 + 3)),
        });
      }

      if (chosenPlatoon) {
        attackPackets.push({
          label: `start_attack_with_chosen_platoon:${target.id}:${chosenPlatoon}`,
          bytes: Array.from(
            buildGatewayActionPacket(
              3,
              3,
              buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: chosenPlatoon }]),
              t0 + 4
            )
          ),
        });
        attackPackets.push({
          label: `start_attack_with_platoon_invade:${target.id}:${chosenPlatoon}`,
          bytes: Array.from(
            buildGatewayActionPacket(
              3,
              3,
              buildStartAttackPayload(target.id, baseId, [
                { key: 'chosenPlatoon', value: chosenPlatoon },
                { key: 'invadeHex', value: '1' },
              ]),
              t0 + 5
            )
          ),
        });
      }

      if (selfBase && selfBase.id) {
        const eventAttacker = buildBattleEntityPayload(2);
        const randomRfAttacker = buildBattleEntityPayload(1);
        attackPackets.push({
          label: `start_attack_event_rf_home:${selfBase.id}`,
          bytes: Array.from(
            buildGatewayActionPacket(
              3,
              3,
              buildStartAttackPayload(selfBase.id, null, [], [eventAttacker]),
              t0 + 6
            )
          ),
        });
        attackPackets.push({
          label: `start_attack_random_rf_home:${selfBase.id}`,
          bytes: Array.from(
            buildGatewayActionPacket(
              3,
              3,
              buildStartAttackPayload(selfBase.id, null, [], [randomRfAttacker]),
              t0 + 7
            )
          ),
        });
      }

      const attackSend = await page.evaluate((rows) => {
        if (typeof window.__wsProbeSendPackets === 'function') return window.__wsProbeSendPackets(rows);
        return { ok: false, reason: 'ws-send-helper-missing' };
      }, attackPackets);
      out.probeSends.push({
        t: Date.now(),
        phase: 'combat_attempt',
        target: {
          id: target.id,
          type: target.type,
          owner: target.owner,
          attrs: target.attributes || {},
          coord: target.coord || null,
          baseId,
        },
        chosenPlatoon,
        sendResult: attackSend,
      });
    } else {
      out.probeSends.push({
        t: Date.now(),
        phase: 'combat_attempt',
        sendResult: { ok: false, reason: 'no_target_found' },
      });
    }

    // Nudge UI to provoke any server/client follow-up processing.
    try {
      await page.mouse.click(683, 380);
      await sleep(2200);
      await page.mouse.click(1268, 585);
      await sleep(2200);
      await page.mouse.click(1315, 585);
      out.notes.push('ui_nudge_clicks');
    } catch (e) {
      out.notes.push(`ui_nudge_fail:${String(e)}`);
    }

    await sleep(28000);
    await page.screenshot({ path: 'tmp_live_ws_combat_focus_t1.png' });
    out.screenshots.push('tmp_live_ws_combat_focus_t1.png');
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    const actionCounts = {};
    for (const row of out.wsActions) {
      const key = `${row.dir}:${row.action}`;
      actionCounts[key] = (actionCounts[key] || 0) + 1;
    }

    const visibleEntities = extractLargestVisibleEntitySet(out.wsFrames);
    const selfOwner = inferSelfOwner(visibleEntities);
    const targets = pickAttackTargets(visibleEntities, selfOwner);

    const combatRows = [];
    const combatResponseActions = new Set(['3:22', '3:4', '3:24', '3:27', '2:1104']);
    for (const fr of out.wsFrames) {
      if (fr.dir !== 'recv') continue;
      if (combatSendEpoch && fr.t < combatSendEpoch - 1000) continue;
      if (!combatResponseActions.has(fr.action)) continue;
      const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
      if (!parsed) continue;
      const payload = maybeInflate(parsed.payload, parsed.compressed);
      combatRows.push({
        t: fr.t,
        action: fr.action,
        compressed: parsed.compressed,
        payloadLen: payload.length,
        wire: parseWireShallow(payload, 120),
      });
    }

    const sentStartAttackRows = [];
    for (const fr of out.wsFrames) {
      if (fr.dir !== 'sent' || fr.action !== '3:3') continue;
      if (combatSendEpoch && fr.t < combatSendEpoch - 1000) continue;
      const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
      if (!parsed) continue;
      const payload = maybeInflate(parsed.payload, parsed.compressed);
      sentStartAttackRows.push({
        t: fr.t,
        payloadLen: payload.length,
        wire: parseWireShallow(payload, 120),
      });
    }

    const postCombatActions = {};
    for (const row of out.wsActions) {
      if (row.dir !== 'recv') continue;
      if (combatSendEpoch && row.t < combatSendEpoch - 1000) continue;
      postCombatActions[row.action] = (postCombatActions[row.action] || 0) + 1;
    }

    out.summary = {
      requestCount: out.requestEvents.length,
      responseCount: out.responseEvents.length,
      failedCount: out.loadingFailed.length,
      wsCapturedFrames: out.wsFrames.length,
      wsActionCounts: actionCounts,
      visibleEntityCount: visibleEntities.length,
      visibleEntityTypeCounts: (() => {
        const m = {};
        for (const e of visibleEntities) {
          const k = String(e.type == null ? 'null' : e.type);
          m[k] = (m[k] || 0) + 1;
        }
        return m;
      })(),
      inferredSelfOwner: selfOwner,
      attackTargetCandidates: targets.slice(0, 6),
      postCombatActions,
      combatResponses: combatRows.slice(0, 20),
      sentStartAttackPayloads: sentStartAttackRows.slice(0, 12),
    };

    out.endedAt = new Date().toISOString();
    fs.writeFileSync('tmp_live_capture_ws_combat_focus_signed.json', JSON.stringify(out, null, 2));
    try {
      await browser.close();
    } catch {}
  }
}

main().catch((e) => {
  try {
    fs.writeFileSync('tmp_live_capture_ws_combat_focus_signed_fatal.txt', String(e));
  } catch {}
  process.exit(1);
});
