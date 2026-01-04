/**
 * PATCH GAME INIT V27
 * - V26 logic but targeting window._hx_classes.GAME
 */

(function () {
    console.log("[PATCH] V27 Script Loaded");

    // =========================================================================
    // 1. GAME.prototype.Data Interception
    // =========================================================================
    function patchGameData() {
        var GameClass = null;

        // Target: window._hx_classes["GAME"]
        if (window._hx_classes && window._hx_classes["GAME"]) {
            GameClass = window._hx_classes["GAME"];
        } else if (window.GAME) {
            GameClass = window.GAME;
        }

        if (GameClass && GameClass.prototype && GameClass.prototype.Data) {
            if (GameClass.prototype.Data.patched) return;

            var originalData = GameClass.prototype.Data;
            console.log("[PATCH] Intercepting GAME.prototype.Data (Found in " + (window._hx_classes && window._hx_classes["GAME"] ? "_hx_classes" : "window") + ")");

            GameClass.prototype.Data = function (a, b) {
                console.log("[PATCH] GAME.Data called with:", a);

                if (!a) a = {};

                function def(key, val) {
                    if (!a[key]) a[key] = val;
                }

                var localhost = "http://localhost:8088/";

                def("baseurl", localhost + "assets/");
                def("apiurl", localhost + "api/");
                def("wmbasemanurl", localhost + "api/wm/");
                def("platform_api_url", localhost + "api/platform/");
                def("env_name", "localhost");
                def("gameurl", localhost);
                def("statsurl", localhost + "stats");
                def("logurl", localhost + "logs");
                def("mapurl", localhost + "assets/map.json");
                def("siu", localhost + "siu/");
                def("abtests", "{}");
                def("softversion", "1");
                def("gameversion", "1");
                def("locale", "en_US");
                def("__", 0);
                def("___", 0);

                def("_baseURL", a.baseurl);
                def("_apiURL", a.apiurl);
                def("_gameURL", a.gameurl);

                console.warn("[PATCH] Injected defaults into GAME.Data params:", a);

                try {
                    return originalData.call(this, a, b);
                } catch (e) {
                    console.error("[PATCH] Error inside original GAME.Data:", e);
                    throw e;
                }
            };
            GameClass.prototype.Data.patched = true;
            console.log("[PATCH] GAME.prototype.Data patched successfully.");
        } else {
            // Debugging
            if (!window._hx_classes) console.log("[PATCH] window._hx_classes is undefined");
            else if (!window._hx_classes["GAME"]) console.log("[PATCH] window._hx_classes.GAME is undefined");
        }
    }

    // Attempt immediately
    patchGameData();

    // =========================================================================
    // 2. URLoaderApi Interception (Fixes 501 POST getflags)
    // =========================================================================
    // Need to find URLoaderApi too. It's likely in _hx_classes.
    // But V25 used window.URLoaderApi. Maybe that worked? Check previous logs?
    // V25 logs said "URLoaderApi intercepted". So window.URLoaderApi exists?
    // WarCommander.patched.js might assign it to window too?

    // Let's look in _hx_classes just in case.
    function patchURLoader() {
        var URLLoaderClass = window.URLoaderApi;
        if (!URLLoaderClass && window._hx_classes) {
            // Check _hx_classes for something that looks like URLoaderApi
            // Usually keys are full class paths e.g. "openfl.net.URLLoader" or just "URLoaderApi"
            // In patch V25 I blindly used window.URLoaderApi.
            if (window._hx_classes["URLoaderApi"]) URLLoaderClass = window._hx_classes["URLoaderApi"];
        }

        if (URLLoaderClass && URLLoaderClass.prototype && URLLoaderClass.prototype.load) {
            if (URLLoaderClass.prototype.load.patched) return;

            var originalLoad = URLLoaderClass.prototype.load;
            URLLoaderClass.prototype.load = function (urlRequest) {
                var url = urlRequest.url;
                console.log("[PATCH] URLoaderApi.load intercepted: " + url);

                if (url.indexOf("getflags") !== -1 || url.indexOf("undefinedwc") !== -1) {
                    console.warn("[PATCH] BLOCKED invalid/POST request: " + url);

                    var mockData = {
                        success: true,
                        flags: { example_flag: 1 }
                    };

                    var self = this;
                    setTimeout(function () {
                        console.log("[PATCH] Dispatching MOCK COMPLETE for " + url);
                        self.data = JSON.stringify(mockData);
                        var evt = { type: "complete", target: self };
                        try {
                            if (self.dispatchEvent) self.dispatchEvent(evt);
                            else if (self.onComplete) self.onComplete(evt);
                        } catch (e) { console.error("Dispatch error", e); }
                    }, 100);

                    return;
                }
                return originalLoad.call(this, urlRequest);
            };
            URLLoaderClass.prototype.load.patched = true;
            console.log("[PATCH] URLoaderApi.prototype.load has been intercepted.");
        }
    }
    patchURLoader();


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
            if (window.GAME && window.GAME._instance && window.GAME._instance.sfs) {
                window.__SFS = window.GAME._instance.sfs;
            }
            // Try _hx_classes access
            if (!window.__SFS && window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance && window._hx_classes["GAME"]._instance.sfs) {
                window.__SFS = window._hx_classes["GAME"]._instance.sfs;
            }
            return;
        }

        if (sfsState === 0) {
            triggerSmartFoxEvent("connection", { success: true });
            sfsState = 1;
        } else if (sfsState === 1) {
            triggerSmartFoxEvent("login", { success: true, user: { name: "Player", id: 123 }, data: {} });
            sfsState = 2;
        } else if (sfsState === 2) {
            triggerSmartFoxEvent("roomJoin", { room: { name: "Global", id: 1 } });
            sfsState = 3;
        }
    }, 2000);


    // =========================================================================
    // 4. MAIN PATCH LOOP
    // =========================================================================
    var patchInterval = setInterval(function () {
        patchGameData();
        patchURLoader();

        var stage = null;
        if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) {
            try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }
        }
        if (!stage && window.lime && window.lime.app && window.lime.app.Application && window.lime.app.Application.current) {
            try { stage = window.lime.app.Application.current.stage; } catch (e) { }
        }

        // GLOBAL Variable Force Fix
        if (window.GLOBAL) {
            if (!window.GLOBAL._baseURL) window.GLOBAL._baseURL = "http://localhost:8088/assets/";
            if (!window.GLOBAL._apiURL) window.GLOBAL._apiURL = "http://localhost:8088/api/";
            if (!window.GLOBAL._rootURL) window.GLOBAL._rootURL = "http://localhost:8088/";
        }

        if (!stage) return;

        function recursiveKill(obj, depth) {
            if (!obj) return;
            if (depth > 5) return;

            var count = 0;
            if (typeof obj.get_numChildren === 'function') count = obj.get_numChildren();
            else if (obj.numChildren !== undefined) count = obj.numChildren;

            for (var i = count - 1; i >= 0; i--) {
                var child = null;
                try { if (typeof obj.getChildAt === 'function') child = obj.getChildAt(i); } catch (e) { }

                if (child) {
                    var name = "";
                    try { name = child.get_name(); } catch (e) { name = child.name; }
                    var className = "";
                    try { className = child.__class__.__name__; } catch (e) { }

                    var isBad = false;
                    if (name && (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1)) isBad = true;
                    if (className && (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1)) isBad = true;
                    if (child.text && child.text.indexOf && child.text.indexOf("ESTABLISHING SATELLITE") !== -1) isBad = true;

                    if (isBad) {
                        console.log("[PATCH Nuclear] NUKING: " + name + " (" + className + ")");
                        try { child.set_visible(false); } catch (e) { child.visible = false; }
                        try { child.set_alpha(0); } catch (e) { child.alpha = 0; }
                        try { child.set_x(-20000); } catch (e) { child.x = -20000; }
                        try { if (obj.removeChild) obj.removeChild(child); } catch (e) { }
                    } else {
                        recursiveKill(child, depth + 1);
                    }
                }
            }
        }

        try { recursiveKill(stage, 0); } catch (e) { }

    }, 50);

})();
