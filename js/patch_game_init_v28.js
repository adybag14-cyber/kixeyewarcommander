/**
 * PATCH GAME INIT V28
 * - V27 logic (GAME.Data Intercept, SmartFox Mock, etc.)
 * - NEW: Deep Hierarchy Logging (Depth 0-10) to find persistent popup.
 * - NEW: Runtime Method Discovery on GAME object.
 * - NEW: Attempt to force World Map transition.
 */

(function () {
    console.log("[PATCH] V28 Script Loaded");

    // =========================================================================
    // 1. GAME.prototype.Data Interception
    // =========================================================================
    function patchGameData() {
        var GameClass = null;
        if (window._hx_classes && window._hx_classes["GAME"]) {
            GameClass = window._hx_classes["GAME"];
        } else if (window.GAME) {
            GameClass = window.GAME;
        }

        if (GameClass && GameClass.prototype && GameClass.prototype.Data) {
            if (GameClass.prototype.Data.patched) return;
            var originalData = GameClass.prototype.Data;
            GameClass.prototype.Data = function (a, b) {
                if (!a) a = {};
                function def(key, val) { if (!a[key]) a[key] = val; }
                var localhost = "http://localhost:8088/";
                def("baseurl", localhost + "assets/");
                def("apiurl", localhost + "api/");
                def("wmbasemanurl", localhost + "api/wm/");
                def("platform_api_url", localhost + "api/platform/");
                def("gameurl", localhost);
                def("mk", "1"); // Mock session key
                def("sid", "1");
                def("_baseURL", localhost + "assets/");
                def("_apiURL", localhost + "api/");
                def("_gameURL", localhost);

                try {
                    return originalData.call(this, a, b);
                } catch (e) {
                    throw e;
                }
            };
            GameClass.prototype.Data.patched = true;
            console.log("[PATCH] GAME.prototype.Data patched.");
        }
    }
    patchGameData();

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
                if (url.indexOf("getflags") !== -1 || url.indexOf("undefinedwc") !== -1 || url.indexOf("loadidata") !== -1) {
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
    // 4. MAIN PATCH LOOP & DEEP INSPECTION
    // =========================================================================
    var loggedMethods = false;
    var foundPopupPath = false;

    setInterval(function () {
        patchGameData();
        patchURLoader();

        var stage = null;
        if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }
        if (!stage && window.lime && window.lime.app && window.lime.app.Application && window.lime.app.Application.current) try { stage = window.lime.app.Application.current.stage; } catch (e) { }

        // --- METHOD DISCOVERY ---
        if (!loggedMethods) {
            var g = window.GAME || (window._hx_classes && window._hx_classes["GAME"]);
            var inst = g && g._instance;
            if (inst) {
                console.log("[PATCH V28] Inspecting GAME Instance Methods:");
                var props = [];
                for (var k in inst) {
                    if (typeof inst[k] === 'function') props.push(k);
                }
                console.log("[PATCH V28] Methods: " + props.join(", "));

                // Try to force map?
                // Common names: ShowWorldMap, UnloadBase, SwitchState, ToWorld
                var mapMethods = props.filter(p => p.toLowerCase().indexOf("map") !== -1 || p.toLowerCase().indexOf("world") !== -1 || p.toLowerCase().indexOf("init") !== -1 || p.toLowerCase().indexOf("state") !== -1);
                console.log("[PATCH V28] Potential Map Methods: ", mapMethods);
                loggedMethods = true;
            }
        }

        if (!stage) return;

        // --- DEEP RECURSIVE KILL & LOGGING ---
        function recursiveKill(obj, depth, path) {
            if (!obj) return;
            if (depth > 12) return; // Increased depth

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
                    var text = "";
                    if (child.text) text = child.text;

                    var currentPath = path + " > " + (name || "?") + "(" + (className || "?") + ")";

                    var isBad = false;

                    // CHECK FOR POPUP
                    if (name && (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1)) isBad = true;
                    if (className && (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1)) isBad = true;
                    if (text && text.indexOf && text.indexOf("ESTABLISHING SATELLITE") !== -1) {
                        isBad = true;
                        console.warn("[PATCH V28] FOUND POPUP TEXT at: " + currentPath);
                    }
                    if (text && text.indexOf && text.indexOf("Connecting") !== -1) {
                        isBad = true;
                        console.warn("[PATCH V28] FOUND POPUP TEXT at: " + currentPath);
                    }

                    if (isBad) {
                        console.log("[PATCH Nuclear V28] NUKING: " + currentPath);
                        try { child.set_visible(false); } catch (e) { child.visible = false; }
                        try { child.set_alpha(0); } catch (e) { child.alpha = 0; }
                        try { child.set_x(-20000); } catch (e) { child.x = -20000; }
                        try { if (obj.removeChild) obj.removeChild(child); } catch (e) { }
                    } else {
                        // Log hierarchy occasionally to debug
                        if (depth < 6 && (className.indexOf("Popup") !== -1 || name.indexOf("Message") !== -1)) {
                            // console.log("[PATCH DEBUG] " + currentPath);
                        }
                        recursiveKill(child, depth + 1, currentPath);
                    }
                }
            }
        }

        try { recursiveKill(stage, 0, "Stage"); } catch (e) { }

    }, 100);

})();
