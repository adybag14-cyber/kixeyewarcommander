/**
 * PATCH GAME INIT V32
 * - V31 Logic (Popup Nuke + Data Patch)
 * - NEW: Try semantic methods: RemoveLoader, handlePanToBase
 * - NEW: Try instantiating Worldmap
 */

(function () {
    console.log("[PATCH] V32 Script Loaded");

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
    // 2. MAIN LOOP
    // =========================================================================
    var attempts = { RemoveLoader: 0, handlePanToBase: 0, worldMap: 0, tick: 0 };
    var MAX_ATTEMPTS = 5;

    setInterval(function () {
        patchGameData();
        patchURLoader();

        var inst = (window.GAME && window.GAME._instance) || (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance);
        var stage = null;
        if (inst && inst.stage) stage = inst.stage;
        else if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }

        // --- SEMANTIC METHODS ---
        if (inst) {
            // 1. RemoveLoader (Should kill popup logic?)
            if (attempts.RemoveLoader < MAX_ATTEMPTS && inst.RemoveLoader) {
                console.log("[PATCH V32] Calling RemoveLoader()...");
                try { inst.RemoveLoader(); console.log(">> RemoveLoader SUCCESS"); } catch (e) { console.error(">> RemoveLoader FAILED", e); }
                attempts.RemoveLoader++;
            }
            // 2. handlePanToBase (Go to base?)
            if (attempts.handlePanToBase < MAX_ATTEMPTS && inst.handlePanToBase) {
                console.log("[PATCH V32] Calling handlePanToBase()...");
                try { inst.handlePanToBase(); console.log(">> handlePanToBase SUCCESS"); } catch (e) { console.error(">> handlePanToBase FAILED", e); }
                attempts.handlePanToBase++;
            }
            // 3. startTickFast (Ensure loop is running)
            if (attempts.tick < 1 && inst.startTickFast) {
                try { inst.startTickFast(); } catch (e) { }
                attempts.tick++;
            }
        }

        // 4. Force Worldmap Creation
        if (attempts.worldMap < 1 && window._hx_classes && stage) {
            var WorldmapClass = window._hx_classes["com.cc.worldmap.Worldmap"];
            if (WorldmapClass) {
                console.warn("[PATCH V32] Creating NEW Worldmap instance...");
                try {
                    var wm = new WorldmapClass();
                    stage.addChild(wm);
                    console.log(">> Worldmap created and added to stage!");
                    attempts.worldMap++;
                } catch (e) {
                    console.error(">> Worldmap creation failed", e);
                }
            }
        }

        if (!stage) return;

        // --- POPUP REMOVAL (Proven to work) ---
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
                    if (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1) isBad = true;
                    if (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1) isBad = true;

                    if (isBad) {
                        // console.log("[PATCH V32] REMOVING POPUP: " + className);
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
