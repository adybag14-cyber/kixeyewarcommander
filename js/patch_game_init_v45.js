/**
 * PATCH GAME INIT V45
 * - V44 Logic
 * - ASSET LOADER MOCK (ImageCache)
 */

(function () {
    console.log("[PATCH] V45 Script Loaded");

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
                if (url.indexOf("wc/getflags") !== -1 || url.indexOf("undefinedwc") !== -1 || url.indexOf("loadidata") !== -1 || url.indexOf("assets/json/") !== -1) {
                    if (url.indexOf("wc/getflags") !== -1) {
                        var mockData = { success: true, flags: { example_flag: 1 }, data: {} };
                        var self = this;
                        setTimeout(function () {
                            self.data = JSON.stringify(mockData);
                            var evt = { type: "complete", target: self };
                            try { if (self.dispatchEvent) self.dispatchEvent(evt); else if (self.onComplete) self.onComplete(evt); } catch (e) { }
                        }, 50);
                        return;
                    }
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
    // 2. DEPENDENCY PATCHES
    // =========================================================================
    var tileProviderPatched = false;
    function patchDependencies() {
        if (!window._hx_classes) return;
        if (!tileProviderPatched) {
            for (var key in window._hx_classes) {
                var cls = window._hx_classes[key];
                if (cls && cls.prototype && cls.prototype.getTiles && cls.prototype.onTileDataLoaded) {
                    if (!cls.prototype.getTiles.patched) {
                        var originalGetTiles = cls.prototype.getTiles;
                        cls.prototype.getTiles = function (a) {
                            if (!this._tiles || !this._tiles.h) return { tiles: [], backgrounds: [], backgroundColors: [] };
                            try { return originalGetTiles.call(this, a); } catch (e) { return { tiles: [], backgrounds: [], backgroundColors: [] }; }
                        };
                        cls.prototype.getTiles.patched = true;
                        tileProviderPatched = true;
                    }
                    break;
                }
            }
        }
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

    var managersPatched = false;
    function patchManagers() {
        if (managersPatched) return;
        if (!window._hx_classes) return;
        var targets = ["com.cc.blackops.worldmap.BlackOpsWorldmapManager", "com.cc.sectorgoal.SectorGoalManager", "com.cc.ui.worldmap.vxp.VXPBaseIconManager"];
        var dummySignal = { add: function () { }, dispatch: function () { }, remove: function () { } };
        var dummyInstance = { get_signalChange: function () { return dummySignal; }, get_membersUpdated: function () { return dummySignal; }, get_alliancesUpdated: function () { return dummySignal; } };
        for (var i = 0; i < targets.length; i++) {
            var cls = window._hx_classes[targets[i]];
            if (cls) {
                if (cls.get_instance) {
                    if (!cls.get_instance.patched) {
                        var originalInst = cls.get_instance;
                        cls.get_instance = function () { try { var res = originalInst.call(this); return res || dummyInstance; } catch (e) { return dummyInstance; } };
                        cls.get_instance.patched = true;
                    }
                } else { cls.get_instance = function () { return dummyInstance; }; }
            }
        }
        managersPatched = true;
    }

    var popupsPatched = false;
    function patchPopups() {
        if (!window._hx_classes) return;
        if (popupsPatched) return;
        var targets = ["PLEASEWAIT", "POPUPS", "com.cc.popups.PopupSystem", "com.cc.popups.PopupGeneric"];
        for (var i = 0; i < targets.length; i++) {
            var cls = window._hx_classes[targets[i]];
            if (cls && cls.Show && !cls.Show.patched) {
                var origShow = cls.Show;
                cls.Show = function () {
                    var msg = arguments[0];
                    if (typeof msg === 'string' && (msg.indexOf("Connecting") !== -1 || msg.indexOf("Please wait") !== -1 || msg.indexOf("Satellite") !== -1)) {
                        return; // SUPPRESS
                    }
                    return origShow.apply(this, arguments);
                };
                cls.Show.patched = true;
            }
        }
        popupsPatched = true;
    }

    // =========================================================================
    // 5. ASSET LOADER MOCK (ImageCache)
    // =========================================================================
    var imageCachePatched = false;
    function patchImageCache() {
        if (imageCachePatched) return;
        if (!window._hx_classes) return;

        // Hunt for ImageCache
        var cacheClass = null;
        var keys = Object.keys(window._hx_classes);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].indexOf("ImageCache") !== -1) {
                console.log("[PATCH V45] Found ImageCache class: " + keys[i]);
                cacheClass = window._hx_classes[keys[i]];
                break;
            }
        }

        if (cacheClass) {
            // Check for load methods: load, GetImage, etc.
            // Assumption: It has a 'load' method or similar used by Game.
            // Based on logs "ImageCache IOError", maybe "load" triggers internal loading.

            // Try patching 'load'
            if (cacheClass.prototype && cacheClass.prototype.load) {
                // Mock the instance load
                var origLoad = cacheClass.prototype.load;
                cacheClass.prototype.load = function (url, id, onError, onSuccess) {
                    console.log("[PATCH V45] Intercepted Image Load: " + url);
                    // Check if URL is local asset
                    if (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1) {
                        // FAIL SILENTLY? NO, return Success with Dummy!
                        // But onSuccess expects BitmapData?
                        // We need to create a dummy BitmapData.
                        // Requires 'openfl.display.BitmapData'.
                        try {
                            if (window.openfl && window.openfl.display && window.openfl.display.BitmapData) {
                                var bmd = new window.openfl.display.BitmapData(32, 32, true, 0xFFFF0000); // Red Dummy

                                if (typeof onSuccess === 'function') {
                                    setTimeout(function () { onSuccess(bmd); }, 10);
                                    return; // BYPASS
                                }

                                // If args are different (url, callback?)
                                // We'll rely on inspecting arguments dynamically if needed.
                            }
                        } catch (e) { }
                    }
                    return origLoad.apply(this, arguments);
                };
                console.log("[PATCH V45] Patched ImageCache.prototype.load");
            }
            // Also check Static methods if singleton

            imageCachePatched = true;
        }
    }


    // =========================================================================
    // 6. STAGE HUNTER & MAIN LOOP
    // =========================================================================
    var attempts = { worldMapSetup: 0, createView: 0 };
    var MAX_ATTEMPTS = 5;

    function findStage() {
        try { if (window.GAME && window.GAME._instance && window.GAME._instance.stage) return window.GAME._instance.stage; } catch (e) { }
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current && window.openfl.Lib.get_current().stage) return window.openfl.Lib.get_current().stage; } catch (e) { }
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.current && window.openfl.Lib.current.stage) return window.openfl.Lib.current.stage; } catch (e) { }
        var candidates = ["com.cc.worldmap.Worldmap", "com.cc.ui.ViewManager", "GAME"];
        if (window._hx_classes) {
            for (var i = 0; i < candidates.length; i++) {
                var cls = window._hx_classes[candidates[i]];
                if (cls && cls._instance && cls._instance.stage) return cls._instance.stage;
                if (cls && cls._mapView && cls._mapView.stage) return cls._mapView.stage;
            }
        }
        return null;
    }

    setInterval(function () {
        patchGameData();
        patchURLoader();
        patchDependencies();
        patchManagers();
        patchPopups();
        patchImageCache(); // New

        var stage = findStage();

        if (stage) {
            // --- POPUP REMOVAL ---
            function getClassName(obj) { try { if (obj.__class__ && obj.__class__.__name__) return obj.__class__.__name__; } catch (e) { } try { if (obj.__name__) return obj.__name__; } catch (e) { } return ""; }
            function recursiveKill(obj, depth) {
                if (!obj || depth > 12) return;
                var count = 0;
                if (typeof obj.get_numChildren === 'function') count = obj.get_numChildren();
                else if (obj.numChildren !== undefined) count = obj.numChildren;
                else if (obj.__children) count = obj.__children.length;
                for (var i = count - 1; i >= 0; i--) {
                    var child = null;
                    try { if (typeof obj.getChildAt === 'function') child = obj.getChildAt(i); } catch (e) { }
                    if (!child && obj.__children) child = obj.__children[i];
                    if (child) {
                        var classNameArr = getClassName(child);
                        var className = Array.isArray(classNameArr) ? classNameArr.join(".") : String(classNameArr);
                        var name = ""; try { name = child.get_name(); } catch (e) { name = child.name; }
                        var isBad = false;
                        if (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1 || name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1) isBad = true;
                        if (isBad) {
                            try { child.set_visible(false); } catch (e) { child.visible = false; }
                            try { if (obj.removeChild) obj.removeChild(child); } catch (e) { }
                            if (obj.__children) { var idx = obj.__children.indexOf(child); if (idx !== -1) obj.__children.splice(idx, 1); }
                        } else { recursiveKill(child, depth + 1); }
                    }
                }
            }
            try { recursiveKill(stage, 0); } catch (e) { }

            // --- WORLDMAP FORCE ---
            if (window._hx_classes && attempts.createView < MAX_ATTEMPTS) {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];

                if (Worldmap) {
                    if (!Worldmap.reconnect.patched) { Worldmap.reconnect = function () { }; Worldmap.reconnect.patched = true; }
                    if (!Worldmap._hexMap && attempts.worldMapSetup < 1) {
                        try { Worldmap.Setup(); console.log(">> Setup SUCCESS"); } catch (e) { }
                        attempts.worldMapSetup++;
                    }
                    if (Worldmap._hexMap && Worldmap._controller && !Worldmap._mapView) {
                        try { Worldmap.CreateMapView(); console.log(">> CreateMapView SUCCESS"); attempts.createView++; } catch (e) { }
                    }

                    // FORCE ADD TO STAGE
                    if (Worldmap._mapView && stage) {
                        if (Worldmap._mapView.parent !== stage) {
                            console.log("[PATCH V45] Forcing Worldmap._mapView to Stage!");
                            try { stage.addChild(Worldmap._mapView); } catch (e) { console.error(">> Force Add Failed", e); }
                        }
                    }
                }
            }
        }

    }, 200);

})();
