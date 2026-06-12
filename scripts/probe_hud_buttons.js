const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const LOCAL_ORIGIN = 'http://127.0.0.1:8089';
const BOOT_WAIT_MS = 125000;
const BOOT_MAX_MS = 180000;
const BOOT_POLL_MS = 5000;
const OUT_DIR = 'tmp_probe_hud_buttons';

const PLATFORM_TYPE_IDS = new Set([
  10, 64, 86, 87, 88, 111, 114, 130, 187, 270, 275, 276, 277, 353, 361, 362, 387, 488, 489,
]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
}

function scaleCoord(x1280, y720, w, h) {
  return {
    x: Math.round((x1280 * w) / 1280),
    y: Math.round((y720 * h) / 720),
  };
}

function buttonPlan(viewport) {
  const w = viewport.width || 1365;
  const h = viewport.height || 768;
  const cx = (left, right, top, bottom) => ({
    x: Math.round((left + right) / 2),
    y: Math.round((top + bottom) / 2),
    box: { left, right, top, bottom },
  });

  const worldMap = cx(w - 92, w - 8, h - 222, h - 138);
  const attackLog = cx(w - 150, w - 8, 46, 118);
  const platoons = scaleCoord(1060, 565, w, h);
  const buildings = scaleCoord(1120, 565, w, h);
  const store = scaleCoord(1170, 565, w, h);
  const worldTab = scaleCoord(1230, 565, w, h);

  return [
    {
      id: 'player_profile',
      label: 'Player profile / rank (top-left)',
      region: 'top_hud',
      ...cx(8, 170, 8, 42),
      waitMs: 2500,
      recover: 'none',
      expectKeys: ['topLayerDelta', 'popupOpened'],
    },
    {
      id: 'resource_medical_plus',
      label: 'Medical resource + button',
      region: 'top_hud',
      x: Math.round(w * 0.36),
      y: 18,
      waitMs: 2000,
      recover: 'close_popup',
      expectKeys: ['topLayerDelta', 'popupOpened'],
    },
    {
      id: 'resource_coin_plus',
      label: 'Coin resource + button',
      region: 'top_hud',
      x: Math.round(w * 0.44),
      y: 18,
      waitMs: 2000,
      recover: 'close_popup',
      expectKeys: ['topLayerDelta', 'popupOpened'],
    },
    {
      id: 'attack_log',
      label: 'Attack Log (top-right)',
      region: 'top_hud',
      ...attackLog,
      waitMs: 3500,
      recover: 'close_popup',
      expectKeys: ['attackLogOpen', 'popupOpened'],
    },
    {
      id: 'settings_gear',
      label: 'Settings / gear icon (top-right)',
      region: 'top_hud',
      x: Math.round(w - 220),
      y: 30,
      waitMs: 2500,
      recover: 'close_popup',
      expectKeys: ['topLayerDelta', 'popupOpened'],
    },
    {
      id: 'platoons_tab',
      label: 'Platoons tab (bottom bar)',
      region: 'bottom_tabs',
      ...platoons,
      waitMs: 3000,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'buildings_tab',
      label: 'Buildings tab (bottom bar)',
      region: 'bottom_tabs',
      ...buildings,
      waitMs: 3000,
      recover: 'none',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'store_tab',
      label: 'Store tab (bottom bar)',
      region: 'bottom_tabs',
      ...store,
      waitMs: 3000,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta', 'popupOpened'],
    },
    {
      id: 'world_map_tab',
      label: 'World Map tab (bottom-right)',
      region: 'bottom_tabs',
      ...worldTab,
      waitMs: 14000,
      recover: 'home',
      expectKeys: ['worldMapToggled'],
    },
    {
      id: 'building_context_upgrade',
      label: 'Building context menu: Upgrade',
      region: 'context_menu',
      x: Math.round(w * 0.52),
      y: Math.round(h * 0.46),
      prereq: 'select_platform',
      waitMs: 2500,
      recover: 'dismiss_menu',
      expectKeys: ['topLayerDelta', 'popupOpened', 'selectionChanged'],
    },
    {
      id: 'building_context_change_type',
      label: 'Building context menu: Change Type',
      region: 'context_menu',
      x: Math.round(w * 0.52),
      y: Math.round(h * 0.42),
      prereq: 'select_platform',
      waitMs: 2500,
      recover: 'dismiss_menu',
      expectKeys: ['topLayerDelta', 'popupOpened'],
    },
    {
      id: 'right_panel_upgrade_all',
      label: 'Right panel: Upgrade All',
      region: 'right_panel',
      x: Math.round(w - 95),
      y: Math.round(h - 130),
      prereq: 'select_barricade',
      waitMs: 3000,
      recover: 'dismiss_menu',
      expectKeys: ['topLayerDelta', 'popupOpened', 'selectionChanged'],
    },
    {
      id: 'building_category_1',
      label: 'Building category icon 1 (bottom panel)',
      region: 'bottom_panel',
      x: Math.round(w - 310),
      y: Math.round(h * 0.72),
      waitMs: 2500,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'building_category_2',
      label: 'Building category icon 2 (bottom panel)',
      region: 'bottom_panel',
      x: Math.round(w - 260),
      y: Math.round(h * 0.72),
      waitMs: 2500,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'building_category_3',
      label: 'Building category icon 3 (bottom panel)',
      region: 'bottom_panel',
      x: Math.round(w - 210),
      y: Math.round(h * 0.72),
      waitMs: 2500,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'building_category_4',
      label: 'Building category icon 4 (bottom panel)',
      region: 'bottom_panel',
      x: Math.round(w - 160),
      y: Math.round(h * 0.72),
      waitMs: 2500,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'buildings_panel_close',
      label: 'Buildings panel close X (left panel)',
      region: 'left_panel',
      x: Math.round(w * 0.31),
      y: h - 175,
      waitMs: 2000,
      recover: 'buildings_tab',
      expectKeys: ['bottomPanelDelta'],
    },
    {
      id: 'canvas_center',
      label: 'Canvas center (select base / building)',
      region: 'canvas',
      x: Math.round(w * 0.5),
      y: Math.round(h * 0.45),
      waitMs: 2500,
      recover: 'none',
      expectKeys: ['selectionChanged', 'topLayerDelta'],
    },
    {
      id: 'canvas_platform',
      label: 'Canvas platform cluster (mid-right)',
      region: 'canvas',
      x: Math.round(w * 0.62),
      y: Math.round(h * 0.52),
      waitMs: 2500,
      recover: 'none',
      expectKeys: ['selectionChanged', 'topLayerDelta', 'popupOpened'],
    },
  ];
}

