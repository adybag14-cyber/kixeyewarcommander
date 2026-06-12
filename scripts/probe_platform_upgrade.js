const fs = require('fs');
const puppeteer = require('puppeteer');

const BOOT_WAIT_MS = 125000;
const BOOT_MAX_MS = 180000;
const BOOT_POLL_MS = 5000;
const LOCAL_ORIGIN = 'http://127.0.0.1:8089';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PLATFORM_TYPE_IDS = new Set([
  10, 64, 86, 87, 88, 111, 114, 130, 187, 270, 275, 276, 277, 353, 361, 362, 387, 488, 489,
]);

function isUpgradeAssetUrl(url) {
  const u = String(url || '').toLowerCase();
  if (u.includes('towers/blank') || u.includes('/shadow.') || u.includes('.destroyed')) return false;

  const platformIdPattern = [...PLATFORM_TYPE_IDS].join('|');
  const buildingMatch = u.match(new RegExp(`/buildings/(?:(${platformIdPattern}))(?:\\.v2)?/`));
  const buttonMatch = u.match(new RegExp(`/buildingbuttons/(${platformIdPattern})-`));
  if (buildingMatch || buttonMatch) return true;

  return u.includes('towerbuttons') || u.includes('buildingupgrade/');
}

function assetResponseOk(url, status, bytes) {
  if (status < 200 || status >= 400) return false;
  if (bytes == null) return true;
  const u = String(url || '').toLowerCase();
  if (u.includes('/embedded/ui/widgets/buildingupgrade/')) {
    return bytes > 100;
  }
  return bytes > 500;
}

async function waitForBaseReady(page, out) {
  const started = Date.now();
  while (Date.now() - started < BOOT_MAX_MS) {
    const state = await page.evaluate(() => {
      const hx = window._hx_classes || {};
      const BASE = hx['BASE'];
      const MAP = hx['com.cc.core.MAP'];
      let buildingCount = 0;
      try {
        if (BASE && BASE._buildingsAll && typeof BASE._buildingsAll.get_length === 'function') {
          buildingCount = BASE._buildingsAll.get_length();
        }
      } catch {}
      let tops = null;
      try {
        tops = MAP && MAP._BUILDINGTOPS && typeof MAP._BUILDINGTOPS.get_numChildren === 'function'
          ? MAP._BUILDINGTOPS.get_numChildren()
          : null;
      } catch {}
      return {
        buildingCount,
        buildingTopsChildren: tops,
        hasHx: Object.keys(hx).length > 0,
        hasCanvas: !!document.querySelector('canvas'),
        baseReady: !!document.querySelector('canvas') && Object.keys(hx).length > 0 && (tops || 0) > 50,
      };
    });

    out.bootPolls.push({ elapsedMs: Date.now() - started, state });
    if (state.baseReady) {
      return state;
    }
    await sleep(BOOT_POLL_MS);
  }
  return out.bootPolls.length ? out.bootPolls[out.bootPolls.length - 1].state : { buildingCount: 0 };
}

async function tryOpenPlatformUpgradeUi(page) {
  return page.evaluate(() => {
    const hx = window._hx_classes || {};
    const PopupUpgradePlatform = hx['com.cc.popups.PopupUpgradePlatform'];
    const PopupChangePlatformType = hx['com.cc.popups.PopupChangePlatformType'];
    const result = { opened: false, method: null, error: null };
    try {
      if (PopupUpgradePlatform && typeof PopupUpgradePlatform.show === 'function') {
        PopupUpgradePlatform.show();
        result.opened = true;
        result.method = 'PopupUpgradePlatform.show';
        return result;
      }
      if (PopupChangePlatformType && typeof PopupChangePlatformType.show === 'function') {
        PopupChangePlatformType.show();
        result.opened = true;
        result.method = 'PopupChangePlatformType.show';
        return result;
      }
    } catch (err) {
      result.error = String(err);
    }
    return result;
  });
}

