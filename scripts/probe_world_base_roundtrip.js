const fs = require('fs');
const puppeteer = require('puppeteer');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hudButtonCoords(viewport) {
  const width = viewport.width || 1365;
  const height = viewport.height || 768;
  return {
    worldMapButton: {
      x: Math.round(width - 50),
      y: Math.round(height - 180),
    },
    attackLogButton: {
      x: Math.round(width - 80),
      y: 82,
    },
  };
}

async function readState(page) {
  return page.evaluate(() => {
    const hx = window._hx_classes || {};
    const ActiveState = hx['ActiveState'];
    const Worldmap = hx['com.cc.worldmap.Worldmap'];
    const MAP = hx['com.cc.core.MAP'];
    const BASE = hx['BASE'];
    const GLOBAL = hx['GLOBAL'];

    function childCount(layer) {
      try {
        return layer && typeof layer.get_numChildren === 'function' ? layer.get_numChildren() : null;
      } catch {
        return null;
      }
    }

    function layerVisible(layer) {
      try {
        if (!layer) return null;
        if (typeof layer.get_visible === 'function') return !!layer.get_visible();
        if (typeof layer.visible !== 'undefined') return !!layer.visible;
      } catch {}
      return null;
    }

    let isWorld = null;
    let isChanging = null;
    try {
      isWorld = ActiveState && typeof ActiveState.IsWorldMap === 'function' ? !!ActiveState.IsWorldMap() : null;
    } catch {}
    try {
      isChanging = ActiveState && typeof ActiveState.IsChangingState === 'function' ? !!ActiveState.IsChangingState() : null;
    } catch {}

    let buildingCount = 0;
    try {
      if (BASE && BASE._buildingsAll && typeof BASE._buildingsAll.get_length === 'function') {
        buildingCount = BASE._buildingsAll.get_length();
      }
    } catch {}

    return {
      isWorldMap: isWorld,
      isChangingState: isChanging,
      worldmap: Worldmap
        ? {
            hasMapView: !!Worldmap._mapView,
            mapViewVisible: layerVisible(Worldmap._mapView),
            hasController: !!Worldmap._controller,
            hasHexMap: !!Worldmap._hexMap,
            hasFinishedLoading: Worldmap._hasFinishedLoading ?? null,
          }
        : null,
      map: MAP
        ? {
            buildingTopsChildren: childCount(MAP._BUILDINGTOPS),
            buildingBasesChildren: childCount(MAP._BUILDINGBASES),
            groundChildren: childCount(MAP._GROUND),
            oldRenderChildren: childCount(MAP._oldRender),
            layerMapVisible: layerVisible(GLOBAL && GLOBAL._layerMap),
          }
        : null,
      base: {
        loadedHomeBase: !!(BASE && BASE._buildingsAll),
        buildingCount,
      },
      hasCanvas: !!document.querySelector('canvas'),
    };
  });
}

(async () => {
  const out = {
    startedAt: new Date().toISOString(),
    steps: [],
    pageErrors: [],
    pass: false,
  };

  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 300000 });
  const page = await browser.newPage();
  const viewport = { width: 1365, height: 768 };
  await page.setViewport(viewport);
  page.on('pageerror', (err) => out.pageErrors.push(String(err)));

  const coords = hudButtonCoords(viewport);

  await page.goto('http://127.0.0.1:8089/index.html', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(100000);

  async function capture(label, click) {
    if (click) {
      await page.mouse.click(click.x, click.y);
      await sleep(click.waitMs || 8000);
    }
    const state = await readState(page);
    const shot = `tmp_probe_world_base_roundtrip_${label}.png`;
    await page.screenshot({ path: shot });
    out.steps.push({ label, state, screenshot: shot });
    return state;
  }

  const baseState = await capture('01_base_initial');
  await capture('02_world_click_1', { ...coords.worldMapButton, waitMs: 25000 });
  let worldState = await readState(page);
  if (!worldState.isWorldMap) {
    await capture('03_world_click_2', { ...coords.worldMapButton, waitMs: 12000 });
    worldState = await readState(page);
  }
  if (!worldState.isWorldMap || worldState.isChangingState) {
    await page.evaluate(() => {
      if (typeof window.__PATCH_V33_TOGGLE_WORLD_MAP__ === 'function') {
        window.__PATCH_V33_TOGGLE_WORLD_MAP__();
      }
    });
    await sleep(15000);
    worldState = await capture('04_world_forced_toggle');
  } else {
    await sleep(5000);
    worldState = await capture('04_world_ready');
  }

  await capture('05_enter_base_click', { ...coords.worldMapButton, waitMs: 10000 });
  let homeState = await readState(page);
  if (homeState.isWorldMap) {
    await page.evaluate(() => {
      if (typeof window.__PATCH_V33_TOGGLE_HOME_BASE__ === 'function') {
        window.__PATCH_V33_TOGGLE_HOME_BASE__();
      }
    });
    await sleep(10000);
    homeState = await capture('06_home_forced_toggle');
  } else {
    await capture('06_home_ready');
  }

  const initial = out.steps[0].state;
  const finalWorld = worldState;
  const finalHome = homeState;

  out.summary = {
    baseBuildingCountInitial: initial.base.buildingCount,
    baseBuildingCountAfterWorld: finalWorld.base.buildingCount,
    baseBuildingCountAfterHome: finalHome.base.buildingCount,
    worldMapActivated: !!finalWorld.isWorldMap || !!finalWorld.worldmap?.mapViewVisible,
    homeRestored: finalHome.isWorldMap === false,
    mapLayersChanged:
      initial.map?.buildingTopsChildren !== finalWorld.map?.buildingTopsChildren ||
      initial.map?.layerMapVisible !== finalWorld.map?.layerMapVisible,
    homeLayersRestored:
      finalHome.map?.buildingTopsChildren > 0 || finalHome.base.buildingCount > 0,
  };

  const fatalErrors = out.pageErrors.filter(
    (msg) =>
      !String(msg).includes('getHomeBase') &&
      !String(msg).includes('WebSocket') &&
      !String(msg).includes("reading 'url'")
  );

  out.pass =
    fatalErrors.length === 0 &&
    out.summary.worldMapActivated &&
    out.summary.homeRestored &&
    out.summary.mapLayersChanged &&
    out.summary.homeLayersRestored;

  out.endedAt = new Date().toISOString();
  fs.writeFileSync('tmp_probe_world_base_roundtrip.json', JSON.stringify(out, null, 2));
  await browser.close();
  if (!out.pass) process.exitCode = 1;
})().catch((err) => {
  fs.writeFileSync(
    'tmp_probe_world_base_roundtrip.json',
    JSON.stringify({ startedAt: new Date().toISOString(), error: String(err), endedAt: new Date().toISOString() }, null, 2)
  );
  process.exitCode = 1;
});