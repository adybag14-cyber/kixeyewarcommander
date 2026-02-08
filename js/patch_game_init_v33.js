(function () {
    console.log("[PATCH V33] Initializing Runtime Patches... NEW FILE");

    var attempts = { setupStage: 0, initLocal: 0, onDataFinishedLoading: 0, worldMap: 0 };
    var success = { setupStage: false, initLocal: false, onDataFinishedLoading: false };
    var MAX_ATTEMPTS = 5;
    var manifestKickAttempts = 0;
    var nextManifestKickAtMs = 45000;
    var LOCAL_ORIGIN = (window.location && window.location.origin && window.location.origin !== "null")
        ? window.location.origin
        : "http://127.0.0.1:8089";
    var WORLDMAP_SYNTHETIC_BOOTSTRAP_MIN_MS = 45000;

    function rewriteLocalUrl(url) {
        if (!url || typeof url !== "string") return url;

        if (url.indexOf("http://127.0.0.1:8888") === 0 || url.indexOf("http://localhost:8888") === 0) {
            return LOCAL_ORIGIN + url.replace(/^https?:\/\/(?:127\.0\.0\.1|localhost):8888/, "");
        }

        if (url.indexOf("http://127.0.0.1:8089") === 0 || url.indexOf("http://localhost:8089") === 0) {
            return LOCAL_ORIGIN + url.replace(/^https?:\/\/(?:127\.0\.0\.1|localhost):8089/, "");
        }

        if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
            return url;
        }

        if (url.startsWith("/")) {
            return LOCAL_ORIGIN + url;
        }

        return LOCAL_ORIGIN + "/" + url;
    }

    function normalizeLocalizationPayload(raw) {
        var payload = raw;
        if (typeof payload === "string") {
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                return {};
            }
        }

        if (!payload || typeof payload !== "object") return {};

        var source = payload.content;
        if (!source || typeof source !== "object") source = payload;

        var out = {};
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = source[key];
            if (typeof value === "string") {
                out[key] = value;
                continue;
            }
            if (value && typeof value === "object") {
                if (typeof value.value === "string") {
                    out[key] = value.value;
                } else if (typeof value.text === "string") {
                    out[key] = value.text;
                }
            }
        }

        return out;
    }

    function getLocalizationFallbackMap() {
        return window.__PATCH_V33_REAL_LANG_MAP__ || null;
    }

    function setLocalizationFallbackMap(map, source) {
        if (!map || typeof map !== "object") return false;
        var keyCount = Object.keys(map).length;
        if (keyCount < 100) return false;
        window.__PATCH_V33_REAL_LANG_MAP__ = map;
        window.__PATCH_V33_REAL_LANG_SOURCE__ = source || "unknown";
        console.log("[PATCH V33] Loaded localization fallback map from " + window.__PATCH_V33_REAL_LANG_SOURCE__ + " (" + keyCount + " keys)");
        return true;
    }

    function ensureLocalizationFallbackMap() {
        var existing = getLocalizationFallbackMap();
        if (existing) return;
        if (window.__PATCH_V33_REAL_LANG_LOADING__) return;

        window.__PATCH_V33_REAL_LANG_LOADING__ = true;

        var candidates = [
            "/manifest/en_US.json",
            "/manifest/en_US.1.json",
            "/lang/en_US_real.json",
            "/assets/lang/en_US_real.json",
            "/lang/en_US.json",
            "/assets/lang/en_US.json"
        ];

        function finish() {
            window.__PATCH_V33_REAL_LANG_LOADING__ = false;
        }

        function tryFetch(index) {
            if (index >= candidates.length) {
                finish();
                return;
            }

            var rel = candidates[index];
            fetch(rewriteLocalUrl(rel))
                .then(function (r) {
                    if (!r.ok) throw new Error("HTTP " + r.status);
                    return r.text();
                })
                .then(function (text) {
                    var map = normalizeLocalizationPayload(text);
                    if (setLocalizationFallbackMap(map, rel)) {
                        finish();
                        return;
                    }
                    tryFetch(index + 1);
                })
                .catch(function () {
                    tryFetch(index + 1);
                });
        }

        tryFetch(0);
    }

    function buildLocalizationLookupKeys(bundle, key) {
        var out = [];
        var seen = {};

        function add(value) {
            var v = String(value || "").trim();
            if (!v || seen[v]) return;
            seen[v] = true;
            out.push(v);
        }

        var b = String(bundle || "").trim();
        var k = String(key || "").trim();

        add(k);
        if (b && k && k.indexOf("__") === -1) {
            add(b + "__" + k);
        }

        if (k && k.indexOf("__") === -1 && k.indexOf("_") !== -1) {
            var parts = k.split("_");
            if (parts.length >= 3) {
                add(parts[0] + "_" + parts[1] + "__" + parts.slice(2).join("_"));
            }
            if (parts.length >= 2) {
                add(parts[0] + "__" + parts.slice(1).join("_"));
            }
        }

        if (k && k.indexOf("__") !== -1) {
            add(k.replace("__", "_"));
        }

        return out;
    }

    function applyLocalizationParams(text, params) {
        var result = String(text || "");
        if (!params || typeof params !== "object") return result;

        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
            var value = params[key];
            var safe = value == null ? "" : String(value);
            result = result.replace(new RegExp("\\{" + key + "\\}", "g"), safe);
            result = result.replace(new RegExp("#" + key + "#", "g"), safe);
        }
        return result;
    }

    function lookupLocalizationFallback(bundle, key, params) {
        var map = getLocalizationFallbackMap();
        if (!map) return null;

        var candidates = buildLocalizationLookupKeys(bundle, key);
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (!Object.prototype.hasOwnProperty.call(map, candidate)) continue;
            var text = map[candidate];
            if (typeof text !== "string" || text === "") continue;
            return applyLocalizationParams(text, params);
        }
        return null;
    }

    function buildDefaultLoaderParams(existing) {
        var params = (existing && typeof existing === "object") ? existing : {};
        function setIfMissing(key, value) {
            if (params[key] == null || params[key] === "") params[key] = value;
        }

        setIfMissing("baseurl", LOCAL_ORIGIN + "/");
        setIfMissing("apiurl", LOCAL_ORIGIN + "/api/");
        setIfMissing("wmbasemanurl", LOCAL_ORIGIN + "/api/");
        setIfMissing("gameurl", LOCAL_ORIGIN + "/");
        setIfMissing("statsurl", LOCAL_ORIGIN + "/api/stats/");
        setIfMissing("statsDURL", LOCAL_ORIGIN + "/api/statsd/");
        setIfMissing("mapurl", LOCAL_ORIGIN + "/");
        setIfMissing("locale", "en");
        setIfMissing("version", "71601");
        setIfMissing("softversion", 71601);
        setIfMissing("gameversion", 71601);
        setIfMissing("app_enable_response_checksum", 0);
        setIfMissing("integ", "fbg");
        // World-map networking is driven by loader params, not API flags.
        // Provide a local HTTP gateway by default so WorldmapController can connect.
        try {
            var worldmapHost = "127.0.0.1";
            var worldmapPort = "8089";
            try {
                var parsed = new URL(LOCAL_ORIGIN);
                if (parsed.hostname) worldmapHost = parsed.hostname;
                if (parsed.port && parsed.port !== "") {
                    worldmapPort = parsed.port;
                } else {
                    worldmapPort = parsed.protocol === "https:" ? "443" : "80";
                }
            } catch (_ignored) { }

            // Use HTTP gateway only (type 3) to avoid secure socket failures locally.
            var defaultWorldmapServers = JSON.stringify([
                [worldmapHost, 3, String(worldmapPort)]
            ]);

            if (
                params.worldmap_servers == null ||
                params.worldmap_servers === "" ||
                params.worldmap_servers === "[]"
            ) {
                params.worldmap_servers = defaultWorldmapServers;
            }
        } catch (_wmServersError) { }
        if (!Object.prototype.hasOwnProperty.call(params, "abtests") || !params.abtests || typeof params.abtests !== "object") {
            params.abtests = {};
        }
        if (!Object.prototype.hasOwnProperty.call(params, "root")) {
            params.root = null;
        }
        return params;
    }

    // --- PATCH: Intercept XHR for Assets ---
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.indexOf("http") === -1 || url.indexOf("localhost") !== -1 || url.indexOf("127.0.0.1") !== -1) {
            url = rewriteLocalUrl(url);
        }
        arguments[1] = url;
        return originalOpen.apply(this, arguments);
    };

    // --- PATCH: Hook URL Loading ---
    var originalLoad = null;
    function hookUrlLoader() {
        var URLLoaderClass = (window._hx_classes && window._hx_classes["openfl.net.URLLoader"]) || (window.openfl && window.openfl.net && window.openfl.net.URLLoader) || (window._hx_classes && window._hx_classes["lime.net.URLLoader"]);
        if (URLLoaderClass && URLLoaderClass.prototype && !URLLoaderClass.prototype.__patched) {
            console.log("[PATCH V32] Hooking URLLoader.load");
            originalLoad = URLLoaderClass.prototype.load;
            URLLoaderClass.prototype.load = function (urlRequest) {
                var url = rewriteLocalUrl(urlRequest.url);
                urlRequest.url = url;

                // PATCH: Strip query params from static assets to ensure we hit the preloaded cache
                // The game adds ?12345 cache busters, but our preloader loads clean URLs.
                if ((url.indexOf(".zip") !== -1 || url.indexOf(".png") !== -1) && url.indexOf("?") !== -1) {
                    var cleanUrl = url.split("?")[0];
                    // console.log("[PATCH V32] Stripping query param for cache hit: " + url + " -> " + cleanUrl);
                    urlRequest.url = cleanUrl;
                    url = cleanUrl;
                }

                console.log("[PATCH V32] URLLoader Loading: " + url);

                if (url.indexOf("wc/getflags") !== -1 || url.indexOf("undefinedwc") !== -1 || url.indexOf("loadidata") !== -1 || url.indexOf("base/load") !== -1) {
                    console.log("[PATCH V32] Allowing server.py to handle API: " + url);
                    return originalLoad.apply(this, arguments);
                }
                return originalLoad.call(this, urlRequest);
            };
            URLLoaderClass.prototype.__patched = true;
        }

        // Patch URLLoaderApi (Hc) to ignore hashes
        var Hc = (window._hx_classes && window._hx_classes["URLLoaderApi"]) || window.URLLoaderApi;
        if (Hc && Hc.prototype && !Hc.prototype.__patched) {
            console.log("[PATCH V32] Hooking URLLoaderApi.prototype.fireComplete to ignore hashes");

            var patchComplete = function (originalName) {
                var original = Hc.prototype[originalName];
                if (original) {
                    Hc.prototype[originalName] = function (a) {
                        // Force ignoreHash to true
                        this._ignoreHash = true;
                        return original.apply(this, arguments);
                    };
                }
            };

            patchComplete("fireComplete");
            patchComplete("fireComplete_DebugLogger");
            Hc.prototype.__patched = true;
        }

        // --- PATCH: Intercept AssetManager.getAsset ---
    if (window._hx_classes && window._hx_classes["com.cc.assets.AssetManager"]) {
        var Yn = window._hx_classes["com.cc.assets.AssetManager"];
        var originalGetAsset = Yn.prototype.getAsset;
        Yn.prototype.getAsset = function (name, type, success, failed) {
            if (window.__ASSET_DEBUG_VERBOSE__) {
                console.warn("[ANTIGRAVITY_DEBUG] Yn.getAsset: " + name + " (type " + type + ")");
                try {
                    var versioned = this.getVersionedAssetURL(name);
                    console.warn("[ANTIGRAVITY_DEBUG] Yn.getAsset versioned URL: " + versioned);
                } catch (e) {
                    console.error("[ANTIGRAVITY_DEBUG] Yn.getAsset versioned error:", e);
                }
            }
            return originalGetAsset.apply(this, arguments);
        };
    }

    // --- PATCH: Hook Loader (for Images) ---
        var LoaderClass = (window._hx_classes && window._hx_classes["openfl.display.Loader"]) || (window.openfl && window.openfl.display && window.openfl.display.Loader);
        if (LoaderClass && LoaderClass.prototype && !LoaderClass.prototype.__patched) {
            console.log("[PATCH V32] Hooking Loader.load");
            var originalLoaderLoad = LoaderClass.prototype.load;
            LoaderClass.prototype.load = function (urlRequest) {
                var url = rewriteLocalUrl(urlRequest.url);
                urlRequest.url = url;
                if ((url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1) && url.indexOf("?") !== -1) {
                    var cleanUrl = url.split("?")[0];
                    urlRequest.url = cleanUrl;
                    url = cleanUrl;
                }
                console.log("[PATCH V32] Loader Loading: " + url);
                return originalLoaderLoad.call(this, urlRequest);
            };
            LoaderClass.prototype.__patched = true;
        }
    }

    // --- PATCH: Localization Helper ---
    function patchLocalization() {
        var LocalizerClass = (window._hx_classes && window._hx_classes["com.kixeye.wc.resources.WCLocalizer"]) || (window.com && window.com.kixeye && window.com.kixeye.wc && window.com.kixeye.wc.resources.WCLocalizer);
        if (LocalizerClass && !LocalizerClass.__patched) {
            console.log("[PATCH V32] Found WCLocalizer class, hooking...");
            ensureLocalizationFallbackMap();

            // Logging for handleSharedConfigCDNDataLoaded
            var originalHandle = LocalizerClass.handleSharedConfigCDNDataLoaded;
            LocalizerClass.handleSharedConfigCDNDataLoaded = function (a) {
                console.warn("[ANTIGRAVITY_DEBUG] WCLocalizer.handleSharedConfigCDNDataLoaded: " + (a ? a.name : "null"));
                return originalHandle.apply(this, arguments);
            };

            // Logging for MergeLocalizationData
            var originalMerge = LocalizerClass.MergeLocalizationData;
            LocalizerClass.MergeLocalizationData = function (a, b) {
                console.warn("[ANTIGRAVITY_DEBUG] WCLocalizer.MergeLocalizationData");
                try {
                    return originalMerge.apply(this, arguments);
                } catch (e) {
                    console.error("[ANTIGRAVITY_DEBUG] Error in MergeLocalizationData:", e);
                    return a; // Return original if merge fails
                }
            };

            // The localizer uses a delegate (m.get_delegate()) which is an instance of FW (ResourceManager)
            var originalGetDelegate = LocalizerClass.get_delegate;
            LocalizerClass.get_delegate = function () {
                var delegate = originalGetDelegate.apply(this, arguments);
                if (delegate && !delegate.__patched) {
                    console.log("[PATCH V32] Patching Localizer Delegate (ResourceManager)");
                    var oldGS = delegate.getString;
                    delegate.getString = function (bundle, key, params) {
                        var res = oldGS.apply(this, arguments);
                        if (!res || res === key || res === "undefined") {
                            var fromRealMap = lookupLocalizationFallback(bundle, key, params);
                            if (fromRealMap) return fromRealMap;

                            var fallbacks = {
                                "common__error": "Error",
                                "global_body__reload_to_continue_error": "A critical error occurred. Please reload.",
                                "error_code__error_wrapper": "Error Code: {code} - {message}",
                                "common_button__reconnect": "Reconnect",
                                "common__processing": "Processing...",
                                "updates_title__welcome_back": "Welcome Back!",
                                "updates_body__welcome_back": "Loading your base...",
                                "global_header__error": "Initialization Error",
                                "chat_ui__chat_disconnected": "Chat offline.",
                                "tutorial__base_is_ours_again": "Base secured."
                            };
                            if (fallbacks[key]) {
                                var txt = fallbacks[key];
                                if (params) {
                                    for (var pKey in params) {
                                        if (params.hasOwnProperty(pKey)) {
                                            txt = txt.replace(new RegExp("{" + pKey + "}", "g"), params[pKey]);
                                        }
                                    }
                                }
                                return txt;
                            }
                        }
                        return res;
                    };
                    delegate.__patched = true;
                }
                return delegate;
            };
            LocalizerClass.__patched = true;
        }
    }

    // --- POPUP REMOVAL ---
    function removeBlockingPopups() {
        var PopupClasses = [
            "com.cc.popups.PopupPleaseWait",
            "com.cc.popups.PopupConnection",
            "com.cc.popups.PopupError"
        ];

        PopupClasses.forEach(function (clsName) {
            var Cls = window._hx_classes && window._hx_classes[clsName];
            if (Cls && Cls._instance) {
                console.log("[PATCH V32] Hiding " + clsName);
                try {
                    if (Cls.Hide) Cls.Hide();
                    else if (Cls._instance.Hide) Cls._instance.Hide();
                    else if (Cls._instance.close) Cls._instance.close();
                } catch (e) { }
            }
        });

        // Aggressive DOM removal for overlays
        var layers = ["_layerWindows", "_layerTop"];
        layers.forEach(function (lName) {
            var layer = window.GAME && window.GAME._instance && window.GAME._instance[lName];
            if (layer && layer.get_numChildren && layer.get_numChildren() > 0) {
                // console.log("[PATCH V32] Layer " + lName + " has children, might be blocking...");
            }
        });
    }

    // --- PATCH: Global Error Handling ---
    function patchGlobalErrorHandling() {
        var GLOBAL = (window._hx_classes && window._hx_classes["GLOBAL"]);
        if (GLOBAL && !GLOBAL.__patchedErrors) {
            console.log("[PATCH V32] Hooking GLOBAL.showErrorMessage");

            var originalShow = GLOBAL.showErrorMessage;
            GLOBAL.showErrorMessage = function (code, msg, c, d, e) {
                console.warn("[ANTIGRAVITY_DEBUG] GLOBAL.showErrorMessage CALLED:", code, msg);
                window.__LAST_ERROR_CODE = code;
                window.__LAST_ERROR_MSG = msg;
                return originalShow.apply(this, arguments);
            };

            var originalPopup = GLOBAL.showErrorPopup;
            GLOBAL.showErrorPopup = function (code, msg, c) {
                console.warn("[ANTIGRAVITY_DEBUG] GLOBAL.showErrorPopup CALLED:", code, msg);
                return originalPopup.apply(this, arguments);
            };

            GLOBAL.__patchedErrors = true;
        }
    }

    function patchWorldmapDisconnectSafety() {
        var hx = window._hx_classes || {};
        var GLOBAL = hx["GLOBAL"];
        var WorldmapController = hx["com.cc.worldmap.WorldmapController"];
        var POPUPS = hx["POPUPS"];

        function isConnectionReason(text) {
            var s = String(text || "").toLowerCase();
            return s.indexOf("connection") !== -1 ||
                s.indexOf("client has lost connection") !== -1 ||
                s.indexOf("atlas") !== -1 ||
                s.indexOf("satellite") !== -1 ||
                s.indexOf("server") !== -1;
        }

        if (GLOBAL && !GLOBAL.__patchedNoConnectionHalt) {
            if (GLOBAL.setHalted) {
                var originalSetHalted = GLOBAL.setHalted;
                GLOBAL.setHalted = function (flag, reason) {
                    if (flag && isConnectionReason(reason)) {
                        console.warn("[PATCH V33] Suppressed GLOBAL.setHalted for connection reason:", reason);
                        try {
                            return originalSetHalted.call(this, false, "");
                        } catch (e) {
                            return;
                        }
                    }
                    return originalSetHalted.apply(this, arguments);
                };
            }

            if (GLOBAL.Halt) {
                var originalHalt = GLOBAL.Halt;
                GLOBAL.Halt = function (where, reason) {
                    if (isConnectionReason(reason)) {
                        console.warn("[PATCH V33] Suppressed GLOBAL.Halt for connection reason:", reason, "at", where);
                        try {
                            if (GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                        } catch (e) { }
                        return;
                    }
                    return originalHalt.apply(this, arguments);
                };
            }

            GLOBAL.__patchedNoConnectionHalt = true;
        }

        if (POPUPS && !POPUPS.__patchedNoWorldmapDown && POPUPS.DisplayWorldmapDown) {
            var originalDisplayWorldmapDown = POPUPS.DisplayWorldmapDown;
            POPUPS.DisplayWorldmapDown = function () {
                console.warn("[PATCH V33] POPUPS.DisplayWorldmapDown suppressed.");
                try {
                    if (GLOBAL && GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                } catch (e) { }
                return;
            };
            POPUPS.__patchedNoWorldmapDown = true;
        }

        if (WorldmapController && !WorldmapController.__patchedNoDisconnect) {
            if (WorldmapController.onDisconnected) {
                var originalOnDisconnected = WorldmapController.onDisconnected;
                WorldmapController.onDisconnected = function (reason, allowReconnect) {
                    console.warn("[PATCH V33] WorldmapController.onDisconnected suppressed:", reason);
                    try {
                        if (GLOBAL && GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                    } catch (e) { }
                    return;
                };
            }

            if (WorldmapController.onForceDisconnect) {
                var originalOnForceDisconnect = WorldmapController.onForceDisconnect;
                WorldmapController.onForceDisconnect = function (event) {
                    var msg = event && event.message;
                    console.warn("[PATCH V33] WorldmapController.onForceDisconnect suppressed:", msg);
                    try {
                        if (GLOBAL && GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                    } catch (e) { }
                    return;
                };
            }

            WorldmapController.__patchedNoDisconnect = true;
        }

        if (WorldmapController && !WorldmapController.__patchedConnectivityBypass) {
            if (typeof WorldmapController.isConnectedAndAuthenticated === "function") {
                WorldmapController.isConnectedAndAuthenticated = function () {
                    return true;
                };
            }

            if (typeof WorldmapController.canUseService === "function") {
                WorldmapController.canUseService = function () {
                    return true;
                };
            }

            WorldmapController.__patchedConnectivityBypass = true;
            console.log("[PATCH V33] WorldmapController connectivity checks bypassed.");
        }
    }

    function patchGatewayHttpBootstrap() {
        var hx = window._hx_classes || {};
        var GatewayHttpConnection = hx["com.kixeye.net.GatewayHttpConnection"];
        if (!GatewayHttpConnection || !GatewayHttpConnection.prototype) return;

        var proto = GatewayHttpConnection.prototype;
        if (proto.__patchedGatewayHttpBootstrap) return;

        if (typeof proto.getRequiredParameters === "function") {
            var originalGetRequiredParameters = proto.getRequiredParameters;
            proto.getRequiredParameters = function () {
                if (this.sessionId == null || this.sessionId === "" || this.sessionId === "undefined") {
                    this.sessionId = "local_session";
                }
                return originalGetRequiredParameters.apply(this, arguments);
            };
        }

        if (typeof proto.get_connected === "function") {
            var originalGetConnected = proto.get_connected;
            proto.get_connected = function () {
                // URLStream in this build does not report a true connected state.
                // Treat an active stream as connected so gateway frames are processed.
                if (this.stream) return true;
                try {
                    return originalGetConnected.apply(this, arguments);
                } catch (e) {
                    return false;
                }
            };
        }

        if (typeof proto.createConnection === "function") {
            var originalCreateConnection = proto.createConnection;
            proto.createConnection = function () {
                var result = originalCreateConnection.apply(this, arguments);
                var self = this;

                // Force initial ping bootstrap if URLStream never emits an "open" event.
                setTimeout(function () {
                    try {
                        if (self.connecting && !self._isPinging && typeof self.onConnect === "function") {
                            console.warn("[PATCH V33] Forcing GatewayHttpConnection open handshake.");
                            self.onConnect({ type: "open", forced: true });
                        }
                    } catch (e) {
                        console.warn("[PATCH V33] GatewayHttpConnection bootstrap failed:", e);
                    }
                }, 0);

                // Some browser/runtime combinations keep the poll stream open but do not
                // surface progress bytes, so the client never sees handler=1/action=6.
                // If we are still stuck in ping handshake, force the same transition path.
                setTimeout(function () {
                    try {
                        if (self.connecting && self._isPinging && typeof self.receivedPong === "function") {
                            console.warn("[PATCH V33] Forcing GatewayHttpConnection pong completion.");
                            self.receivedPong();
                        }
                    } catch (e) {
                        console.warn("[PATCH V33] GatewayHttpConnection forced pong failed:", e);
                    }
                }, 500);

                return result;
            };
        }

        proto.__patchedGatewayHttpBootstrap = true;
        console.log("[PATCH V33] GatewayHttpConnection bootstrap patch enabled.");
    }

    function patchGatewayAuthBootstrap() {
        var hx = window._hx_classes || {};
        var GatewayConnection = hx["com.kixeye.net.GatewayConnection"];
        var AuthenticateEvent = hx["com.kixeye.net.events.AuthenticateEvent"];
        if (!GatewayConnection || !GatewayConnection.prototype) return;
        if (GatewayConnection.prototype.__patchedGatewayAuthBootstrap) return;

        var proto = GatewayConnection.prototype;
        if (typeof proto.authenticate === "function") {
            var originalAuthenticate = proto.authenticate;
            proto.authenticate = function () {
                var out = originalAuthenticate.apply(this, arguments);
                var self = this;

                // If poll bytes are not surfaced by the browser stream, action=2 auth
                // responses never arrive. Fall back to local-success auth so map init can continue.
                setTimeout(function () {
                    try {
                        if (self && !self._authenticated) {
                            self._authenticated = true;
                            if (typeof self.dispatchEvent === "function" && AuthenticateEvent) {
                                self.dispatchEvent(new AuthenticateEvent(true, "local-bootstrap-auth"));
                            }
                            console.warn("[PATCH V33] Forced GatewayConnection authenticated=true bootstrap.");
                        }
                    } catch (e) {
                        console.warn("[PATCH V33] GatewayConnection auth bootstrap failed:", e);
                    }
                }, 800);

                return out;
            };
        }

        if (typeof proto.sendMessage === "function" && !proto.__patchedGatewayTrafficOutbound) {
            var originalSendMessage = proto.sendMessage;
            proto.sendMessage = function (handlerId, actionId) {
                try {
                    var traffic = window.__PATCH_V33_GATEWAY_TRAFFIC__;
                    if (!traffic || typeof traffic !== "object") {
                        traffic = {};
                        window.__PATCH_V33_GATEWAY_TRAFFIC__ = traffic;
                    }
                    traffic.outboundCount = (traffic.outboundCount || 0) + 1;
                    traffic.lastOutboundMs = Date.now();
                    traffic.lastOutboundHandler = handlerId == null ? null : Number(handlerId);
                    traffic.lastOutboundAction = actionId == null ? null : Number(actionId);
                } catch (_trafficErr) { }
                return originalSendMessage.apply(this, arguments);
            };
            proto.__patchedGatewayTrafficOutbound = true;
        }

        if (typeof proto.handleAction === "function" && !proto.__patchedGatewayTrafficInbound) {
            var originalHandleAction = proto.handleAction;
            proto.handleAction = function (actionMsg) {
                try {
                    var handlerId = null;
                    var actionId = null;
                    if (actionMsg) {
                        if (typeof actionMsg.get_handler === "function") handlerId = actionMsg.get_handler();
                        else if (Object.prototype.hasOwnProperty.call(actionMsg, "handler")) handlerId = actionMsg.handler;
                        if (typeof actionMsg.get_actionId === "function") actionId = actionMsg.get_actionId();
                        else if (Object.prototype.hasOwnProperty.call(actionMsg, "action")) actionId = actionMsg.action;
                    }

                    var traffic = window.__PATCH_V33_GATEWAY_TRAFFIC__;
                    if (!traffic || typeof traffic !== "object") {
                        traffic = {};
                        window.__PATCH_V33_GATEWAY_TRAFFIC__ = traffic;
                    }
                    traffic.inboundCount = (traffic.inboundCount || 0) + 1;
                    traffic.lastInboundMs = Date.now();
                    traffic.lastInboundHandler = handlerId == null ? null : Number(handlerId);
                    traffic.lastInboundAction = actionId == null ? null : Number(actionId);
                } catch (_trafficErr) { }
                return originalHandleAction.apply(this, arguments);
            };
            proto.__patchedGatewayTrafficInbound = true;
        }

        GatewayConnection.prototype.__patchedGatewayAuthBootstrap = true;
        console.log("[PATCH V33] GatewayConnection auth bootstrap patch enabled.");
    }

    function patchUInt64Safety() {
        var hx = window._hx_classes || {};
        var Misc = hx["com.kixeye.util.Misc"];
        if (!Misc || typeof Misc.UInt64ToNumber !== "function" || Misc.__patchedUInt64ToNumberSafety) return;

        var originalUInt64ToNumber = Misc.UInt64ToNumber;
        Misc.UInt64ToNumber = function (value) {
            if (value == null) return 0;

            if (typeof value === "number") {
                return isFinite(value) ? value : 0;
            }

            try {
                if (typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "high") && Object.prototype.hasOwnProperty.call(value, "low")) {
                    if (value.high == null || value.low == null) {
                        return 0;
                    }
                }
            } catch (_shapeErr) {
                return 0;
            }

            try {
                var out = originalUInt64ToNumber.call(this, value);
                return (typeof out === "number" && isFinite(out)) ? out : 0;
            } catch (err) {
                if (!Misc.__patchedUInt64ToNumberWarned) {
                    Misc.__patchedUInt64ToNumberWarned = true;
                    console.warn("[PATCH V33] Suppressed invalid UInt64 conversion.", err);
                }
                return 0;
            }
        };

        Misc.__patchedUInt64ToNumberSafety = true;
        console.log("[PATCH V33] UInt64 safety patch enabled.");
    }

    function patchMissionToolServiceSafety() {
        var hx = window._hx_classes || {};
        var MissionToolServiceWrapper = hx["com.cc.missiontool.MissionToolServiceWrapper"];
        if (!MissionToolServiceWrapper || !MissionToolServiceWrapper.prototype || MissionToolServiceWrapper.prototype.__patchedMissionToolServiceSafety) return;

        var proto = MissionToolServiceWrapper.prototype;

        function wrapCall(methodName, requiredMethod) {
            if (typeof proto[methodName] !== "function") return;
            var original = proto[methodName];

            proto[methodName] = function () {
                var service = this && this._missionToolService;
                if (!service || typeof service[requiredMethod] !== "function") {
                    if (!this.__patchV33MissingMissionServiceLogged) {
                        this.__patchV33MissingMissionServiceLogged = true;
                        console.warn("[PATCH V33] MissionToolServiceWrapper missing mission service; suppressing mission requests.");
                    }
                    return;
                }

                try {
                    return original.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] MissionToolServiceWrapper." + methodName + " suppressed:", e);
                    return;
                }
            };
        }

        wrapCall("sendGetMissionRequest", "getMissionSlots");
        wrapCall("sendRejectMissionRequest", "rejectMission");
        wrapCall("sendRefreshMissionRequest", "refreshMission");
        wrapCall("sendClaimMissionRequest", "claimMission");

        if (typeof proto.requestMissionsFromCache === "function") {
            var originalRequestMissionsFromCache = proto.requestMissionsFromCache;
            proto.requestMissionsFromCache = function () {
                try {
                    return originalRequestMissionsFromCache.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] MissionToolServiceWrapper.requestMissionsFromCache suppressed:", e);
                    return;
                }
            };
        }

        MissionToolServiceWrapper.prototype.__patchedMissionToolServiceSafety = true;
        console.log("[PATCH V33] MissionToolServiceWrapper safety enabled.");
    }

    function patchMapResetSafety() {
        var hx = window._hx_classes || {};
        var MAP = hx["com.cc.core.MAP"];
        if (!MAP || MAP.__patchedMapResetSafety) return;

        // Do not force MAP.Init from the patch layer.
        // Calling it before the game owns the display root can create a detached
        // GroundSprite tree where buildings render off-stage.
        if (!MAP.__mapInitAutoCallDisabledLogged) {
            MAP.__mapInitAutoCallDisabledLogged = true;
            console.warn("[PATCH V33] MAP.Init auto-call disabled (prevents detached render trees).");
        }

        if (!MAP._buildingSelector || typeof MAP._buildingSelector.cleanUp !== "function") {
            MAP._buildingSelector = {
                cleanUp: function () { },
                numSelected: function () { return 0; },
                isBuildingSelected: function () { return false; },
                addOrRemoveSingle: function () { },
                addSingle: function () { },
                nudgeSelectedBuildings: function () { },
                startSelectedBuildingsMove: function () { },
                stopSelectedBuildingsMove: function (value) { return !!value; },
                selectGroup: function () { }
            };
            console.warn("[PATCH V33] MAP._buildingSelector fallback injected.");
        }

        MAP.__patchedMapResetSafety = true;
        console.log("[PATCH V33] MAP reset safety enabled.");
    }

    function patchWorldmapViewBootstrap() {
        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!Worldmap) return;
        var MAP = hx["com.cc.core.MAP"];

        // Do not force Worldmap.Setup here.
        // It can run before required assets/libraries are ready, fail once,
        // and leave world-map initialization in a permanently bad state.

        if (Worldmap._hexMap && Worldmap._controller && !Worldmap._mapView && typeof Worldmap.CreateMapView === "function") {
            if (MAP && (!MAP._terrainManager || typeof MAP._terrainManager.get_terrainSize !== "function")) {
                return;
            }
            try {
                Worldmap.CreateMapView();
                console.log("[PATCH V33] Worldmap.CreateMapView forced.");
            } catch (e) {
                if (!Worldmap.__patchedCreateMapViewWarned) {
                    Worldmap.__patchedCreateMapViewWarned = true;
                    console.warn("[PATCH V33] Worldmap.CreateMapView failed:", e);
                }
            }
        }

        if (Worldmap._mapView) {
            var GameClass = hx["GAME"] || window.GAME;
            var GLOBAL = hx["GLOBAL"] || window.GLOBAL;
            var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
            var stage = inst && inst.stage ? inst.stage : null;
            var layerMap = GLOBAL && GLOBAL._layerMap ? GLOBAL._layerMap : null;

            var currentParent = Worldmap._mapView.parent || null;
            var targetParent = null;

            if (layerMap && typeof layerMap.addChild === "function") {
                // Prefer the game's map layer when available.
                if (!currentParent || currentParent === stage) {
                    targetParent = layerMap;
                }
            } else if (stage && typeof stage.addChild === "function") {
                // Last-resort fallback only when map view is unparented.
                if (!currentParent) {
                    targetParent = stage;
                }
            }

            if (targetParent && currentParent !== targetParent) {
                try {
                    targetParent.addChild(Worldmap._mapView);
                    console.log("[PATCH V33] Worldmap map view attached to target parent.");
                } catch (e) {
                    if (!Worldmap.__patchedStageAttachWarned) {
                        Worldmap.__patchedStageAttachWarned = true;
                        console.warn("[PATCH V33] Failed to attach worldmap view:", e);
                    }
                }
            }
        }
    }

    function syncWorldmapMapViewVisibility() {
        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        var ActiveState = hx["ActiveState"];
        var BASE = hx["BASE"];
        if (!Worldmap || !Worldmap._mapView) return;

        var shouldShowMapView = false;
        var decidedFromState = false;

        if (ActiveState && typeof ActiveState.IsWorldMap === "function") {
            try {
                shouldShowMapView = !!ActiveState.IsWorldMap();
                decidedFromState = true;
            } catch (_stateReadErr) { }
        }

        if (!decidedFromState) {
            var hasHomeBaseBuildings = false;
            try {
                if (BASE && BASE.loadedHomeBase && BASE._buildingsAll && typeof BASE._buildingsAll.iterator === "function") {
                    var it = BASE._buildingsAll.iterator();
                    hasHomeBaseBuildings = !!(
                        it &&
                        it.keys &&
                        typeof it.keys.hasNext === "function" &&
                        it.keys.hasNext()
                    );
                }
            } catch (_baseScanErr) { }
            shouldShowMapView = !hasHomeBaseBuildings;
        }

        try {
            var currentVisible = null;
            if (typeof Worldmap._mapView.get_visible === "function") {
                currentVisible = !!Worldmap._mapView.get_visible();
            } else if (typeof Worldmap._mapView.visible !== "undefined") {
                currentVisible = !!Worldmap._mapView.visible;
            }

            if (currentVisible !== shouldShowMapView) {
                if (typeof Worldmap._mapView.set_visible === "function") {
                    Worldmap._mapView.set_visible(shouldShowMapView);
                } else {
                    Worldmap._mapView.visible = shouldShowMapView;
                }
            }

            if (Worldmap.__patchV33MapViewVisible !== shouldShowMapView) {
                Worldmap.__patchV33MapViewVisible = shouldShowMapView;
                console.log("[PATCH V33] Worldmap map view visibility -> " + (shouldShowMapView ? "visible" : "hidden"));
            }
        } catch (_mapViewVisibilityErr) { }

        try {
            if (typeof Worldmap._mapView.mouseEnabled !== "undefined") {
                Worldmap._mapView.mouseEnabled = shouldShowMapView;
            }
            if (typeof Worldmap._mapView.mouseChildren !== "undefined") {
                Worldmap._mapView.mouseChildren = shouldShowMapView;
            }
        } catch (_mapViewMouseErr) { }
    }

    function ensureMapLayerRefs(MAP) {
        if (!MAP || !MAP._oldRender) return;
        if (typeof MAP._oldRender.get_numChildren !== "function" || typeof MAP._oldRender.getChildAt !== "function") return;

        var oldRender = MAP._oldRender;
        var layerOrder = [
            "_UNDERLAY",
            "_BUILDINGBASES",
            "_BUILDINGFOOTPRINTS",
            "_BUILDINGTOPS",
            "_GIBLETS",
            "_MISSILE_RETICLE",
            "_GROUND_ATTACK_RETICLE",
            "_PROJECTILE_EFFECTS",
            "_UI_ORDERS",
            "_PROJECTILES",
            "_PROJECTILE_HITBOXES",
            "_AIRUNITS",
            "_BUILDINGINFO",
            "_EFFECTSTOP",
            "_FULLSCREENOVERLAY",
            "_OUTSIDE_BASE_FOG"
        ];

        var childCount = 0;
        try {
            childCount = oldRender.get_numChildren();
        } catch (_countErr) {
            childCount = 0;
        }

        var offset = 0;
        try {
            var firstChild = childCount > 0 ? oldRender.getChildAt(0) : null;
            var firstClass = firstChild && firstChild.__class__ && firstChild.__class__.__name__ ? String(firstChild.__class__.__name__).toLowerCase() : "";
            if (firstClass.indexOf("bitmap") !== -1) {
                offset = 1;
            }
        } catch (_offsetErr) { }

        for (var i = 0; i < layerOrder.length; i++) {
            var field = layerOrder[i];
            if (MAP[field] && MAP[field].parent === oldRender) continue;

            var idx = offset + i;
            if (idx < childCount) {
                try {
                    MAP[field] = oldRender.getChildAt(idx);
                    continue;
                } catch (_assignFromIndexErr) { }
            }
        }

        function ensureLayer(fieldName, mouseChildren) {
            if (MAP[fieldName] && MAP[fieldName].parent === oldRender) return;
            if (typeof MAP.addNewLayer !== "function") return;
            try {
                MAP[fieldName] = MAP.addNewLayer(!!mouseChildren);
            } catch (_createLayerErr) { }
        }

        ensureLayer("_BUILDINGBASES", true);
        ensureLayer("_BUILDINGFOOTPRINTS", false);
        if (!MAP._BUILDINGTOPS || MAP._BUILDINGTOPS.parent !== oldRender) {
            ensureLayer("_BUILDINGTOPS", true);
        }
        ensureLayer("_GIBLETS", false);
        ensureLayer("_MISSILE_RETICLE", false);
        ensureLayer("_GROUND_ATTACK_RETICLE", false);
        ensureLayer("_PROJECTILE_EFFECTS", false);
        ensureLayer("_UI_ORDERS", false);
        ensureLayer("_PROJECTILES", false);
        ensureLayer("_PROJECTILE_HITBOXES", true);
        ensureLayer("_AIRUNITS", true);
        ensureLayer("_BUILDINGINFO", true);
        ensureLayer("_EFFECTSTOP", false);
        ensureLayer("_FULLSCREENOVERLAY", false);
        ensureLayer("_OUTSIDE_BASE_FOG", false);

        if (MAP._OUTSIDE_BASE_FOG) {
            try {
                MAP._OUTSIDE_BASE_FOG.mouseEnabled = true;
            } catch (_fogMouseErr) { }
        }
    }

    function patchMapLayerCallSafety() {
        var hx = window._hx_classes || {};
        var MAP = hx["com.cc.core.MAP"];
        if (!MAP || MAP.__patchedMapLayerCallSafety) return;

        ensureMapLayerRefs(MAP);

        if (typeof MAP.updateOutsideBaseFog === "function") {
            var originalUpdateOutsideBaseFog = MAP.updateOutsideBaseFog;
            MAP.updateOutsideBaseFog = function () {
                try {
                    ensureMapLayerRefs(MAP);
                    if (!MAP._OUTSIDE_BASE_FOG) return;
                    return originalUpdateOutsideBaseFog.apply(this, arguments);
                } catch (e) {
                    if (!MAP.__patchedOutsideFogWarned) {
                        MAP.__patchedOutsideFogWarned = true;
                        console.warn("[PATCH V33] MAP.updateOutsideBaseFog suppressed:", e);
                    }
                    return;
                }
            };
        }

        if (typeof MAP.updateBaseEdges === "function") {
            var originalUpdateBaseEdges = MAP.updateBaseEdges;
            MAP.updateBaseEdges = function () {
                try {
                    if (!MAP._BASE_EDGES) return;
                    return originalUpdateBaseEdges.apply(this, arguments);
                } catch (e2) {
                    if (!MAP.__patchedBaseEdgesWarned) {
                        MAP.__patchedBaseEdgesWarned = true;
                        console.warn("[PATCH V33] MAP.updateBaseEdges suppressed:", e2);
                    }
                    return;
                }
            };
        }

        if (typeof MAP.updateBaseEdgesAndOutsideFog === "function") {
            var originalUpdateBaseEdgesAndOutsideFog = MAP.updateBaseEdgesAndOutsideFog;
            MAP.updateBaseEdgesAndOutsideFog = function () {
                try {
                    ensureMapLayerRefs(MAP);
                    return originalUpdateBaseEdgesAndOutsideFog.apply(this, arguments);
                } catch (e3) {
                    if (!MAP.__patchedEdgesAndFogWarned) {
                        MAP.__patchedEdgesAndFogWarned = true;
                        console.warn("[PATCH V33] MAP.updateBaseEdgesAndOutsideFog suppressed:", e3);
                    }
                    return;
                }
            };
        }

        MAP.__patchedMapLayerCallSafety = true;
        console.log("[PATCH V33] MAP layer call safety enabled.");
    }

    function patchHexMapSafety() {
        var hx = window._hx_classes || {};
        var HexMap = hx["com.cc.models.HexMap"];
        if (!HexMap || !HexMap.prototype || HexMap.prototype.__patchedHexMapSafety) return;

        var proto = HexMap.prototype;

        function safeFinishHexMap(instance) {
            if (!instance) return;
            try {
                instance._cellData = null;
                if (!instance._cells) instance._cells = [];
                instance._numCells = 0;
                instance._currentIndex = 0;
                instance._hasInitializedHeader = true;
                if (typeof instance.markHeaderLoaded === "function") {
                    try {
                        instance.markHeaderLoaded();
                        return;
                    } catch (_markHeaderErr) { }
                }
                instance._isDoneLoading = true;
            } catch (_safeFinishErr) { }
        }

        function hasReadableByteInterface(data) {
            if (!data || typeof data !== "object") return false;
            if (typeof data.readByte !== "function") return false;
            if (typeof data.position === "undefined") return false;
            if (typeof data.length === "undefined") return false;
            return true;
        }

        if (typeof proto.initData === "function") {
            var originalInitData = proto.initData;
            proto.initData = function (data) {
                if (!hasReadableByteInterface(data)) {
                    if (!this.__patchV33HexMapBadDataLogged) {
                        this.__patchV33HexMapBadDataLogged = true;
                        console.warn("[PATCH V33] HexMap.initData received unreadable payload; marking map data as loaded.");
                    }
                    safeFinishHexMap(this);
                    return;
                }
                try {
                    return originalInitData.apply(this, arguments);
                } catch (e) {
                    if (!this.__patchV33HexMapInitWarned) {
                        this.__patchV33HexMapInitWarned = true;
                        console.warn("[PATCH V33] HexMap.initData suppressed:", e);
                    }
                    safeFinishHexMap(this);
                    return;
                }
            };
        }

        if (typeof proto.processData === "function") {
            var originalProcessData = proto.processData;
            proto.processData = function () {
                if (this._cellData && !hasReadableByteInterface(this._cellData)) {
                    if (!this.__patchV33HexMapProcessBadDataLogged) {
                        this.__patchV33HexMapProcessBadDataLogged = true;
                        console.warn("[PATCH V33] HexMap.processData skipping unreadable cell data.");
                    }
                    safeFinishHexMap(this);
                    return;
                }
                try {
                    return originalProcessData.apply(this, arguments);
                } catch (e2) {
                    if (!this.__patchV33HexMapProcessWarned) {
                        this.__patchV33HexMapProcessWarned = true;
                        console.warn("[PATCH V33] HexMap.processData suppressed:", e2);
                    }
                    safeFinishHexMap(this);
                    return;
                }
            };
        }

        if (typeof proto.initializeAndShowMap === "function") {
            var originalInitializeAndShowMap = proto.initializeAndShowMap;
            proto.initializeAndShowMap = function (callback, arg1, arg2) {
                try {
                    return originalInitializeAndShowMap.apply(this, arguments);
                } catch (e3) {
                    if (!this.__patchV33HexMapInitializeWarned) {
                        this.__patchV33HexMapInitializeWarned = true;
                        console.warn("[PATCH V33] HexMap.initializeAndShowMap suppressed:", e3);
                    }
                    safeFinishHexMap(this);
                    try {
                        if (typeof callback === "function") callback(arg1, arg2);
                    } catch (_callbackErr) { }
                    return;
                }
            };
        }

        HexMap.prototype.__patchedHexMapSafety = true;
        console.log("[PATCH V33] HexMap safety enabled.");
    }

    function _cleanDetachedBaseRender(MAP, detachedGround) {
        if (!MAP || !detachedGround || typeof detachedGround.get_numChildren !== "function") return false;
        var detachedRemoved = false;
        try {
            var childCount = detachedGround.get_numChildren();
            if (!childCount || childCount <= 0 || typeof detachedGround.getChildAt !== "function") return false;

            for (var i = childCount - 1; i >= 0; i--) {
                var child = null;
                try {
                    child = detachedGround.getChildAt(i);
                } catch (_detachedGetErr) {
                    continue;
                }
                if (!child) continue;
                if (child === MAP._oldRender) continue;
                if (typeof detachedGround.removeChild === "function") {
                    detachedGround.removeChild(child);
                    detachedRemoved = true;
                }
            }
        } catch (_cleanDetachedErr) { }
        return detachedRemoved;
    }

    function reconcileDetachedBaseRender() {
        var hx = window._hx_classes || {};
        var BASE = hx["BASE"];
        var MAP = hx["com.cc.core.MAP"];
        if (!BASE || !MAP || !BASE._buildingsAll || typeof BASE._buildingsAll.iterator !== "function") return;
        if (!MAP._GROUND || !MAP._oldRender) return;

        ensureMapLayerRefs(MAP);

        try {
            if (
                MAP._BUILDINGTOPS &&
                MAP._OUTSIDE_BASE_FOG &&
                MAP._BUILDINGTOPS.parent === MAP._oldRender &&
                typeof MAP._BUILDINGTOPS.get_numChildren === "function" &&
                MAP._BUILDINGTOPS.get_numChildren() > 0
            ) {
                return;
            }
        } catch (_topsCountErr) { }

        var iterator = BASE._buildingsAll.iterator();
        var detachedOldRender = null;
        var detachedGround = null;
        var detachedTopLayer = null;
        var topLayerBuckets = [];

        function bumpTopLayerBucket(layer) {
            if (!layer) return;
            for (var bi = 0; bi < topLayerBuckets.length; bi++) {
                if (topLayerBuckets[bi].layer === layer) {
                    topLayerBuckets[bi].count++;
                    return;
                }
            }
            topLayerBuckets.push({ layer: layer, count: 1 });
        }

        var checks = 0;
        while (
            iterator &&
            iterator.keys &&
            typeof iterator.keys.hasNext === "function" &&
            iterator.keys.hasNext() &&
            checks < 256
        ) {
            var key = iterator.keys.next();
            checks++;
            var building = iterator.map && iterator.map.h ? iterator.map.h[key] : null;
            if (!building || typeof building.get_sprite !== "function") continue;

            var sprite = null;
            try {
                sprite = building.get_sprite();
            } catch (_getSpriteErr) {
                continue;
            }
            if (!sprite || !sprite.parent) continue;

            var p0 = sprite.parent;
            var p1 = p0 ? p0.parent : null;
            var p2 = p1 ? p1.parent : null;
            var p2Class = p2 && p2.__class__ && p2.__class__.__name__ ? String(p2.__class__.__name__) : "";

            var candidateOldRender = null;
            var candidateGround = null;
            if (
                p1 &&
                p2 &&
                !p2.parent &&
                p0 !== MAP._BUILDINGTOPS &&
                p2Class.toLowerCase().indexOf("groundsprite") !== -1
            ) {
                candidateOldRender = p1;
                candidateGround = p2;
            } else if (p1 && !p1.parent && p0 !== MAP._BUILDINGTOPS) {
                candidateOldRender = p1;
                candidateGround = null;
            }
            if (!candidateOldRender) continue;

            if (!detachedOldRender) {
                detachedOldRender = candidateOldRender;
                detachedGround = candidateGround;
            }
            if (candidateOldRender !== detachedOldRender) continue;
            if (!detachedGround && candidateGround) detachedGround = candidateGround;

            bumpTopLayerBucket(p0);
        }

        if (topLayerBuckets.length > 0) {
            topLayerBuckets.sort(function (a, b) { return b.count - a.count; });
            detachedTopLayer = topLayerBuckets[0].layer;
        }

        if (!detachedOldRender) {
            if (
                MAP.__detachedRenderResolvedFor &&
                MAP._BUILDINGTOPS &&
                MAP._OUTSIDE_BASE_FOG &&
                MAP._BUILDINGTOPS.parent === MAP._oldRender
            ) {
                MAP.__detachedRenderResolvedFor = null;
            }
            return;
        }
        var resolvedGroundMatches = !detachedGround || MAP.__detachedGroundResolvedFor === detachedGround;

        if (
            MAP.__detachedRenderResolvedFor === detachedOldRender &&
            resolvedGroundMatches &&
            MAP._oldRender === detachedOldRender &&
            MAP._BUILDINGTOPS &&
            MAP._OUTSIDE_BASE_FOG &&
            MAP._BUILDINGTOPS.parent === MAP._oldRender
        ) {
            return;
        }

        try {
            var activeGround = MAP._GROUND;
            var activeOldRender = MAP._oldRender;
            if (!activeGround || !activeGround.parent) return;

            if (detachedOldRender.parent && detachedOldRender.parent !== activeGround && typeof detachedOldRender.parent.removeChild === "function") {
                detachedOldRender.parent.removeChild(detachedOldRender);
            }
            if (detachedOldRender.parent !== activeGround && typeof activeGround.addChild === "function") {
                activeGround.addChild(detachedOldRender);
            }

            MAP._oldRender = detachedOldRender;
            ensureMapLayerRefs(MAP);
            if (detachedTopLayer && detachedTopLayer.parent === MAP._oldRender) {
                MAP._BUILDINGTOPS = detachedTopLayer;
            }

            try {
                if (
                    activeOldRender &&
                    activeOldRender !== detachedOldRender &&
                    activeOldRender.parent === activeGround &&
                    typeof activeOldRender.get_numChildren === "function" &&
                    activeOldRender.get_numChildren() <= 32
                ) {
                    activeGround.removeChild(activeOldRender);
                }
            } catch (_removeOldRenderErr) { }

            if (detachedGround) {
                _cleanDetachedBaseRender(MAP, detachedGround);
            }

            try {
                if (typeof MAP.SortDepth === "function") MAP.SortDepth();
            } catch (_sortErr) { }

            MAP.__detachedRenderResolvedFor = detachedOldRender;
            MAP.__detachedGroundResolvedFor = detachedGround || activeGround;
            console.warn("[PATCH V33] Rebound detached base render tree to active MAP layers.");
        } catch (e) {
            if (!MAP.__detachedRenderRebindWarned) {
                MAP.__detachedRenderRebindWarned = true;
                console.warn("[PATCH V33] Detached render rebind failed:", e);
            }
        }
    }

    function synthesizeWorldmapControllerData(controller) {
        if (!controller) return false;

        var hx = window._hx_classes || {};
        var VisibleSectorUpdate = hx["com.kixeye.net.proto.atlas.VisibleSectorUpdate"];
        var Sector = hx["com.kixeye.net.proto.atlas.Sector"];
        var Region = hx["com.kixeye.net.proto.atlas.Region"];
        var RegionTemplate = hx["com.kixeye.net.proto.atlas.RegionTemplate"];
        var VisibleEntityUpdate = hx["com.kixeye.net.proto.atlas.VisibleEntityUpdate"];
        var MapEntity = hx["com.kixeye.net.proto.atlas.MapEntity"];
        var Coord = hx["com.kixeye.net.proto.atlas.Coord"];
        var Attribute = hx["com.kixeye.net.proto.atlas.Attribute"];

        if (!VisibleSectorUpdate || !Sector || !Region || !RegionTemplate || !VisibleEntityUpdate || !MapEntity || !Coord || !Attribute) {
            return false;
        }

        try {
            var sectorId = 1;
            var regionId = 1;
            var mapId = 1;
            var checksum = 10101;
            var playerId = 123456;
            var homeEntityId = 500001;

            try {
                if (window.ja && window.ja.playerInfo) {
                    if (typeof window.ja.playerInfo.get_id === "function") {
                        var pid = window.ja.playerInfo.get_id();
                        if (pid != null) playerId = pid;
                    }
                    if (typeof window.ja.playerInfo.get_homeBaseEntityId === "function") {
                        var hid = window.ja.playerInfo.get_homeBaseEntityId();
                        if (hid != null && hid !== 0) homeEntityId = hid;
                    }
                }
            } catch (_playerInfoErr) { }

            if (typeof controller.getSectorData === "function") {
                try {
                    controller.getSectorData();
                } catch (_sectorDataErr) { }
            }

            var visibleSectorUpdate = new VisibleSectorUpdate();
            var sector = new Sector();
            sector.set_id(sectorId);
            sector.set_type(1);
            sector.set_mapId(mapId);

            var region = new Region();
            region.set_id(regionId);
            region.set_templateChecksum(checksum);
            sector.get_regions().push(region);
            visibleSectorUpdate.get_sectors().push(sector);

            if (typeof controller.onVisibleSectorUpdate === "function") {
                controller.onVisibleSectorUpdate({ update: visibleSectorUpdate });
            }

            var regionTemplate = new RegionTemplate();
            regionTemplate.set_checksum(checksum);
            regionTemplate.set_layout(3);
            regionTemplate.set_stride(1);
            regionTemplate.set_cells([0]);
            if (typeof controller.onRegionTemplate === "function") {
                controller.onRegionTemplate(regionTemplate);
            }

            if (typeof controller.OnSharedConfigsInfo === "function") {
                controller.OnSharedConfigsInfo({ configs: [] });
            }

            var visibleEntityUpdate = new VisibleEntityUpdate();
            var homeBase = new MapEntity();
            homeBase.set_entityId(homeEntityId);
            homeBase.set_type(1);
            homeBase.set_ownerId(playerId);
            homeBase.set_status(1);

            var coord = new Coord();
            coord.set_sector(sectorId);
            coord.set_region(regionId);
            coord.set_x(500);
            coord.set_y(500);
            homeBase.set_coord(coord);

            var attrDp = new Attribute();
            attrDp.set_key("dp");
            attrDp.set_value("0");
            homeBase.get_attributes().push(attrDp);

            var attrThorium = new Attribute();
            attrThorium.set_key("thoriumTotal");
            attrThorium.set_value("0");
            homeBase.get_attributes().push(attrThorium);

            visibleEntityUpdate.get_entities().push(homeBase);
            if (typeof controller.onVisibleEntityUpdate === "function") {
                controller.onVisibleEntityUpdate({
                    get_response: function () { return visibleEntityUpdate; }
                });
            }

            if (typeof controller.receivedDepositInfo === "function") {
                try {
                    controller.receivedDepositInfo(false);
                } catch (_depositErr) { }
            }

            if (typeof controller.onTuningDataError === "function") {
                try {
                    controller.onTuningDataError({});
                } catch (_tuningErr) { }
            }

            // Safety: if any expected flag still did not flip due intermediate runtime errors,
            // force them true to allow the map loading state machine to complete.
            if (!controller._hasHomeBaseData) controller._hasHomeBaseData = true;
            if (!controller._hasMapHeader) controller._hasMapHeader = true;
            if (!controller._hasSharedConfigs) controller._hasSharedConfigs = true;
            if (!controller._hasBaseInfo) controller._hasBaseInfo = true;
            if (!controller._hasVisibleEntityInfo) controller._hasVisibleEntityInfo = true;
            if (!controller._hasDepositInfo) controller._hasDepositInfo = true;
            if (!controller._hasTuningData) controller._hasTuningData = true;

            if (typeof controller.get_hasReceivedAllInfo === "function") {
                return !!controller.get_hasReceivedAllInfo();
            }

            return !!(controller._hasHomeBaseData && controller._hasMapHeader && controller._hasSharedConfigs && controller._hasBaseInfo && controller._hasVisibleEntityInfo && controller._hasDepositInfo && controller._hasTuningData);
        } catch (e) {
            console.warn("[PATCH V33] Synthetic worldmap bootstrap failed:", e);
            return false;
        }
    }

    function trySyntheticWorldmapBootstrap() {
        if (window.__PATCH_V33_SYNTH_WM_DONE__) return;
        if (!window._hx_classes) return;

        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        var controller = Worldmap && Worldmap._controller ? Worldmap._controller : null;
        if (!controller) return;

        try {
            if (typeof controller.get_hasReceivedAllInfo === "function" && controller.get_hasReceivedAllInfo()) {
                window.__PATCH_V33_SYNTH_WM_DONE__ = true;
                return;
            }
        } catch (_readyErr) { }

        var elapsedMs = window.game_boot_started ? (Date.now() - window.game_boot_started) : 0;
        if (elapsedMs < WORLDMAP_SYNTHETIC_BOOTSTRAP_MIN_MS) return;

        var traffic = window.__PATCH_V33_GATEWAY_TRAFFIC__ || {};
        var outboundCount = traffic.outboundCount || 0;
        var inboundCount = traffic.inboundCount || 0;
        var lastOutboundMs = traffic.lastOutboundMs || 0;
        var lastInboundMs = traffic.lastInboundMs || 0;
        var now = Date.now();

        var noInboundAfterOutbound = outboundCount >= 3 &&
            lastOutboundMs > 0 &&
            (now - lastOutboundMs) > 1500 &&
            (inboundCount === 0 || (lastInboundMs > 0 && (now - lastInboundMs) > 12000));
        var longTimeout = elapsedMs > 90000;

        if (!noInboundAfterOutbound && !longTimeout) return;

        var attempts = window.__PATCH_V33_SYNTH_WM_ATTEMPTS__ || 0;
        var lastAttemptMs = window.__PATCH_V33_SYNTH_WM_LAST_ATTEMPT_MS__ || 0;
        if (attempts >= 4) return;
        if ((now - lastAttemptMs) < 5000) return;

        window.__PATCH_V33_SYNTH_WM_ATTEMPTS__ = attempts + 1;
        window.__PATCH_V33_SYNTH_WM_LAST_ATTEMPT_MS__ = now;

        var ok = synthesizeWorldmapControllerData(controller);
        if (ok) {
            window.__PATCH_V33_SYNTH_WM_DONE__ = true;
            console.warn("[PATCH V33] Synthetic worldmap bootstrap succeeded (attempt " + (attempts + 1) + ").");
        } else if (attempts < 2) {
            console.warn("[PATCH V33] Synthetic worldmap bootstrap attempt failed (" + (attempts + 1) + ").");
        }
    }

    function clearConnectionPopups() {
        var hx = window._hx_classes || {};
        var GLOBAL = hx["GLOBAL"];
        var PLEASEWAIT = hx["PLEASEWAIT"];
        if (!GLOBAL) return;

        try {
            if (GLOBAL.get_isHalted && GLOBAL.get_isHalted()) {
                var reason = "";
                try {
                    reason = GLOBAL.get_haltReason ? GLOBAL.get_haltReason() : "";
                } catch (e) { }
                if (String(reason || "").length === 0 || String(reason).toLowerCase().indexOf("connection") !== -1 || String(reason).toLowerCase().indexOf("server") !== -1) {
                    if (GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                    console.warn("[PATCH V33] Cleared halted connection state.");
                }
            }
        } catch (haltErr) { }

        try {
            if (PLEASEWAIT && typeof PLEASEWAIT.IsOpen === "function" && PLEASEWAIT.IsOpen()) {
                var isHalted = false;
                try {
                    isHalted = !!(GLOBAL.get_isHalted && GLOBAL.get_isHalted());
                } catch (haltReadErr) { }

                var elapsedMs = window.game_boot_started ? (Date.now() - window.game_boot_started) : 0;
                var shouldHideWait = !isHalted && elapsedMs > 45000;

                var GameClass = hx["GAME"];
                var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
                if (!shouldHideWait && !isHalted && inst && inst.stage && inst.stage.get_numChildren && inst.stage.get_numChildren() > 0) {
                    shouldHideWait = true;
                }

                if (shouldHideWait && typeof PLEASEWAIT.Hide === "function") {
                    PLEASEWAIT.Hide();
                    console.warn("[PATCH V33] Force-hid lingering PLEASEWAIT popup.");
                }
            }
        } catch (pleaseWaitErr) { }

        var layerTop = GLOBAL._layerTop;
        if (!layerTop || !layerTop.get_numChildren) return;

        try {
            for (var i = layerTop.get_numChildren() - 1; i >= 0; i--) {
                var child = layerTop.getChildAt(i);
                var className = (child && child.__class__ && child.__class__.__name__) || "";
                var lower = className.toLowerCase();
                if (lower.indexOf("popupgenericrubi") !== -1 || lower.indexOf("popup_bg") !== -1 || lower.indexOf("popupbg") !== -1) {
                    layerTop.removeChild(child);
                }
            }
        } catch (popupErr) { }
    }

    function patchDisplayListSafety() {
        var hx = window._hx_classes || {};
        var DisplayObjectContainer = hx["openfl.display.DisplayObjectContainer"] ||
            (window.openfl && window.openfl.display && window.openfl.display.DisplayObjectContainer);

        if (!DisplayObjectContainer || !DisplayObjectContainer.prototype || DisplayObjectContainer.prototype.__patchedNullChildSafety) return;

        var proto = DisplayObjectContainer.prototype;
        var warnCounts = window.__PATCH_V33_NULL_CHILD_WARN_COUNTS__ || (window.__PATCH_V33_NULL_CHILD_WARN_COUNTS__ = {});

        function warnOncePerMethod(methodName, argsLen) {
            var count = warnCounts[methodName] || 0;
            if (count < 5) {
                console.warn("[PATCH V33] Suppressed null child in " + methodName + " (args=" + argsLen + ")");
            }
            warnCounts[methodName] = count + 1;
        }

        function wrapFirstArg(methodName) {
            var original = proto[methodName];
            if (typeof original !== "function") return;
            proto[methodName] = function (child) {
                if (child == null) {
                    warnOncePerMethod(methodName, arguments.length);
                    return null;
                }
                return original.apply(this, arguments);
            };
        }

        function wrapTwoArgs(methodName) {
            var original = proto[methodName];
            if (typeof original !== "function") return;
            proto[methodName] = function (childA, childB) {
                if (childA == null || childB == null) {
                    warnOncePerMethod(methodName, arguments.length);
                    return null;
                }
                return original.apply(this, arguments);
            };
        }

        wrapFirstArg("addChild");
        wrapFirstArg("addChildAt");
        wrapFirstArg("removeChild");
        wrapFirstArg("setChildIndex");
        wrapFirstArg("getChildIndex");
        wrapTwoArgs("swapChildren");

        proto.__patchedNullChildSafety = true;
        console.log("[PATCH V33] DisplayObjectContainer null-child safety enabled.");
    }

    function patchDailyMissionHudSafety() {
        var hx = window._hx_classes || {};
        var WidgetDailyMissionContainer = hx["com.cc.widget.WidgetDailyMissionContainer"];
        if (!WidgetDailyMissionContainer || !WidgetDailyMissionContainer.prototype || WidgetDailyMissionContainer.prototype.__patchedMissionHudSafety) return;

        var proto = WidgetDailyMissionContainer.prototype;

        if (typeof proto.regenerate === "function") {
            var originalRegenerate = proto.regenerate;
            proto.regenerate = function () {
                try {
                    return originalRegenerate.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] WidgetDailyMissionContainer.regenerate suppressed:", e);
                    this._shouldRegenerate = false;
                    this._shouldHide = true;
                    try { this.set_visible(false); } catch (vErr) { }
                    try { this.removeChildren(); } catch (rErr) { }
                    return;
                }
            };
        }

        if (typeof proto.tickFast === "function") {
            var originalTickFast = proto.tickFast;
            proto.tickFast = function () {
                try {
                    return originalTickFast.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] WidgetDailyMissionContainer.tickFast suppressed:", e);
                    this._shouldRegenerate = false;
                    this._shouldHide = true;
                    try { this.set_visible(false); } catch (vErr) { }
                    return;
                }
            };
        }

        WidgetDailyMissionContainer.prototype.__patchedMissionHudSafety = true;
        console.log("[PATCH V33] WidgetDailyMissionContainer safety enabled.");
    }

    // --- PATCH: Login Process ---
    // --- PATCH: Login Process ---
    function patchLoginProcess() {
        var LOGIN = (window._hx_classes && window._hx_classes["LOGIN"]);
        if (LOGIN && !LOGIN.__patchedProcess) {
            console.log("[PATCH V32] Hooking LOGIN.Process");
            var originalProcess = LOGIN.Process;
            LOGIN.Process = function (data) {
                console.warn("[ANTIGRAVITY_DEBUG] LOGIN.Process ENTER with data:", data);
                window.__LOGIN_ENTERED = true;
                window.__LOGIN_DATA_VERSION = data.version;

                var GLOBAL = (window._hx_classes && window._hx_classes["GLOBAL"]);
                if (GLOBAL) {
                    window.__GLOBAL_VERSION = GLOBAL._version;
                    window.__GLOBAL_API_URL = GLOBAL._apiURL;
                }

                try {
                    return originalProcess.apply(this, arguments);
                } catch (e) {
                    console.error("[ANTIGRAVITY_DEBUG] Exception in LOGIN.Process:", e);
                    window.__LOGIN_EXCEPTION = e.toString();
                    throw e;
                }
            };
            LOGIN.__patchedProcess = true;
        }

        var Nk = window.com && window.com.cc && window.com.cc.loading && window.com.cc.loading.CDNLoader;
        if (!Nk) {
            Nk = window._hx_classes && window._hx_classes["com.cc.loading.CDNLoader"];
        }

        if (Nk && !Nk.__patchedProgress) {
            console.log("[PATCH V32] Hooking Nk.updateLoadingProgress");
            var originalUpdate = Nk.prototype.updateLoadingProgress;
            var r = window._hx_classes["Reflect"];

            Nk.prototype.updateLoadingProgress = function () {
                // Periodically log status (every 50th call to avoid spam)
                if (!this._logCounter) this._logCounter = 0;
                this._logCounter++;

                if (this._logCounter % 50 === 1) {
                    console.log("[ANTIGRAVITY_DEBUG] Nk.updateLoadingProgress called. Checking loaders:");
                    var loadList = (this.constructor.loadList || Nk.loadList); // Accept both static access patterns
                    if (loadList) {
                        for (var i = 0; i < loadList.length; i++) {
                            var loader = loadList[i];
                            var key = loader.get_CDNKey ? loader.get_CDNKey() : "unknown";
                            var priority = loader.get_priority ? loader.get_priority() : -1;
                            var loaded = loader.hasLoadedData ? loader.hasLoadedData() : false;
                            var required = (priority >= 10);

                            console.log("[ANTIGRAVITY_DEBUG] Loader " + i + ": Key=" + key +
                                ", Prio=" + priority +
                                ", Loaded=" + loaded +
                                ", Req=" + required);
                        }
                    } else {
                        console.warn("[ANTIGRAVITY_DEBUG] Nk.loadList is null/undefined!");
                    }
                }
                return originalUpdate.apply(this, arguments);
            };
            Nk.__patchedProgress = true;
        }
    }

    function patchGameInitParams() {
        var GAME = window._hx_classes && window._hx_classes["GAME"];
        if (!GAME || !GAME.prototype || GAME.prototype.__patchedInitParams || !GAME.prototype.init) return;

        var originalInit = GAME.prototype.init;
        GAME.prototype.init = function () {
            try {
                var info = this.get_loaderInfo ? this.get_loaderInfo() : null;
                if (info) {
                    info.parameters = buildDefaultLoaderParams(info.parameters);
                    if (!this.__loaderParamsPatchedLogged) {
                        this.__loaderParamsPatchedLogged = true;
                        console.warn("[PATCH V33] GAME.init loader params patched.");
                    }
                }
            } catch (paramErr) {
                console.warn("[PATCH V33] GAME.init param patch failed:", paramErr);
            }

            try {
                return originalInit.apply(this, arguments);
            } catch (e) {
                console.warn("[PATCH V33] GAME.init suppressed:", e);
                try {
                    var fallbackInfo = this.get_loaderInfo ? this.get_loaderInfo() : null;
                    var fallbackParams = buildDefaultLoaderParams(fallbackInfo ? fallbackInfo.parameters : null);
                    if (typeof this.Data === "function") this.Data(fallbackParams, false);
                    if (typeof this.setupStage === "function") this.setupStage();
                } catch (fallbackErr) {
                    console.warn("[PATCH V33] GAME.init fallback bootstrap failed:", fallbackErr);
                }
                return;
            }
        };

        GAME.prototype.__patchedInitParams = true;
    }

    function bootstrapGameDataIfMissing() {
        var GAME = window._hx_classes && window._hx_classes["GAME"];
        var GLOBAL = window._hx_classes && window._hx_classes["GLOBAL"];
        if (!GAME || !GAME._instance) return;

        var inst = GAME._instance;
        if (inst.__patchedDataBootstrapDone) return;
        if (GLOBAL && GLOBAL._ROOT) {
            inst.__patchedDataBootstrapDone = true;
            return;
        }
        if (typeof inst.Data !== "function") return;

        try {
            var info = inst.get_loaderInfo ? inst.get_loaderInfo() : null;
            var params = buildDefaultLoaderParams(info ? info.parameters : null);
            console.warn("[PATCH V33] Bootstrapping GAME.Data due to missing GLOBAL._ROOT.");
            inst.Data(params, false);
            if (typeof inst.setupStage === "function") inst.setupStage();
            inst.__patchedDataBootstrapDone = true;
        } catch (e) {
            console.warn("[PATCH V33] GAME.Data bootstrap suppressed:", e);
        }
    }

    // --- PATCH: Time Synchronization ---
    function patchTimeSync() {
        var GLOBAL = (window._hx_classes && window._hx_classes["GLOBAL"]);
        if (!GLOBAL || GLOBAL.__patchedTime) return;

        console.log("DEBUG: patchTimeSync running");
        console.log("DEBUG: GLOBAL is FOUND");
        console.log("[PATCH V33] Hooking GLOBAL.setServerTimestampSeconds & setLocalTimestampSeconds");

            var V = window._hx_classes["com.kixeye.utils.json.IntObfuscator"]; // Attempt to find V, though we might not need it if we reimplement fully

            // Helper to ensure 32-bit int
            function ensureInt(n) {
                return n | 0;
            }

            GLOBAL.setServerTimestampSeconds = function (a) {
                // Mimic original logic but safely
                var p = this;
                var b = p._serverTimeSeconds;
                // Only update if a > current time (retaining original logic check)
                // But first we need to read current time safely
                var currentVal = 0;
                if (b) {
                    var c = b.x ^ b.s;
                    var d = (b.n ^ b.s) - 2 * b.s;
                    if (c == d) currentVal = c;
                }

                if (a > currentVal) {
                    if (!p._serverTimeSeconds) p._serverTimeSeconds = { s: 0, x: 0, n: 0 };
                    b = p._serverTimeSeconds;

                    b.s = (99999 * Math.random()) | 0;
                    b.x = a ^ b.s;
                    b.n = (a + 2 * b.s) ^ b.s;

                    // Also clear remainder? Original did this:
                    if (!p._serverTimeRemainderMs) p._serverTimeRemainderMs = { s: 0, x: 0, n: 0 };
                    var br = p._serverTimeRemainderMs;
                    br.s = (99999 * Math.random()) | 0;
                    br.x = 0 ^ br.s;
                    br.n = (2 * br.s) ^ br.s;

                    // Verify immediately?
                    var checkC = b.x ^ b.s;
                    var checkD = (b.n ^ b.s) - 2 * b.s;
                    if (checkC !== checkD || checkC !== a) {
                        console.warn("[ANTIGRAVITY_DEBUG] setServerTimestampSeconds verification FAILED locally. Expected " + a + " got " + checkC);
                        // Force fix?
                        // If math failed, maybe just trust x?
                    } else {
                        // console.log("[ANTIGRAVITY_DEBUG] setServerTimestampSeconds success: " + a);
                    }
                }
            };

            GLOBAL.setLocalTimestampSeconds = function (a) {
                var p = this;
                if (!p._localTimeSeconds) p._localTimeSeconds = { s: 0, x: 0, n: 0 };
                var b = p._localTimeSeconds;

                b.s = (99999 * Math.random()) | 0;
                b.x = a ^ b.s;
                b.n = (a + 2 * b.s) ^ b.s;

                if (!p._localTimeRemainderMs) p._localTimeRemainderMs = { s: 0, x: 0, n: 0 };
                var br = p._localTimeRemainderMs;
                br.s = (99999 * Math.random()) | 0;
                br.x = 0 ^ br.s;
                br.n = (2 * br.s) ^ br.s;

                console.log("[ANTIGRAVITY_DEBUG] setLocalTimestampSeconds set to: " + a);
            };

            GLOBAL.__patchedTime = true;
    }

    // --- PATCH: Hook Asset Cache ---
    function hookLimeAssets() {
        var Assets = (window._hx_classes && window._hx_classes["openfl.utils.Assets"]) || window.Assets;
        if (Assets && !Assets.__patched) {
            console.log("[PATCH V32] Hooking openfl.utils.Assets");
            var originalGetText = Assets.getText;
            if (originalGetText) {
                Assets.getText = function (id) {
                    var text = null;
                    try {
                        text = originalGetText.apply(this, arguments);
                    } catch (e) {
                        console.warn("[ANTIGRAVITY_DEBUG] Assets.getText error for " + id + ":", e);
                    }

                    // Only fallback when text is genuinely missing.
                    if (text != null && text !== "") return text;

                    if (id === "sheets/icons.json" || id === "sheets/components.json" || id === "sheets/pvprewards_v4.json") {
                        console.warn("[ANTIGRAVITY_DEBUG] Assets.getText fallback for missing " + id);
                        return '{"sheets": [], "mapping": {}}';
                    }

                    return text;
                };
            }

            // Do not force fake ZIP bytes here. Returning invalid ZIP data breaks CDN manifest initialization.
            Assets.__patched = true;
        }
    }

    // --- PATCH: Hook CDN Manifest Data Manager ---
    function hookDb() {
        var Db = window.Db || (window._hx_classes && (
            window._hx_classes["com.kixeye.wc.resources.CDNManifestDataManager"] ||
            window._hx_classes["CDNManifestDataManager"]
        ));
        if (Db) window.Db = Db;
        if (Db && !Db.__patched) {
            console.log("[PATCH V32] Hooking Db.retrieveAssetByName");
            var originalRetrieve = Db.retrieveAssetByName;
            Db.retrieveAssetByName = function (name, callback) {
                var completed = false;

                var wrappedCallback = function (asset) {
                    completed = true;
                    return callback.apply(this, arguments);
                };

                try {
                    originalRetrieve.call(this, name, wrappedCallback);
                } catch (e) {
                    console.warn("[PATCH V33] Db.retrieveAssetByName original threw for " + name + ":", e);
                }

                // Fallback: if CDN manifest lookup never resolves, try local manifest JSON directly.
                setTimeout(function () {
                    if (completed) return;

                    var key = String(name || "");
                    var candidates = [
                        "/manifest/" + key + ".1.json",
                        "/manifest/" + key + ".json",
                        "/manifest/" + key
                    ];

                    // Contract/XML assets can be requested by full path key names.
                    if (key.indexOf("/") !== -1) {
                        candidates.push("/assets/" + key);
                    }

                    var tryFetch = function (idx) {
                        if (completed || idx >= candidates.length) return;

                        var url = rewriteLocalUrl(candidates[idx]);
                        fetch(url)
                            .then(function (r) {
                                if (!r.ok) throw new Error("HTTP " + r.status);
                                return r.text();
                            })
                            .then(function (text) {
                                if (completed) return;

                                var data = null;
                                try {
                                    var trimmed = text.trim();
                                    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                                        data = JSON.parse(trimmed);
                                    } else {
                                        data = text;
                                    }
                                } catch (e) {
                                    data = text;
                                }

                                // Keep payloads in simple, stable shapes for local fallback mode.
                                if (key === "objectives") {
                                    // onObjectivesData expects a serialized string payload and decodes it itself.
                                    data = text;
                                } else if (key === "Buildings") {
                                    if (data && typeof data === "object" && Array.isArray(data.data)) {
                                        data = data.data;
                                    }
                                    if (!Array.isArray(data)) {
                                        data = [];
                                    }
                                    for (var bi = 0; bi < data.length; bi++) {
                                        var bld = data[bi];
                                        if (!bld || typeof bld !== "object" || !Array.isArray(bld.levels)) continue;
                                        for (var li = 0; li < bld.levels.length; li++) {
                                            var lvl = bld.levels[li];
                                            if (!lvl || typeof lvl !== "object") continue;
                                            // BuildingLevelData.SetRequirements expects a semicolon-delimited string.
                                            if (Array.isArray(lvl.re)) {
                                                lvl.re = lvl.re.join(";");
                                            } else if (lvl.re == null) {
                                                lvl.re = "";
                                            } else if (typeof lvl.re !== "string") {
                                                lvl.re = String(lvl.re);
                                            }
                                        }
                                    }
                                } else if (key === "PlatoonPropertiesData" && !Array.isArray(data)) {
                                    data = [];
                                } else if (key === "replicator_sku_data" && (data == null || typeof data !== "object")) {
                                    data = {};
                                }

                                completed = true;
                                console.warn("[PATCH V33] Db.retrieveAssetByName fallback hit for " + key + " via " + candidates[idx]);

                                // Populate CDN manifest cache when possible so future retrievals succeed normally.
                                try {
                                    if (Db._dataStore && Db._dataStore.h) {
                                        Db._dataStore.h[key] = data;
                                    }
                                } catch (cacheErr) {
                                    console.warn("[PATCH V33] Db cache update skipped for " + key + ":", cacheErr);
                                }

                                try {
                                    callback({ name: key, data: data });
                                } catch (cbErr) {
                                    console.error("[PATCH V33] Db.retrieveAssetByName fallback callback error for " + key + ":", cbErr);
                                }
                            })
                            .catch(function () {
                                tryFetch(idx + 1);
                            });
                    };

                    tryFetch(0);
                }, 1500);

                return;
            };
            Db.__patched = true;
        }
    }

    function nudgeBlockingLoaders() {
        var Nk = window._hx_classes && window._hx_classes["com.cc.loading.CDNLoader"];
        if (!Nk || !Nk.loadList || Nk.loadList.length === 0) return;

        var now = Date.now();
        if (!window.__NEXT_LOADER_NUDGE_MS__) window.__NEXT_LOADER_NUDGE_MS__ = now;
        if (now < window.__NEXT_LOADER_NUDGE_MS__) return;
        window.__NEXT_LOADER_NUDGE_MS__ = now + 3000;

        for (var i = 0; i < Nk.loadList.length; i++) {
            var loader = Nk.loadList[i];
            if (!loader || !loader.hasLoadedData || loader.hasLoadedData()) continue;
            var priority = 0;
            try { priority = loader.get_priority ? loader.get_priority() : 0; } catch (prioErr) { }
            if (priority < 10) continue;

            try {
                if (loader.init && loader.init.length === 0) loader.init();
            } catch (e) { }
            try {
                if (loader.load && loader.load.length === 0) loader.load();
            } catch (e2) { }
        }

        // Last-resort normalization for loaders that never transition to loaded in local mode.
        var elapsed = window.game_boot_started ? (now - window.game_boot_started) : 0;
        if (elapsed < 90000) return;

        var forcedAny = false;
        for (var j = 0; j < Nk.loadList.length; j++) {
            var ldr = Nk.loadList[j];
            if (!ldr || !ldr.hasLoadedData || ldr.hasLoadedData()) continue;

            var key = "";
            var prio = 0;
            try { key = ldr.get_CDNKey ? ldr.get_CDNKey() : ""; } catch (e3) { }
            try { prio = ldr.get_priority ? ldr.get_priority() : 0; } catch (e4) { }
            if (prio < 10) continue;

            try {
                if (key === "PlatoonPropertiesData" && ldr.processData) {
                    ldr.processData([]);
                    forcedAny = true;
                    continue;
                }
                if (key === "Buildings" && ldr.handleBuildingData) {
                    ldr.handleBuildingData({ name: "Buildings", data: [] });
                    forcedAny = true;
                    continue;
                }
                if (key === "ui/cards/unit_cards.xml") {
                    ldr.hasLoadedData = function () { return true; };
                    forcedAny = true;
                    continue;
                }
                if (key === "" || key === "en_US") {
                    ldr.hasLoadedData = function () { return true; };
                    forcedAny = true;
                    continue;
                }
            } catch (forceErr) {
                console.warn("[PATCH V33] force loader fallback failed for " + key + ":", forceErr);
            }
        }

        if (forcedAny) {
            try {
                var GameClass = window._hx_classes && window._hx_classes["GAME"];
                var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
                var cdn = inst && inst._cdnLoader;
                if (cdn && cdn.finishedLoadingBlockingData) {
                    cdn.finishedLoadingBlockingData();
                }
            } catch (e5) { }
        }
    }

    function patchBuildingDataSafety() {
        var CB = window._hx_classes && window._hx_classes["com.cc.build.CBuildings"];
        if (!CB || CB.__patchedSafeData) return;

        var fallbackCustomParameters = {
            getParameter: function (name, defaultValue) {
                return defaultValue == null ? 0 : defaultValue;
            }
        };

        function makeLevelData(level, typeId) {
            var lvl = (typeof level === "number" && isFinite(level) && level > 0) ? (level | 0) : 1;
            return {
                level: lvl,
                skuCosts: [],
                get_level: function () { return lvl; },
                hasMountType: function () { return false; },
                hasTrait: function () { return false; },
                get_customParameters: function () { return fallbackCustomParameters; },
                get_hp: function () { return 1000; },
                get_storage: function () { return 1; },
                get_time: function () { return 0; },
                get_r1: function () { return 0; },
                get_r2: function () { return 0; },
                get_r3: function () { return 0; },
                get_xp: function () { return 0; },
                get_rate: function () { return 0; },
                get_lifetimeSec: function () { return 0; },
                get_timeToGoldFormulaMultiplier: function () { return 1800; },
                get_instantGoldCost: function () { return 0; }
            };
        }

        function makeBuildingData(typeId) {
            var tid = (typeof typeId === "number" && isFinite(typeId)) ? (typeId | 0) : 0;
            var levelCache = {};
            return {
                id: tid,
                group: 0,
                classType: 0,
                swapGroup: 0,
                maxLevel: 1,
                quantity: [9999],
                instantiator: null,
                unlockSku: "",
                get_id: function () { return tid; },
                get_name: function () { return "Building " + tid; },
                get_requiresSkuUnlock: function () { return 0; },
                get_levelDataCount: function () { return 2; },
                hasTrait: function (trait) {
                    if (trait === 5 && tid === 14) return true; // command center fallback
                    if (trait === 8 && (tid === 17 || tid === 249 || tid === 250)) return true; // wall fallback
                    return false;
                },
                getLevelData: function (level) {
                    var lvl = (typeof level === "number" && isFinite(level) && level > 0) ? (level | 0) : 1;
                    if (!levelCache[lvl]) levelCache[lvl] = makeLevelData(lvl, tid);
                    return levelCache[lvl];
                }
            };
        }

        var fallbackDataCache = {};
        var originalGetData = CB.GetData;
        if (originalGetData) {
            CB.GetData = function (typeId) {
                var num = Number(typeId);
                if (!isFinite(num)) num = 0;
                var idx = num | 0;

                var data = null;
                try {
                    data = originalGetData.call(this, idx);
                } catch (e) { }

                if (data != null) return data;
                if (!fallbackDataCache[idx]) fallbackDataCache[idx] = makeBuildingData(idx);
                return fallbackDataCache[idx];
            };
        }

        var originalGetLevelData = CB.GetLevelData;
        if (originalGetLevelData) {
            CB.GetLevelData = function (typeId, level) {
                try {
                    var value = originalGetLevelData.apply(this, arguments);
                    if (value != null) return value;
                } catch (e) { }
                return makeBuildingData(Number(typeId) | 0).getLevelData(level);
            };
        }

        if (CB.isWall) {
            var originalIsWall = CB.isWall;
            CB.isWall = function (typeId) {
                try {
                    return !!originalIsWall.apply(this, arguments);
                } catch (e) {
                    var n = Number(typeId) | 0;
                    return n === 17 || n === 249 || n === 250;
                }
            };
        }

        if (CB.isCommandCenter) {
            var originalIsCommandCenter = CB.isCommandCenter;
            CB.isCommandCenter = function (typeId) {
                try {
                    return !!originalIsCommandCenter.apply(this, arguments);
                } catch (e) {
                    return (Number(typeId) | 0) === 14;
                }
            };
        }

        CB.__patchedSafeData = true;
    }

    function patchBaseSafety() {
        var BASE = window._hx_classes && window._hx_classes["BASE"];
        if (!BASE || BASE.__patchedSafeBase) return;

        if (BASE.countImportantBuildings) {
            var originalCountImportantBuildings = BASE.countImportantBuildings;
            BASE.countImportantBuildings = function (data) {
                try {
                    return originalCountImportantBuildings.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] BASE.countImportantBuildings fallback:", e);
                    var count = 0;
                    if (data && typeof data === "object") {
                        var keys = Object.keys(data);
                        for (var i = 0; i < keys.length; i++) {
                            var item = data[keys[i]];
                            if (!item || typeof item !== "object") continue;
                            var typeId = Number(item.t != null ? item.t : item.type);
                            if (!isFinite(typeId)) continue;

                            var isWall = false;
                            try {
                                var CB = window._hx_classes && window._hx_classes["com.cc.build.CBuildings"];
                                isWall = !!(CB && CB.isWall && CB.isWall(typeId));
                            } catch (wallErr) { }

                            if (!isWall) count++;
                        }
                    }
                    return count;
                }
            };
        }

        BASE.__patchedSafeBase = true;
    }

    function patchDefenderFireteamSafety() {
        var hx = window._hx_classes;
        if (!hx) return;

        function createFallbackSquad() {
            return {
                get_Roster: function () { return null; },
                GetUnitList: function () { return []; },
                get_UnitCount: function () { return 0; },
                ClearSquad: function () { },
                UpdateWith_Squad: function () { }
            };
        }

        function createFallbackHomeBaseDefender() {
            var properties = {
                get_group: function () { return 0; },
                get_type: function () { return 2; },
                get_isUnique: function () { return 1; },
                get_repairSetId: function () { return 0; }
            };

            var obj = {
                _fireteams: [],
                _squads: [createFallbackSquad()],
                assignFireteams: function (list) { this._fireteams = Array.isArray(list) ? list : []; },
                get_fireteams: function () { return this._fireteams; },
                addFireteam: function (model) { if (model != null) this._fireteams.push(model); },
                removeAllFireTeams: function () { this._fireteams = []; },
                exportFireteamsArray: function () { return this._fireteams; },
                get_SquadList: function () { return this._squads; },
                get_SquadCount: function () { return this._squads.length; },
                GetSquad: function (index) { return this._squads[index] || null; },
                setSquadsToLength: function (count) {
                    count = count | 0;
                    if (count < 0) count = 0;
                    while (this._squads.length < count) this._squads.push(createFallbackSquad());
                    if (this._squads.length > count) this._squads.length = count;
                },
                get_UnitList: function () { return []; },
                GetUnitList: function () { return []; },
                getTopUnitList: function () { return []; },
                GetUnitByID: function () { return null; },
                get_properties: function () { return properties; },
                get_type: function () { return 2; },
                get_state: function () { return 0; },
                get_isDeployable: function () { return 0; },
                get_isViewable: function () { return 0; },
                get_isAircraftPlatoon: function () { return 0; },
                get_isAirDefenderPlatoon: function () { return 0; },
                get_ID: function () { return "p2"; },
                get_Name: function () { return "Home Base Defender"; },
                set_Name: function () { },
                get_Repairing: function () { return 0; },
                get_needsRepair: function () { return 0; },
                appendToItemRepairedLog: function () { },
                unitListEnter: function () { },
                UnitEnter: function () { },
                Load_From_AbstractUnitList: function () { },
                ConvertToData: function () { return {}; },
                UpdateWith_Data: function () { },
                GS_To_Base: function () { },
                Base_To_GS: function () { },
                isInBattle: function () { return false; },
                get_capacityUsed: function () { return 0; },
                get_singleUseCapacityUsed: function () { return 0; }
            };

            return obj;
        }

        var platoonManagerClass = hx["com.cc.units.PlatoonManager"] || hx["PlatoonManager"];
        var patchedHomeDefender = 0;
        if (platoonManagerClass && platoonManagerClass.prototype && !platoonManagerClass.prototype.__patchedSafeHomeBaseDefender) {
            var originalGetHomeBaseDefender = platoonManagerClass.prototype.get_HomeBaseDefender;
            if (typeof originalGetHomeBaseDefender === "function") {
                platoonManagerClass.prototype.get_HomeBaseDefender = function () {
                    var defender = null;
                    try {
                        defender = originalGetHomeBaseDefender.apply(this, arguments);
                    } catch (e) {
                        console.warn("[PATCH V33] get_HomeBaseDefender suppressed:", e);
                    }

                    if (defender != null) return defender;

                    if (!this.__fallbackHomeBaseDefender) {
                        this.__fallbackHomeBaseDefender = createFallbackHomeBaseDefender();
                    }
                    return this.__fallbackHomeBaseDefender;
                };
                platoonManagerClass.prototype.__patchedSafeHomeBaseDefender = true;
                patchedHomeDefender = 1;
            }
        }

        var keys = Object.keys(hx);
        var patchedProcessCount = 0;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var Cls = hx[key];
            if (!Cls || !Cls.prototype || Cls.prototype.__patchedSafeDefenderFireteams) continue;
            if (typeof Cls.prototype.ProcessBaseDefenderData !== "function") continue;

            var originalProcessBaseDefenderData = Cls.prototype.ProcessBaseDefenderData;
            Cls.prototype.ProcessBaseDefenderData = function () {
                try {
                    return originalProcessBaseDefenderData.apply(this, arguments);
                } catch (e2) {
                    var msg = String((e2 && e2.message) || e2 || "");
                    if (msg.indexOf("assignFireteams") !== -1) {
                        console.warn("[PATCH V33] ProcessBaseDefenderData suppressed assignFireteams crash:", e2);
                        return [];
                    }
                    throw e2;
                }
            };

            Cls.prototype.__patchedSafeDefenderFireteams = true;
            patchedProcessCount++;
        }

        if (!window.__PATCH_V33_DEFENDER_FIRETEAM_LOGGED__ && (patchedProcessCount > 0 || patchedHomeDefender > 0)) {
            window.__PATCH_V33_DEFENDER_FIRETEAM_LOGGED__ = true;
            console.log("[PATCH V33] Defender safety patched: ProcessBaseDefenderData=" + patchedProcessCount + ", get_HomeBaseDefender=" + patchedHomeDefender);
        }
    }

    function patchFootprintSafety() {
        var BF = window._hx_classes && window._hx_classes["com.cc.build.BldgFoundation"];
        if (!BF || !BF.prototype || BF.prototype.__patchedSafeFootprint) return;

        if (BF.prototype.addFootprintToGrid) {
            var originalAddFootprintToGrid = BF.prototype.addFootprintToGrid;
            BF.prototype.addFootprintToGrid = function () {
                try {
                    return originalAddFootprintToGrid.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] BldgFoundation.addFootprintToGrid suppressed:", e);
                    return;
                }
            };
        }

        if (BF.prototype.removeFootprintFromGrid) {
            var originalRemoveFootprintFromGrid = BF.prototype.removeFootprintFromGrid;
            BF.prototype.removeFootprintFromGrid = function () {
                try {
                    return originalRemoveFootprintFromGrid.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] BldgFoundation.removeFootprintFromGrid suppressed:", e);
                    return;
                }
            };
        }

        BF.prototype.__patchedSafeFootprint = true;
    }

    function patchPlatoonManifestDefaults() {
        var PM = window._hx_classes && window._hx_classes["com.cc.units.PlatoonPropManifest"];
        if (!PM || !PM.prototype || PM.__patchedDefaults) return;

        var originalGet = PM.prototype.getPlatoonPropertiesForType;
        PM.prototype.getPlatoonPropertiesForType = function (type) {
            var value = null;
            try {
                value = originalGet.apply(this, arguments);
            } catch (e) { }
            if (value) return value;

            if (type === 1) {
                return {
                    get_type: function () { return 1; },
                    get_isUnique: function () { return 0; },
                    get_uniqueId: function () { return "default"; },
                    getRandomPlatoonName: function () { return "Platoon"; },
                    get_platoonNames: function () { return ["Platoon"]; }
                };
            }
            return value;
        };

        PM.__patchedDefaults = true;
    }

    function patchBattleSafety() {
        var Battle = window._hx_classes && window._hx_classes["com.cc.battle.Battle"];
        if (!Battle || !Battle.prototype || Battle.prototype.__patchedSafeDeploy) return;

        if (Battle.prototype.DeployUnit) {
            var originalDeployUnit = Battle.prototype.DeployUnit;
            Battle.prototype.DeployUnit = function (unit) {
                if (!unit || typeof unit.get_uid !== "function") {
                    console.warn("[PATCH V33] Battle.DeployUnit skipped null/invalid unit payload.");
                    return null;
                }
                try {
                    return originalDeployUnit.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] Battle.DeployUnit suppressed:", e);
                    return null;
                }
            };
        }

        if (Battle.prototype.DeployUnitFromBuilding) {
            var originalDeployUnitFromBuilding = Battle.prototype.DeployUnitFromBuilding;
            Battle.prototype.DeployUnitFromBuilding = function (unitData, building, queueOrder) {
                if (!unitData || typeof unitData.get_uid !== "function") return;
                try {
                    return originalDeployUnitFromBuilding.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] Battle.DeployUnitFromBuilding suppressed:", e);
                    return;
                }
            };
        }

        Battle.prototype.__patchedSafeDeploy = true;
    }

    function patchReticleSafety() {
        var MechMercReticle = window._hx_classes && window._hx_classes["com.cc.ui.reticles.MechMercReticle"];
        if (!MechMercReticle || !MechMercReticle.prototype || MechMercReticle.prototype.__patchedSafeChangeMode) return;

        if (MechMercReticle.prototype.changeMode) {
            var originalChangeMode = MechMercReticle.prototype.changeMode;
            MechMercReticle.prototype.changeMode = function () {
                try {
                    return originalChangeMode.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] MechMercReticle.changeMode suppressed:", e);
                    try {
                        if (this.get_activeContainer) {
                            var container = this.get_activeContainer();
                            if (container && container.set_visible) container.set_visible(false);
                        }
                    } catch (hideErr) { }
                    return;
                }
            };
        }

        MechMercReticle.prototype.__patchedSafeChangeMode = true;
    }

    function patchSwfAssetBitmapFallback() {
        var hx = window._hx_classes;
        var SwfAsset = hx && hx["com.cc.assets.SwfAsset"];
        if (!SwfAsset || !SwfAsset.prototype || SwfAsset.prototype.__patchedSafeBitmapLookup) return;

        var Bitmap = hx["openfl.display.Bitmap"];
        var BitmapData = hx["openfl.display.BitmapData"];
        var MovieClip = hx["openfl.display.MovieClip"] || hx["openfl.display.Sprite"];
        if (!Bitmap || !BitmapData || !SwfAsset.prototype.getBitmapFromClassName) return;

        var originalGetBitmap = SwfAsset.prototype.getBitmapFromClassName;
        var bitmapDataCache = {};

        function hashColor(key) {
            var h = 0;
            for (var i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
            var r = (h >>> 16) & 255;
            var g = (h >>> 8) & 255;
            var b = h & 255;
            return ((255 << 24) | (r << 16) | (g << 8) | b) >>> 0;
        }

        function pickSize(name) {
            var n = String(name || "").toLowerCase();
            if (n.indexOf("bar") !== -1) return { w: 128, h: 8 };
            if (n.indexOf("button") !== -1 || n.indexOf("btn") !== -1) return { w: 64, h: 32 };
            if (n.indexOf("icon") !== -1 || n.indexOf("indicator") !== -1) return { w: 16, h: 16 };
            return { w: 8, h: 8 };
        }

        function getFallbackBitmapData(name) {
            var key = String(name || "__null__");
            if (!bitmapDataCache[key]) {
                var size = pickSize(key);
                bitmapDataCache[key] = new BitmapData(size.w, size.h, true, hashColor(key));
            }
            return bitmapDataCache[key];
        }

        SwfAsset.prototype.getBitmapFromClassName = function (className) {
            var bmp = null;
            try {
                bmp = originalGetBitmap.apply(this, arguments);
            } catch (e) {
                console.warn("[PATCH V33] SwfAsset.getBitmapFromClassName threw for " + className + ":", e);
            }
            if (bmp) return bmp;

            try {
                var bmd = getFallbackBitmapData(className);
                if (!this.__missingBitmapSymbols) this.__missingBitmapSymbols = {};
                var symbolKey = String(className || "__null__");
                if (!this.__missingBitmapSymbols[symbolKey]) {
                    this.__missingBitmapSymbols[symbolKey] = true;
                    console.warn("[PATCH V33] Missing SWF bitmap symbol fallback: " + symbolKey);
                }
                return new Bitmap(bmd);
            } catch (fallbackErr) {
                console.warn("[PATCH V33] SwfAsset bitmap fallback failed for " + className + ":", fallbackErr);
                return null;
            }
        };

        if (SwfAsset.prototype.getMovieClipFromClassName) {
            var originalGetMovieClip = SwfAsset.prototype.getMovieClipFromClassName;
            SwfAsset.prototype.getMovieClipFromClassName = function (className) {
                var clip = null;
                try {
                    clip = originalGetMovieClip.apply(this, arguments);
                } catch (e) {
                    console.warn("[PATCH V33] SwfAsset.getMovieClipFromClassName threw for " + className + ":", e);
                }
                if (clip) return clip;

                try {
                    var symbolKey = String(className || "__null__");
                    if (!this.__missingMovieClipSymbols) this.__missingMovieClipSymbols = {};
                    if (!this.__missingMovieClipSymbols[symbolKey]) {
                        this.__missingMovieClipSymbols[symbolKey] = true;
                        console.warn("[PATCH V33] Missing SWF movie clip symbol fallback: " + symbolKey);
                    }
                    return MovieClip ? new MovieClip() : null;
                } catch (fallbackErr) {
                    console.warn("[PATCH V33] SwfAsset movie clip fallback failed for " + className + ":", fallbackErr);
                    return null;
                }
            };
        }

        SwfAsset.prototype.__patchedSafeBitmapLookup = true;
    }

    function patchWidgetColorBarSafety() {
        var WidgetColorBar = window._hx_classes && window._hx_classes["com.cc.widget.WidgetColorBar"];
        if (!WidgetColorBar || !WidgetColorBar.prototype || WidgetColorBar.prototype.__patchedSafeOnSwfLoaded) return;

        var BitmapData = window._hx_classes && window._hx_classes["openfl.display.BitmapData"];
        if (!BitmapData || !WidgetColorBar.prototype.onSwfLoaded) return;

        var originalOnSwfLoaded = WidgetColorBar.prototype.onSwfLoaded;

        function makeBmd(color) {
            return new BitmapData(128, 8, true, color >>> 0);
        }

        function ensureColorBarFallbackArray() {
            if (WidgetColorBar._bitmapDataByColor && WidgetColorBar._bitmapDataByColor.length >= 10) return;
            WidgetColorBar._bitmapDataByColor = [
                makeBmd(0xff4f86ff),
                makeBmd(0xffffa64f),
                makeBmd(0xffff4f4f),
                makeBmd(0xff5ad05a),
                makeBmd(0xffffe65a),
                makeBmd(0xff2e4d8f),
                makeBmd(0xff8f5c2e),
                makeBmd(0xff8f2e2e),
                makeBmd(0xff2e8f2e),
                makeBmd(0xff8f862e)
            ];
        }

        WidgetColorBar.prototype.onSwfLoaded = function () {
            try {
                return originalOnSwfLoaded.apply(this, arguments);
            } catch (e) {
                console.warn("[PATCH V33] WidgetColorBar.onSwfLoaded suppressed:", e);
                try {
                    ensureColorBarFallbackArray();
                    if (typeof this.Draw === "function") this.Draw();
                } catch (drawErr) {
                    console.warn("[PATCH V33] WidgetColorBar fallback draw failed:", drawErr);
                }
                return;
            }
        };

        WidgetColorBar.prototype.__patchedSafeOnSwfLoaded = true;
    }

    function patchUpdatesCheck() {
        var UPDATES = window._hx_classes && window._hx_classes["UPDATES"];
        if (!UPDATES || UPDATES.__patchedSafeCheck || !UPDATES.Check) return;

        function sanitizeUpdatesArray() {
            if (!Array.isArray(UPDATES._updates)) {
                UPDATES._updates = [];
                return;
            }

            var cleaned = [];
            for (var i = 0; i < UPDATES._updates.length; i++) {
                var item = UPDATES._updates[i];
                if (!item || !Array.isArray(item.data) || item.data.length < 2) continue;

                var timestamp = Number(item.data[0]);
                if (!isFinite(timestamp)) continue;
                item.data[0] = timestamp;

                cleaned.push(item);
            }

            if (cleaned.length !== UPDATES._updates.length) {
                UPDATES._updates = cleaned;
            }
        }

        if (UPDATES.Process) {
            var originalProcess = UPDATES.Process;
            UPDATES.Process = function (updates) {
                if (!Array.isArray(updates)) updates = [];
                try {
                    return originalProcess.call(this, updates);
                } catch (e) {
                    console.warn("[PATCH V33] UPDATES.Process suppressed:", e);
                    return;
                } finally {
                    try { sanitizeUpdatesArray(); } catch (e2) { }
                }
            };
        }

        var originalCheck = UPDATES.Check;
        UPDATES.Check = function () {
            try { sanitizeUpdatesArray(); } catch (sanitizeErr) { }
            try {
                return originalCheck.apply(this, arguments);
            } catch (e) {
                console.warn("[PATCH V33] UPDATES.Check suppressed:", e);
                try {
                    UPDATES._updates = [];
                } catch (clearErr) { }
                return;
            }
        };

        UPDATES.__patchedSafeCheck = true;
    }

    function patchStoreSafety() {
        var STORE = window._hx_classes && window._hx_classes["STORE"];
        if (!STORE || STORE.__patchedSafeStore) return;

        function asInt(value) {
            var n = Number(value);
            if (!isFinite(n)) return 0;
            return n | 0;
        }

        function defaultStoreItem(code) {
            return {
                id: code,
                i: 0,
                du: 0,
                q: 0,
                quantity: 0,
                c: [0],
                d: "",
                t: ""
            };
        }

        function normalizeStoreItems(input) {
            var out = (input && typeof input === "object") ? input : {};
            var required = ["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BIP", "ENL", "BLK2", "BLK3"];

            for (var i = 0; i < required.length; i++) {
                var code = required[i];
                var item = out[code];
                if (!item || typeof item !== "object") item = defaultStoreItem(code);
                if (!Array.isArray(item.c)) item.c = [0];
                item.i = asInt(item.i);
                item.du = asInt(item.du);
                item.q = asInt(item.q);
                item.quantity = asInt(item.quantity);
                if (typeof item.d !== "string") item.d = "";
                if (typeof item.t !== "string") item.t = "";
                out[code] = item;
            }

            return out;
        }

        function normalizeStoreData(input) {
            var out = (input && typeof input === "object") ? input : {};
            var required = ["BR11", "BR12", "BR13", "BR21", "BR22", "BR23", "BIP", "ENL", "BLK2", "BLK3"];

            for (var i = 0; i < required.length; i++) {
                var code = required[i];
                if (!out[code] || typeof out[code] !== "object") out[code] = { q: 0 };
                out[code].q = asInt(out[code].q);
            }

            return out;
        }

        if (STORE.Data) {
            var originalData = STORE.Data;
            STORE.Data = function (storeItems, storeData, inventory) {
                var safeItems = normalizeStoreItems(storeItems);
                var safeData = normalizeStoreData(storeData);
                var safeInventory = (inventory && typeof inventory === "object") ? inventory : {};
                try {
                    return originalData.call(this, safeItems, safeData, safeInventory);
                } catch (e) {
                    console.warn("[PATCH V33] STORE.Data suppressed:", e);
                    STORE._storeItems = safeItems;
                    STORE._storeData = safeData;
                    STORE._storeInventory = safeInventory;
                    return;
                }
            };
        }

        if (STORE.ProcessBaseSize) {
            var originalProcessBaseSize = STORE.ProcessBaseSize;
            STORE.ProcessBaseSize = function (data) {
                var safeData = normalizeStoreData(data || STORE._storeData);
                try {
                    STORE._storeData = safeData;
                    return originalProcessBaseSize.call(this, safeData);
                } catch (e) {
                    console.warn("[PATCH V33] STORE.ProcessBaseSize suppressed:", e);
                    return;
                }
            };
        }

        if (STORE.ProcessPurchases) {
            var originalProcessPurchases = STORE.ProcessPurchases;
            STORE.ProcessPurchases = function () {
                try {
                    STORE._storeData = normalizeStoreData(STORE._storeData);
                    return originalProcessPurchases.apply(this, arguments);
                } catch (e2) {
                    console.warn("[PATCH V33] STORE.ProcessPurchases suppressed:", e2);
                    return;
                }
            };
        }

        STORE.__patchedSafeStore = true;
    }

    function patchContractLoader() {
        var DZ = window._hx_classes && window._hx_classes["com.cc.ui.xbaux.ContractLoader"];
        if (DZ && !DZ.prototype.load) {
            console.log("[PATCH V32] Adding dummy load() to ContractLoader");
            DZ.prototype.load = function() {
                console.warn("[ANTIGRAVITY_DEBUG] ContractLoader.load() called for: " + this._contractUrl);
            };
        }
    }

    function patchCDNLoader() {
        var Nk = window._hx_classes && window._hx_classes["com.cc.loading.CDNLoader"];
        if (Nk && !Nk.__patched) {
            console.log("[PATCH V32] Hooking CDNLoader (Nk)");
            var originalUpdate = Nk.prototype.updateLoadingProgress;
            Nk.prototype.updateLoadingProgress = function() {
                // If we are stuck, force finish after some time or if critical items are loaded
                var result = originalUpdate.apply(this, arguments);
                
                // Force finish if we've been here too long
                if (!this.__forceFinished && window.game_boot_started) {
                    var elapsed = Date.now() - window.game_boot_started;
                    // Keep this as a last-resort fallback only.
                    if (elapsed > 180000) { // 3 minutes
                        console.warn("[ANTIGRAVITY_DEBUG] CDNLoader timeout reached, forcing finish!");
                        this.__forceFinished = true;
                        if (this.finishedLoggingIn) this.finishedLoggingIn();
                        else if (this.finishedLoadingFlags) this.finishedLoadingFlags();
                    }
                }
                return result;
            };
            Nk.__patched = true;
        }
    }

    function ensureCDNManifestInitialized() {
        if (window.__MANIFEST_KICK_DONE__) return;
        if (!window.game_boot_started || !window._hx_classes) return;

        var elapsed = Date.now() - window.game_boot_started;
        if (elapsed < nextManifestKickAtMs) return;

        var GameClass = window._hx_classes["GAME"];
        var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
        var cdnLoader = inst && inst._cdnLoader;
        var Nk = window._hx_classes["com.cc.loading.CDNLoader"];
        var loadListLen = Nk && Nk.loadList ? Nk.loadList.length : 0;

        if (loadListLen > 0) {
            window.__MANIFEST_KICK_DONE__ = true;
            return;
        }

        if (!cdnLoader || !cdnLoader.finishedLoadingAssetManifest) {
            nextManifestKickAtMs += 5000;
            return;
        }

        if (manifestKickAttempts >= 6) return;

        manifestKickAttempts++;
        nextManifestKickAtMs += 10000;

        try {
            console.warn("[PATCH V33] CDN loadList still empty. Triggering finishedLoadingAssetManifest (attempt " + manifestKickAttempts + ").");
            cdnLoader.finishedLoadingAssetManifest({ name: "assetManifest" });

            Nk = window._hx_classes["com.cc.loading.CDNLoader"];
            loadListLen = Nk && Nk.loadList ? Nk.loadList.length : 0;
            if (loadListLen > 0) {
                console.log("[PATCH V33] CDN manifest kick succeeded. loadList size: " + loadListLen);
                window.__MANIFEST_KICK_DONE__ = true;
            }
        } catch (e) {
            console.error("[PATCH V33] CDN manifest kick failed:", e);
        }
    }

    function removeLoadingOverlays() {
        var inst = (window.GAME && window.GAME._instance) || (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance);
        if (inst && inst.stage) {
            var stage = inst.stage;
            for (var i = 0; i < stage.get_numChildren(); i++) {
                var child = stage.getChildAt(i);
                var className = (child && child.__class__ && child.__class__.__name__) || "";
                if (className.toLowerCase().includes("preloader") || className.toLowerCase().includes("loading")) {
                    console.warn("[ANTIGRAVITY_DEBUG] Removing loading overlay: " + className);
                    stage.removeChild(child);
                }
            }
        }
    }

    function autoLoadSharedConfigs() {
        if (window.__CONFIGS_LOADED__) return;
        if (!window._hx_classes) return;
        
        var Kb = window._hx_classes["com.cc.utils.sharedConfig.ConfigDataLoader"];
        if (Kb && Kb.LoadConfigData) {
            console.log("[PATCH V33] Found ConfigDataLoader! Attempting to auto-load shared configs...");
            window.__CONFIGS_LOADED__ = "PENDING";
            fetch(rewriteLocalUrl("/shared_configs.json"))
                .then(r => r.json())
                .then(data => {
                    console.log("[PATCH V33] Shared configs fetched (" + data.length + " items), loading into Kb...");
                    Kb.LoadConfigData(data);
                    console.log("[PATCH V33] Kb.LoadConfigData call finished.");
                    window.__CONFIGS_LOADED__ = true;
                })
                .catch(e => {
                    console.error("[PATCH V33] Failed to fetch shared configs:", e);
                    window.__CONFIGS_LOADED__ = false;
                });
        } else if (loopCount % 100 === 0) {
            // console.log("[PATCH V33] Waiting for ConfigDataLoader... keys in _hx_classes: " + Object.keys(window._hx_classes).length);
        }
    }

    function forceGameStart() {
        var GameClass = window._hx_classes && window._hx_classes["GAME"];
        var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
        if (inst && !window.__FORCE_STARTED__) {
            var elapsed = Date.now() - window.game_boot_started;
            if (elapsed > 180000) { // 3 minutes
                console.warn("[PATCH V33] Game stuck in loading for 3 minutes. Forcing onDataFinishedLoading...");
                window.__FORCE_STARTED__ = true;
                if (inst.onDataFinishedLoading) {
                    try {
                        inst.onDataFinishedLoading();
                        console.log("[PATCH V33] onDataFinishedLoading forced successfully.");
                    } catch (e) {
                        console.error("[PATCH V33] Error forcing onDataFinishedLoading:", e);
                    }
                } else {
                    console.error("[PATCH V33] Could not find onDataFinishedLoading on GAME instance.");
                }
            }
        }
    }

    // --- MAIN LOOP ---
    window.game_boot_started = Date.now();
    var loopCount = 0;
    var mainInterval = setInterval(function () {
        loopCount++;

        // Expose class map if found
        if (window._hx_classes) window.l = window._hx_classes;

        // Aggressively try to hook
        hookUrlLoader();
        hookLimeAssets();
        hookDb();
        patchLocalization();
        patchGlobalErrorHandling();
        patchLoginProcess();
        patchGameInitParams();
        patchWorldmapDisconnectSafety();
        patchGatewayHttpBootstrap();
        patchGatewayAuthBootstrap();
        patchUInt64Safety();
        patchMapResetSafety();
        patchWorldmapViewBootstrap();
        syncWorldmapMapViewVisibility();
        patchMapLayerCallSafety();
        patchHexMapSafety();
        reconcileDetachedBaseRender();
        trySyntheticWorldmapBootstrap();
        patchDisplayListSafety();
        patchDailyMissionHudSafety();
        patchMissionToolServiceSafety();
        patchTimeSync();
        patchContractLoader();
        patchCDNLoader();
        patchBuildingDataSafety();
        patchBaseSafety();
        patchDefenderFireteamSafety();
        patchFootprintSafety();
        patchBattleSafety();
        patchReticleSafety();
        patchSwfAssetBitmapFallback();
        patchWidgetColorBarSafety();
        patchPlatoonManifestDefaults();
        patchUpdatesCheck();
        patchStoreSafety();
        bootstrapGameDataIfMissing();
        clearConnectionPopups();
        ensureCDNManifestInitialized();
        nudgeBlockingLoaders();
        autoLoadSharedConfigs();
        forceGameStart();

        if (loopCount % 20 === 0) removeLoadingOverlays();

        var inst = (window.GAME && window.GAME._instance) || (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance);

        if (inst) {
            // No longer forcing initialization - letting the game handle it
            // now that URLLoaderApi hashes are bypassed.

            // If we are stuck in an error state, try to clear it
            if (loopCount % 50 === 0) {
                removeBlockingPopups();
            }
        }
    }, 50); // 50ms loop for faster checking

    // --- EXPOSE GLOBAL PATCHER ---
    window.applyPatchesNow = function () {
        console.log("[PATCH V33] Force applying patches now...");
        hookUrlLoader();
        patchLocalization();
        patchGlobalErrorHandling();
        patchLoginProcess();
        patchGameInitParams();
        patchWorldmapDisconnectSafety();
        patchGatewayHttpBootstrap();
        patchGatewayAuthBootstrap();
        patchUInt64Safety();
        patchMapResetSafety();
        patchWorldmapViewBootstrap();
        syncWorldmapMapViewVisibility();
        patchMapLayerCallSafety();
        patchHexMapSafety();
        reconcileDetachedBaseRender();
        trySyntheticWorldmapBootstrap();
        patchDisplayListSafety();
        patchDailyMissionHudSafety();
        patchMissionToolServiceSafety();
        patchTimeSync();
        patchBuildingDataSafety();
        patchBaseSafety();
        patchDefenderFireteamSafety();
        patchFootprintSafety();
        patchBattleSafety();
        patchReticleSafety();
        patchSwfAssetBitmapFallback();
        patchWidgetColorBarSafety();
        patchUpdatesCheck();
        patchStoreSafety();
        bootstrapGameDataIfMissing();
        clearConnectionPopups();
    };

})();
