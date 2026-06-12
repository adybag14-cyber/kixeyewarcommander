const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BOOT_WAIT_MS = 125000;
const BOOT_MAX_MS = 180000;
const BOOT_POLL_MS = 5000;
const LOCAL_ORIGIN = 'http://127.0.0.1:8089';

const PLATFORM_TYPE_IDS = new Set([
  10, 64, 86, 87, 88, 111, 114, 130, 187, 270, 275, 276, 277, 353, 361, 362, 387, 488, 489,
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadMaxLevelsByType() {
  const buildingsPath = path.join(__dirname, 'manifest', 'Buildings.json');
  const rows = JSON.parse(fs.readFileSync(buildingsPath, 'utf8'));
  const maxByType = {};
  for (const row of rows) {
    const id = Number(row.id);
    if (!PLATFORM_TYPE_IDS.has(id)) continue;
    maxByType[id] = Array.isArray(row.levels) ? row.levels.length : 0;
  }
  return maxByType;
}

function loadManifestAssetIndex() {
  const manifestPath = path.join(__dirname, 'manifest', 'assetManifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const topAssetsByType = {};
  const buttonAssetsByType = {};
  const topRe = /^buildings\/(\d+)(?:\.v2)?\/top\.(\d+)(?:\.v\d+)?\.png$/;
  const buttonRe = /^buildingbuttons\/(\d+)-(\d+)-s\.jpg$/;

  for (const key of Object.keys(manifest)) {
    const topMatch = key.match(topRe);
    if (topMatch) {
      const typeId = Number(topMatch[1]);
      const level = Number(topMatch[2]);
      if (!topAssetsByType[typeId]) topAssetsByType[typeId] = {};
      if (!topAssetsByType[typeId][level]) topAssetsByType[typeId][level] = [];
      topAssetsByType[typeId][level].push(key);
      continue;
    }
    const buttonMatch = key.match(buttonRe);
    if (buttonMatch) {
      const typeId = Number(buttonMatch[1]);
      const level = Number(buttonMatch[2]);
      if (!buttonAssetsByType[typeId]) buttonAssetsByType[typeId] = {};
      if (!buttonAssetsByType[typeId][level]) buttonAssetsByType[typeId][level] = [];
      buttonAssetsByType[typeId][level].push(key);
    }
  }
  return { topAssetsByType, buttonAssetsByType };
}

function isPlatformAssetUrl(url) {
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
  if (u.includes('/embedded/ui/widgets/buildingupgrade/')) return bytes > 100;
  return bytes > 500;
}

async function waitForBaseReady(page, out) {
  const started = Date.now();
  while (Date.now() - started < BOOT_MAX_MS) {
    const state = await page.evaluate(() => {
      const hx = window._hx_classes || {};
      const MAP = hx['com.cc.core.MAP'];
      let tops = null;
      try {
        tops = MAP && MAP._BUILDINGTOPS && typeof MAP._BUILDINGTOPS.get_numChildren === 'function'
          ? MAP._BUILDINGTOPS.get_numChildren()
          : null;
      } catch {}
      return {
        buildingTopsChildren: tops,
        hasHx: Object.keys(hx).length > 0,
        hasCanvas: !!document.querySelector('canvas'),
        baseReady: !!document.querySelector('canvas') && Object.keys(hx).length > 0 && (tops || 0) > 50,
      };
    });
    out.bootPolls.push({ elapsedMs: Date.now() - started, state });
    if (state.baseReady) return state;
    await sleep(BOOT_POLL_MS);
  }
  return out.bootPolls.length ? out.bootPolls[out.bootPolls.length - 1].state : { buildingTopsChildren: 0 };
}

async function runMaxUpgradeAndAssetChecks(page, maxByType, manifestIndex) {
  return page.evaluate(
    async ({ origin, maxByType, platformTypeIds, manifestIndex }) => {
      const PLATFORM_TYPES = new Set(platformTypeIds);

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
          json = { raw: text.slice(0, 300) };
        }
        return { ok: resp.ok, status: resp.status, json };
      }

      async function loadBase() {
        const ts = Math.floor(Date.now() / 1000);
        const resp = await fetch(`${origin}/api/wc/base/load?ts=${ts}`);
        return resp.json();
      }

      function manifestAssetKeysForType(typeId) {
        const keys = new Set();
        const tops = (manifestIndex.topAssetsByType && manifestIndex.topAssetsByType[typeId]) || {};
        const buttons = (manifestIndex.buttonAssetsByType && manifestIndex.buttonAssetsByType[typeId]) || {};
        Object.values(tops).forEach((rows) => rows.forEach((key) => keys.add(key)));
        Object.values(buttons).forEach((rows) => rows.forEach((key) => keys.add(key)));
        return [...keys];
      }

      async function fetchAsset(key) {
        try {
          const resp = await fetch(`${origin}/assets/${key}`);
          const buf = await resp.arrayBuffer();
          return { key, status: resp.status, bytes: buf.byteLength, ok: resp.ok && buf.byteLength > 500 };
        } catch (err) {
          return { key, error: String(err), ok: false };
        }
      }

      const baseBefore = await loadBase();
      const buildingdataBefore = parseBuildingData(baseBefore.buildingdata);
      const platforms = Object.values(buildingdataBefore).filter(
        (row) => row && PLATFORM_TYPES.has(parseInt(row.t, 10))
      );

      const upgrades = [];
      for (let i = 0; i < platforms.length; i++) {
        const row = platforms[i];
        const buildingId = parseInt(row.id, 10);
        const typeId = parseInt(row.t, 10);
        const maxLevel = maxByType[String(typeId)] || maxByType[typeId] || 0;
        if (!buildingId || !typeId || maxLevel <= 0) continue;

        const resp = await postProduction(
          [
            {
              action: 'instant_upgrade',
              building_id: buildingId,
              to_level: maxLevel,
              upgrade_to: maxLevel,
              type: typeId,
              building_type: typeId,
              instant: 1,
            },
          ],
          `max-${buildingId}`
        );

        upgrades.push({
          buildingId,
          typeId,
          maxLevel,
          levelBefore: parseInt(row.l, 10) || 0,
          resp,
        });
      }

      const baseAfter = await loadBase();
      const buildingdataAfter = parseBuildingData(baseAfter.buildingdata);

      const upgradeResults = upgrades.map((entry) => {
        let afterLevel = null;
        for (const row of Object.values(buildingdataAfter)) {
          if (row && parseInt(row.id, 10) === entry.buildingId) {
            afterLevel = parseInt(row.l, 10);
            break;
          }
        }
        return {
          ...entry,
          levelAfter: afterLevel,
          reachedMax: afterLevel === entry.maxLevel,
          apiOk: !!(entry.resp && entry.resp.ok),
        };
      });

      const typesOnBase = [...new Set(upgradeResults.map((row) => row.typeId))];
      const assetChecks = [];
      for (const typeId of typesOnBase) {
        const keys = manifestAssetKeysForType(typeId);
        for (const key of keys) {
          const result = await fetchAsset(key);
          assetChecks.push({ typeId, key, result, ok: !!result.ok });
        }
      }

      const hx = window._hx_classes || {};
      const UPDATES = hx['UPDATES'];
      if (UPDATES && typeof UPDATES.Process === 'function' && Array.isArray(baseAfter.updates)) {
        try {
          UPDATES.Process(baseAfter.updates);
        } catch (e) {}
      }
      if (typeof window.applyPatchesNow === 'function') {
        try {
          window.applyPatchesNow();
        } catch (e) {}
      }

      const failedAssets = assetChecks.filter((row) => !row.ok);
      const failedUpgrades = upgradeResults.filter((row) => !row.apiOk || !row.reachedMax);

      return {
        platformCount: platforms.length,
        upgradedCount: upgradeResults.length,
        upgradeResults,
        assetChecks,
        failedAssets,
        failedUpgrades,
        typesOnBase,
      };
    },
    { origin: LOCAL_ORIGIN, maxByType, platformTypeIds: [...PLATFORM_TYPE_IDS], manifestIndex }
  );
}

(async () => {
  const maxByType = loadMaxLevelsByType();
  const manifestIndex = loadManifestAssetIndex();
  const out = {
    startedAt: new Date().toISOString(),
    maxByType,
    manifestIndexSummary: Object.fromEntries(
      Object.entries(manifestIndex.topAssetsByType).map(([typeId, levels]) => [typeId, Object.keys(levels).length])
    ),
    bootPolls: [],
    network: [],
    result: null,
    pageErrors: [],
    pass: false,
  };

  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 420000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1365, height: 768 });

  page.on('pageerror', (err) => out.pageErrors.push(String(err)));
  page.on('response', async (response) => {
    try {
      const url = response.url();
      if (!isPlatformAssetUrl(url)) return;
      const status = response.status();
      let bytes = null;
      try {
        bytes = (await response.buffer()).length;
      } catch {
        bytes = null;
      }
      out.network.push({ url, status, bytes, ok: assetResponseOk(url, status, bytes) });
    } catch {}
  });

  await page.goto(`${LOCAL_ORIGIN}/index.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(BOOT_WAIT_MS);
  const bootState = await waitForBaseReady(page, out);
  out.bootReady = bootState;
  await page.screenshot({ path: 'tmp_probe_platform_max_upgrade_01_base.png' });

  out.result = await runMaxUpgradeAndAssetChecks(page, maxByType, manifestIndex);
  await sleep(5000);
  await page.screenshot({ path: 'tmp_probe_platform_max_upgrade_02_maxed.png' });

  const fatalErrors = out.pageErrors.filter(
    (msg) =>
      !String(msg).includes('getHomeBase') &&
      !String(msg).includes('WebSocket') &&
      !String(msg).includes("reading 'url'")
  );

  const baseRendered = (bootState.buildingTopsChildren || 0) > 50;
  const allUpgraded =
    out.result &&
    out.result.upgradedCount > 0 &&
    (out.result.failedUpgrades || []).length === 0;
  const allAssets =
    out.result &&
    Array.isArray(out.result.assetChecks) &&
    out.result.assetChecks.length > 0 &&
    (out.result.failedAssets || []).length === 0;
  const netOk = out.network.filter((row) => !row.ok).length === 0;

  out.summary = {
    baseRendered,
    platformCount: out.result && out.result.platformCount,
    upgradedCount: out.result && out.result.upgradedCount,
    typesOnBase: out.result && out.result.typesOnBase,
    assetChecks: out.result && out.result.assetChecks ? out.result.assetChecks.length : 0,
    failedUpgrades: out.result && out.result.failedUpgrades ? out.result.failedUpgrades.length : 0,
    failedAssets: out.result && out.result.failedAssets ? out.result.failedAssets.length : 0,
    failedNetworkAssets: out.network.filter((row) => !row.ok).length,
    allUpgraded,
    allAssets,
    netOk,
  };

  out.pass = fatalErrors.length === 0 && baseRendered && allUpgraded && allAssets && netOk;
  out.endedAt = new Date().toISOString();

  fs.writeFileSync('tmp_probe_platform_max_upgrade.json', JSON.stringify(out, null, 2));
  await browser.close();

  console.log(JSON.stringify({ pass: out.pass, summary: out.summary }, null, 2));
  if (!out.pass) process.exitCode = 1;
})().catch((err) => {
  const payload = {
    startedAt: new Date().toISOString(),
    error: String(err),
    endedAt: new Date().toISOString(),
  };
  fs.writeFileSync('tmp_probe_platform_max_upgrade.json', JSON.stringify(payload, null, 2));
  console.error(err);
  process.exitCode = 1;
});