async function waitForBaseReady(page) {
  const started = Date.now();
  while (Date.now() - started < BOOT_MAX_MS) {
    const state = await readUiState(page);
    if (state.baseReady) return state;
    await sleep(BOOT_POLL_MS);
  }
  return readUiState(page);
}

async function readUiState(page) {
  return page.evaluate(() => {
    const hx = window._hx_classes || {};
    const ActiveState = hx['ActiveState'];
    const Worldmap = hx['com.cc.worldmap.Worldmap'];
    const MAP = hx['com.cc.core.MAP'];
    const GLOBAL = hx['GLOBAL'];
    const AttackLogPopup = hx['com.cc.attacklog.ui.attack_log_popup.AttackLogPopup'];

    function childCount(layer) {
      try {
        return layer && typeof layer.get_numChildren === 'function' ? layer.get_numChildren() : 0;
      } catch {
        return 0;
      }
    }

    function layerChildren(layer) {
      const out = [];
      const n = childCount(layer);
      for (let i = 0; i < n; i++) {
        try {
          const c = layer.getChildAt(i);
          out.push({
            cls: (c && c.__class__ && c.__class__.__name__) || null,
            visible:
              c && typeof c.get_visible === 'function' ? !!c.get_visible() : c && c.visible != null ? !!c.visible : null,
          });
        } catch {
          out.push({ cls: null, visible: null });
        }
      }
      return out;
    }

    let isWorld = null;
    let isChanging = null;
    try {
      isWorld = ActiveState && typeof ActiveState.IsWorldMap === 'function' ? !!ActiveState.IsWorldMap() : null;
    } catch {}
    try {
      isChanging =
        ActiveState && typeof ActiveState.IsChangingState === 'function' ? !!ActiveState.IsChangingState() : null;
    } catch {}

    const tops = childCount(MAP && MAP._BUILDINGTOPS);
    const topLayer = childCount(GLOBAL && GLOBAL._layerTop);
    const windowLayer = childCount(GLOBAL && GLOBAL._layerWindows);
    const bottomLayer = childCount(GLOBAL && GLOBAL._layerBottom);

    let attackLogOpen = false;
    try {
      attackLogOpen = !!(AttackLogPopup && AttackLogPopup._instance);
    } catch {}

    return {
      isWorldMap: isWorld,
      isChangingState: isChanging,
      attackLogOpen,
      buildingTopsChildren: tops,
      topLayerChildren: topLayer,
      windowLayerChildren: windowLayer,
      bottomLayerChildren: bottomLayer,
      topLayer: layerChildren(GLOBAL && GLOBAL._layerTop),
      windowLayer: layerChildren(GLOBAL && GLOBAL._layerWindows),
      baseReady: !!document.querySelector('canvas') && tops > 50,
      worldmapLoaded: !!(Worldmap && Worldmap._hasFinishedLoading),
    };
  });
}

