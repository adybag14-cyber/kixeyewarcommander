/**
 * PATCH GAME INIT V35
 * - V34 Logic (Ap Patch)
 * - NEW: Fix com.cc.core.MAP.Clear crash.
 * - NEW: Force Worldmap -> CreateMapView.
 */

(function () {
    console.log("[PATCH] V35 Script Loaded");

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
                def("baseurl", localhost + "assets/");
                def("apiurl", localhost + "api/");
                def("_baseURL", localhost + "assets/");
                try { return originalData.call(this, a, b); } catch (e) { throw e; }
            };
            GameClass.prototype.Data.patched = true;
        }
    }

    function patchURLoader() {
        var URLLoaderClass = window.URLoaderApi || (window._hx_classes && window._hx_classes["URLoaderApi"]);
        if (URLLoaderClass && URLLoaderClass.prototype && URLLoaderClass.prototype.load && !URLLoaderClass.prototype.load.patched) {
            var originalLoad = URLLoaderClass.prototype.load;
            URLLoaderClass.prototype.load = function (urlRequest) {
                var url = urlRequest.url;
                if (url.indexOf("wc/getflags") !== -1 || url.indexOf("undefinedwc") !== -1 || url.indexOf("loadidata") !== -1) {
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

    // =========================================================================
    // 2. TILE PROVIDER PATCH (Fix Ap.getTiles crash)
    // =========================================================================
    var tileProviderPatched = false;
    function patchTileProvider() {
        if (tileProviderPatched) return;
        if (!window._hx_classes) return;

        // Iterate all classes to find the one with getTiles and onTileDataLoaded
        for (var key in window._hx_classes) {
            var cls = window._hx_classes[key];
            if (cls && cls.prototype && cls.prototype.getTiles && cls.prototype.onTileDataLoaded) {
                console.log("[PATCH V35] Found TileProvider Class: " + key);
                var originalGetTiles = cls.prototype.getTiles;
                if (!originalGetTiles.patched) {
                    cls.prototype.getTiles = function (a) {
                        if (!this._tiles || !this._tiles.h) {
                            return { tiles: [], backgrounds: [], backgroundColors: [] };
                        }
                        try { return originalGetTiles.call(this, a); } catch (e) { return {}; }
                    };
                    cls.prototype.getTiles.patched = true;
                    tileProviderPatched = true;
                }
                break;
            }
        }
    }

    // =========================================================================
    // 3. MAP CLASS PATCH (Fix L.Clear crash)
    // =========================================================================
    var mapClassPatched = false;
    function patchMapClass() {
        if (mapClassPatched) return;
        if (!window._hx_classes) return;

        var MapClass = window._hx_classes["com.cc.core.MAP"];
        if (MapClass) {
            console.log("[PATCH V35] Found com.cc.core.MAP. Patching Clear()...");
            if (MapClass.Clear && !MapClass.Clear.patched) {
                var originalClear = MapClass.Clear;
                MapClass.Clear = function () {
                    try { originalClear(); } catch (e) { console.warn("MAP.Clear suppressed error:", e); }
                };
                MapClass.Clear.patched = true;
                mapClassPatched = true;
            }
        }
    }

    // =========================================================================
    // 4. MAIN LOOP
    // =========================================================================
    var attempts = { worldMapSetup: 0, createView: 0 };
    var MAX_ATTEMPTS = 5;

    setInterval(function () {
        patchGameData();
        patchURLoader();
        patchTileProvider();
        patchMapClass();

        var stage = null;
        if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }

        // --- POPUP REMOVAL (Run First) ---
        function getClassName(obj) {
            try { if (obj.__class__ && obj.__class__.__name__) return obj.__class__.__name__; } catch (e) { }
            try { if (obj.__name__) return obj.__name__; } catch (e) { }
            return "";
        }

        function recursiveKill(obj, depth) {
            if (!obj) return;
            if (depth > 12) return;

            var count = 0;
            if (typeof obj.get_numChildren === 'function') count = obj.get_numChildren();
            else if (obj.numChildren !== undefined) count = obj.numChildren;
            else if (obj.__children && obj.__children.length) count = obj.__children.length;

            for (var i = count - 1; i >= 0; i--) {
                var child = null;
                try { if (typeof obj.getChildAt === 'function') child = obj.getChildAt(i); } catch (e) { }
                if (!child && obj.__children) child = obj.__children[i];

                if (child) {
                    var classNameArr = getClassName(child);
                    var className = Array.isArray(classNameArr) ? classNameArr.join(".") : String(classNameArr);
                    var name = "";
                    try { name = child.get_name(); } catch (e) { name = child.name; }

                    var isBad = false;
                    if (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1 || name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1) isBad = true;

                    if (isBad) {
                        try { child.set_visible(false); } catch (e) { child.visible = false; }
                        try { if (obj.removeChild) obj.removeChild(child); } catch (e) { }
                        if (obj.__children) {
                            var idx = obj.__children.indexOf(child);
                            if (idx !== -1) obj.__children.splice(idx, 1);
                        }
                    } else {
                        recursiveKill(child, depth + 1);
                    }
                }
            }
        }
        try { recursiveKill(stage, 0); } catch (e) { }

        // --- WORLDMAP FORCE ---
        if (window._hx_classes && attempts.createView < MAX_ATTEMPTS) {
            var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];

            if (Worldmap) {
                // Initialize if needed
                if (!Worldmap._hexMap && attempts.worldMapSetup < 1) {
                    console.log("[PATCH V35] Calling Worldmap.Setup()...");
                    try { Worldmap.Setup(); console.log(">> Setup SUCCESS"); } catch (e) { console.error(">> Setup FAILED", e); }
                    attempts.worldMapSetup++;
                }

                // Create View
                if (Worldmap._hexMap && Worldmap._controller && !Worldmap._mapView) {
                    console.log("[PATCH V35] Calling Worldmap.CreateMapView()...");
                    try {
                        Worldmap.CreateMapView();
                        console.log(">> CreateMapView SUCCESS");
                        attempts.createView++;
                    } catch (e) {
                        console.error(">> CreateMapView FAILED", e);
                    }
                }
            }
        }

    }, 200);

})();
