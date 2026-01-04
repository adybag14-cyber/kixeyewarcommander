/**
 * PATCH GAME INIT V29
 * - V28 logic (Deep Log, etc.)
 * - NEW: "Neutron Star" Instance Lobotomy for PopupPleaseWait.
 * - NEW: Force call to GAME._instance.onDataFinishedLoading().
 */

(function () {
    console.log("[PATCH] V29 Script Loaded");

    // =========================================================================
    // 1. GAME.prototype.Data Interception
    // =========================================================================
    function patchGameData() {
        var GameClass = null;
        if (window._hx_classes && window._hx_classes["GAME"]) GameClass = window._hx_classes["GAME"];
        else if (window.GAME) GameClass = window.GAME;

        if (GameClass && GameClass.prototype && GameClass.prototype.Data) {
            if (GameClass.prototype.Data.patched) return;
            var originalData = GameClass.prototype.Data;
            GameClass.prototype.Data = function (a, b) {
                if (!a) a = {};
                function def(key, val) { if (!a[key]) a[key] = val; }
                var localhost = "http://localhost:8089/";
                def("baseurl", localhost + "assets/");
                def("apiurl", localhost + "api/");
                def("wmbasemanurl", localhost + "api/wm/");
                def("platform_api_url", localhost + "api/platform/");
                def("gameurl", localhost);
                def("mk", "1");
                def("sid", "1");
                def("_baseURL", localhost + "assets/");
                def("_apiURL", localhost + "api/");
                def("_gameURL", localhost);
                try { return originalData.call(this, a, b); } catch (e) { throw e; }
            };
            GameClass.prototype.Data.patched = true;
        }
    }

    // =========================================================================
    // 2. URLoaderApi Interception
    // =========================================================================
    function patchURLoader() {
        var URLLoaderClass = window.URLoaderApi || (window._hx_classes && window._hx_classes["URLoaderApi"]);
        if (URLLoaderClass && URLLoaderClass.prototype && URLLoaderClass.prototype.load) {
            if (URLLoaderClass.prototype.load.patched) return;
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

    // =========================================================================
    // 3. SmartFox Interception
    // =========================================================================
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
        else if (sfsState === 2) { triggerSmartFoxEvent("roomJoin", { room: { name: "Global", id: 1 } }); sfsState = 3; }
    }, 2000);

    // =========================================================================
    // 4. MAIN PATCH LOOP & NUKE
    // =========================================================================
    var forcedFinish = false;

    setInterval(function () {
        patchGameData();
        patchURLoader();

        var stage = null;
        if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }
        if (!stage && window.lime && window.lime.app && window.lime.app.Application && window.lime.app.Application.current) try { stage = window.lime.app.Application.current.stage; } catch (e) { }

        // --- FORCE FINISH LOADING ---
        if (!forcedFinish) {
            var g = window.GAME || (window._hx_classes && window._hx_classes["GAME"]);
            var inst = g && g._instance;
            if (inst && inst.onDataFinishedLoading) {
                console.warn("[PATCH V29] FORCING GAME._instance.onDataFinishedLoading() !!!");
                try {
                    inst.onDataFinishedLoading();
                    forcedFinish = true;
                } catch (e) {
                    console.error("[PATCH V29] Force finish failed:", e);
                }
            }
        }

        if (!stage) return;

        // --- HELPER TO IDENTIFY CLASS ARRAY ---
        function getClassName(obj) {
            try {
                if (obj.__class__ && obj.__class__.__name__) return obj.__class__.__name__; // Array
            } catch (e) { }
            try {
                if (obj.__name__) return obj.__name__;
            } catch (e) { }
            return "";
        }

        // --- NEUTRON STAR NUKE ---
        function recursiveKill(obj, depth) {
            if (!obj) return;
            if (depth > 12) return;

            var count = 0;
            if (typeof obj.get_numChildren === 'function') count = obj.get_numChildren();
            else if (obj.numChildren !== undefined) count = obj.numChildren;

            for (var i = count - 1; i >= 0; i--) {
                var child = null;
                try { if (typeof obj.getChildAt === 'function') child = obj.getChildAt(i); } catch (e) { }

                if (child) {
                    var classNameArr = getClassName(child);
                    var className = Array.isArray(classNameArr) ? classNameArr.join(".") : String(classNameArr);
                    var name = "";
                    try { name = child.get_name(); } catch (e) { name = child.name; }

                    var isBad = false;
                    if (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1) isBad = true;
                    if (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1) isBad = true;

                    if (isBad) {
                        console.log("[PATCH V29] FOUND BAD POPUP: " + className + " / " + name);

                        // INSTANCE LOBOTOMY
                        // Replace render methods with empty
                        child.__renderGL = function () { };
                        child.__renderCanvas = function () { };
                        child.__renderDOM = function () { };
                        child.render = function () { };

                        // Override setters to prevent reappearance
                        try {
                            Object.defineProperty(child, "visible", { get: function () { return false; }, set: function (v) { } });
                            Object.defineProperty(child, "alpha", { get: function () { return 0; }, set: function (v) { } });
                            Object.defineProperty(child, "x", { get: function () { return -99999; }, set: function (v) { } });
                        } catch (e) {
                            // If property is not configurable, try method override
                            child.set_visible = function () { };
                            child.set_alpha = function () { };
                            child.set_x = function () { };
                        }

                        // Force current state
                        try { child.set_visible(false); } catch (e) { child.visible = false; }
                        try { if (obj.removeChild) obj.removeChild(child); } catch (e) { }

                        console.log("[PATCH V29] POPUP LOBOTOMIZED!");
                    } else {
                        recursiveKill(child, depth + 1);
                    }
                }
            }
        }

        try { recursiveKill(stage, 0); } catch (e) { }

    }, 200);

})();