function diffState(before, after) {
  return {
    worldMapToggled: before.isWorldMap !== after.isWorldMap,
    attackLogOpen: after.attackLogOpen && !before.attackLogOpen,
    attackLogClosed: before.attackLogOpen && !after.attackLogOpen,
    topLayerDelta: after.topLayerChildren !== before.topLayerChildren,
    windowLayerDelta: after.windowLayerChildren !== before.windowLayerChildren,
    bottomPanelDelta: after.bottomLayerChildren !== before.bottomLayerChildren,
    buildingTopsDelta: after.buildingTopsChildren !== before.buildingTopsChildren,
    popupOpened: after.topLayerChildren > before.topLayerChildren || after.windowLayerChildren > before.windowLayerChildren,
    popupClosed: after.topLayerChildren < before.topLayerChildren || after.windowLayerChildren < before.windowLayerChildren,
    selectionChanged:
      JSON.stringify(before.topLayer) !== JSON.stringify(after.topLayer) &&
      !(
        after.topLayerChildren > before.topLayerChildren || after.windowLayerChildren > before.windowLayerChildren
      ),
    anyChange:
      before.isWorldMap !== after.isWorldMap ||
      before.attackLogOpen !== after.attackLogOpen ||
      before.topLayerChildren !== after.topLayerChildren ||
      before.windowLayerChildren !== after.windowLayerChildren ||
      before.bottomLayerChildren !== after.bottomLayerChildren ||
      before.buildingTopsChildren !== after.buildingTopsChildren ||
      JSON.stringify(before.topLayer) !== JSON.stringify(after.topLayer) ||
      JSON.stringify(before.windowLayer) !== JSON.stringify(after.windowLayer),
  };
}

function screenshotsDiffer(beforePath, afterPath) {
  try {
    const before = fs.readFileSync(beforePath);
    const after = fs.readFileSync(afterPath);
    return !before.equals(after);
  } catch {
    return false;
  }
}

function evaluateButton(button, diff, afterState, beforeShot, afterShot) {
  const hits = (button.expectKeys || []).filter((key) => diff[key]);
  const layerClasses = (afterState.topLayer || []).map((row) => row.cls).filter(Boolean);
  const visualChange = screenshotsDiffer(beforeShot, afterShot);
  return {
    responded: diff.anyChange || visualChange,
    expectedHit: hits.length > 0,
    hits,
    layerClasses,
    visualChange,
    pass: diff.anyChange || visualChange,
  };
}

async function resetUi(page, viewport) {
  await page.keyboard.press('Escape').catch(() => {});
  await sleep(400);
  await page.keyboard.press('Escape').catch(() => {});
  await sleep(400);
  await page.mouse.click(24, Math.round(viewport.height * 0.35));
  await sleep(800);
}

async function ensureHomeBase(page) {
  const state = await readUiState(page);
  if (!state.isWorldMap) return state;
  await page.evaluate(() => {
    if (typeof window.__PATCH_V33_TOGGLE_HOME_BASE__ === 'function') {
      window.__PATCH_V33_TOGGLE_HOME_BASE__();
    }
  });
  await sleep(12000);
  return readUiState(page);
}

