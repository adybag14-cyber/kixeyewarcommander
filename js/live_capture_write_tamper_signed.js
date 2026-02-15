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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseLevel(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
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
    requestCount: 0,
    capture: {
      baseLoadUrl: null,
      baseLoadBodyLen: 0,
      baseSaveUrl: null,
      baseSaveBodyLen: 0,
    },
    checks: {},
    summary: {},
  };

  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--ignore-certificate-errors', '--allow-insecure-localhost'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  const seen = {
    baseLoadUrl: null,
    baseLoadBody: null,
    baseSaveUrl: null,
    baseSaveBody: null,
  };

  page.on('pageerror', (e) => out.pageErrors.push({ t: Date.now(), text: String(e) }));
  page.on('request', (req) => {
    try {
      out.requestCount += 1;
      const u = req.url();
      if (!seen.baseLoadUrl && u.includes('/api/wc/base/load')) {
        seen.baseLoadUrl = u;
        seen.baseLoadBody = req.postData() || '';
      }
      if (!seen.baseSaveUrl && u.includes('/api/wc/base/save')) {
        seen.baseSaveUrl = u;
        seen.baseSaveBody = req.postData() || '';
      }
    } catch {}
  });

  try {
    await page.goto(liveUrl, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await sleep(32000);
    try {
      await page.mouse.click(1295, 635);
      out.notes.push('click:worldmap_tab');
    } catch {}
    await sleep(12000);
    try {
      await page.mouse.click(1295, 635);
      out.notes.push('click:worldmap_tab_again');
    } catch {}

    const waitStart = Date.now();
    while (Date.now() - waitStart < 180000) {
      if (seen.baseLoadUrl && seen.baseSaveUrl && seen.baseLoadBody != null && seen.baseSaveBody != null) break;
      await sleep(1000);
    }

    out.capture.baseLoadUrl = seen.baseLoadUrl ? safeUrl(seen.baseLoadUrl) : null;
    out.capture.baseLoadBodyLen = (seen.baseLoadBody || '').length;
    out.capture.baseSaveUrl = seen.baseSaveUrl ? safeUrl(seen.baseSaveUrl) : null;
    out.capture.baseSaveBodyLen = (seen.baseSaveBody || '').length;

    if (!seen.baseLoadUrl || !seen.baseLoadBody || !seen.baseSaveUrl || !seen.baseSaveBody) {
      out.notes.push('insufficient_capture_for_write_tamper');
      out.summary = { ok: false, reason: 'missing base/load or base/save capture' };
      return;
    }

    const result = await page.evaluate(async ({ baseLoadUrl, baseLoadBody, baseSaveUrl, baseSaveBody }) => {
      function headers() {
        return { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' };
      }
      async function post(url, body) {
        try {
          const r = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: headers(),
            body,
          });
          const txt = await r.text();
          let json = null;
          try {
            json = JSON.parse(txt);
          } catch {}
          return { ok: true, status: r.status, text: txt.slice(0, 2000), json };
        } catch (e) {
          return { ok: false, error: String(e) };
        }
      }

      function snapshotFromBaseLoad(resp) {
        const json = resp && resp.json && typeof resp.json === 'object' ? resp.json : null;
        if (!json) return null;
        let building = json.buildingdata;
        if (typeof building === 'string') {
          try { building = JSON.parse(building); } catch { building = null; }
        }
        const b1 = building && typeof building === 'object' ? (building['1'] || null) : null;
        const b0 = building && typeof building === 'object' ? (building['0'] || null) : null;
        const b1Level = b1 && b1.l != null ? Number(b1.l) : null;
        const b0Level = b0 && b0.l != null ? Number(b0.l) : null;
        return {
          credits: json.credits != null ? Number(json.credits) : null,
          baseid: json.baseid != null ? String(json.baseid) : null,
          b0Level: Number.isFinite(b0Level) ? Math.trunc(b0Level) : null,
          b1Level: Number.isFinite(b1Level) ? Math.trunc(b1Level) : null,
        };
      }

      function bodyWithTokenOffset(url, delta) {
        try {
          const u = new URL(url);
          const t = Number(u.searchParams.get('token'));
          if (Number.isFinite(t)) u.searchParams.set('token', String(t + delta));
          return u.toString();
        } catch {
          return url;
        }
      }

      const out = {
        baseline: null,
        afterInvalidToken: null,
        afterBadHash: null,
        afterCreditsTamper: null,
        afterBuildingTamper: null,
        afterRestore: null,
        responses: {},
        checks: {},
      };

      const baselineResp = await post(baseLoadUrl, baseLoadBody);
      out.responses.baselineLoad = baselineResp;
      out.baseline = snapshotFromBaseLoad(baselineResp);

      // A) Invalid token replay with original body.
      const invalidTokenUrl = bodyWithTokenOffset(baseSaveUrl, 1);
      out.responses.invalidTokenSave = await post(invalidTokenUrl, baseSaveBody);
      out.responses.loadAfterInvalidToken = await post(baseLoadUrl, baseLoadBody);
      out.afterInvalidToken = snapshotFromBaseLoad(out.responses.loadAfterInvalidToken);

      // B) Valid token but tampered body hash field.
      const badHashParams = new URLSearchParams(baseSaveBody);
      badHashParams.set('h', 'deadbeefdeadbeefdeadbeefdeadbeef');
      out.responses.badHashSave = await post(baseSaveUrl, badHashParams.toString());
      out.responses.loadAfterBadHash = await post(baseLoadUrl, baseLoadBody);
      out.afterBadHash = snapshotFromBaseLoad(out.responses.loadAfterBadHash);

      // C) Credits tamper attempt (+12345), if credits present in body.
      const creditParams = new URLSearchParams(baseSaveBody);
      if (out.baseline && out.baseline.credits != null) {
        creditParams.set('credits', String(Number(out.baseline.credits) + 12345));
      }
      out.responses.creditsTamperSave = await post(baseSaveUrl, creditParams.toString());
      out.responses.loadAfterCreditsTamper = await post(baseLoadUrl, baseLoadBody);
      out.afterCreditsTamper = snapshotFromBaseLoad(out.responses.loadAfterCreditsTamper);

      // D) Building level tamper attempt for id=1 (+1), if buildingdata parseable.
      const buildingParams = new URLSearchParams(baseSaveBody);
      let buildingTamperAttempted = false;
      try {
        const raw = buildingParams.get('buildingdata');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && parsed['1'] && parsed['1'].l != null) {
            const lvl = Number(parsed['1'].l);
            if (Number.isFinite(lvl)) {
              parsed['1'].l = String(Math.trunc(lvl) + 1);
              buildingParams.set('buildingdata', JSON.stringify(parsed));
              buildingTamperAttempted = true;
            }
          }
        }
      } catch {}
      out.responses.buildingTamperSave = buildingTamperAttempted
        ? await post(baseSaveUrl, buildingParams.toString())
        : { ok: false, skipped: true };
      out.responses.loadAfterBuildingTamper = await post(baseLoadUrl, baseLoadBody);
      out.afterBuildingTamper = snapshotFromBaseLoad(out.responses.loadAfterBuildingTamper);

      // Restore original captured save payload.
      out.responses.restoreOriginalSave = await post(baseSaveUrl, baseSaveBody);
      out.responses.loadAfterRestore = await post(baseLoadUrl, baseLoadBody);
      out.afterRestore = snapshotFromBaseLoad(out.responses.loadAfterRestore);

      const same = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
      out.checks.invalidTokenNoMutation = same(out.baseline, out.afterInvalidToken);
      out.checks.badHashNoMutation = same(out.afterInvalidToken, out.afterBadHash);
      out.checks.creditsTamperApplied = !!(
        out.baseline &&
        out.afterCreditsTamper &&
        Number.isFinite(out.baseline.credits) &&
        Number.isFinite(out.afterCreditsTamper.credits) &&
        out.afterCreditsTamper.credits !== out.baseline.credits
      );
      out.checks.buildingTamperApplied = !!(
        out.baseline &&
        out.afterBuildingTamper &&
        Number.isFinite(out.baseline.b1Level) &&
        Number.isFinite(out.afterBuildingTamper.b1Level) &&
        out.afterBuildingTamper.b1Level !== out.baseline.b1Level
      );
      out.checks.restoredToBaseline = same(out.baseline, out.afterRestore);

      return out;
    }, {
      baseLoadUrl: seen.baseLoadUrl,
      baseLoadBody: seen.baseLoadBody,
      baseSaveUrl: seen.baseSaveUrl,
      baseSaveBody: seen.baseSaveBody,
    });

    out.checks = result.checks || {};
    out.summary = {
      ok: true,
      invalidTokenNoMutation: !!out.checks.invalidTokenNoMutation,
      badHashNoMutation: !!out.checks.badHashNoMutation,
      creditsTamperApplied: !!out.checks.creditsTamperApplied,
      buildingTamperApplied: !!out.checks.buildingTamperApplied,
      restoredToBaseline: !!out.checks.restoredToBaseline,
    };

    out.result = result;
  } catch (e) {
    out.notes.push(`fatal:${String(e)}`);
  } finally {
    out.endedAt = new Date().toISOString();
    fs.writeFileSync('tmp_live_capture_write_tamper_signed.json', JSON.stringify(out, null, 2));
    try {
      await browser.close();
    } catch {}
  }
}

main().catch((e) => {
  try {
    fs.writeFileSync('tmp_live_capture_write_tamper_signed_fatal.txt', String(e));
  } catch {}
  process.exit(1);
});

