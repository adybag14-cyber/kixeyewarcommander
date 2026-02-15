const fs = require('fs');
const puppeteer = require('puppeteer');

function safeUrl(url) {
  try {
    const u = new URL(String(url || ''));
    return `${u.origin}${u.pathname}`;
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

function pathOf(url) {
  try {
    return new URL(String(url || '')).pathname;
  } catch {
    return String(url || '');
  }
}

function summarizeNetwork(list, key) {
  const counts = Object.create(null);
  for (const row of list || []) {
    const k = String(row && row[key] != null ? row[key] : '');
    counts[k] = (counts[k] || 0) + 1;
  }
  return counts;
}

function cappedPush(arr, value, cap = 3000) {
  arr.push(value);
  if (arr.length > cap) arr.splice(0, arr.length - cap);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    targets: [],
    frames: [],
    console: [],
    pageErrors: [],
    requestEvents: [],
    responseEvents: [],
    loadingFailed: [],
    apiGatewayBodies: [],
    wsCreated: [],
    wsSent: [],
    wsReceived: [],
    wsClosed: [],
    wsErrors: [],
    jsHooks: [],
    screenshots: [],
    summary: {}
  };

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--ignore-certificate-errors',
      '--allow-insecure-localhost'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  page.on('console', (m) => {
    try {
      cappedPush(out.console, { t: Date.now(), type: m.type(), text: m.text() }, 2000);
    } catch {}
  });
  page.on('pageerror', (e) => {
    cappedPush(out.pageErrors, { t: Date.now(), text: String(e) }, 800);
  });

  // JS-level network hooks (best-effort, same frame context).
  await page.evaluateOnNewDocument(() => {
    try {
      if (window.__deepNetHookInstalled) return;
      window.__deepNetHookInstalled = true;
      window.__deepNetHook = [];

      function log(kind, data) {
        try {
          window.__deepNetHook.push({ t: Date.now(), kind, ...data });
          if (window.__deepNetHook.length > 4000) {
            window.__deepNetHook.splice(0, window.__deepNetHook.length - 3000);
          }
        } catch {}
      }

      const origFetch = window.fetch;
      if (typeof origFetch === 'function') {
        window.fetch = function(input, init) {
          try {
            const url = typeof input === 'string' ? input : (input && input.url) || '';
            const method = (init && init.method) || 'GET';
            const body = init && init.body;
            const bodyLen = typeof body === 'string' ? body.length : (body ? -1 : 0);
            log('fetch', { url: String(url), method: String(method), bodyLen });
          } catch {}
          return origFetch.apply(this, arguments);
        };
      }

      const xhrOpen = XMLHttpRequest.prototype.open;
      const xhrSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url) {
        try {
          this.__deepUrl = String(url || '');
          this.__deepMethod = String(method || 'GET');
        } catch {}
        return xhrOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function(body) {
        try {
          const bodyLen = typeof body === 'string' ? body.length : (body ? -1 : 0);
          log('xhr', { url: this.__deepUrl || '', method: this.__deepMethod || 'GET', bodyLen });
        } catch {}
        return xhrSend.apply(this, arguments);
      };

      if (navigator && typeof navigator.sendBeacon === 'function') {
        const origBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function(url, data) {
          try {
            const bodyLen = typeof data === 'string' ? data.length : (data ? -1 : 0);
            log('beacon', { url: String(url || ''), method: 'BEACON', bodyLen });
          } catch {}
          return origBeacon(url, data);
        };
      }

      if (typeof WebSocket === 'function') {
        const NativeWS = WebSocket;
        // eslint-disable-next-line no-global-assign
        WebSocket = function(url, protocols) {
          const ws = protocols != null ? new NativeWS(url, protocols) : new NativeWS(url);
          try { log('ws_create_js', { url: String(url || '') }); } catch {}
          try {
            const origSend = ws.send;
            ws.send = function(payload) {
              let len = 0;
              try {
                len = typeof payload === 'string' ? payload.length : (payload && payload.byteLength) || -1;
              } catch {
                len = -1;
              }
              try { log('ws_send_js', { url: String(url || ''), len }); } catch {}
              return origSend.apply(this, arguments);
            };
          } catch {}
          return ws;
        };
        WebSocket.prototype = NativeWS.prototype;
      }
    } catch {}
  });

  // CDP capture.
  const cdp = await page.target().createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Page.enable').catch(() => {});

  const responseMetaByReqId = new Map();
  const bodyCaptureCap = 120;

  cdp.on('Network.requestWillBeSent', (e) => {
    try {
      cappedPush(out.requestEvents, {
        t: Date.now(),
        requestId: e.requestId,
        method: e.request && e.request.method,
        url: safeUrl(e.request && e.request.url),
        fullUrl: e.request && e.request.url,
        host: originOf(e.request && e.request.url),
        path: pathOf(e.request && e.request.url),
        resourceType: e.type || null,
        hasPostData: !!(e.request && e.request.postData),
        postDataLen: e.request && e.request.postData ? e.request.postData.length : 0,
        initiatorType: e.initiator && e.initiator.type ? e.initiator.type : null
      }, 4000);
    } catch {}
  });

  cdp.on('Network.responseReceived', (e) => {
    try {
      const url = e.response && e.response.url ? e.response.url : '';
      const meta = {
        t: Date.now(),
        requestId: e.requestId,
        status: e.response && e.response.status,
        url: safeUrl(url),
        fullUrl: url,
        host: originOf(url),
        path: pathOf(url),
        mimeType: e.response && e.response.mimeType ? e.response.mimeType : null,
        fromDiskCache: !!(e.response && e.response.fromDiskCache),
        fromServiceWorker: !!(e.response && e.response.fromServiceWorker),
        protocol: e.response && e.response.protocol ? e.response.protocol : null
      };
      cappedPush(out.responseEvents, meta, 4000);
      responseMetaByReqId.set(e.requestId, meta);
    } catch {}
  });

  cdp.on('Network.loadingFailed', (e) => {
    try {
      cappedPush(out.loadingFailed, {
        t: Date.now(),
        requestId: e.requestId,
        errorText: e.errorText,
        canceled: !!e.canceled,
        blockedReason: e.blockedReason || null
      }, 1200);
    } catch {}
  });

  cdp.on('Network.webSocketCreated', (e) => {
    try {
      cappedPush(out.wsCreated, {
        t: Date.now(),
        requestId: e.requestId,
        url: safeUrl(e.url),
        fullUrl: e.url,
        host: originOf(e.url),
        path: pathOf(e.url)
      }, 600);
    } catch {}
  });

  cdp.on('Network.webSocketFrameSent', (e) => {
    try {
      const payload = e.response && typeof e.response.payloadData === 'string' ? e.response.payloadData : '';
      cappedPush(out.wsSent, {
        t: Date.now(),
        requestId: e.requestId,
        opcode: e.response ? e.response.opcode : null,
        mask: e.response ? e.response.mask : null,
        len: payload.length,
        preview: payload.slice(0, 180)
      }, 1200);
    } catch {}
  });

  cdp.on('Network.webSocketFrameReceived', (e) => {
    try {
      const payload = e.response && typeof e.response.payloadData === 'string' ? e.response.payloadData : '';
      cappedPush(out.wsReceived, {
        t: Date.now(),
        requestId: e.requestId,
        opcode: e.response ? e.response.opcode : null,
        mask: e.response ? e.response.mask : null,
        len: payload.length,
        preview: payload.slice(0, 180)
      }, 1200);
    } catch {}
  });

  cdp.on('Network.webSocketClosed', (e) => {
    try {
      cappedPush(out.wsClosed, { t: Date.now(), requestId: e.requestId, timestamp: e.timestamp }, 300);
    } catch {}
  });

  cdp.on('Network.webSocketFrameError', (e) => {
    try {
      cappedPush(out.wsErrors, { t: Date.now(), requestId: e.requestId, errorMessage: e.errorMessage }, 300);
    } catch {}
  });

  cdp.on('Network.loadingFinished', async (e) => {
    try {
      const meta = responseMetaByReqId.get(e.requestId);
      if (!meta) return;
      const p = String(meta.path || '');
      const isApiOrGateway = p.includes('/api/') || p.includes('/gateway/');
      if (!isApiOrGateway) return;
      if (out.apiGatewayBodies.length >= bodyCaptureCap) return;
      try {
        const body = await cdp.send('Network.getResponseBody', { requestId: e.requestId });
        cappedPush(out.apiGatewayBodies, {
          t: Date.now(),
          requestId: e.requestId,
          url: meta.url,
          path: meta.path,
          status: meta.status,
          base64Encoded: !!(body && body.base64Encoded),
          bodyLen: body && typeof body.body === 'string' ? body.body.length : 0,
          preview: body && typeof body.body === 'string' ? body.body.slice(0, 600) : ''
        }, bodyCaptureCap);
      } catch (err) {
        cappedPush(out.apiGatewayBodies, {
          t: Date.now(),
          requestId: e.requestId,
          url: meta.url,
          path: meta.path,
          status: meta.status,
          bodyError: String(err)
        }, bodyCaptureCap);
      }
    } catch {}
  });

  browser.on('targetcreated', (target) => {
    try {
      cappedPush(out.targets, {
        t: Date.now(),
        event: 'created',
        type: target.type(),
        url: safeUrl(target.url()),
        fullUrl: target.url()
      }, 500);
    } catch {}
  });
  browser.on('targetchanged', (target) => {
    try {
      cappedPush(out.targets, {
        t: Date.now(),
        event: 'changed',
        type: target.type(),
        url: safeUrl(target.url()),
        fullUrl: target.url()
      }, 500);
    } catch {}
  });

  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    out.notes.push('domcontentloaded');

    await sleep(20000);
    await page.screenshot({ path: 'tmp_live_capture_deep_t0.png' });
    out.screenshots.push('tmp_live_capture_deep_t0.png');

    // Capture frame map early.
    out.frames = page.frames().map((f) => ({
      name: f.name() || '',
      url: safeUrl(f.url()),
      fullUrl: f.url()
    }));

    // Stimulate likely UI routes.
    const clicks = [
      { name: 'platoons_tab', x: 1060, y: 635, wait: 3500 },
      { name: 'buildings_tab', x: 1145, y: 635, wait: 3500 },
      { name: 'store_tab', x: 1220, y: 635, wait: 3500 },
      { name: 'worldmap_tab', x: 1295, y: 635, wait: 9000 },
      { name: 'attack_log_button', x: 1260, y: 150, wait: 4500 },
      { name: 'find_base_or_enter_base_area', x: 1270, y: 585, wait: 5000 }
    ];
    for (const step of clicks) {
      try {
        await page.mouse.click(step.x, step.y);
        out.notes.push(`click:${step.name}`);
      } catch (e) {
        out.notes.push(`click_fail:${step.name}:${String(e)}`);
      }
      await sleep(step.wait);
    }

    // Try a small drag on the world map area.
    try {
      await page.mouse.move(730, 360);
      await page.mouse.down();
      await page.mouse.move(840, 410, { steps: 6 });
      await page.mouse.up();
      out.notes.push('world_drag');
    } catch (e) {
      out.notes.push(`world_drag_fail:${String(e)}`);
    }

    await sleep(30000);
    await page.screenshot({ path: 'tmp_live_capture_deep_t1.png' });
    out.screenshots.push('tmp_live_capture_deep_t1.png');

    // Pull JS-level hook logs.
    try {
      const hookRows = await page.evaluate(() => {
        return Array.isArray(window.__deepNetHook) ? window.__deepNetHook.slice(-3000) : [];
      });
      out.jsHooks = hookRows;
    } catch (e) {
      out.notes.push(`hook_read_fail:${String(e)}`);
    }
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    out.endedAt = new Date().toISOString();

    const reqPaths = out.requestEvents.map((r) => r.path).filter(Boolean);
    const resPaths = out.responseEvents.map((r) => r.path).filter(Boolean);
    const reqHosts = out.requestEvents.map((r) => r.host).filter(Boolean);
    const resHosts = out.responseEvents.map((r) => r.host).filter(Boolean);
    const wsHosts = out.wsCreated.map((w) => w.host).filter(Boolean);
    const jsHookUrls = out.jsHooks.map((h) => safeUrl(h.url)).filter(Boolean);
    const gatewayReq = reqPaths.filter((p) => p.includes('/gateway/')).length;
    const gatewayRes = resPaths.filter((p) => p.includes('/gateway/')).length;
    const apiReq = reqPaths.filter((p) => p.includes('/api/')).length;
    const apiRes = resPaths.filter((p) => p.includes('/api/')).length;

    out.summary = {
      requestCount: out.requestEvents.length,
      responseCount: out.responseEvents.length,
      failedCount: out.loadingFailed.length,
      apiReqCount: apiReq,
      apiResCount: apiRes,
      gatewayReqCount: gatewayReq,
      gatewayResCount: gatewayRes,
      wsCreatedCount: out.wsCreated.length,
      wsSentCount: out.wsSent.length,
      wsReceivedCount: out.wsReceived.length,
      uniqueReqPaths: Object.keys(summarizeNetwork(out.requestEvents, 'path')).sort(),
      uniqueResPaths: Object.keys(summarizeNetwork(out.responseEvents, 'path')).sort(),
      reqHosts: Object.keys(summarizeNetwork(out.requestEvents, 'host')).sort(),
      resHosts: Object.keys(summarizeNetwork(out.responseEvents, 'host')).sort(),
      wsHosts: [...new Set(wsHosts)].sort(),
      jsHookUniqueUrls: [...new Set(jsHookUrls)].slice(0, 200)
    };

    fs.writeFileSync('tmp_live_capture_deep_signed.json', JSON.stringify(out, null, 2));
    try {
      await browser.close();
    } catch {}
  }
}

main().catch((e) => {
  try {
    fs.writeFileSync('tmp_live_capture_deep_signed_fatal.txt', String(e));
  } catch {}
  process.exit(1);
});