async function runPrereq(page, prereq, viewport) {
  if (!prereq) return;
  if (prereq === 'select_platform') {
    await page.mouse.click(Math.round(viewport.width * 0.62), Math.round(viewport.height * 0.52));
    await sleep(2000);
    return;
  }
  if (prereq === 'select_barricade') {
    await page.mouse.click(Math.round(viewport.width * 0.78), Math.round(viewport.height * 0.58));
    await sleep(2000);
  }
}

async function recoverUi(page, mode, viewport) {
  if (!mode || mode === 'none') return;
  const plan = buttonPlan(viewport);
  const buildings = plan.find((b) => b.id === 'buildings_tab');
  const close = { x: Math.round(viewport.width * 0.64), y: Math.round(viewport.height * 0.42), waitMs: 1500 };

  if (mode === 'dismiss_menu') {
    await resetUi(page, viewport);
    return;
  }

  if (mode === 'close_popup') {
    await page.mouse.click(close.x, close.y);
    await sleep(close.waitMs);
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(800);
    return;
  }
  if (mode === 'buildings_tab' && buildings) {
    await page.mouse.click(buildings.x, buildings.y);
    await sleep(2500);
    return;
  }
  if (mode === 'home') {
    await page.evaluate(() => {
      if (typeof window.__PATCH_V33_TOGGLE_HOME_BASE__ === 'function') {
        window.__PATCH_V33_TOGGLE_HOME_BASE__();
      }
    });
    await sleep(10000);
    const state = await readUiState(page);
    if (state.isWorldMap) {
      const world = plan.find((b) => b.id === 'world_map_tab');
      if (world) {
        await page.mouse.click(world.x, world.y);
        await sleep(12000);
      }
    }
  }
}

async function runMaxUpgrade(page) {
  const maxByType = loadMaxLevelsByType();
  return page.evaluate(
    async ({ origin, maxByType, platformTypeIds }) => {
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
        return { ok: resp.ok, status: resp.status };
      }
      const base = await fetch(`${origin}/api/wc/base/load?ts=${Math.floor(Date.now() / 1000)}`).then((r) => r.json());
      const buildingdata = parseBuildingData(base.buildingdata);
      const platforms = Object.values(buildingdata).filter((row) => row && PLATFORM_TYPES.has(parseInt(row.t, 10)));
      let ok = 0;
      for (const row of platforms) {
        const buildingId = parseInt(row.id, 10);
        const typeId = parseInt(row.t, 10);
        const maxLevel = maxByType[String(typeId)] || maxByType[typeId] || 0;
        if (!buildingId || !typeId || maxLevel <= 0) continue;
        const resp = await postProduction(
          [{ action: 'instant_upgrade', building_id: buildingId, to_level: maxLevel, instant: 1 }],
          `hud-${buildingId}`
        );
        if (resp.ok) ok++;
      }
      const hx = window._hx_classes || {};
      const UPDATES = hx['UPDATES'];
      const baseAfter = await fetch(`${origin}/api/wc/base/load?ts=${Math.floor(Date.now() / 1000)}`).then((r) => r.json());
      if (UPDATES && typeof UPDATES.Process === 'function' && Array.isArray(baseAfter.updates)) {
        try {
          UPDATES.Process(baseAfter.updates);
        } catch {}
      }
      if (typeof window.applyPatchesNow === 'function') {
        try {
          window.applyPatchesNow();
        } catch {}
      }
      return { platformCount: platforms.length, upgradedOk: ok };
    },
    { origin: LOCAL_ORIGIN, maxByType, platformTypeIds: [...PLATFORM_TYPE_IDS] }
  );
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

async function testButton(page, button, phase, viewport) {
  const slug = `${phase}_${button.id}`;
  await resetUi(page, viewport);
  if (button.prereq) await runPrereq(page, button.prereq, viewport);

  const beforeState = await readUiState(page);
  const beforeShot = path.join(OUT_DIR, `${slug}_before.png`);
  await page.screenshot({ path: beforeShot });

  await page.mouse.click(button.x, button.y);
  await sleep(button.waitMs || 2500);

  const afterState = await readUiState(page);
  const afterShot = path.join(OUT_DIR, `${slug}_after.png`);
  await page.screenshot({ path: afterShot });

  const diff = diffState(beforeState, afterState);
  const verdict = evaluateButton(button, diff, afterState, beforeShot, afterShot);

  await recoverUi(page, button.recover, viewport);
  await sleep(1500);

  return {
    id: button.id,
    label: button.label,
    region: button.region,
    phase,
    coords: { x: button.x, y: button.y },
    before: beforeState,
    after: afterState,
    diff,
    verdict,
    screenshots: { before: beforeShot, after: afterShot },
  };
}

