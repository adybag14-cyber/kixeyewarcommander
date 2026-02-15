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

function encodeSint32(value) {
  const n = Number(value || 0) | 0;
  const zigzag = ((n << 1) ^ (n >> 31)) >>> 0;
  return encodeVarint(zigzag);
}

function decodeSint32(value) {
  const v = Number(value || 0) >>> 0;
  return (v >>> 1) ^ -(v & 1);
}

function encodeFieldVarint(fieldNo, value) {
  const tag = (Number(fieldNo) << 3) | 0;
  return Buffer.concat([encodeVarint(tag), encodeVarint(value)]);
}

function encodeFieldSint32(fieldNo, value) {
  const tag = (Number(fieldNo) << 3) | 0;
  return Buffer.concat([encodeVarint(tag), encodeSint32(value)]);
}

function encodeFieldBytes(fieldNo, payload) {
  const data = Buffer.isBuffer(payload) ? payload : Buffer.from(payload || []);
  const tag = (Number(fieldNo) << 3) | 2;
  return Buffer.concat([encodeVarint(tag), encodeVarint(data.length), data]);
}

function buildCoordPayload(sector, x, y, region) {
  const parts = [];
  parts.push(encodeFieldVarint(1, sector));
  parts.push(encodeFieldVarint(2, x));
  parts.push(encodeFieldVarint(3, y));
  parts.push(encodeFieldVarint(4, region));
  return Buffer.concat(parts);
}

