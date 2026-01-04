/**
 * PATCH GAME INIT V50
 * - V48 Logic
 * - NUCLEAR STAGE CLEAR
 * - FORCE MAP VIEW ONLY
 */

(function () {
    console.log("[PATCH] V50 Script Loaded");

    // =========================================================================
    // 1. STANDARD PATCHES
    // =========================================================================
    function patchGameData() {
        var GameClass = window._hx_classes && window._hx_classes["GAME"] ? window._hx_classes["GAME"] : window.GAME;
        if (GameClass && GameClass.prototype && GameClass.prototype.Data && !GameClass.prototype.Data.patched) {
            var originalData = GameClass.prototype.Data;
            GameClass.prototype.Data = function (a, b) {
                if (!a) a = {};
                function def(key, val) { if (!a[key]) a[key] = val; }
                var localhost = "http://localhost:8088/";
                try { return originalData.call(this, a, b); } catch (e) { throw e; }
            };
            GameClass.prototype.Data.patched = true;
        }
    }

    function patchURLoader() {
        var URLLoaderClass = window.URLoaderApi || (window._hx_classes && window._hx_classes["URLoaderApi"]);
        var OpenFLURLLoader = window._hx_classes && window._hx_classes["openfl.net.URLLoader"];
        if (OpenFLURLLoader && OpenFLURLLoader.prototype && OpenFLURLLoader.prototype.load && !OpenFLURLLoader.prototype.load.patched) {
            console.log("[PATCH V50] Patching openfl.net.URLLoader");
            var orig = OpenFLURLLoader.prototype.load;
            OpenFLURLLoader.prototype.load = function (request) {
                var url = request ? request.url : "";
                if (url.indexOf(".zip") !== -1 || url.indexOf(".xml") !== -1 || url.indexOf("json") !== -1) {
                    var self = this;
                    setTimeout(function () {
                        if (url.indexOf(".xml") !== -1) self.data = "<root></root>";
                        else if (url.indexOf(".json") !== -1) self.data = "{}";
                        else self.data = "";
                        var Event = window._hx_classes && window._hx_classes["openfl.events.Event"];
                        if (Event && self.dispatchEvent) {
                            try { self.dispatchEvent(new Event("complete")); } catch (e) { }
                        }
                    }, 10);
                    return;
                }
                return orig.call(this, request);
            };
            OpenFLURLLoader.prototype.load.patched = true;
        }
        if (URLLoaderClass && URLLoaderClass.prototype && URLLoaderClass.prototype.load && !URLLoaderClass.prototype.load.patched) {
            var originalLoad = URLLoaderClass.prototype.load;
            URLLoaderClass.prototype.load = function (urlRequest) {
                var url = urlRequest.url;
                if (url.indexOf("wc/getflags") !== -1 || url.indexOf("undefinedwc") !== -1 || url.indexOf("loadidata") !== -1 || url.indexOf("assets/json/") !== -1) {
                    var mockData = { success: true, flags: { example_flag: 1 }, data: {} };
                    var self = this;
                    setTimeout(function () {
                        self.data = JSON.stringify(mockData);
                        var evt = { type: "complete", target: self };
                        try { if (self.dispatchEvent) self.dispatchEvent(evt); else if (self.onComplete) self.onComplete(evt); } catch (e) { }
                    }, 50);
                    return;
                }
                return originalLoad.call(this, urlRequest);
            };
            URLLoaderClass.prototype.load.patched = true;
        }
    }

    function triggerSmartFoxEvent(eventType, params) {
        if (!window.__SFS) return;
        var evt = { type: eventType, params: params || {} };
        if (window.__SFS.dispatchEvent) window.__SFS.dispatchEvent(evt);
    }
    var sfsState = 0;
    setInterval(function () {
        if (!window.__SFS) {
            if (window.GAME && window.GAME._instance && window.GAME._instance.sfs) window.__SFS = window.GAME._instance.sfs;
            if (!window.__SFS && window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) window.__SFS = window._hx_classes["GAME"]._instance.sfs;
            return;
        }
        if (sfsState === 0) { triggerSmartFoxEvent("connection", { success: true }); sfsState = 1; }
        else if (sfsState === 1) { triggerSmartFoxEvent("login", { success: true, user: { name: "Player", id: 123 }, data: {} }); sfsState = 2; }
    }, 2000);

    function patchManagers() {
        if (!window._hx_classes) return;
        var targets = ["com.cc.blackops.worldmap.BlackOpsWorldmapManager", "com.cc.sectorgoal.SectorGoalManager", "com.cc.ui.worldmap.vxp.VXPBaseIconManager"];
        var dummySignal = { add: function () { }, dispatch: function () { }, remove: function () { } };
        var dummyInstance = { get_signalChange: function () { return dummySignal; }, get_membersUpdated: function () { return dummySignal; }, get_alliancesUpdated: function () { return dummySignal; } };
        for (var i = 0; i < targets.length; i++) {
            var cls = window._hx_classes[targets[i]];
            if (cls && cls.get_instance && !cls.get_instance.patched) {
                var originalInst = cls.get_instance;
                cls.get_instance = function () { try { var res = originalInst.call(this); return res || dummyInstance; } catch (e) { return dummyInstance; } };
                cls.get_instance.patched = true;
            } else if (cls && !cls.get_instance) { cls.get_instance = function () { return dummyInstance; }; }
        }
    }

    function patchDependencies() {
        if (!window._hx_classes) return;
        var MapClass = window._hx_classes["com.cc.core.MAP"];
        if (MapClass) {
            function safePatch(methodName) {
                if (MapClass[methodName] && !MapClass[methodName].patched) {
                    var orig = MapClass[methodName];
                    MapClass[methodName] = function () { try { return orig.apply(this, arguments); } catch (e) { } };
                    MapClass[methodName].patched = true;
                }
            }
            safePatch("Clear"); safePatch("Reset"); safePatch("ResetEffects"); safePatch("clearOutsideBaseFog"); safePatch("clearBaseEdges");
        }
    }

    // =========================================================================
    // 6. LOADER (V48 Logic)
    // =========================================================================
    var loaderPatched = false;
    function resolveClass(name) {
        if (window._hx_classes && window._hx_classes[name]) return window._hx_classes[name];
        if (window.openfl) {
            var parts = name.split('.');
            var curr = window;
            for (var i = 0; i < parts.length; i++) { curr = curr[parts[i]]; if (!curr) return null; }
            return curr;
        }
        return null;
    }

    function patchLoader() {
        if (loaderPatched) return;
        var Loader = resolveClass("openfl.display.Loader");

        if (Loader && Loader.prototype && Loader.prototype.load && !Loader.prototype.load.patched) {
            console.log("[PATCH V50] Patching openfl.display.Loader");
            var origLoad = Loader.prototype.load;
            Loader.prototype.load = function (request) {
                var url = "";
                if (typeof request === 'string') url = request;
                else if (request && request.url) url = request.url;

                if (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1 || url.indexOf("platoonsprites") !== -1) {
                    var self = this;
                    try {
                        var Bitmap = resolveClass("openfl.display.Bitmap");
                        var BitmapData = resolveClass("openfl.display.BitmapData");
                        var Event = resolveClass("openfl.events.Event");

                        if (Bitmap && BitmapData && Event) {
                            var dummyBmd = new BitmapData(64, 64, false, 0xFF00FF00); // 64x64 GREEN
                            var dummyBitmap = new Bitmap(dummyBmd);

                            // Set content
                            if (self.contentLoaderInfo) {
                                try { self.contentLoaderInfo.content = dummyBitmap; } catch (e) { }
                                try { if (self.contentLoaderInfo._content === undefined) self.contentLoaderInfo._content = dummyBitmap; } catch (e) { }

                                setTimeout(function () {
                                    if (self.contentLoaderInfo.dispatchEvent) {
                                        try { self.contentLoaderInfo.dispatchEvent(new Event("complete")); } catch (e) { }
                                    }
                                }, 10);
                                return;
                            }
                        }
                    } catch (e) { console.error("Mock failed", e); }
                }
                return origLoad.apply(this, arguments);
            };
            Loader.prototype.load.patched = true;
            loaderPatched = true;
        }
    }


    // =========================================================================
    // 7. NUCLEAR STAGE MANAGEMENT
    // =========================================================================
    var attempts = { worldMapSetup: 0, createView: 0 };
    var MAX_ATTEMPTS = 5;
    var nukeCount = 0;

    function findStage() {
        try { if (window.GAME && window.GAME._instance && window.GAME._instance.stage) return window.GAME._instance.stage; } catch (e) { }
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current && window.openfl.Lib.get_current().stage) return window.openfl.Lib.get_current().stage; } catch (e) { }
        return null;
    }

    setInterval(function () {
        patchGameData();
        patchURLoader();
        patchDependencies();
        patchManagers();
        patchLoader();

        var stage = findStage();

        if (stage && nukeCount < 50) { // Keep nuking for a while to ensure persistence
            // FORCE REMOVE ALL except MAP
            var num = 0; try { num = stage.get_numChildren(); } catch (e) { num = stage.numChildren; }

            // Check if MAP is ready
            var mapReady = false;
            if (window._hx_classes) {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                if (Worldmap && Worldmap._mapView) {
                    // Ensure Worldmap Init
                    if (!Worldmap._hexMap && attempts.worldMapSetup < 1) { try { Worldmap.Setup(); attempts.worldMapSetup++; } catch (e) { } }
                    if (Worldmap._hexMap && !Worldmap._mapView && attempts.createView < 1) { try { Worldmap.CreateMapView(); attempts.createView++; } catch (e) { } }

                    // If we have map view, clear stage and add it
                    if (Worldmap._mapView) {
                        // Nuke loop
                        var safeGuard = 0;
                        while (num > 0 && safeGuard < 100) {
                            var c = stage.getChildAt(0);
                            if (c === Worldmap._mapView) {
                                // Already Map, good. Do we have others?
                                if (num > 1) {
                                    // Remove index 1?
                                    stage.removeChildAt(1);
                                } else {
                                    break; // Only map remains
                                }
                            } else {
                                stage.removeChildAt(0);
                            }
                            try { num = stage.get_numChildren(); } catch (e) { num = stage.numChildren; }
                            safeGuard++;
                        }

                        // Add Map if missing
                        if (Worldmap._mapView.parent !== stage) {
                            console.log(">> ADDING MAP TO STAGE");
                            stage.addChild(Worldmap._mapView);
                        }

                        // Ensure Visible
                        try { Worldmap._mapView.visible = true; Worldmap._mapView.alpha = 1; } catch (e) { }
                        mapReady = true;
                    }
                }
            }
            if (mapReady) nukeCount++;
        }

    }, 200);

})();