(async () => {
  ensureOutDir();
  const viewport = { width: 1365, height: 768 };
  const plan = buttonPlan(viewport).sort((a, b) => {
    if (a.id === 'world_map_tab') return 1;
    if (b.id === 'world_map_tab') return -1;
    return 0;
  });
  const out = {
    startedAt: new Date().toISOString(),
    viewport,
    buttonPlan: plan.map(({ id, label, region, x, y, box, waitMs, recover, expectKeys }) => ({
      id,
      label,
      region,
      x,
      y,
      box: box || null,
      waitMs,
      recover,
      expectKeys,
    })),
    phases: {},
    pageErrors: [],
    pass: false,
  };

  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 600000 });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  page.on('pageerror', (err) => out.pageErrors.push(String(err)));

  await page.goto(`${LOCAL_ORIGIN}/index.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await sleep(BOOT_WAIT_MS);
  const bootState = await waitForBaseReady(page);
  out.bootState = bootState;

  const planShot = path.join(OUT_DIR, '00_plan_baseline.png');
  await page.screenshot({ path: planShot, fullPage: false });
  out.planScreenshot = planShot;

  out.phases.before_max_upgrade = [];
  for (const button of plan) {
    await ensureHomeBase(page);
    out.phases.before_max_upgrade.push(await testButton(page, button, 'before_max', viewport));
  }

  const maxResult = await runMaxUpgrade(page);
  out.maxUpgrade = maxResult;
  await sleep(5000);
  await ensureHomeBase(page);
  await sleep(3000);
  await resetUi(page, viewport);
  await sleep(2000);
  const afterMaxShot = path.join(OUT_DIR, '01_plan_after_max_upgrade.png');
  await page.screenshot({ path: afterMaxShot });
  out.afterMaxScreenshot = afterMaxShot;
  out.afterMaxState = await readUiState(page);

  out.phases.after_max_upgrade = [];
  for (const button of plan) {
    await ensureHomeBase(page);
    out.phases.after_max_upgrade.push(await testButton(page, button, 'after_max', viewport));
  }

  function summarizePhase(rows) {
    return {
      total: rows.length,
      responded: rows.filter((r) => r.verdict.responded).length,
      expectedHits: rows.filter((r) => r.verdict.expectedHit).length,
      passed: rows.filter((r) => r.verdict.pass).length,
      failed: rows.filter((r) => !r.verdict.pass).map((r) => ({ id: r.id, label: r.label, diff: r.diff })),
    };
  }

  out.summary = {
    beforeMax: summarizePhase(out.phases.before_max_upgrade),
    afterMax: summarizePhase(out.phases.after_max_upgrade),
    maxUpgrade: maxResult,
  };

  const fatalErrors = out.pageErrors.filter(
    (msg) =>
      !String(msg).includes('getHomeBase') &&
      !String(msg).includes('WebSocket') &&
      !String(msg).includes("reading 'url'")
  );

  out.pass =
    fatalErrors.length === 0 &&
    bootState.baseReady &&
    maxResult.upgradedOk > 0 &&
    out.summary.beforeMax.passed >= Math.floor(plan.length * 0.7) &&
    out.summary.afterMax.passed >= Math.floor(plan.length * 0.7);

  out.endedAt = new Date().toISOString();
  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify(out, null, 2));
  await browser.close();

  console.log(
    JSON.stringify(
      {
        pass: out.pass,
        planScreenshot: out.planScreenshot,
        afterMaxScreenshot: out.afterMaxScreenshot,
        summary: out.summary,
        buttonCount: plan.length,
      },
      null,
      2
    )
  );
  if (!out.pass) process.exitCode = 1;
})().catch((err) => {
  ensureOutDir();
  fs.writeFileSync(
    path.join(OUT_DIR, 'report.json'),
    JSON.stringify({ startedAt: new Date().toISOString(), error: String(err), endedAt: new Date().toISOString() }, null, 2)
  );
  console.error(err);
  process.exitCode = 1;
});