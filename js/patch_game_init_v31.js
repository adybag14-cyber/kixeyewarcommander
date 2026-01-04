/**
 * PATCH GAME INIT V31
 * - V30 Logic (Popup Nuke + Data Patch)
 * - NEW: Aggressive Method Brute-Force (setupStage, initLocal, onDataFinishedLoading)
 * - NEW: WorldMapController Inspection/Invocation
 */

(function () {
    console.log("[PATCH] V31 Script Loaded");

    // =========================================================================
    // 1. GAME.prototype.Data / URLoaderApi / SmartFox (Standard Suite)
    // -------------------------------------------------------------------------
    // These patches overwrite core game engine functions at runtime.
    // By hooking into the GAME class and URLoaderApi, we can redirect
    // asset requests to localhost and provide mock JSON responses for
    // flags and player data, bypassing the original servers.
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
    // 2. MAIN LOOP: NUKE & METHOD FORCE
    // -------------------------------------------------------------------------
    // This loop runs every 200ms to ensure the game stays in a "clean" state.
    // It aggressively calls initialization methods if the game gets stuck
    // and scans the display list to delete security/connection popups.
    // =========================================================================
    var attempts = { setupStage: 0, initLocal: 0, onDataFinishedLoading: 0, worldMap: 0 };
    var MAX_ATTEMPTS = 5;

    setInterval(function () {
        patchGameData();
        patchURLoader();

        var inst = (window.GAME && window.GAME._instance) || (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance);
        var stage = null;
        if (inst && inst.stage) stage = inst.stage;
        else if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }

        // --- METHOD BRUTE FORCE ---
        if (inst) {
            // 1. setupStage
            if (attempts.setupStage < MAX_ATTEMPTS && inst.setupStage) {
                console.log("[PATCH V31] Calling setupStage()...");
                try { inst.setupStage(); console.log(">> setupStage SUCCESS"); } catch (e) { console.error(">> setupStage FAILED", e); }
                attempts.setupStage++;
            }
            // 2. initLocal
            if (attempts.initLocal < MAX_ATTEMPTS && inst.initLocal) {
                console.log("[PATCH V31] Calling initLocal()...");
                try { inst.initLocal(); console.log(">> initLocal SUCCESS"); } catch (e) { console.error(">> initLocal FAILED", e); }
                attempts.initLocal++;
            }
            // 3. onDataFinishedLoading
            if (attempts.onDataFinishedLoading < MAX_ATTEMPTS && inst.onDataFinishedLoading) {
                console.log("[PATCH V31] Calling onDataFinishedLoading()...");
                try { inst.onDataFinishedLoading(); console.log(">> onDataFinishedLoading SUCCESS"); } catch (e) { console.error(">> onDataFinishedLoading FAILED", e); }
                attempts.onDataFinishedLoading++;
            }
        }

        // 4. WorldmapController
        if (attempts.worldMap < MAX_ATTEMPTS && window._hx_classes) {
            var WMC = window._hx_classes["com.cc.worldmap.WorldmapController"];
            if (WMC) {
                console.log("[PATCH V31] Found WorldmapController class");
                // Check for instance or static methods
                if (WMC._instance) {
                    console.log("[PATCH V31] WorldmapController._instance found");
                    // Try init? show?
                }
                if (WMC.getInstance) {
                    try {
                        var wmInst = WMC.getInstance();
                        console.log("[PATCH V31] Got WorldmapController instance", wmInst);
                        if (wmInst.init) wmInst.init();
                        if (wmInst.show) wmInst.show();
                    } catch (e) { }
                }
                attempts.worldMap++;
            }
        }

        if (!stage) return;

        // --- POPUP REMOVAL ---
        function getClassName(obj) {
            try { if (obj.__class__ && obj.__class__.__name__) return obj.__class__.__name__; } catch (e) { }
            try { if (obj.__name__) return obj.__name__; } catch (e) { }
            return "";
        }

        /**
         * RECURSIVE DISPLAY-LIST SCANNER
         * Traverses the entire Haxe/OpenFL display tree to find and destroy
         * specific popup classes. This is the 'brute force' way to get past
         * "Connection Lost" or "Please Wait" screens that won't go away.
         */
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
                    if (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1) isBad = true;
                    if (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1) isBad = true;

                    if (isBad) {
                        // console.log("[PATCH V31] REMOVING POPUP: " + className);
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

    }, 200);

})();
