(function () {
    // 0. LOG CAPTURE (Must be first)
    window.__LOGS__ = [];
    function captureLog(type, args) {
        try {
            var msg = "[" + type + "] " + Array.prototype.slice.call(args).join(" ");
            window.__LOGS__.push(msg);
        } catch (e) { }
    }

    var origLog = console.log;
    var origWarn = console.warn;
    var origError = console.error;

    console.log = function () { captureLog("LOG", arguments); origLog.apply(console, arguments); };
    console.warn = function () { captureLog("WARN", arguments); origWarn.apply(console, arguments); };
    console.error = function () { captureLog("ERROR", arguments); origError.apply(console, arguments); };

    console.log("=== PATCH GAME INIT START (V25 - Mock POST getflags) ===");

    function attemptInit() {
        if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
            var GameClass = window._hx_classes.GAME;
            var inst = GameClass._instance;

            console.log("Found GAME instance. Applying patches...");

            // 1. DISABLE POPUPS (LOBOTOMY)
            if (window._hx_classes.POPUPS) {
                window._hx_classes.POPUPS.DisplayWorldmapDown = function () { };
                window._hx_classes.POPUPS.displayBadConnectionPopup = function () { };
            }

            // 2. PATCH VARIABLES
            function enforceGlobals() {
                if (window._hx_classes.GLOBAL) {
                    if (!window._hx_classes.GLOBAL._baseURL) window._hx_classes.GLOBAL._baseURL = "http://localhost:8088/assets/";
                    if (!window._hx_classes.GLOBAL._apiURL) window._hx_classes.GLOBAL._apiURL = "http://localhost:8088/api/";
                    if (!window._hx_classes.GLOBAL._rootURL) window._hx_classes.GLOBAL._rootURL = "http://localhost:8088/";
                }
            }
            enforceGlobals();

            // 3. PATCH URLoaderApi (INTERCEPT LOAD)
            var URLoaderApi = null;
            for (var clsName in window._hx_classes) {
                if (window._hx_classes[clsName] && window._hx_classes[clsName].prototype && window._hx_classes[clsName].prototype.load) {
                    URLoaderApi = window._hx_classes[clsName];
                    break;
                }
            }
            if (URLoaderApi) {
                var originalLoad = URLoaderApi.prototype.load;
                URLoaderApi.prototype.load = function (req) {
                    var url = (req && req.url) ? req.url : "";
                    console.log("[PATCH URLoader] Loading: " + url);

                    if (url.indexOf("getflags") !== -1 || url.indexOf("undefinedwc") !== -1) {
                        console.log("[PATCH URLoader] INTERCEPTED 'getflags' request. Mocking response.");
                        var self = this;
                        setTimeout(function () {
                            // Construct a valid Event
                            var Event = window._hx_classes["openfl.events.Event"];
                            var evt = new Event(Event.COMPLETE);
                            // Set data
                            // Format: JSON? Or key-value?
                            // Usually JSON for getflags
                            evt.target = self;
                            self.data = JSON.stringify({
                                "success": true,
                                "flags": {
                                    "example_flag": 1
                                }
                            });

                            if (self.fireComplete) {
                                self.fireComplete(evt);
                            } else if (self.dispatchEvent) {
                                self.dispatchEvent(evt);
                            }
                        }, 100);
                        return; // Prevent actual load
                    }

                    return originalLoad.call(this, req);
                };

                var originalFireComplete = URLoaderApi.prototype.fireComplete;
                URLoaderApi.prototype.fireComplete = function (e) {
                    this._ignoreHash = true;
                    return originalFireComplete.call(this, e);
                };
            }

            // 4. PATCH SmartFox
            var SmartFox = window._hx_classes["com.smartfoxserver.v2.SmartFox"];
            if (SmartFox && SmartFox.prototype) {
                SmartFox.prototype.connect = function () {
                    window.__SFS = this;
                    this.connected = true;
                    this._connected = true;
                    this.isConnected = function () { return true; };
                    this.disconnect = function () { };
                    this.killConnection = function () { };
                    return true;
                };
                SmartFox.prototype.send = function (req) {
                    window.__SFS = this;
                };
            }

            // 5. PREPARE ASSETS
            if (window.AssetPreloader) window.AssetPreloader.injectIntoCache();

            // 6. INIT GAME
            try {
                inst.init();
                console.log("GAME._instance.init() Success!");
            } catch (e) {
                console.error("GAME._instance.init() Threw (Continuing):", e);
            }

            // -------------------------------------------------------------
            // AGGRESSIVE LOADER LOOP
            // -------------------------------------------------------------
            var cycleCount = 0;
            var loginSent = false;

            // HELPERS
            var popupClass = window._hx_classes['com.cc.popups.PopupPleaseWait'];

            function nuclearOption(obj) {
                if (!obj || obj.__nuked) return;
                try {
                    console.log("[PATCH Nuclear] NUKING: " + obj);
                    if (obj.set_visible) obj.set_visible(false);
                    obj.visible = false;
                    obj.alpha = 0;
                    obj.x = -20000;
                    obj.set_visible = function (v) { return false; };
                    try { if (obj.parent) obj.parent.removeChild(obj); } catch (e) { }
                    obj.__nuked = true;
                } catch (e) { }
            }

            setInterval(function () {
                cycleCount++;

                // A. ENFORCE GLOBALS
                enforceGlobals();

                // B. RECURSIVE KILL
                var stage = null;
                try {
                    if (window.openfl && window.openfl.Lib) {
                        if (window.openfl.Lib.current) stage = window.openfl.Lib.current.stage;
                        else if (window.openfl.Lib.get_current) stage = window.openfl.Lib.get_current().stage;
                    }
                } catch (e) { }

                function getChildrenCount(node) {
                    try {
                        if (typeof node.get_numChildren === 'function') return node.get_numChildren();
                        if (node.numChildren !== undefined) return node.numChildren;
                        if (node.__children) return node.__children.length;
                    } catch (e) { }
                    return 0;
                }
                function getChildAt(node, idx) {
                    try {
                        if (typeof node.getChildAt === 'function') return node.getChildAt(idx);
                        if (node.__children) return node.__children[idx];
                    } catch (e) { }
                    return null;
                }

                function recursiveKill(node, depth) {
                    if (!node || depth > 20) return;
                    try {
                        var count = getChildrenCount(node);
                        if (count > 0) {
                            for (var i = count - 1; i >= 0; i--) {
                                var child = getChildAt(node, i);
                                if (child) {
                                    var isPopup = false;
                                    try {
                                        var s = child.toString();
                                        isPopup = (popupClass && child instanceof popupClass) ||
                                            (s.indexOf('PopupPleaseWait') !== -1) ||
                                            (s.indexOf('PopupConnection') !== -1);
                                    } catch (e) { }

                                    if (isPopup) {
                                        nuclearOption(child);
                                    } else {
                                        recursiveKill(child, depth + 1);
                                    }
                                }
                            }
                        }
                    } catch (e) { }
                }
                if (stage) recursiveKill(stage, 0);


                // D. FORCE CONNECTION EVENTS
                var sfs = window.__SFS;
                if (!sfs && inst.sfs) sfs = inst.sfs;

                if (sfs) {
                    var SFSEvent = window._hx_classes["com.smartfoxserver.v2.core.SFSEvent"];
                    var User = window._hx_classes["com.smartfoxserver.v2.entities.SFSUser"];

                    if (SFSEvent && User) {
                        try {
                            if (cycleCount % 20 === 0 && cycleCount < 200) {
                                sfs.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION, { success: true, params: {} }));
                            }
                            if ((!loginSent || cycleCount % 40 === 0) && cycleCount > 10) {
                                var u = new User(123456, "LocalCommander");
                                sfs.mySelf = u;
                                sfs.dispatchEvent(new SFSEvent(SFSEvent.LOGIN, { success: true, user: u, data: {} }));
                                loginSent = true;
                            }
                            if (cycleCount % 30 === 0 && cycleCount > 20) {
                                sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_JOIN, { success: true, room: { name: "Lobby", id: 1 }, vars: {} }));
                            }
                        } catch (e) { }
                    }
                }

                // E. FORCE MAP SHOW
                if (cycleCount % 50 === 0 && cycleCount > 40) {
                    if (window._hx_classes.GLOBAL && window._hx_classes.GLOBAL.ShowMap) {
                        window._hx_classes.GLOBAL.ShowMap(500, 500);
                    }
                }

            }, 50);

            console.log("PATCH Loop Started (V25 - Mock POST getflags).");

            return true;
        }
        return false;
    }

    if (!attemptInit()) {
        var attempts = 0;
        var interval = setInterval(function () {
            attempts++;
            if (attemptInit() || attempts > 50) {
                clearInterval(interval);
            }
        }, 100);
    }

})();
