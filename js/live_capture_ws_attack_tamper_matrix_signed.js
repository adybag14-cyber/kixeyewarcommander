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

function buildCoordPayload(sector, x, y, region) {
  const parts = [];
  parts.push(encodeFieldVarint(1, sector));
  parts.push(encodeFieldVarint(2, x));
  parts.push(encodeFieldVarint(3, y));
  parts.push(encodeFieldVarint(4, region));
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
  return { handler, action, payload, compressed, frameLen: raw.length };
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

function parseWireShallow(buf, maxFields = 120) {
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

function parseMapEntity(buf) {
  const out = { id: '', type: null, status: null, owner: null, coord: null, attributes: {} };
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

function extractLargestVisibleEntitySet(wsFrames) {
  let best = [];
  for (const fr of wsFrames || []) {
    if (fr.dir !== 'recv' || fr.action !== '2:1102') continue;
    const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
    if (!parsed) continue;
    const payload = maybeInflate(parsed.payload, parsed.compressed);
    const entities = parseVisibleEntitiesPayload(payload);
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
  return (entities || [])
    .filter((e) => e && e.id && e.type === 3 && (selfOwner == null || String(e.owner) !== String(selfOwner)))
    .slice(0, 4);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function analyzeWindow(wsFrames, fromTs, toTs) {
  const rows = (wsFrames || []).filter((fr) => fr.dir === 'recv' && fr.t >= fromTs && fr.t <= toTs);
  const actionCounts = {};
  const codes = {};
  const battleHosts = [];
  let attackInfoCount = 0;

  for (const fr of rows) {
    actionCounts[fr.action] = (actionCounts[fr.action] || 0) + 1;
    const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
    if (!parsed) continue;
    const payload = maybeInflate(parsed.payload, parsed.compressed);
    const wire = parseWireShallow(payload, 120);
    if (fr.action === '3:4') attackInfoCount += 1;
    for (const w of wire) {
      if (w.wt === 0 && (w.val === 2202 || w.val === 2212)) {
        const k = String(w.val);
        codes[k] = (codes[k] || 0) + 1;
      }
      if (w.wt === 2 && typeof w.ascii === 'string' && w.ascii.includes('prod-battle')) {
        battleHosts.push(w.ascii);
      }
    }
  }

  return {
    recvFrameCount: rows.length,
    actionCounts,
    codes,
    attackInfoCount,
    hasBattleHandoff: battleHosts.length > 0,
    battleHostSnippets: battleHosts.slice(0, 6),
  };
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
    wsFrames: [],
    wsActions: [],
    requestEvents: [],
    loadingFailed: [],
    variants: [],
    summary: {},
  };

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors', '--allow-insecure-localhost'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  await page.evaluateOnNewDocument(() => {
    try {
      if (window.__wsProbeWrapped) return;
      window.__wsProbeWrapped = true;
      window.__wsProbeRows = [];
      const NativeWS = window.WebSocket;
      function WrappedWS(url, protocols) {
        const ws = protocols != null ? new NativeWS(url, protocols) : new NativeWS(url);
        try {
          window.__wsProbeRows.push({ createdAt: Date.now(), url: String(url || ''), ws });
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
        return { ok: true, chosenUrl: String(chosen.url || ''), sent };
      };
    } catch {}
  });

  page.on('pageerror', (e) => out.pageErrors.push({ t: Date.now(), text: String(e) }));

  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');

  cdp.on('Network.requestWillBeSent', (e) => {
    const url = e.request && e.request.url ? e.request.url : '';
    out.requestEvents.push({ t: Date.now(), method: e.request && e.request.method, url: safeUrl(url) });
    if (out.requestEvents.length > 5000) out.requestEvents.splice(0, out.requestEvents.length - 3500);
  });
  cdp.on('Network.loadingFailed', (e) => {
    out.loadingFailed.push({ t: Date.now(), errorText: e.errorText, canceled: !!e.canceled });
  });
  const onWsFrame = (dir, e) => {
    const payload = e.response && typeof e.response.payloadData === 'string' ? e.response.payloadData : '';
    const parsed = parseGatewayPacketFromWsFramePayload(payload);
    if (!parsed) return;
    const action = `${parsed.handler}:${parsed.action}`;
    out.wsActions.push({ t: Date.now(), dir, action, frameLen: parsed.frameLen });
    out.wsFrames.push({
      t: Date.now(),
      dir,
      action,
      frameLen: parsed.frameLen,
      compressed: Number(parsed.compressed || 0),
      payloadB64: payload,
    });
    if (out.wsFrames.length > 2800) out.wsFrames.splice(0, out.wsFrames.length - 2000);
  };
  cdp.on('Network.webSocketFrameSent', (e) => onWsFrame('sent', e));
  cdp.on('Network.webSocketFrameReceived', (e) => onWsFrame('recv', e));

  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await sleep(32000);
    try {
      await page.mouse.click(1295, 635);
      out.notes.push('click:worldmap_tab');
    } catch (e) {
      out.notes.push(`click_fail:worldmap_tab:${String(e)}`);
    }
    await sleep(9000);

    const tPrime = Date.now();
    const primePackets = [
      { label: 'prime_visible_0', bytes: Array.from(buildGatewayActionPacket(2, 102, encodeFieldVarint(1, 0), tPrime)) },
      { label: 'prime_blocked_0', bytes: Array.from(buildGatewayActionPacket(2, 106, encodeFieldVarint(1, 0), tPrime + 1)) },
      {
        label: 'prime_nearby_3',
        bytes: Array.from(
          buildGatewayActionPacket(
            2,
            103,
            Buffer.concat([encodeFieldBytes(1, buildCoordPayload(199, 268, 377, 0)), encodeFieldVarint(2, 3)]),
            tPrime + 2
          )
        ),
      },
    ];
    await page.evaluate((rows) => {
      if (typeof window.__wsProbeSendPackets === 'function') return window.__wsProbeSendPackets(rows);
      return null;
    }, primePackets);
    await sleep(3000);

    const entities = extractLargestVisibleEntitySet(out.wsFrames);
    const selfOwner = inferSelfOwner(entities);
    const targets = pickAttackTargets(entities, selfOwner);
    const target = targets[0] || null;
    const selfBase = (entities || []).find((e) => e && e.type === 1 && String(e.owner || '') === String(selfOwner || '')) || null;
    let chosenPlatoon = '';
    try {
      chosenPlatoon = await page.evaluate(() => {
        const pm = window._hx_classes && window._hx_classes['com.cc.units.PlatoonManager'] ? window._hx_classes['com.cc.units.PlatoonManager'] : null;
        const inst = pm ? ((typeof pm.get_Instance === 'function' ? pm.get_Instance() : null) || pm._Instance || null) : null;
        if (!inst || !inst._platoonList) return '';
        const rows = [];
        try {
          const arr = inst._platoonList;
          const n = typeof arr.length === 'number' ? arr.length : 0;
          for (let i = 0; i < n && i < 400; i++) {
            const p = arr[i];
            if (!p) continue;
            const id = String(p.id || p._id || '');
            const dep = !!(p.isDeployable === true || (typeof p.get_isDeployable === 'function' && p.get_isDeployable()));
            if (id && dep) rows.push(id);
          }
        } catch {}
        return rows[0] || '';
      });
    } catch {}

    out.summary.target = target ? { id: target.id, type: target.type, attrs: target.attributes || {} } : null;
    out.summary.selfBase = selfBase ? { id: selfBase.id, type: selfBase.type } : null;
    out.summary.chosenPlatoon = chosenPlatoon || '';

    if (!target || !target.id) {
      out.notes.push('no_target_found');
    } else {
      const baseIdRaw = target.attributes && target.attributes.baseId != null ? Number(target.attributes.baseId) : null;
      const baseId = Number.isFinite(baseIdRaw) ? Math.trunc(baseIdRaw) : null;
      const fakePlatoon = 'p99999999999999';
      const longPlatoon = `p${'9'.repeat(128)}`;
      const manyAttackers = Array.from({ length: 24 }, () => buildBattleEntityPayload(2));
      const mixedAttackers = [
        buildBattleEntityPayload(999),
        buildBattleEntityPayload(777),
        buildBattleEntityPayload(2),
        buildBattleEntityPayload(1),
      ];

      const variants = [
        {
          label: 'valid_target_only',
          payload: buildStartAttackPayload(target.id, null, []),
        },
        {
          label: 'valid_target_with_baseid',
          payload: buildStartAttackPayload(target.id, baseId, []),
        },
        {
          label: 'forged_platoon_nonexistent',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: fakePlatoon }]),
        },
        {
          label: 'forged_platoon_long',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: longPlatoon }]),
        },
        {
          label: 'forged_baseid_huge',
          payload: buildStartAttackPayload(target.id, 2147483647, [{ key: 'chosenPlatoon', value: chosenPlatoon || fakePlatoon }]),
        },
        {
          label: 'forged_invade_without_platoon',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'invadeHex', value: '1' }]),
        },
        {
          label: 'forged_attacker_npc_999',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: chosenPlatoon || fakePlatoon }], [buildBattleEntityPayload(999)]),
        },
        {
          label: 'forged_many_attackers_24',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: chosenPlatoon || fakePlatoon }], manyAttackers),
        },
        {
          label: 'forged_mixed_attackers',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: chosenPlatoon || fakePlatoon }], mixedAttackers),
        },
      ];

      if (chosenPlatoon) {
        variants.splice(2, 0, {
          label: 'valid_with_real_platoon',
          payload: buildStartAttackPayload(target.id, baseId, [{ key: 'chosenPlatoon', value: chosenPlatoon }]),
        });
      }

      if (selfBase && selfBase.id) {
        variants.push({
          label: 'self_target_event_attacker',
          payload: buildStartAttackPayload(selfBase.id, null, [], [buildBattleEntityPayload(2)]),
        });
      }

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const ts = Date.now();
        const packet = {
          label: v.label,
          bytes: Array.from(buildGatewayActionPacket(3, 3, v.payload, ts + i)),
        };
        const sendResult = await page.evaluate((row) => {
          if (typeof window.__wsProbeSendPackets === 'function') return window.__wsProbeSendPackets([row]);
          return { ok: false, reason: 'ws-send-helper-missing' };
        }, packet);
        await sleep(2800);
        const windowResult = analyzeWindow(out.wsFrames, ts - 200, Date.now() + 100);
        out.variants.push({
          label: v.label,
          sentAt: ts,
          sendOk: !!(sendResult && sendResult.ok),
          sendResult,
          outcome: windowResult,
        });
      }
    }

    const byVariant = {};
    for (const row of out.variants) {
      byVariant[row.label] = {
        hasBattleHandoff: !!(row.outcome && row.outcome.hasBattleHandoff),
        attackInfoCount: row.outcome ? row.outcome.attackInfoCount : 0,
        codes: row.outcome ? row.outcome.codes : {},
      };
    }
    const globalCodes = {};
    for (const fr of out.wsFrames) {
      if (fr.dir !== 'recv') continue;
      const parsed = parseGatewayPacketFromWsFramePayload(fr.payloadB64);
      if (!parsed) continue;
      const payload = maybeInflate(parsed.payload, parsed.compressed);
      for (const w of parseWireShallow(payload, 80)) {
        if (w.wt === 0 && (w.val === 2202 || w.val === 2212)) {
          const k = String(w.val);
          globalCodes[k] = (globalCodes[k] || 0) + 1;
        }
      }
    }
    const wsActionCounts = {};
    for (const row of out.wsActions) {
      const k = `${row.dir}:${row.action}`;
      wsActionCounts[k] = (wsActionCounts[k] || 0) + 1;
    }

    out.summary = {
      requestCount: out.requestEvents.length,
      failedCount: out.loadingFailed.length,
      wsCapturedFrames: out.wsFrames.length,
      wsActionCounts,
      variantCount: out.variants.length,
      perVariant: byVariant,
      globalCodes,
    };
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    out.endedAt = new Date().toISOString();
    fs.writeFileSync('tmp_live_capture_ws_attack_tamper_matrix_signed.json', JSON.stringify(out, null, 2));
    try {
      await browser.close();
    } catch {}
  }
}

main().catch((e) => {
  try {
    fs.writeFileSync('tmp_live_capture_ws_attack_tamper_matrix_signed_fatal.txt', String(e));
  } catch {}
  process.exit(1);
});