function buildNearbyRequestPayload({ sector, x, y, region, typeId }) {
  const parts = [];
  parts.push(encodeFieldBytes(1, buildCoordPayload(sector, x, y, region)));
  parts.push(encodeFieldVarint(2, typeId));
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

function parseNearbyResponsePayload(payloadBytes) {
  const out = {
    typeId: null,
    entities: [],
  };
  let i = 0;
  while (i < payloadBytes.length) {
    const tag = readVarint(payloadBytes, i);
    if (!tag) break;
    i = tag.next;
    const field = tag.val >> 3;
    const wt = tag.val & 0x7;
    if (wt === 0) {
      const v = readVarint(payloadBytes, i);
      if (!v) break;
      i = v.next;
      if (field === 1) out.typeId = decodeSint32(v.val);
    } else if (wt === 2) {
      const ln = readVarint(payloadBytes, i);
      if (!ln) break;
      const start = ln.next;
      const end = start + ln.val;
      if (end > payloadBytes.length) break;
      if (field === 2) {
        out.entities.push(parseMapEntity(payloadBytes.subarray(start, end)));
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

function summarizeEntityRows(entities) {
  const typeCounts = {};
  const specialTokens = {};
  const rfTypeCounts = {};
  for (const row of entities || []) {
    const t = String(row.type == null ? 'null' : row.type);
    typeCounts[t] = (typeCounts[t] || 0) + 1;
    const attrs = row.attributes || {};
    const specialRaw = String(attrs.specialAttributes || '').toLowerCase();
    if (specialRaw) {
      for (const token of specialRaw.split(',').map((s) => s.trim()).filter(Boolean)) {
        specialTokens[token] = (specialTokens[token] || 0) + 1;
      }
    }
    if (attrs.rogueFactionType != null && attrs.rogueFactionType !== '') {
      const key = String(attrs.rogueFactionType);
      rfTypeCounts[key] = (rfTypeCounts[key] || 0) + 1;
    }
  }
  return { typeCounts, specialTokens, rfTypeCounts };
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
    if (out.console.length > 2400) out.console.splice(0, out.console.length - 1800);
  });
  page.on('pageerror', (e) => {
    out.pageErrors.push({ t: Date.now(), text: String(e) });
    if (out.pageErrors.length > 700) out.pageErrors.splice(0, out.pageErrors.length - 600);
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
    if (out.requestEvents.length > 7000) out.requestEvents.splice(0, out.requestEvents.length - 5500);
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
    if (out.responseEvents.length > 7000) out.responseEvents.splice(0, out.responseEvents.length - 5500);
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
    if (out.wsFrames.length > 1800) out.wsFrames.splice(0, out.wsFrames.length - 1300);
  }

  cdp.on('Network.webSocketFrameSent', (e) => onWsFrame('sent', e));
  cdp.on('Network.webSocketFrameReceived', (e) => onWsFrame('recv', e));

  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    out.notes.push('domcontentloaded');
    await sleep(30000);

    await page.screenshot({ path: 'tmp_live_ws_nearby_probe_t0.png' });
    out.screenshots.push('tmp_live_ws_nearby_probe_t0.png');

    try {
      await page.mouse.click(1295, 635); // world map tab
      out.notes.push('click:worldmap_tab');
    } catch (e) {
      out.notes.push(`click_fail:worldmap_tab:${String(e)}`);
    }
    await sleep(9000);

    const wsBefore = await page.evaluate(() => {
      if (typeof window.__wsProbeList === 'function') return window.__wsProbeList();
      return [];
    });
    out.notes.push(`ws_before=${JSON.stringify(wsBefore)}`);

    const coord = { sector: 199, x: 268, y: 377, region: 0 };
    const typeIds = [5, 6, 7, 8, 10];
    const packets = [];
    const t0 = Date.now();
    for (let i = 0; i < typeIds.length; i += 1) {
      const typeId = typeIds[i];
      const reqPayload = buildNearbyRequestPayload({
        sector: coord.sector,
        x: coord.x,
        y: coord.y,
        region: coord.region,
        typeId,
      });
      const packet = buildGatewayActionPacket(2, 103, reqPayload, t0 + i);
      packets.push({
        label: `nearby_type_${typeId}`,
        bytes: Array.from(packet),
      });
    }

    // Include one visible-entities refresh and one blocked-rf-bases request.
    packets.push({
      label: 'visible_entities_region_0',
      bytes: Array.from(buildGatewayActionPacket(2, 102, Buffer.from([0x08, 0x00]), t0 + 20)),
    });
    packets.push({
      label: 'blocked_rf_bases',
      bytes: Array.from(buildGatewayActionPacket(2, 106, Buffer.alloc(0), t0 + 21)),
    });

    const sendResult = await page.evaluate((rows) => {
      if (typeof window.__wsProbeSendPackets === 'function') {
        return window.__wsProbeSendPackets(rows);
      }
      return { ok: false, reason: 'ws-send-helper-missing' };
    }, packets);
    out.probeSends.push({
      t: Date.now(),
      coord,
      sendResult,
    });

    await sleep(18000);
    await page.mouse.move(720, 360);
    await page.mouse.down();
    await page.mouse.move(860, 410, { steps: 8 });
    await page.mouse.up();
    out.notes.push('world_drag');
    await sleep(16000);

    await page.screenshot({ path: 'tmp_live_ws_nearby_probe_t1.png' });
    out.screenshots.push('tmp_live_ws_nearby_probe_t1.png');
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    const actionCounts = {};
    for (const row of out.wsActions) {
      const key = `${row.dir}:${row.action}`;
      actionCounts[key] = (actionCounts[key] || 0) + 1;
    }

    const visiblePackets = [];
    const nearbyPackets = [];
    for (const row of out.wsFrames) {
      if (row.dir !== 'recv') continue;
      const parsed = parseGatewayPacketFromWsFramePayload(row.payloadB64);
      if (!parsed) continue;
      if (parsed.handler !== 2) continue;
      const decodedPayload = maybeInflate(parsed.payload, parsed.compressed);
      if (parsed.action === 1102) {
        const entities = parseVisibleEntitiesPayload(decodedPayload);
        visiblePackets.push({
          t: row.t,
          action: '2:1102',
          payloadLen: decodedPayload.length,
          entities,
          summary: summarizeEntityRows(entities),
        });
      } else if (parsed.action === 1103) {
        const nearby = parseNearbyResponsePayload(decodedPayload);
        nearbyPackets.push({
          t: row.t,
          action: '2:1103',
          payloadLen: decodedPayload.length,
          typeId: nearby.typeId,
          entities: nearby.entities,
          summary: summarizeEntityRows(nearby.entities),
        });
      }
    }

    out.summary = {
      requestCount: out.requestEvents.length,
      responseCount: out.responseEvents.length,
      failedCount: out.loadingFailed.length,
      wsCapturedFrames: out.wsFrames.length,
      wsActionCounts: actionCounts,
      visiblePackets: visiblePackets.map((r) => ({
        t: r.t,
        payloadLen: r.payloadLen,
        entityCount: (r.entities || []).length,
        summary: r.summary,
      })),
      nearbyPackets: nearbyPackets.map((r) => ({
        t: r.t,
        typeId: r.typeId,
        payloadLen: r.payloadLen,
        entityCount: (r.entities || []).length,
        summary: r.summary,
      })),
      nearbySampleEntities: nearbyPackets.slice(0, 6).map((r) => ({
        typeId: r.typeId,
        sample: (r.entities || []).slice(0, 2),
      })),
      visibleSampleEntities: visiblePackets.slice(0, 4).map((r) => ({
        sample: (r.entities || []).slice(0, 2),
      })),
    };

    out.endedAt = new Date().toISOString();
    fs.writeFileSync('tmp_live_capture_ws_nearby_probe_signed.json', JSON.stringify(out, null, 2));
    try {
      await browser.close();
    } catch {}
  }
}

main().catch((e) => {
  try {
    fs.writeFileSync('tmp_live_capture_ws_nearby_probe_signed_fatal.txt', String(e));
  } catch {}
  process.exit(1);
});

