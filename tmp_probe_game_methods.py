import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page(viewport={"width": 1280, "height": 720})
        await page.goto('http://localhost:8089/index.html', wait_until='domcontentloaded', timeout=90000)
        await page.wait_for_timeout(110000)
        data = await page.evaluate('''() => {
            const hx = window._hx_classes || {};
            const GameClass = hx["GAME"] || window.GAME;
            const Worldmap = hx["com.cc.worldmap.Worldmap"];
            const out = { hasGameClass: !!GameClass, hasWorldmapClass: !!Worldmap };
            if (GameClass && GameClass.prototype) {
                out.gameStatic = Object.getOwnPropertyNames(GameClass).slice(0, 400);
                out.gameProto = Object.getOwnPropertyNames(GameClass.prototype).filter(k => k !== 'constructor').slice(0, 600);
                const inst = GameClass._instance || GameClass.instance || null;
                out.hasGameInstance = !!inst;
                if (inst) {
                    out.gameKeys = Object.getOwnPropertyNames(inst).slice(0, 600);
                    out.mapId = inst.map_id ?? null;
                    out.worldMapTruthy = !!inst.worldMap;
                    out.activeState = !!inst._activeState;
                    if (inst._activeState) {
                        out.activeStateKeys = Object.getOwnPropertyNames(inst._activeState).slice(0, 200);
                        try {
                            out.activeStateName = inst._activeState.getCurrentStateName ? inst._activeState.getCurrentStateName() : (inst._activeState.get_stateName ? inst._activeState.get_stateName() : null);
                        } catch (e) {
                            out.activeStateName = null;
                        }
                    }
                }
            }
            if (Worldmap) {
                out.worldmapStatic = Object.getOwnPropertyNames(Worldmap).slice(0, 400);
                out.worldmapState = {
                    attemptedLoad: Worldmap._attemptedLoad ?? null,
                    hasFinishedLoading: Worldmap._hasFinishedLoading ?? null,
                    hasHexMap: !!Worldmap._hexMap,
                    hasController: !!Worldmap._controller,
                    hasMapView: !!Worldmap._mapView,
                    sectorId: Worldmap._sectorId ?? null,
                    waitTime: Worldmap._waitTime ?? null,
                };
            }
            return out;
        }''')
        print(json.dumps(data, indent=2))
        await b.close()

if __name__ == '__main__':
    asyncio.run(main())
