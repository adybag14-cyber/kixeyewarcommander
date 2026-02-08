import asyncio
import json

from playwright.async_api import async_playwright


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        await page.goto("http://localhost:8089/index.html", wait_until="domcontentloaded", timeout=90000)
        await page.wait_for_timeout(90000)

        before = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const keys = Object.keys(hx);
                const gatewayKeys = keys.filter(k => /gateway|net\\.proto|connection|worldmap/i.test(k));

                function protoMethods(name) {
                    const cls = hx[name];
                    if (!cls || !cls.prototype) return [];
                    return Object.getOwnPropertyNames(cls.prototype).filter(m => m !== "constructor").slice(0, 300);
                }

                const out = {
                    gatewayClassCount: gatewayKeys.length,
                    gatewayKeys: gatewayKeys.slice(0, 300),
                    selected: {},
                };

                const interesting = [
                    "com.kixeye.net.GatewayHttpConnection",
                    "com.kixeye.net.GatewayConnection",
                    "com.kixeye.net.GatewayClient",
                    "com.kixeye.net.GatewayService",
                    "com.cc.worldmap.WorldmapController",
                    "com.cc.worldmap.Worldmap",
                ];

                for (const k of interesting) {
                    out.selected[k] = {
                        exists: !!hx[k],
                        proto: protoMethods(k),
                        staticKeys: hx[k] ? Object.getOwnPropertyNames(hx[k]).slice(0, 300) : []
                    };
                }

                const WMC = hx["com.cc.worldmap.WorldmapController"];
                if (WMC) {
                    const inst = WMC._instance || (WMC.get_instance ? WMC.get_instance() : null) || null;
                    out.wmcHasInstance = !!inst;
                    if (inst) {
                        out.wmcKeys = Object.getOwnPropertyNames(inst).slice(0, 400);
                        out.wmcState = {
                            connected: inst.get_connected ? !!inst.get_connected() : null,
                            authenticated: inst.get_authenticated ? !!inst.get_authenticated() : null,
                            hasService: !!inst._worldmapService,
                            hasClient: !!inst._gatewayClient,
                            hasConn: !!inst._connection,
                            connectCancelTime: inst._connectCancelTime || null,
                            connectStartTime: inst._connectStartTime || null,
                            requestedSectors: inst._requestedSectors ? Object.keys(inst._requestedSectors).length : null,
                        };
                    }
                }

                const GameClass = hx["GAME"] || window.GAME;
                const gameInst = GameClass ? (GameClass._instance || GameClass.instance) : null;
                out.gameState = gameInst ? {
                    hasWorldMap: !!gameInst.worldMap,
                    mapId: gameInst.map_id ?? null,
                } : null;

                return out;
            }"""
        )

        print("=== BEFORE CLICK ===")
        print(json.dumps(before, indent=2))

        await page.mouse.click(1210, 568)
        await page.wait_for_timeout(30000)

        after = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const out = {};
                const WMC = hx["com.cc.worldmap.WorldmapController"];
                const Worldmap = hx["com.cc.worldmap.Worldmap"];
                const GameClass = hx["GAME"] || window.GAME;
                const gameInst = GameClass ? (GameClass._instance || GameClass.instance) : null;

                if (WMC) {
                    const inst = WMC._instance || (WMC.get_instance ? WMC.get_instance() : null) || null;
                    out.wmcHasInstance = !!inst;
                    if (inst) {
                        out.wmcKeys = Object.getOwnPropertyNames(inst).slice(0, 500);
                        out.wmcState = {
                            connected: inst.get_connected ? !!inst.get_connected() : null,
                            authenticated: inst.get_authenticated ? !!inst.get_authenticated() : null,
                            connectCancelTime: inst._connectCancelTime || null,
                            connectStartTime: inst._connectStartTime || null,
                            hasGatewayClient: !!inst._gatewayClient,
                            hasConn: !!inst._connection,
                            hasWorldmapService: !!inst._worldmapService,
                            requestedSectors: inst._requestedSectors ? Object.keys(inst._requestedSectors).length : null,
                        };
                    }
                }

                if (Worldmap) {
                    out.worldmapStatics = Object.getOwnPropertyNames(Worldmap).slice(0, 400);
                    out.worldmapState = {
                        hasHexMap: !!Worldmap._hexMap,
                        hasController: !!Worldmap._controller,
                        hasMapView: !!Worldmap._mapView,
                    };
                    if (Worldmap._controller) {
                        const c = Worldmap._controller;
                        function summarizeObj(obj) {
                            if (!obj) return null;
                            let proto = null;
                            let protoKeys = [];
                            try {
                                proto = Object.getPrototypeOf(obj);
                                if (proto) protoKeys = Object.getOwnPropertyNames(proto).slice(0, 400);
                            } catch (e) {}
                            return {
                                className: (obj.__class__ && obj.__class__.__name__) ? obj.__class__.__name__ : null,
                                keys: Object.getOwnPropertyNames(obj).slice(0, 400),
                                protoKeys: protoKeys
                            };
                        }
                        out.worldmapControllerKeys = Object.getOwnPropertyNames(c).slice(0, 500);
                        out.worldmapControllerState = {
                            connected: c.get_connected ? !!c.get_connected() : null,
                            authenticated: c.get_authenticated ? !!c.get_authenticated() : null,
                            hasMapService: !!c._mapService,
                            hasDataStorageService: !!c._dataStorageService,
                            hasWcDataStorageService: !!c._wcDataStorageService,
                            hasSharedConfigMapService: !!c._sharedConfigMapService,
                            hasHasReceivedAllInfo: c.get_hasReceivedAllInfo ? !!c.get_hasReceivedAllInfo() : null,
                            hasHomeBaseData: c.get_hasHomeBaseData ? !!c.get_hasHomeBaseData() : null,
                            hasMapHeader: c.get_hasMapHeader ? !!c.get_hasMapHeader() : null,
                            hasSharedConfigs: c.get_hasSharedConfigs ? !!c.get_hasSharedConfigs() : null,
                            hasBaseInfo: c.get_hasBaseInfo ? !!c.get_hasBaseInfo() : null,
                            hasVisibleEntityInfo: c.get_hasVisibleEntityInfo ? !!c.get_hasVisibleEntityInfo() : null,
                            hasDepositInfo: c.get_hasDepositInfo ? !!c.get_hasDepositInfo() : null,
                            hasSpawnedForUserInfo: c.get_hasSpawnedForUserInfo ? !!c.get_hasSpawnedForUserInfo() : null,
                            hasTuningData: c.get_hasTuningData ? !!c.get_hasTuningData() : null
                        };
                        out.worldmapControllerServices = {
                            mapService: summarizeObj(c._mapService),
                            sharedConfigMapService: summarizeObj(c._sharedConfigMapService),
                            dataStorageService: summarizeObj(c._dataStorageService),
                            wcDataStorageService: summarizeObj(c._wcDataStorageService),
                            factionsService: summarizeObj(c._factionsService),
                            notificationService: summarizeObj(c._notificationService),
                        };
                    }
                }

                out.gameState = gameInst ? {
                    hasWorldMap: !!gameInst.worldMap,
                    mapId: gameInst.map_id ?? null,
                    activeStateName: (() => {
                        try {
                            if (gameInst._activeState && gameInst._activeState.getCurrentStateName) return gameInst._activeState.getCurrentStateName();
                            if (gameInst._activeState && gameInst._activeState.get_stateName) return gameInst._activeState.get_stateName();
                        } catch (e) {}
                        return null;
                    })()
                } : null;

                return out;
            }"""
        )

        print("\\n=== AFTER CLICK ===")
        print(json.dumps(after, indent=2))

        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
