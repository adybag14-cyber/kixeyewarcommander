/**
 * PATCH GAME INIT V48
 * - V47 Logic
 * - MOCK ZIP/XML
 * - DEBUG CLASS NAMES
 */

(function () {
    console.log("[PATCH] V48 Script Loaded");

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
        // Also check if there is a native openfl.net.URLLoader wrapped?
        // But the game seems to use URLoaderApi as a wrapper?
        // Or maybe standard openfl.net.URLLoader usage for external assets?

        // Let's look for openfl.net.URLLoader too
        var OpenFLURLLoader = window._hx_classes && window._hx_classes["openfl.net.URLLoader"];
        if (OpenFLURLLoader && OpenFLURLLoader.prototype && OpenFLURLLoader.prototype.load && !OpenFLURLLoader.prototype.load.patched) {
            console.log("[PATCH V48] Patching openfl.net.URLLoader");
            var orig = OpenFLURLLoader.prototype.load;
            OpenFLURLLoader.prototype.load = function (request) {
                var url = request ? request.url : "";
                if (url.indexOf(".zip") !== -1 || url.indexOf(".xml") !== -1) {
                    console.log("[PATCH V48] Mocking File: " + url);
                    var self = this;
                    setTimeout(function () {
                        // Mock Data
                        if (url.indexOf(".xml") !== -1) self.data = "<root></root>";
                        else self.data = ""; // ZIP? Empty string might crash, but better than 404 event?

                        // Dispatch Complete
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

        // Keep URLoaderApi patch
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
    // 6. DEBUG & LOADER (V47 Logic Updated)
    // =========================================================================
    var classLogDone = false;
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
            console.log("[PATCH V48] Patching openfl.display.Loader");
            var origLoad = Loader.prototype.load;
            Loader.prototype.load = function (request) {
                var url = "";
                if (typeof request === 'string') url = request;
                else if (request && request.url) url = request.url;

                if (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1 || url.indexOf("platoonsprites") !== -1) {
                    console.log("[PATCH V48] Mocking Asset: " + url);

                    var self = this;
                    try {
                        var Bitmap = resolveClass("openfl.display.Bitmap");
                        var BitmapData = resolveClass("openfl.display.BitmapData");
                        var Event = resolveClass("openfl.events.Event");

                        if (Bitmap && BitmapData && Event) {
                            var dummyBmd = new BitmapData(32, 32, false, 0xFFFF0000); // Red
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
    // 7. STAGE HUNTER & MAIN LOOP
    // =========================================================================
    var attempts = { worldMapSetup: 0, createView: 0 };
    var MAX_ATTEMPTS = 5;

    function findStage() {
        try { if (window.GAME && window.GAME._instance && window.GAME._instance.stage) return window.GAME._instance.stage; } catch (e) { }
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current && window.openfl.Lib.get_current().stage) return window.openfl.Lib.get_current().stage; } catch (e) { }
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.current && window.openfl.Lib.current.stage) return window.openfl.Lib.current.stage; } catch (e) { }
        if (window._hx_classes) {
            var candidates = ["com.cc.worldmap.Worldmap", "com.cc.ui.ViewManager", "GAME"];
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
        patchLoader();

        if (window._hx_classes && !classLogDone) {
            console.log("[PATCH V48] Scanning for Loaders...");
            var keys = Object.keys(window._hx_classes);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].toLowerCase().indexOf("loader") !== -1) {
                    console.log(">> LOADER CLASS: " + keys[i]);
                }
            }
            classLogDone = true;
        }

        var stage = findStage();

        if (stage) {
            // --- POPUP KILL ---
            try {
                if (stage.get_numChildren) {
                    var n = stage.get_numChildren();
                    for (var i = n - 1; i >= 0; i--) {
                        var c = stage.getChildAt(i);
                        if (c) {
                            var nm = ""; try { nm = c.get_name(); } catch (e) { }
                            var cl = ""; try { cl = c.__class__.__name__; } catch (e) { }
                            if (nm.indexOf("PleaseWait") !== -1 || cl.indexOf("PleaseWait") !== -1) {
                                c.visible = false;
                                if (stage.removeChild) stage.removeChild(c);
                            }
                        }
                    }
                }
            } catch (e) { }


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
                            // console.log("[PATCH V48] Forcing Worldmap._mapView to Stage!");
                            try { stage.addChild(Worldmap._mapView); } catch (e) { }
                        }
                    }
                }
            }
        }

    }, 200);

})();