async function runUpgradeFlow(page) {
  return page.evaluate(async (origin) => {
    function parseBuildingData(raw) {
      if (!raw) return {};
      if (typeof raw === 'string') {
        try {
          return JSON.parse(raw);
        } catch {
          return {};
        }
      }
      return raw;
    }

    function pickPlatform(buildingdata) {
      const rows = Object.values(buildingdata || {});
      const platformTypes = new Set(['10', '64', '86', '87', '88', '111', '114']);
      let best = null;
      for (const row of rows) {
        if (!row || typeof row !== 'object') continue;
        if (!platformTypes.has(String(row.t))) continue;
        const level = parseInt(row.l, 10);
        const safeLevel = Number.isFinite(level) ? level : 0;
        if (!best || safeLevel >= parseInt(best.l, 10)) best = row;
      }
      return best;
    }

    async function postProduction(actions, token) {
      const ts = Math.floor(Date.now() / 1000);
      const form = new URLSearchParams();
      form.set('data', JSON.stringify(actions));
      const resp = await fetch(`${origin}/api/building/production?ts=${ts}&token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      });
      const text = await resp.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text.slice(0, 500) };
      }
      return { ok: resp.ok, status: resp.status, json };
    }

    async function loadBase() {
      const ts = Math.floor(Date.now() / 1000);
      const resp = await fetch(`${origin}/api/wc/base/load?ts=${ts}`);
      return resp.json();
    }

    const baseBefore = await loadBase();
    const buildingdataBefore = parseBuildingData(baseBefore.buildingdata);
    const target = pickPlatform(buildingdataBefore);
    if (!target) return { error: 'no_platform_found' };

    const buildingId = parseInt(target.id, 10);
    const currentLevel = parseInt(target.l, 10) || 0;
    const toLevel = currentLevel + 1;

    const upgradeResp = await postProduction(
      [
        {
          action: 'upgrade',
          building_id: buildingId,
          to_level: toLevel,
          upgrade_to: toLevel,
          type: parseInt(target.t, 10) || 10,
          building_type: parseInt(target.t, 10) || 10,
          time: Math.floor(Date.now() / 1000),
        },
      ],
      'probe-upgrade'
    );

    const finishResp = await postProduction(
      [{ action: 'finish_now', building_id: buildingId }],
      'probe-finish'
    );

    const baseAfter = await loadBase();
    const buildingdataAfter = parseBuildingData(baseAfter.buildingdata);
    let afterRow = null;
    for (const row of Object.values(buildingdataAfter)) {
      if (row && parseInt(row.id, 10) === buildingId) {
        afterRow = row;
        break;
      }
    }

    const hx = window._hx_classes || {};
    const UPDATES = hx['UPDATES'];
    if (UPDATES && typeof UPDATES.Process === 'function' && Array.isArray(baseAfter.updates)) {
      try {
        UPDATES.Process(baseAfter.updates);
      } catch (e) {
        /* ignore */
      }
    }
    if (typeof window.applyPatchesNow === 'function') {
      try {
        window.applyPatchesNow();
      } catch (e) {
        /* ignore */
      }
    }

    const manifestKeyCandidates = [
      `buildings/10.v2/top.${toLevel}.png`,
      `buildings/10/top.${toLevel}.png`,
      `buildings/${target.t}/top.${toLevel}.png`,
      `buildingbuttons/${target.t}-${toLevel}-s.jpg`,
      `buildingbuttons/10-${toLevel}-s.jpg`,
    ];

    const assetChecks = [];
    for (const key of manifestKeyCandidates) {
      try {
        const assetResp = await fetch(`${origin}/assets/${key}`);
        const buf = await assetResp.arrayBuffer();
        assetChecks.push({
          key,
          status: assetResp.status,
          bytes: buf.byteLength,
          ok: assetResp.ok && buf.byteLength > 500,
        });
      } catch (err) {
        assetChecks.push({ key, error: String(err), ok: false });
      }
    }

    const hookNames = Object.keys(hx).filter((name) => /building|upgrade|platform/i.test(name)).slice(0, 40);

    return {
      target: {
        id: buildingId,
        type: target.t,
        levelBefore: currentLevel,
        levelAfter: afterRow ? parseInt(afterRow.l, 10) : null,
        position: { x: target.X, y: target.Y },
      },
      upgradeResp,
      finishResp,
      assetChecks,
      hookNames,
      updatesCount: Array.isArray(baseAfter.updates) ? baseAfter.updates.length : 0,
    };
  }, LOCAL_ORIGIN);
}

(async () => {
  const out = {
    startedAt: new Date().toISOString(),
    bootPolls: [],
    network: [],
    upgrade: null,
    pageErrors: [],
    pass: false,
  };

  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 360000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  page.on('pageerror', (err) => out.pageErrors.push(String(err)));
  page.on('response', async (response) => {
    try {
      const url = response.url();
      if (!isUpgradeAssetUrl(url)) return;
      const status = response.status();
      let bytes = null;
      try {
        const buf = await response.buffer();
        bytes = buf.length;
      } catch {
        bytes = null;
      }
      out.network.push({
        url,
        status,
        bytes,
        ok: assetResponseOk(url, status, bytes),
      });
    } catch {
      /* ignore */
    }
  });

  await page.goto(`${LOCAL_ORIGIN}/index.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(BOOT_WAIT_MS);

  const bootState = await waitForBaseReady(page, out);
  out.bootReady = bootState;
  await page.screenshot({ path: 'tmp_probe_platform_upgrade_01_base.png' });

  out.ui = await tryOpenPlatformUpgradeUi(page);
  await sleep(3000);
  if (out.ui && out.ui.opened) {
    await page.screenshot({ path: 'tmp_probe_platform_upgrade_01b_upgrade_ui.png' });
  }

  out.upgrade = await runUpgradeFlow(page);
  await sleep(5000);
  await page.screenshot({ path: 'tmp_probe_platform_upgrade_02_after.png' });

  const failedAssets = out.network.filter((row) => !row.ok);
  const apiOk =
    out.upgrade &&
    !out.upgrade.error &&
    out.upgrade.upgradeResp &&
    out.upgrade.upgradeResp.ok &&
    out.upgrade.finishResp &&
    out.upgrade.finishResp.ok;
  const levelAdvanced =
    out.upgrade &&
    out.upgrade.target &&
    Number.isFinite(out.upgrade.target.levelAfter) &&
    out.upgrade.target.levelAfter > (out.upgrade.target.levelBefore || 0);
  const manifestAssetsOk =
    out.upgrade &&
    Array.isArray(out.upgrade.assetChecks) &&
    out.upgrade.assetChecks.some((row) => row.ok);

  const fatalErrors = out.pageErrors.filter(
    (msg) =>
      !String(msg).includes('getHomeBase') &&
      !String(msg).includes('WebSocket') &&
      !String(msg).includes("reading 'url'")
  );

  const baseRendered = (bootState.buildingTopsChildren || 0) > 50 || !!bootState.baseReady;

  out.summary = {
    bootBuildingCount: bootState.buildingCount,
    bootBuildingTops: bootState.buildingTopsChildren,
    baseRendered,
    apiOk,
    levelAdvanced,
    manifestAssetsOk,
    failedUpgradeAssetRequests: failedAssets.length,
    totalUpgradeAssetRequests: out.network.length,
    target: out.upgrade && out.upgrade.target,
    uiOpened: !!(out.ui && out.ui.opened),
  };

  out.pass =
    fatalErrors.length === 0 &&
    apiOk &&
    levelAdvanced &&
    manifestAssetsOk &&
    failedAssets.length === 0 &&
    baseRendered;

  out.endedAt = new Date().toISOString();
  fs.writeFileSync('tmp_probe_platform_upgrade.json', JSON.stringify(out, null, 2));
  await browser.close();

  console.log(JSON.stringify({ pass: out.pass, summary: out.summary }, null, 2));
  if (!out.pass) process.exitCode = 1;
})().catch((err) => {
  const existing = fs.existsSync('tmp_probe_platform_upgrade.json')
    ? JSON.parse(fs.readFileSync('tmp_probe_platform_upgrade.json', 'utf8'))
    : {};
  const payload = {
    ...existing,
    error: String(err),
    endedAt: new Date().toISOString(),
  };
  if (!payload.startedAt) payload.startedAt = new Date().toISOString();
  fs.writeFileSync('tmp_probe_platform_upgrade.json', JSON.stringify(payload, null, 2));
  console.error(err);
  process.exitCode = 1;
});