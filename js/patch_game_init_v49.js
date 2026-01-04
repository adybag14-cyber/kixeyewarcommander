/**
 * PATCH GAME INIT V49
 * - V48 Logic
 * - DIAGNOSTICS: DOM & DISPLAY LIST
 */

(function () {
    console.log("[PATCH] V49 Script Loaded");

    // =========================================================================
    // 1. STANDARD PATCHES (Compact)
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
            console.log("[PATCH V48] Patching openfl.net.URLLoader");
            var orig = OpenFLURLLoader.prototype.load;
            OpenFLURLLoader.prototype.load = function (request) {
                var url = request ? request.url : "";
                if (url.indexOf(".zip") !== -1 || url.indexOf(".xml") !== -1 || url.indexOf("json") !== -1) {
                    // console.log("[PATCH V48] Mocking File: " + url);
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
    // 6. DEBUG & LOADER (V47/48 Logic)
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
    // 7. DIAGNOSTICS & MAIN LOOP
    // =========================================================================
    var attempts = { worldMapSetup: 0, createView: 0 };
    var MAX_ATTEMPTS = 5;
    var diagTimer = 0;

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

        // Monitor Canvas
        if (diagTimer % 10 == 0) {
            var canvas = document.getElementsByTagName('canvas');
            if (canvas.length > 0) {
                console.log("[DIAG] CANVAS FOUND: " + canvas.length + " Size: " + canvas[0].width + "x" + canvas[0].height);
                // Ensure Visible
                if (canvas[0].style.display === 'none') {
                    console.log("[DIAG] Unhiding Canvas!");
                    canvas[0].style.display = 'block';
                    canvas[0].style.zIndex = 9999;
                }
            } else {
                console.warn("[DIAG] NO CANVAS ELEMENT FOUND!");
            }
        }
        diagTimer++;

        var stage = findStage();

        if (stage) {
            // Force Worldmap
            if (window._hx_classes && attempts.createView < MAX_ATTEMPTS) {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                if (Worldmap) {
                    if (!Worldmap.reconnect.patched) { Worldmap.reconnect = function () { }; Worldmap.reconnect.patched = true; }
                    if (!Worldmap._hexMap && attempts.worldMapSetup < 1) {
                        try { Worldmap.Setup(); console.log(">> Setup SUCCESS"); attempts.worldMapSetup++; } catch (e) { }
                    }
                    if (Worldmap._hexMap && Worldmap._controller && !Worldmap._mapView && attempts.createView < 1) {
                        try { Worldmap.CreateMapView(); console.log(">> CreateMapView SUCCESS"); attempts.createView++; } catch (e) { }
                    }
                    if (Worldmap._mapView && stage && Worldmap._mapView.parent !== stage) {
                        try { stage.addChild(Worldmap._mapView); } catch (e) { }
                    }
                }
            }

            // --- DISPLAY LIST DUMP ---
            if (diagTimer % 25 == 0) {
                console.log("=== DISPLAY LIST DUMP ===");
                function dump(obj, depth) {
                    if (!obj || depth > 5) return;
                    var name = ""; try { name = obj.get_name(); } catch (e) { name = obj.name; }
                    var cls = ""; try { cls = obj.__class__.__name__; } catch (e) { }
                    var vis = "vis:?"; try { vis = obj.get_visible(); } catch (e) { vis = obj.visible; }
                    var a = "alp:?"; try { a = obj.get_alpha(); } catch (e) { a = obj.alpha; }
                    var nCh = 0; try { nCh = obj.get_numChildren(); } catch (e) { nCh = obj.numChildren; }

                    var indent = ""; for (var k = 0; k < depth; k++) indent += "  ";
                    console.log(indent + "[" + depth + "] " + name + " (" + cls + ") V:" + vis + " A:" + a + " Ch:" + nCh);

                    // Force Visible?
                    // if (vis === false) { obj.set_visible(true); }

                    for (var i = 0; i < nCh; i++) {
                        var child = null;
                        try { child = obj.getChildAt(i); } catch (e) { }
                        if (child) dump(child, depth + 1);
                    }
                }
                dump(stage, 0);
            }
        }

    }, 200);

})();
