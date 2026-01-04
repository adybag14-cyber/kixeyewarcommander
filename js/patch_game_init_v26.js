/**
 * PATCH GAME INIT V26
 * - V25 features (Blind Nuke, Global fix, SFS Mock, URLoader Mock)
 * - NEW: GAME.prototype.Data interception to inject missing parameters (baseurl, etc.)
 */

(function () {
    console.log("[PATCH] V26 Script Loaded");

    // =========================================================================
    // 1. GAME.prototype.Data Interception (Fixes TypeError in Ih.Data)
    // =========================================================================
    function patchGameData() {
        // Try to find the GAME class (it's usually 'GAME' or 'Cd' in minified code, but assigned to window.GAME)
        var GameClass = window.GAME;
        if (!GameClass && window.l && window.l.GAME) GameClass = window.l.GAME;

        if (GameClass && GameClass.prototype && GameClass.prototype.Data) {
            if (GameClass.prototype.Data.patched) return; // Already patched

            var originalData = GameClass.prototype.Data;
            console.log("[PATCH] Intercepting GAME.prototype.Data");

            GameClass.prototype.Data = function (a, b) {
                console.log("[PATCH] GAME.Data called with:", a);

                // Inject missing parameters if they are undefined or null
                if (!a) a = {};

                // Helper to set default if missing
                function def(key, val) {
                    if (!a[key]) a[key] = val;
                }

                var localhost = "http://localhost:8088/";

                def("baseurl", localhost + "assets/");
                def("apiurl", localhost + "api/");
                def("wmbasemanurl", localhost + "api/wm/"); // Guess
                def("platform_api_url", localhost + "api/platform/");
                def("env_name", "localhost");
                def("gameurl", localhost);
                def("statsurl", localhost + "stats");
                def("logurl", localhost + "logs");
                def("mapurl", localhost + "assets/map.json"); // Guess
                def("siu", localhost + "siu/");
                def("abtests", "{}");
                def("softversion", "1");
                def("gameversion", "1");
                def("locale", "en_US");
                def("__", 0);
                def("___", 0);

                // Also set the internal underscored versions just in case
                def("_baseURL", a.baseurl);
                def("_apiURL", a.apiurl);
                def("_gameURL", a.gameurl);

                console.warn("[PATCH] Injected defaults into GAME.Data params:", a);

                try {
                    return originalData.call(this, a, b);
                } catch (e) {
                    console.error("[PATCH] Error inside original GAME.Data:", e);
                    // Swallow error to allow game to "continue" if possible? 
                    // No, if Data fails, game is broken. But maybe we fixed the cause.
                    throw e;
                }
            };
            GameClass.prototype.Data.patched = true;
            console.log("[PATCH] GAME.prototype.Data patched successfully.");
        } else {
            console.log("[PATCH] GAME class or Data method not found yet. Retrying in loop.");
        }
    }

    // Attempt immediately
    patchGameData();

    // =========================================================================
    // 2. URLoaderApi Interception (Fixes 501 POST getflags) - FROM V25
    // =========================================================================
    if (window.URLoaderApi && window.URLoaderApi.prototype && window.URLoaderApi.prototype.load) {
        var originalLoad = window.URLoaderApi.prototype.load;
        window.URLoaderApi.prototype.load = function (urlRequest) {
            var url = urlRequest.url;
            console.log("[PATCH] URLoaderApi.load intercepted: " + url);

            if (url.indexOf("getflags") !== -1 || url.indexOf("undefinedwc") !== -1) {
                console.warn("[PATCH] BLOCKED invalid/POST request: " + url);

                // MOCK RESPONSE
                var mockData = {
                    success: true,
                    flags: {
                        example_flag: 1,
                        // Add critical flags here if identified
                    }
                };

                // Create a fake event to dispatch COMPLETE
                // We need to trigger 'onComplete' or similar on 'this' (the URLoader instance)
                // In OpenFL, URLoader dispatches Event.COMPLETE

                var self = this;
                setTimeout(function () {
                    console.log("[PATCH] Dispatching MOCK COMPLETE for " + url);

                    // We need to populate 'data' property of URLoader
                    self.data = JSON.stringify(mockData);

                    // Dispatch openfl.events.Event.COMPLETE (string "complete")
                    // We can try dispatchEvent if it exists
                    if (self.dispatchEvent) {
                        // Assuming openfl.events.Event.COMPLETE is "complete"
                        var evt;
                        try {
                            // Try to use the game's Event class if available globally
                            if (window.openfl && window.openfl.events && window.openfl.events.Event) {
                                evt = new window.openfl.events.Event(window.openfl.events.Event.COMPLETE);
                            } else {
                                // Fallback to generic object or string
                                evt = { type: "complete", target: self }; /* Mock event */
                            }
                        } catch (e) {
                            evt = { type: "complete", target: self };
                        }

                        // Haxe event dispatching
                        try {
                            self.dispatchEvent(evt);
                        } catch (e) {
                            console.error("[PATCH] Failed to dispatch mock event", e);
                            // Fallback: manually call onComplete callback if it exists (internal Haxe)
                            if (self.onComplete) self.onComplete(evt);
                        }
                    }
                }, 100);

                return; // Prevent actual load
            }

            return originalLoad.call(this, urlRequest);
        };
        console.log("[PATCH] URLoaderApi.prototype.load has been intercepted.");
    }

    // =========================================================================
    // 3. SmartFox Interception (Mocks connection events) - FROM V25
    // =========================================================================
    function triggerSmartFoxEvent(eventType, params) {
        if (!window.__SFS) {
            // Try to find SFS instance
            if (window.SmartFox && window.SmartFox.prototype) {
                // If we can't find the instance, we can't dispatch.
                // But usually the game assigns it to a global variable or we can hook the constructor.
            }
            return;
        }

        console.log(`[PATCH] Mocking SmartFox Event: ${eventType}`);

        var evt = { type: eventType, params: params || {} };
        // Dispatch to the SFS instance if possible
        if (window.__SFS.dispatchEvent) {
            window.__SFS.dispatchEvent(evt);
        }

        // Also try to dispatch to the game's top level if it listens there
        if (window.GAME && window.GAME._instance) {
            // Sometimes games relay SFS events
        }
    }

    // Interval to establish "Fake Connection"
    var sfsState = 0;
    setInterval(function () {
        if (!window.__SFS) {
            // Look for SFS in GAME instance if not global
            if (window.GAME && window.GAME._instance && window.GAME._instance.sfs) {
                window.__SFS = window.GAME._instance.sfs;
            }
            return;
        }

        if (sfsState === 0) {
            // CONNECTION
            triggerSmartFoxEvent("connection", { success: true });
            sfsState = 1;
        } else if (sfsState === 1) {
            // LOGIN
            triggerSmartFoxEvent("login", {
                success: true,
                user: { name: "Player", id: 123 },
                data: {}
            });
            sfsState = 2;
        } else if (sfsState === 2) {
            // ROOM JOIN
            triggerSmartFoxEvent("roomJoin", {
                room: { name: "Global", id: 1 }
            });
            sfsState = 3;
        }
    }, 2000);


    // =========================================================================
    // 4. MAIN PATCH LOOP (Popup Nuking & Global Fixes)
    // =========================================================================
    var patchInterval = setInterval(function () {
        // Retry patching GAME.Data if missed
        patchGameData();

        // Safe access to stage
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

        // RECURSIVE NUKE FUNCTION (The "Nuclear Option")
        function recursiveKill(obj, depth) {
            if (!obj) return;
            if (depth > 5) return; // Limit depth

            // Haxe/OpenFL Child Iterator
            var count = 0;
            if (typeof obj.get_numChildren === 'function') {
                count = obj.get_numChildren();
            } else if (obj.numChildren !== undefined) {
                count = obj.numChildren;
            }

            for (var i = count - 1; i >= 0; i--) {
                var child = null;
                try {
                    if (typeof obj.getChildAt === 'function') child = obj.getChildAt(i);
                } catch (e) { }

                if (child) {
                    var name = "";
                    try { name = child.get_name(); } catch (e) { name = child.name; }
                    var className = "";
                    try { className = child.__class__.__name__; } catch (e) { }

                    var isBad = false;

                    // TARGET SPECIFIC POPUP CLASSES
                    if (name && (name.indexOf("PopupPleaseWait") !== -1 || name.indexOf("PopupConnection") !== -1)) isBad = true;
                    if (className && (className.indexOf("PopupPleaseWait") !== -1 || className.indexOf("PopupConnection") !== -1)) isBad = true;

                    // Also generic "Connecting" text search if possible (text fields)
                    if (child.text && child.text.indexOf && child.text.indexOf("ESTABLISHING SATELLITE") !== -1) isBad = true;

                    if (isBad) {
                        console.log("[PATCH Nuclear] NUKING: " + name + " (" + className + ")");
                        try { child.set_visible(false); } catch (e) { child.visible = false; }
                        try { child.set_alpha(0); } catch (e) { child.alpha = 0; }
                        try { child.set_x(-20000); } catch (e) { child.x = -20000; }

                        // Try to remove
                        try {
                            if (obj.removeChild) obj.removeChild(child);
                        } catch (e) { }
                    } else {
                        // Recurse
                        recursiveKill(child, depth + 1);
                    }
                }
            }
        }

        try {
            recursiveKill(stage, 0);
        } catch (e) {
            // Ignore errors during crawl
        }

    }, 50); // Run aggressively

})();
