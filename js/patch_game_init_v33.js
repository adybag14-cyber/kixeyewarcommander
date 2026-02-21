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
    var WORLDMAP_SYNTHETIC_BOOTSTRAP_MIN_MS = 8000;
    var WORLDMAP_TRANSITION_STUCK_TIMEOUT_MS = 2500;
    var WORLDMAP_TRANSITION_MAX_FORCE_ATTEMPTS = 2;
    var WORLDMAP_MAPVIEW_VISIBILITY_GRACE_MS = 20000;
    var ENABLE_WORLDMAP_MAPVIEW_AUTOHIDE = !!window.__PATCH_V33_WM_MAPVIEW_AUTOHIDE__;
    var DISABLE_SYNTHETIC_WORLDMAP_BOOTSTRAP = !!window.__PATCH_V33_DISABLE_SYNTH_WM__;
    var ENABLE_MANUAL_WORLDMAP_DRAG_BRIDGE = !!window.__PATCH_V33_ENABLE_MANUAL_WM_DRAG_BRIDGE__;

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

    function patchTutorialCompletionSafety() {
        var hx = window._hx_classes || {};
        var Tutorial = hx["com.cc.tutorial.TUTORIAL"];
        if (!Tutorial || Tutorial.__patchedTutorialCompletionSafety || !Tutorial.tutorialCompleted) return;

        console.log("[PATCH V33] Hooking TUTORIAL.tutorialCompleted safety guard");

        var originalTutorialCompleted = Tutorial.tutorialCompleted;
        Tutorial.tutorialCompleted = function () {
            try {
                if (!Tutorial._mcZone || typeof Tutorial._mcZone !== "object") {
                    Tutorial._mcZone = {};
                }
                if (typeof Tutorial._mcZone.StopTicking !== "function") {
                    Tutorial._mcZone.StopTicking = function () { };
                }
                if (typeof Tutorial._mcZone.CleanUp !== "function") {
                    Tutorial._mcZone.CleanUp = function () { };
                }
            } catch (_zoneInitErr) { }

            try {
                return originalTutorialCompleted.apply(this, arguments);
            } catch (err) {
                var msg = String((err && err.message) || err || "");
                if (msg.indexOf("StopTicking") !== -1 || msg.indexOf("CleanUp") !== -1) {
                    console.warn("[PATCH V33] Suppressed tutorial completion zone crash:", err);
                    return;
                }
                throw err;
            }
        };

        Tutorial.__patchedTutorialCompletionSafety = true;
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

        function isMissionToolDisconnectReason(text) {
            var s = String(text || "").toLowerCase();
            if (!s) return false;
            return s.indexOf("missiontoolservicewrapper") !== -1 ||
                s.indexOf("sendgetmissionrequest") !== -1 ||
                s.indexOf("mission tool") !== -1 ||
                (s.indexOf("mission") !== -1 && s.indexOf("request") !== -1);
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
                    if (isMissionToolDisconnectReason(reason)) {
                        console.warn("[PATCH V33] WorldmapController.onDisconnected suppressed:", reason);
                        try {
                            if (GLOBAL && GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                        } catch (e) { }
                        return;
                    }
                    return originalOnDisconnected.apply(this, arguments);
                };
            }

            if (WorldmapController.onForceDisconnect) {
                var originalOnForceDisconnect = WorldmapController.onForceDisconnect;
                WorldmapController.onForceDisconnect = function (event) {
                    var msg = event && event.message;
                    if (isMissionToolDisconnectReason(msg)) {
                        console.warn("[PATCH V33] WorldmapController.onForceDisconnect suppressed:", msg);
                        try {
                            if (GLOBAL && GLOBAL.setHalted) GLOBAL.setHalted(false, "");
                        } catch (e) { }
                        return;
                    }
                    return originalOnForceDisconnect.apply(this, arguments);
                };
            }

            WorldmapController.__patchedNoDisconnect = true;
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
                var out = originalGetRequiredParameters.apply(this, arguments);
                if (typeof out !== "string") out = String(out || "");
                // URLStream in this build only exposes binary payload on request completion.
                // Force one-shot poll requests so each response completes and yields bytes.
                if (out.indexOf("oneshot=") === -1 && out.indexOf("pollonce=") === -1 && out.indexOf("once=") === -1) {
                    out += (out.indexOf("?") === -1 ? "?" : "&") + "oneshot=1";
                }
                return out;
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

        if (typeof proto.disconnect === "function") {
            var originalDisconnect = proto.disconnect;
            proto.disconnect = function () {
                this.__patchV33GatewayManualDisconnect = true;
                return originalDisconnect.apply(this, arguments);
            };
        }

        if (typeof proto.createConnection === "function") {
            var originalCreateConnection = proto.createConnection;
            proto.createConnection = function () {
                this.__patchV33GatewayManualDisconnect = false;
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

        if (typeof proto.onClose === "function" && !proto.__patchedGatewayHttpPollReconnect) {
            var originalOnClose = proto.onClose;
            proto.onClose = function () {
                var self = this;
                var shouldReconnect = !self.__patchV33GatewayManualDisconnect;

                // Ensure final response bytes are processed before reconnecting.
                try {
                    if (self.stream && typeof self.onResponse === "function") {
                        self.onResponse({ target: self.stream });
                    }
                } catch (_finalResponseErr) { }

                var out = originalOnClose.apply(self, arguments);

                if (shouldReconnect) {
                    setTimeout(function () {
                        try {
                            if (!self.stream && !self.connecting && self._currentHost && self._currentPort) {
                                self.createConnection(self._currentHost, self._currentPort);
                            }
                        } catch (reopenErr) {
                            console.warn("[PATCH V33] GatewayHttpConnection poll reopen failed:", reopenErr);
                        }
                    }, 25);
                }

                return out;
            };
            proto.__patchedGatewayHttpPollReconnect = true;
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

    function patchAttackLogServiceFallback() {
        var hx = window._hx_classes || {};
        var AttacklogService = hx["com.cc.attacklog.model.AttacklogService"];
        if (!AttacklogService || !AttacklogService.prototype || AttacklogService.prototype.__patchedAttackLogServiceFallback) return;

        var proto = AttacklogService.prototype;
        var originalGetService = (typeof proto.get_service === "function") ? proto.get_service : null;
        var originalIsServiceReady = (typeof proto.isServiceReady === "function") ? proto.isServiceReady : null;

        function buildLocalStub(owner) {
            if (!owner) return null;
            if (owner.__patchV33AttackLogLocalStub) return owner.__patchV33AttackLogLocalStub;

            function buildProtoUser(userId) {
                var nowMs = Date.now();
                var uid = String(userId == null ? "33123969" : userId);
                return {
                    get_userId: function () { return uid; },
                    get_level: function () { return 44; },
                    get_infamy: function () { return 0; },
                    get_mapId: function () { return "1"; },
                    get_baseCoordX: function () { return 249; },
                    get_baseCoordY: function () { return 249; },
                    get_lastBattleTimestamp: function () { return nowMs - (2 * 60 * 60 * 1000); },
                    get_battleRole: function () { return 0; },
                    get_hasDamageProtection: function () { return false; },
                    get_vanityPrize: function () { return 0; }
                };
            }

            function defer(fn) {
                setTimeout(function () {
                    try {
                        fn();
                    } catch (stubErr) {
                        console.warn("[PATCH V33] Attack Log local stub callback failed:", stubErr);
                    }
                }, 0);
            }

            owner.__patchV33AttackLogLocalStub = {
                addEventListener: function () { },
                removeEventListener: function () { },
                requestHasAttackEntriesSince: function (_timestampMs) {
                    defer(function () { owner.onHasBattlesSinceResponse(false); });
                },
                requestHasAttackEntriesWithEnemy: function (enemyUserId) {
                    defer(function () { owner.onHasBattlesWithUserResponse(enemyUserId, false); });
                },
                requestGetRecentEnemiesUserData: function (_olderThanMs, _limit, _queryTimestampMs) {
                    defer(function () {
                        owner.onRecentEnemiesResponse([
                            buildProtoUser("33123969")
                        ]);
                    });
                },
                requestGetAttackEntriesWithEnemy: function (_enemyUserId, _limit, _olderThanMs) {
                    defer(function () { owner.onGetAttackEntriesWithUserResponse([]); });
                },
                requestGetAttackUserData: function (enemyUserId) {
                    defer(function () { owner.onAttackUserDataResponse(buildProtoUser(enemyUserId)); });
                }
            };
            return owner.__patchV33AttackLogLocalStub;
        }

        proto.get_service = function () {
            var service = null;
            try {
                service = originalGetService ? originalGetService.call(this) : this._mapService;
            } catch (_getServiceErr) {
                service = this._mapService;
            }
            if (service) return service;

            var stub = buildLocalStub(this);
            this._mapService = stub;
            return stub;
        };

        proto.isServiceReady = function () {
            try {
                if (originalIsServiceReady && originalIsServiceReady.call(this)) return true;
            } catch (_readyErr) { }
            return !!this.get_service();
        };

        var AttackLogPopup = hx["com.cc.attacklog.ui.attack_log_popup.AttackLogPopup"];
        if (AttackLogPopup && !AttackLogPopup.__patchedAttackLogPopupAvailability) {
            var originalPopupAvailable = (typeof AttackLogPopup.isPopupAvailable === "function") ? AttackLogPopup.isPopupAvailable : null;
            AttackLogPopup.isPopupAvailable = function () {
                try {
                    if (originalPopupAvailable && originalPopupAvailable()) return true;
                } catch (_popupAvailErr) { }
                try {
                    var ConflictManager = hx["com.cc.attacklog.model.ConflictManager"];
                    var manager = ConflictManager && typeof ConflictManager.get_instance === "function" ? ConflictManager.get_instance() : null;
                    return !!(manager && typeof manager.isServiceReady === "function" && manager.isServiceReady());
                } catch (_fallbackReadyErr) {
                    return true;
                }
            };
            AttackLogPopup.__patchedAttackLogPopupAvailability = true;
        }

        AttacklogService.prototype.__patchedAttackLogServiceFallback = true;
        console.log("[PATCH V33] Attack Log service fallback enabled.");
    }

    function patchAttackLogTimeoutSafety() {
        var hx = window._hx_classes || {};
        var AttacklogService = hx["com.cc.attacklog.model.AttacklogService"];
        if (!AttacklogService || !AttacklogService.prototype || AttacklogService.prototype.__patchedAttackLogTimeoutSafety) return;

        var proto = AttacklogService.prototype;
        var originalPopupError = (typeof proto.popupError === "function") ? proto.popupError : null;

        function dispatchFallback(callback, queryType) {
            if (typeof callback !== "function") return;
            if (queryType === 1 || queryType === 2) {
                callback(false);
                return;
            }
            if (queryType === 3) {
                callback([]);
                return;
            }
            if (queryType === 4) {
                callback([], null);
                return;
            }
            if (queryType === 5) {
                callback(null);
                return;
            }
            callback();
        }

        if (originalPopupError) {
            proto.popupError = function (_title, _message, _queryType) {
                if (this && !this.__patchV33AttackLogPopupSuppressed) {
                    this.__patchV33AttackLogPopupSuppressed = true;
                    console.warn("[PATCH V33] Suppressed Attack Log error popup in local mode.");
                }
            };
        }

        if (typeof proto.onQueryFailure === "function") {
            proto.onQueryFailure = function () {
                var queryType = 0;
                try {
                    queryType = this.get_currentQueryType ? this.get_currentQueryType() : 0;
                } catch (_queryTypeErr) { }

                var callback = this._currentQueryCallback || null;

                setTimeout(function () {
                    try {
                        dispatchFallback(callback, queryType);
                    } catch (fallbackErr) {
                        console.warn("[PATCH V33] Attack Log fallback callback failed:", fallbackErr);
                    }
                }, 0);
            };
        }

        AttacklogService.prototype.__patchedAttackLogTimeoutSafety = true;
        console.log("[PATCH V33] Attack Log timeout safety enabled.");
    }

    function getWorldmapStateFlag(hx) {
        var ActiveState = hx["ActiveState"];
        if (!ActiveState || typeof ActiveState.IsWorldMap !== "function") return null;
        try {
            return ActiveState.IsWorldMap() ? true : false;
        } catch (_stateErr) {
            return null;
        }
    }

    function getActiveStateChangingFlag(hx) {
        var ActiveState = hx["ActiveState"];
        if (!ActiveState || typeof ActiveState.IsChangingState !== "function") return null;
        try {
            return ActiveState.IsChangingState() ? true : false;
        } catch (_changingErr) {
            return null;
        }
    }

    function getPendingWorldmapStateFlag(hx) {
        var ActiveState = hx["ActiveState"];
        if (!ActiveState || typeof ActiveState.get_instance !== "function") return null;
        try {
            var inst = ActiveState.get_instance();
            if (!inst) return null;
            return inst._newState === 1;
        } catch (_pendingStateErr) {
            return null;
        }
    }

    function isWorldmapTileDataReady(hx) {
        var TileSetManager = hx["com.cc.worldmap.TileSetManager"];
        if (!TileSetManager || typeof TileSetManager.get_instance !== "function") return false;
        try {
            var manager = TileSetManager.get_instance();
            return !!(manager && manager._tiles && manager._backgrounds);
        } catch (_tilesErr) {
            return false;
        }
    }

    function getWorldmapDimensions(hx) {
        var out = { width: 0, height: 0 };
        try {
            var Worldmap = hx["com.cc.worldmap.Worldmap"];
            var view = Worldmap && Worldmap._mapView ? Worldmap._mapView : null;
            var map = view && view._map ? view._map : null;
            if (!map) return out;
            if (typeof map.get_mapWidth === "function") out.width = map.get_mapWidth() | 0;
            if (typeof map.get_mapHeight === "function") out.height = map.get_mapHeight() | 0;
        } catch (_mapDimsErr) { }
        return out;
    }

    function isWorldmapStableAndUsable(hx) {
        var worldState = getWorldmapStateFlag(hx);
        if (worldState !== true) return false;

        try {
            var Worldmap = hx["com.cc.worldmap.Worldmap"];
            if (!Worldmap || !Worldmap._mapView) return false;
            var dims = getWorldmapDimensions(hx);
            return dims.width > 16 && dims.height > 16;
        } catch (_stableErr) {
            return false;
        }
    }

    function hasUsableHexMapCells(hx) {
        try {
            var Worldmap = hx["com.cc.worldmap.Worldmap"];
            var hexMap = Worldmap && (Worldmap._hexMap || (typeof Worldmap.get_hexMap === "function" ? Worldmap.get_hexMap() : null));
            if (!hexMap) return false;

            var numCells = (hexMap._numCells | 0);
            if (numCells <= 0) return false;

            var cells = hexMap._cells || null;
            if (!cells || !cells.length || cells.length <= 0) return false;

            return true;
        } catch (_usableHexErr) {
            return false;
        }
    }

    function getSyntheticRegionTemplateBytes(hx, templateCells) {
        if (!templateCells || !templateCells.length) return null;
        var Bytes = hx["haxe.io.Bytes"];
        if (!Bytes || typeof Bytes.alloc !== "function") return null;

        var count = templateCells.length | 0;
        if (count <= 0) return null;

        var cache = window.__PATCH_V33_SYNTH_REGION_TEMPLATE_BYTES__;
        if (cache && cache.length === count) return cache;

        var bytes = Bytes.alloc(count);
        for (var i = 0; i < count; i++) {
            var value = templateCells[i];
            if (!isFinite(value)) value = 0;
            bytes.set(i, (value | 0) & 255);
        }
        window.__PATCH_V33_SYNTH_REGION_TEMPLATE_BYTES__ = bytes;
        return bytes;
    }

    function parseRegionTemplateCellsText(rawText, expectedCount) {
        var count = Math.max(1, expectedCount | 0);
        var out = new Array(count);
        for (var fillIdx = 0; fillIdx < count; fillIdx++) out[fillIdx] = 0;

        var text = String(rawText || "").trim();
        if (!text) return out;
        if ((text.length % 2) === 1) text = text.slice(0, -1);

        var maxPairs = Math.min(count, (text.length / 2) | 0);
        for (var i = 0; i < maxPairs; i++) {
            var token = text.substr(i * 2, 2);
            var value = parseInt(token, 10);
            if (!isFinite(value)) value = parseInt(token, 16);
            if (!isFinite(value)) value = 0;
            out[i] = value & 255;
        }
        return out;
    }

    function ensureSyntheticRegionTemplateCellsLoaded(stride) {
        var regionStride = Math.max(1, stride | 0);
        var expectedCount = regionStride * regionStride;
        var existing = window.__PATCH_V33_SYNTH_REGION_TEMPLATE_CELLS__;
        if (existing && existing.length === expectedCount) return true;
        if (window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOADING__) return false;
        if (window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED__) {
            var failedAt = window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED_AT__ || 0;
            if (failedAt && (Date.now() - failedAt) < 15000) return false;
            window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED__ = false;
        }

        window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOADING__ = true;
        fetch(rewriteLocalUrl("/embedded/hardcodedmapheightfield.txt"))
            .then(function (resp) {
                if (!resp || !resp.ok) throw new Error("HTTP " + (resp ? resp.status : "0"));
                return resp.text();
            })
            .then(function (text) {
                var cells = parseRegionTemplateCellsText(text, expectedCount);
                window.__PATCH_V33_SYNTH_REGION_TEMPLATE_CELLS__ = cells;
                window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED__ = false;
                console.log("[PATCH V33] Loaded synthetic region template cells (" + cells.length + ").");
            })
            .catch(function (err) {
                window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED__ = true;
                window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOAD_FAILED_AT__ = Date.now();
                console.warn("[PATCH V33] Failed to load synthetic region template cells:", err);
            })
            .finally(function () {
                window.__PATCH_V33_SYNTH_REGION_TEMPLATE_LOADING__ = false;
            });

        return false;
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

        function scrubInvalidEffectsBitmap() {
            var bmp = MAP._EFFECTSBMP || null;
            if (!bmp) return false;

            var bitmapData = null;
            try {
                if (typeof bmp.get_bitmapData === "function") {
                    bitmapData = bmp.get_bitmapData();
                } else if (typeof bmp.bitmapData !== "undefined") {
                    bitmapData = bmp.bitmapData;
                }
            } catch (_bmpDataErr) {
                bitmapData = null;
            }

            var valid = !!(bitmapData && typeof bitmapData.fillRect === "function");
            if (valid) return false;

            try {
                if (bmp.parent && typeof bmp.parent.removeChild === "function") {
                    bmp.parent.removeChild(bmp);
                }
            } catch (_removeBmpErr) { }

            MAP._EFFECTSBMP = null;
            return true;
        }

        if (typeof MAP.ResetEffects === "function" && !MAP.__patchedResetEffectsSafety) {
            var originalResetEffects = MAP.ResetEffects;
            MAP.ResetEffects = function () {
                scrubInvalidEffectsBitmap();

                try {
                    return originalResetEffects.apply(this, arguments);
                } catch (resetErr) {
                    // Recovery path: clear stale effect bitmap and retry once.
                    try {
                        MAP._EFFECTSBMP = null;
                        return originalResetEffects.apply(this, arguments);
                    } catch (retryErr) {
                        if (!MAP.__patchResetEffectsWarned) {
                            MAP.__patchResetEffectsWarned = true;
                            console.warn("[PATCH V33] MAP.ResetEffects safety fallback failed:", retryErr || resetErr);
                        }
                        return;
                    }
                }
            };
            MAP.__patchedResetEffectsSafety = true;
            console.log("[PATCH V33] MAP.ResetEffects safety wrapper enabled.");
        }

        MAP.__patchedMapResetSafety = true;
        console.log("[PATCH V33] MAP reset safety enabled.");
    }

    function patchHudMapButtonsFallback() {
        if (window.__PATCH_V33_HUD_MAP_BUTTON_FALLBACK__) return;

        var pointerState = {
            down: false,
            x: 0,
            y: 0,
            at: 0,
            moved: false,
            lastToggleAt: 0,
            lastAttackLogAt: 0
        };

        function isInsideWorldMapButton(clientX, clientY) {
            var width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
            var height = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 0;
            if (width < 600 || height < 400) return false;

            // Bottom-right rightmost button area:
            // Home Base: "World Map"
            // World Map: "Enter Base"
            var left = width - 92;
            var right = width - 8;
            var top = height - 222;
            var bottom = height - 138;

            return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
        }

        function isInsideAttackLogButton(clientX, clientY) {
            var width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 0;
            var height = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 0;
            if (width < 600 || height < 400) return false;

            var left = width - 150;
            var right = width - 8;
            var top = 46;
            var bottom = 118;

            return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;
        }

        function openAttackLogFallback() {
            var hx = window._hx_classes || {};
            var AttackLogPopup = hx["com.cc.attacklog.ui.attack_log_popup.AttackLogPopup"];
            if (!AttackLogPopup || typeof AttackLogPopup.open !== "function") return false;

            try {
                AttackLogPopup.open("-1");
                return !!AttackLogPopup._instance;
            } catch (attackLogErr) {
                console.warn("[PATCH V33] HUD fallback failed to open Attack Log popup:", attackLogErr);
            }
            return false;
        }
        window.addEventListener("pointerdown", function (evt) {
            if (!evt) return;
            if (typeof evt.button === "number" && evt.button !== 0) return;
            pointerState.down = true;
            pointerState.x = evt.clientX | 0;
            pointerState.y = evt.clientY | 0;
            pointerState.at = Date.now();
            pointerState.moved = false;
        }, true);

        window.addEventListener("pointermove", function (evt) {
            if (!evt || !pointerState.down) return;
            var dx = Math.abs((evt.clientX | 0) - pointerState.x);
            var dy = Math.abs((evt.clientY | 0) - pointerState.y);
            if (dx > 10 || dy > 10) pointerState.moved = true;
        }, true);

        window.addEventListener("pointerup", function (evt) {
            if (!evt) return;
            if (typeof evt.button === "number" && evt.button !== 0) return;
            var now = Date.now();

            // Treat fallback only as a clean button click, never as drag-release.
            var clickDuration = pointerState.at ? (now - pointerState.at) : 0;
            if (!pointerState.down || pointerState.moved || clickDuration > 1200) {
                pointerState.down = false;
                return;
            }
            pointerState.down = false;

            // Cooldown to avoid accidental rapid state flip-flops.
            if (pointerState.lastToggleAt && (now - pointerState.lastToggleAt) < 1200) return;

            // Ensure the click is inside the actual canvas viewport.
            var canvas = document.querySelector("canvas");
            if (canvas && typeof canvas.getBoundingClientRect === "function") {
                var rect = canvas.getBoundingClientRect();
                if (evt.clientX < rect.left || evt.clientX > rect.right || evt.clientY < rect.top || evt.clientY > rect.bottom) {
                    return;
                }
            }

            if (isInsideAttackLogButton(evt.clientX, evt.clientY)) {
                if (pointerState.lastAttackLogAt && (now - pointerState.lastAttackLogAt) < 600) return;
                pointerState.lastAttackLogAt = now;
                if (openAttackLogFallback()) {
                    try {
                        if (typeof evt.stopImmediatePropagation === "function") evt.stopImmediatePropagation();
                        if (typeof evt.preventDefault === "function") evt.preventDefault();
                    } catch (_attackLogEventStopErr) { }
                    console.warn("[PATCH V33] HUD fallback opened Attack Log popup.");
                    return;
                }
            }
            if (!isInsideWorldMapButton(evt.clientX, evt.clientY)) return;

            var hx = window._hx_classes || {};
            var ActiveState = hx["ActiveState"];
            if (!ActiveState) return;

            var isWorld = false;
            var isChanging = false;
            try { isWorld = !!(ActiveState.IsWorldMap && ActiveState.IsWorldMap()); } catch (_isWorldErr) { }
            try { isChanging = !!(ActiveState.IsChangingState && ActiveState.IsChangingState()); } catch (_isChangingErr) { }
            if (isChanging) return;

            if (isWorld) {
                try {
                    if (typeof ActiveState.goHome === "function") {
                        ActiveState.goHome();
                        pointerState.lastToggleAt = now;
                        console.warn("[PATCH V33] HUD fallback forced Enter Base.");
                    }
                } catch (_goHomeErr) { }
                return;
            }

            try {
                var BaseLoadParams = hx["BaseLoadParams"];
                if (!BaseLoadParams || typeof ActiveState.SetState !== "function") return;

                var params = new BaseLoadParams();
                var MAIN = hx["MAIN"] || window.MAIN;
                var playerInfo = MAIN && MAIN.playerInfo ? MAIN.playerInfo : null;
                var userId = playerInfo && typeof playerInfo.get_id === "function" ? playerInfo.get_id() : 123456;
                if (typeof params.set_userID === "function") {
                    params.set_userID(userId);
                }

                ActiveState.SetState(1, params, false);
                pointerState.lastToggleAt = now;
                console.warn("[PATCH V33] HUD fallback forced World Map transition.");
            } catch (fallbackErr) {
                console.warn("[PATCH V33] HUD fallback SetState failed:", fallbackErr);
            }
        }, true);

        window.__PATCH_V33_HUD_MAP_BUTTON_FALLBACK__ = true;
        console.log("[PATCH V33] HUD world/base button fallback enabled.");
    }

    function patchWorldmapDragInputFallback() {
        var hx = window._hx_classes || {};
        var HexWorldmapView = hx["com.cc.worldmap.HexWorldmapView"];
        if (!HexWorldmapView || !HexWorldmapView.prototype || HexWorldmapView.prototype.__patchedWorldmapDragInputFallback) return;

        if (!window.__PATCH_V33_MOUSE_TRACKING__) {
            window.__PATCH_V33_MOUSE_TRACKING__ = true;
            window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;

            window.addEventListener("mousedown", function (evt) {
                if (!evt || evt.button === 0) {
                    window.__PATCH_V33_WORLD_MOUSE_DOWN__ = true;
                }
            }, true);
            window.addEventListener("mouseup", function (evt) {
                if (!evt || evt.button === 0) {
                    window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;
                }
            }, true);
            window.addEventListener("blur", function () {
                window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;
            }, true);
        }

        var proto = HexWorldmapView.prototype;

        if (typeof proto.mouseDown === "function" && !proto.__patchedWorldmapMouseDownFallback) {
            var originalMouseDown = proto.mouseDown;
            proto.mouseDown = function () {
                window.__PATCH_V33_WORLD_MOUSE_DOWN__ = true;
                return originalMouseDown.apply(this, arguments);
            };
            proto.__patchedWorldmapMouseDownFallback = true;
        }

        if (typeof proto.mouseUp === "function" && !proto.__patchedWorldmapMouseUpFallback) {
            var originalMouseUp = proto.mouseUp;
            proto.mouseUp = function () {
                window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;
                return originalMouseUp.apply(this, arguments);
            };
            proto.__patchedWorldmapMouseUpFallback = true;
        }

        if (typeof proto.mouseMove === "function" && !proto.__patchedWorldmapMouseMoveFallback) {
            var originalMouseMove = proto.mouseMove;
            proto.mouseMove = function (evt) {
                try {
                    if (this && this._dragging && evt && evt.buttonDown == null) {
                        evt.buttonDown = (window.__PATCH_V33_WORLD_MOUSE_DOWN__ === true);
                    }
                } catch (_wmMovePatchErr) { }
                return originalMouseMove.apply(this, arguments);
            };
            proto.__patchedWorldmapMouseMoveFallback = true;
        }

        if (ENABLE_MANUAL_WORLDMAP_DRAG_BRIDGE && !window.__PATCH_V33_WORLDMAP_MANUAL_DRAG_BRIDGE__) {
            window.__PATCH_V33_WORLDMAP_MANUAL_DRAG_BRIDGE__ = {
                active: false
            };

            function getWorldmapForManualDrag() {
                var localHx = window._hx_classes || {};
                var ActiveState = localHx["ActiveState"];
                var Worldmap = localHx["com.cc.worldmap.Worldmap"];
                if (!Worldmap || !Worldmap._mapView) return null;
                try {
                    if (ActiveState && typeof ActiveState.IsWorldMap === "function" && !ActiveState.IsWorldMap()) {
                        return null;
                    }
                } catch (_isWorldErr) {
                    return null;
                }
                var view = Worldmap._mapView;
                try {
                    var visible = (typeof view.get_visible === "function") ? !!view.get_visible() : !!view.visible;
                    if (!visible) return null;
                } catch (_viewVisibleErr) {
                    return null;
                }
                if (typeof view.mouseDown !== "function" || typeof view.mouseMove !== "function" || typeof view.mouseUp !== "function") {
                    return null;
                }
                return view;
            }

            function toStagePoint(evt) {
                var canvas = document.querySelector("canvas");
                if (!canvas || !evt) return null;
                var rect = canvas.getBoundingClientRect();
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top,
                    width: rect.width || (window.innerWidth || 0),
                    height: rect.height || (window.innerHeight || 0)
                };
            }

            function isLikelyHudRegion(x, y, width, height) {
                if (width <= 0 || height <= 0) return false;
                if (y < 110) return true; // top HUD strip
                if (x > width - 250 && y < 180) return true; // attack log + utility cluster
                if (x < 420 && y > height - 270) return true; // chat + sector panel
                if (x > width - 420 && y > height - 270) return true; // bottom-right panel/buttons
                return false;
            }

            function buildSyntheticMouseEvent(view, point, buttonDown) {
                return {
                    stageX: point.x,
                    stageY: point.y,
                    buttonDown: buttonDown ? true : false,
                    target: view,
                    stopImmediatePropagation: function () { },
                    preventDefault: function () { }
                };
            }

            function endManualDrag(evt) {
                var state = window.__PATCH_V33_WORLDMAP_MANUAL_DRAG_BRIDGE__;
                if (!state || !state.active) {
                    window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;
                    return;
                }
                state.active = false;
                window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;

                var view = getWorldmapForManualDrag();
                var point = toStagePoint(evt);
                if (!view || !point) return;

                try {
                    view.mouseUp(buildSyntheticMouseEvent(view, point, false));
                } catch (_manualMouseUpErr) { }
            }

            window.addEventListener("mousedown", function (evt) {
                if (!evt || evt.button !== 0) return;
                var point = toStagePoint(evt);
                if (!point) return;
                if (isLikelyHudRegion(point.x, point.y, point.width, point.height)) return;

                var view = getWorldmapForManualDrag();
                if (!view) return;

                var state = window.__PATCH_V33_WORLDMAP_MANUAL_DRAG_BRIDGE__;
                state.active = true;
                window.__PATCH_V33_WORLD_MOUSE_DOWN__ = true;

                try {
                    view.mouseDown(buildSyntheticMouseEvent(view, point, true));
                } catch (_manualMouseDownErr) {
                    state.active = false;
                    window.__PATCH_V33_WORLD_MOUSE_DOWN__ = false;
                }
            }, true);

            window.addEventListener("mousemove", function (evt) {
                var state = window.__PATCH_V33_WORLDMAP_MANUAL_DRAG_BRIDGE__;
                if (!state || !state.active) return;

                var view = getWorldmapForManualDrag();
                var point = toStagePoint(evt);
                if (!view || !point) {
                    endManualDrag(evt);
                    return;
                }

                try {
                    view.mouseMove(buildSyntheticMouseEvent(view, point, true));
                } catch (_manualMouseMoveErr) {
                    endManualDrag(evt);
                }
            }, true);

            window.addEventListener("mouseup", function (evt) {
                if (!evt || evt.button !== 0) return;
                endManualDrag(evt);
            }, true);

            window.addEventListener("blur", function () {
                endManualDrag(null);
            }, true);

            console.log("[PATCH V33] Worldmap manual drag bridge enabled.");
        }
        if (!ENABLE_MANUAL_WORLDMAP_DRAG_BRIDGE && !window.__PATCH_V33_MANUAL_DRAG_BRIDGE_DISABLED_LOGGED__) {
            window.__PATCH_V33_MANUAL_DRAG_BRIDGE_DISABLED_LOGGED__ = true;
            console.log("[PATCH V33] Worldmap manual drag bridge disabled (native drag path only).");
        }

        HexWorldmapView.prototype.__patchedWorldmapDragInputFallback = true;
        console.log("[PATCH V33] Worldmap drag input fallback enabled.");
    }

    function patchWorldmapNavigationSafety() {
        var hx = window._hx_classes || {};
        var HexWorldmapView = hx["com.cc.worldmap.HexWorldmapView"] || hx["com.cc.worldmap.view.HexWorldmapView"];
        if (!HexWorldmapView || !HexWorldmapView.prototype || HexWorldmapView.prototype.__patchedWorldmapNavigationSafety) return;

        var proto = HexWorldmapView.prototype;

        function isFiniteCoord(v) {
            return typeof v === "number" && isFinite(v);
        }

        function coercePoint(point) {
            if (!point || !isFiniteCoord(point.x) || !isFiniteCoord(point.y)) return null;
            return {
                x: point.x | 0,
                y: point.y | 0
            };
        }

        function resolveSafePoint(view) {
            var fromPlayer = null;
            try {
                if (window.ja && window.ja.playerInfo && typeof window.ja.playerInfo.get_homeBase === "function") {
                    fromPlayer = coercePoint(window.ja.playerInfo.get_homeBase());
                }
            } catch (_homeReadErr) { }
            if (fromPlayer) return fromPlayer;

            var fromSynth = coercePoint(window.__PATCH_V33_SYNTH_HOME_COORD__);
            if (fromSynth) return fromSynth;

            try {
                if (view && view._centerPoint) {
                    var fromCenter = coercePoint(view._centerPoint);
                    if (fromCenter) return fromCenter;
                }
            } catch (_centerReadErr) { }
            return null;
        }

        if (typeof proto.navigateTo === "function" && !proto.__patchedNavigateToNullSafety) {
            var originalNavigateTo = proto.navigateTo;
            proto.navigateTo = function (point, onComplete) {
                var target = coercePoint(point) || resolveSafePoint(this);
                if (!target) {
                    if (!window.__PATCH_V33_NAVIGATE_NULL_WARNED__) {
                        window.__PATCH_V33_NAVIGATE_NULL_WARNED__ = true;
                        console.warn("[PATCH V33] Suppressed navigateTo(null) with no safe fallback point.");
                    }
                    if (typeof onComplete === "function") {
                        try {
                            onComplete();
                        } catch (_navigateCompleteErr) { }
                    }
                    return;
                }

                if (!point || !isFiniteCoord(point.x) || !isFiniteCoord(point.y)) {
                    var guardCount = (window.__PATCH_V33_NAVIGATE_NULL_GUARD_COUNT__ || 0) + 1;
                    window.__PATCH_V33_NAVIGATE_NULL_GUARD_COUNT__ = guardCount;
                    if (guardCount <= 5) {
                        console.warn("[PATCH V33] navigateTo received invalid point; using safe fallback (" + target.x + "," + target.y + ").");
                    }
                }

                return originalNavigateTo.call(this, target, onComplete);
            };
            proto.__patchedNavigateToNullSafety = true;
        }

        if (typeof proto.navigateToBase === "function" && !proto.__patchedNavigateToBaseNullSafety) {
            var originalNavigateToBase = proto.navigateToBase;
            proto.navigateToBase = function () {
                var home = null;
                try {
                    if (window.ja && window.ja.playerInfo && typeof window.ja.playerInfo.get_homeBase === "function") {
                        home = coercePoint(window.ja.playerInfo.get_homeBase());
                    }
                } catch (_homeErr) { }

                if (home) {
                    return this.navigateTo(home);
                }

                var fallback = resolveSafePoint(this);
                if (fallback) {
                    console.warn("[PATCH V33] navigateToBase missing homeBase; using fallback point (" + fallback.x + "," + fallback.y + ").");
                    return this.navigateTo(fallback);
                }

                if (!window.__PATCH_V33_NAVIGATE_BASE_NULL_WARNED__) {
                    window.__PATCH_V33_NAVIGATE_BASE_NULL_WARNED__ = true;
                    console.warn("[PATCH V33] navigateToBase suppressed due to missing homeBase and fallback.");
                }
                return originalNavigateToBase.apply(this, arguments);
            };
            proto.__patchedNavigateToBaseNullSafety = true;
        }

        proto.__patchedWorldmapNavigationSafety = true;
        console.log("[PATCH V33] Worldmap navigation null-safety enabled.");
    }

    function patchWorldmapSubEventSafety() {
        var hx = window._hx_classes || {};
        if (!hx) return;

        function isNullMapCrash(err) {
            var msg = String((err && err.message) || err || "");
            return (
                msg.indexOf("reading 'h'") !== -1 ||
                msg.indexOf("reading \"h\"") !== -1 ||
                msg.indexOf("getSubEventRelatedToBaseRfType") !== -1
            );
        }

        function logSuppressed(tag) {
            var n = (window.__PATCH_V33_WM_SUBEVENT_SUPPRESS_COUNT__ || 0) + 1;
            window.__PATCH_V33_WM_SUBEVENT_SUPPRESS_COUNT__ = n;
            if (n <= 6) {
                console.warn("[PATCH V33] Suppressed " + tag + " null-map crash.");
            } else if (n === 7) {
                console.warn("[PATCH V33] Additional worldmap sub-event null-map suppressions muted.");
            }
        }

        if (!window.__PATCH_V33_WM_NULL_ERROR_GUARD__) {
            window.__PATCH_V33_WM_NULL_ERROR_GUARD__ = true;
            window.addEventListener("error", function (evt) {
                try {
                    var message = String((evt && evt.message) || ((evt && evt.error && evt.error.message) || ""));
                    if (!isNullMapCrash(message)) return;
                    logSuppressed("window.error");
                    if (evt && typeof evt.preventDefault === "function") evt.preventDefault();
                    if (evt && typeof evt.stopImmediatePropagation === "function") evt.stopImmediatePropagation();
                } catch (_wmGlobalErr) { }
            }, true);
            window.addEventListener("unhandledrejection", function (evt) {
                try {
                    var reason = evt ? evt.reason : null;
                    var message = String((reason && reason.message) || reason || "");
                    if (!isNullMapCrash(message)) return;
                    logSuppressed("window.unhandledrejection");
                    if (evt && typeof evt.preventDefault === "function") evt.preventDefault();
                    if (evt && typeof evt.stopImmediatePropagation === "function") evt.stopImmediatePropagation();
                } catch (_wmRejectionErr) { }
            }, true);
        }

        var keys = Object.keys(hx);
        var patchedCanAttack = 0;
        var patchedSubEvent = 0;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var Cls = hx[key];
            if (!Cls || !Cls.prototype) continue;
            var proto = Cls.prototype;

            if (typeof proto.getSubEventRelatedToBaseRfType === "function" && !proto.__patchedSafeGetSubEventRelatedToBaseRfType) {
                var originalGetSubEventRelatedToBaseRfType = proto.getSubEventRelatedToBaseRfType;
                proto.getSubEventRelatedToBaseRfType = function () {
                    try {
                        return originalGetSubEventRelatedToBaseRfType.apply(this, arguments);
                    } catch (e) {
                        if (isNullMapCrash(e)) {
                            logSuppressed("getSubEventRelatedToBaseRfType");
                            return null;
                        }
                        throw e;
                    }
                };
                proto.__patchedSafeGetSubEventRelatedToBaseRfType = true;
                patchedSubEvent++;
            }

            if (typeof proto.isUnderProtectionSubEventBase === "function" && !proto.__patchedSafeIsUnderProtectionSubEventBase) {
                var originalIsUnderProtectionSubEventBase = proto.isUnderProtectionSubEventBase;
                proto.isUnderProtectionSubEventBase = function () {
                    try {
                        return originalIsUnderProtectionSubEventBase.apply(this, arguments);
                    } catch (e) {
                        if (isNullMapCrash(e)) {
                            return false;
                        }
                        throw e;
                    }
                };
                proto.__patchedSafeIsUnderProtectionSubEventBase = true;
                patchedSubEvent++;
            }

            if (typeof proto.isBlockedSubEventBase === "function" && !proto.__patchedSafeIsBlockedSubEventBase) {
                var originalIsBlockedSubEventBase = proto.isBlockedSubEventBase;
                proto.isBlockedSubEventBase = function () {
                    try {
                        return originalIsBlockedSubEventBase.apply(this, arguments);
                    } catch (e) {
                        if (isNullMapCrash(e)) {
                            return false;
                        }
                        throw e;
                    }
                };
                proto.__patchedSafeIsBlockedSubEventBase = true;
                patchedSubEvent++;
            }

            if (typeof proto.canAttackWMEntity === "function" && !proto.__patchedSafeCanAttackWMEntity) {
                var originalCanAttackWMEntity = proto.canAttackWMEntity;
                proto.canAttackWMEntity = function () {
                    try {
                        return originalCanAttackWMEntity.apply(this, arguments);
                    } catch (e) {
                        if (isNullMapCrash(e)) {
                            logSuppressed("canAttackWMEntity");
                            return false;
                        }
                        throw e;
                    }
                };
                proto.__patchedSafeCanAttackWMEntity = true;
                patchedCanAttack++;
            }
        }

        if (!window.__PATCH_V33_WM_SUBEVENT_SAFETY_LOGGED__ && (patchedCanAttack > 0 || patchedSubEvent > 0)) {
            window.__PATCH_V33_WM_SUBEVENT_SAFETY_LOGGED__ = true;
            console.log("[PATCH V33] Worldmap sub-event safety enabled (canAttack=" + patchedCanAttack + ", subEvent=" + patchedSubEvent + ").");
        }
    }

    function stabilizeWorldmapStateTransition() {
        var hx = window._hx_classes || {};
        var ActiveState = hx["ActiveState"];
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!ActiveState || !Worldmap) return;

        var pendingWorldState = getPendingWorldmapStateFlag(hx);
        if (pendingWorldState !== true) {
            window.__PATCH_V33_WM_TRANSITION_STUCK_SINCE__ = 0;
            window.__PATCH_V33_WM_TRANSITION_FORCE_COUNT__ = 0;
            return;
        }

        var now = Date.now();
        var stuckSince = window.__PATCH_V33_WM_TRANSITION_STUCK_SINCE__ || 0;
        if (!stuckSince) {
            window.__PATCH_V33_WM_TRANSITION_STUCK_SINCE__ = now;
            return;
        }
        if ((now - stuckSince) < WORLDMAP_TRANSITION_STUCK_TIMEOUT_MS) return;

        var worldState = getWorldmapStateFlag(hx);
        if (worldState === true) {
            window.__PATCH_V33_WM_TRANSITION_STUCK_SINCE__ = 0;
            window.__PATCH_V33_WM_TRANSITION_FORCE_COUNT__ = 0;
            return;
        }
        if (isWorldmapStableAndUsable(hx)) {
            window.__PATCH_V33_WM_TRANSITION_STUCK_SINCE__ = 0;
            window.__PATCH_V33_WM_TRANSITION_FORCE_COUNT__ = 0;
            return;
        }

        var changingState = getActiveStateChangingFlag(hx);
        if (changingState === false) return;

        var forceCount = window.__PATCH_V33_WM_TRANSITION_FORCE_COUNT__ || 0;
        if (forceCount >= WORLDMAP_TRANSITION_MAX_FORCE_ATTEMPTS) return;

        var controllerReady = false;
        try {
            var ctrl = Worldmap._controller;
            if (ctrl && typeof ctrl.get_hasReceivedAllInfo === "function") {
                controllerReady = !!ctrl.get_hasReceivedAllInfo();
            } else if (ctrl) {
                controllerReady = !!(ctrl._hasMapHeader && ctrl._hasSharedConfigs);
            }
        } catch (_controllerReadyErr) { }
        if (!controllerReady) return;

        var forcedHexReady = false;
        try {
            var hexMap = Worldmap._hexMap || (typeof Worldmap.get_hexMap === "function" ? Worldmap.get_hexMap() : null);
            if (hexMap) {
                // Do not force a transition if the hex-map has no usable cells yet.
                // Forcing here can freeze the world map into border-only terrain.
                var numCells = hexMap._numCells | 0;
                var loadedCells = hexMap._cells && hexMap._cells.length ? (hexMap._cells.length | 0) : 0;
                var currentIndex = hexMap._currentIndex | 0;
                var canSafelyForce = numCells > 0 && loadedCells > 0 && currentIndex >= numCells;
                if (!canSafelyForce) return;

                if (typeof hexMap.markHeaderLoaded === "function") {
                    try {
                        hexMap.markHeaderLoaded();
                    } catch (_markHeaderErr) { }
                }
                hexMap._hasInitializedHeader = true;
                hexMap._isDoneLoading = true;
                forcedHexReady = true;
            }
        } catch (_hexMapPatchErr) { }
        if (!forcedHexReady) return;

        try {
            if (typeof Worldmap.FinishHexMapLoad === "function") {
                Worldmap.FinishHexMapLoad();
            }
        } catch (_finishHexErr) { }
        try {
            if (typeof ActiveState.FinishStateChange === "function") {
                ActiveState.FinishStateChange();
            }
        } catch (_finishStateErr) { }

        forceCount += 1;
        window.__PATCH_V33_WM_TRANSITION_FORCE_COUNT__ = forceCount;
        console.warn("[PATCH V33] Forced worldmap transition completion (attempt " + forceCount + ").");
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
            var worldState = getWorldmapStateFlag(hx);
            var changingState = getActiveStateChangingFlag(hx);
            var hasFinishedLoading = false;
            try {
                hasFinishedLoading = !!(Worldmap.get_hasFinishedLoading && Worldmap.get_hasFinishedLoading());
            } catch (_finishedLoadErr) { }
            // Prevent transition flicker: only create map view after world-state fully enters.
            if (worldState !== true) return;
            if (changingState === true) return;

            var controllerReady = false;
            var hasVisibleEntityInfo = false;
            try {
                var ctrl = Worldmap._controller;
                if (ctrl && typeof ctrl.get_hasReceivedAllInfo === "function") {
                    controllerReady = !!ctrl.get_hasReceivedAllInfo();
                } else if (ctrl) {
                    controllerReady = !!(ctrl._hasMapHeader && ctrl._hasSharedConfigs);
                }
                if (ctrl && typeof ctrl.get_hasVisibleEntityInfo === "function") {
                    hasVisibleEntityInfo = !!ctrl.get_hasVisibleEntityInfo();
                } else if (ctrl) {
                    hasVisibleEntityInfo = !!ctrl._hasVisibleEntityInfo;
                }
            } catch (_controllerReadyErr) { }
            if (!controllerReady) return;
            if (!hasFinishedLoading && !hasVisibleEntityInfo) return;

            if (MAP && (!MAP._terrainManager || typeof MAP._terrainManager.get_terrainSize !== "function")) {
                return;
            }
            if (!isWorldmapTileDataReady(hx)) {
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

    function ensureHexMapLoadProgress() {
        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!Worldmap) return;

        var hexMap = null;
        try {
            hexMap = Worldmap._hexMap || (typeof Worldmap.get_hexMap === "function" ? Worldmap.get_hexMap() : null);
        } catch (_hexRefErr) {
            hexMap = null;
        }
        if (!hexMap) return;

        try {
            if (typeof hexMap.get_isDoneLoading === "function" && hexMap.get_isDoneLoading()) return;
        } catch (_hexDoneReadErr) { }

        if (!hexMap._template || !hexMap._heightFields) return;

        // Drive HexMap decode path when the world-state machine stalls before
        // map header processing completes. This follows native runtime methods
        // instead of forcing done/loading flags.
        try {
            if (typeof hexMap.initializeAndShowMap === "function") {
                hexMap.initializeAndShowMap();
                return;
            }
            if ((!hexMap._hasInitializedHeader || !hexMap._cellData) && typeof hexMap.initData === "function") {
                hexMap.initData(hexMap._heightFields);
                return;
            }
            if (hexMap._cellData && typeof hexMap.processData === "function") {
                hexMap.processData();
            }
        } catch (_hexInitDriveErr) { }
    }

    function syncWorldmapMapViewVisibility() {
        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!Worldmap || !Worldmap._mapView) return;

        var worldState = getWorldmapStateFlag(hx);
        var pendingWorldState = getPendingWorldmapStateFlag(hx);
        var changingState = getActiveStateChangingFlag(hx);
        var inWorldmapFlow = (worldState === true || pendingWorldState === true || changingState === true);
        var currentVisible = null;

        try {
            if (typeof Worldmap._mapView.get_visible === "function") {
                currentVisible = !!Worldmap._mapView.get_visible();
            } else if (typeof Worldmap._mapView.visible !== "undefined") {
                currentVisible = !!Worldmap._mapView.visible;
            }

            if (inWorldmapFlow && currentVisible === false) {
                if (typeof Worldmap._mapView.set_visible === "function") {
                    Worldmap._mapView.set_visible(true);
                } else {
                    Worldmap._mapView.visible = true;
                }
                currentVisible = true;
            }
            if (inWorldmapFlow) {
                window.__PATCH_V33_LAST_WM_FLOW_AT__ = Date.now();
            } else if (currentVisible === true && ENABLE_WORLDMAP_MAPVIEW_AUTOHIDE) {
                var lastFlowAt = window.__PATCH_V33_LAST_WM_FLOW_AT__ || 0;
                var safeToHide = (!lastFlowAt) || ((Date.now() - lastFlowAt) > WORLDMAP_MAPVIEW_VISIBILITY_GRACE_MS);
                if (safeToHide) {
                    if (typeof Worldmap._mapView.set_visible === "function") {
                        Worldmap._mapView.set_visible(false);
                    } else {
                        Worldmap._mapView.visible = false;
                    }
                    currentVisible = false;
                }
            }

            if (worldState === true && Worldmap.__patchV33MapViewVisible !== true && currentVisible === true) {
                Worldmap.__patchV33MapViewVisible = true;
                console.log("[PATCH V33] Worldmap map view visibility -> visible");
            }
        } catch (_mapViewVisibilityErr) { }

        try {
            var lastFlowAtMs = window.__PATCH_V33_LAST_WM_FLOW_AT__ || 0;
            var inFlowGrace = !!lastFlowAtMs && ((Date.now() - lastFlowAtMs) <= WORLDMAP_MAPVIEW_VISIBILITY_GRACE_MS);
            var shouldEnableMouse = currentVisible === true && (inWorldmapFlow || inFlowGrace);
            if (shouldEnableMouse && typeof Worldmap._mapView.mouseEnabled !== "undefined" && !Worldmap._mapView.mouseEnabled) {
                Worldmap._mapView.mouseEnabled = true;
            }
            if (shouldEnableMouse && typeof Worldmap._mapView.mouseChildren !== "undefined" && !Worldmap._mapView.mouseChildren) {
                Worldmap._mapView.mouseChildren = true;
            }
            if (!shouldEnableMouse && typeof Worldmap._mapView.mouseEnabled !== "undefined" && Worldmap._mapView.mouseEnabled) {
                Worldmap._mapView.mouseEnabled = false;
            }
            if (!shouldEnableMouse && typeof Worldmap._mapView.mouseChildren !== "undefined" && Worldmap._mapView.mouseChildren) {
                Worldmap._mapView.mouseChildren = false;
            }
        } catch (_mapViewMouseErr) { }
    }

    function ensureWorldmapCenteredOnHome() {
        var hx = window._hx_classes || {};
        var ActiveState = hx["ActiveState"];
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!ActiveState || !Worldmap || !Worldmap._mapView) return;

        try {
            if (!ActiveState.IsWorldMap || !ActiveState.IsWorldMap()) return;
        } catch (_worldStateErr) {
            return;
        }

        var mapView = Worldmap._mapView;
        var map = mapView._map || null;
        if (!map) return;

        var mapWidth = 0;
        var mapHeight = 0;
        try {
            mapWidth = map.get_mapWidth ? (map.get_mapWidth() | 0) : 0;
            mapHeight = map.get_mapHeight ? (map.get_mapHeight() | 0) : 0;
        } catch (_mapDimErr) { }
        if (mapWidth <= 0 || mapHeight <= 0) return;

        var home = window.__PATCH_V33_SYNTH_HOME_COORD__ || null;
        var targetX = home && isFinite(home.x) ? (home.x | 0) : ((mapWidth / 2) | 0);
        var targetY = home && isFinite(home.y) ? (home.y | 0) : ((mapHeight / 2) | 0);

        if (targetX < 8) targetX = 8;
        if (targetY < 8) targetY = 8;
        if (targetX > mapWidth - 9) targetX = mapWidth - 9;
        if (targetY > mapHeight - 9) targetY = mapHeight - 9;

        var center = mapView._centerPoint || null;
        if (!center) return;

        var currentX = isFinite(center.x) ? (center.x | 0) : targetX;
        var currentY = isFinite(center.y) ? (center.y | 0) : targetY;
        var atEdge = currentX < 16 || currentY < 16 || currentX > (mapWidth - 16) || currentY > (mapHeight - 16);
        var forceLayerResync = false;
        try {
            var baseLayer = mapView._baseLayer || null;
            if (baseLayer && typeof baseLayer.get_numChildren === "function" && baseLayer.get_numChildren() > 0 && typeof baseLayer.getChildAt === "function") {
                var firstBase = baseLayer.getChildAt(0);
                if (firstBase) {
                    var bx = null;
                    var by = null;
                    try { bx = typeof firstBase.get_x === "function" ? firstBase.get_x() : firstBase.x; } catch (_bxReadErr) { }
                    try { by = typeof firstBase.get_y === "function" ? firstBase.get_y() : firstBase.y; } catch (_byReadErr) { }
                    // Broken world-map transform state places base sprites at huge
                    // absolute coordinates (e.g. ~25k,12k) while the camera stays
                    // near 250,250. Force one camera/layer sync when detected.
                    if (isFinite(bx) && isFinite(by) && (Math.abs(bx) > 4000 || Math.abs(by) > 4000)) {
                        forceLayerResync = true;
                    }
                }
            }
        } catch (_baseLayerProbeErr) { }

        var initialSyncPending = !window.__PATCH_V33_WORLDMAP_RECENTER_INITIAL_SYNC_DONE__;
        if (!atEdge && !forceLayerResync && !initialSyncPending) return;

        var appliedKey = String(targetX) + ":" + String(targetY) + ":" + String(mapWidth) + ":" + String(mapHeight);
        if (!forceLayerResync && window.__PATCH_V33_WORLDMAP_RECENTER_APPLIED_KEY__ === appliedKey) return;

        try {
            center.x = targetX;
            center.y = targetY;
            if (typeof mapView.centerOn === "function") {
                mapView.centerOn();
            } else if (typeof mapView.updateMap === "function") {
                mapView.updateMap(true);
            }
            if (typeof mapView.updateMap === "function") {
                mapView.updateMap(true);
            }
            window.__PATCH_V33_WORLDMAP_RECENTER_INITIAL_SYNC_DONE__ = true;
            window.__PATCH_V33_WORLDMAP_RECENTER_APPLIED_KEY__ = appliedKey;
            console.log("[PATCH V33] Recentered world map view to home coordinate (" + targetX + "," + targetY + ").");
        } catch (_recenterErr) { }
    }

    function primeWorldmapNearbyEntities() {
        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        if (!Worldmap || !Worldmap._controller) return;

        var worldState = getWorldmapStateFlag(hx);
        var pendingWorldState = getPendingWorldmapStateFlag(hx);
        var changingState = getActiveStateChangingFlag(hx);
        if (worldState !== true && pendingWorldState !== true && changingState !== true) return;

        var controller = Worldmap._controller;
        var mapService = controller._mapService || null;
        if (!mapService || typeof mapService.nearby !== "function") return;

        var visibleCount = 0;
        try {
            var visibleMap = controller._visibleEntityMap || null;
            if (visibleMap && typeof visibleMap.getValues === "function") {
                var values = visibleMap.getValues();
                if (values) {
                    if (Array.isArray(values)) {
                        visibleCount = values.length | 0;
                    } else if (typeof values.length === "number") {
                        visibleCount = values.length | 0;
                    } else if (typeof values.get_length === "function") {
                        visibleCount = values.get_length() | 0;
                    } else if (values.h && typeof values.h === "object") {
                        visibleCount = Object.keys(values.h).length | 0;
                    }
                }
            }
            if (!visibleCount && visibleMap && visibleMap.h && typeof visibleMap.h === "object") {
                visibleCount = Object.keys(visibleMap.h).length | 0;
            }
        } catch (_visibleCountErr) { }

        // Once map is populated, stop priming nearby fetches.
        if (visibleCount >= 24) return;

        var centerX = 250;
        var centerY = 250;
        var sectorId = 1;
        var regionId = 0;

        try {
            var center = Worldmap._mapView ? Worldmap._mapView._centerPoint : null;
            if (center && isFinite(center.x)) centerX = center.x | 0;
            if (center && isFinite(center.y)) centerY = center.y | 0;
        } catch (_centerErr) { }

        try {
            var fallbackHome = window.__PATCH_V33_SYNTH_HOME_COORD__ || null;
            if (!isFinite(centerX) || centerX <= 0) centerX = fallbackHome && isFinite(fallbackHome.x) ? (fallbackHome.x | 0) : 250;
            if (!isFinite(centerY) || centerY <= 0) centerY = fallbackHome && isFinite(fallbackHome.y) ? (fallbackHome.y | 0) : 250;
            if (fallbackHome && isFinite(fallbackHome.sector) && (fallbackHome.sector | 0) > 0) sectorId = fallbackHome.sector | 0;
            if (fallbackHome && isFinite(fallbackHome.region) && (fallbackHome.region | 0) >= 0) regionId = fallbackHome.region | 0;
        } catch (_homeFallbackErr) { }

        try {
            var activeSector = controller.get_activeSector ? controller.get_activeSector() : controller._activeSector;
            if (activeSector && typeof activeSector.get_id === "function") {
                var sid = activeSector.get_id();
                if (sid != null && isFinite(sid) && (sid | 0) > 0) sectorId = sid | 0;
            }
        } catch (_activeSectorErr) { }

        var now = Date.now();

        // World-map can remain stuck pending when service bootstrap requests are
        // never issued. Drive these calls directly as a local recovery path.
        var needsServiceBootstrap = false;
        try {
            needsServiceBootstrap =
                !controller._hasMapHeader ||
                !controller._hasSharedConfigs ||
                !controller._hasVisibleEntityInfo ||
                !controller._hasDepositInfo ||
                !controller._hasTuningData;
        } catch (_needsBootstrapErr) {
            needsServiceBootstrap = true;
        }

        var serviceLastAt = window.__PATCH_V33_WM_SERVICE_BOOTSTRAP_AT__ || 0;
        if (needsServiceBootstrap && (!serviceLastAt || (now - serviceLastAt) > 3000)) {
            window.__PATCH_V33_WM_SERVICE_BOOTSTRAP_AT__ = now;
            try { if (typeof mapService.getVisibleSectors === "function") mapService.getVisibleSectors(); } catch (_svcVisibleSectorsErr) { }
            try { if (typeof mapService.getVisibleEntities === "function") mapService.getVisibleEntities(regionId); } catch (_svcVisibleEntitiesErr) { }
            try { if (typeof mapService.getBlockedRfBases === "function") mapService.getBlockedRfBases(regionId); } catch (_svcBlockedRfErr) { }
            try {
                if (typeof mapService.getPlayerHome === "function" && window.ja && window.ja.playerInfo && typeof window.ja.playerInfo.get_id === "function") {
                    mapService.getPlayerHome(sectorId, window.ja.playerInfo.get_id());
                }
            } catch (_svcPlayerHomeErr) { }
        }

        var lastAt = window.__PATCH_V33_WM_NEARBY_PRIME_AT__ || 0;
        if (lastAt && (now - lastAt) < 6000) return;

        var key = String(sectorId) + ":" + String(regionId) + ":" + String((centerX / 8) | 0) + ":" + String((centerY / 8) | 0);
        var lastKey = window.__PATCH_V33_WM_NEARBY_PRIME_KEY__ || "";
        if (lastKey === key && lastAt && (now - lastAt) < 30000) return;

        window.__PATCH_V33_WM_NEARBY_PRIME_AT__ = now;
        window.__PATCH_V33_WM_NEARBY_PRIME_KEY__ = key;

        var nearbyTypes = [5, 4, 6, 7, 10];
        for (var i = 0; i < nearbyTypes.length; i++) {
            (function (typeId, delayMs) {
                setTimeout(function () {
                    try {
                        mapService.nearby(sectorId, regionId, centerX, centerY, typeId, null, null, null);
                    } catch (_nearbyPrimeErr) { }
                }, delayMs);
            })(nearbyTypes[i], i * 130);
        }
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
                var existingCells = (instance._cells && instance._cells.length) ? instance._cells : null;
                instance._cellData = null;
                if (!instance._cells) instance._cells = [];
                if (existingCells) {
                    instance._numCells = existingCells.length | 0;
                    instance._currentIndex = instance._numCells;
                } else {
                    instance._numCells = 0;
                    instance._currentIndex = 0;
                }
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
                var hasRenderableCells = !!(this._cells && this._cells.length && this._cells.length > 0);
                if (this._cellData && !hasReadableByteInterface(this._cellData)) {
                    if (!this.__patchV33HexMapProcessBadDataLogged) {
                        this.__patchV33HexMapProcessBadDataLogged = true;
                        console.warn("[PATCH V33] HexMap.processData skipping unreadable cell data.");
                    }
                    if (!hasRenderableCells) {
                        safeFinishHexMap(this);
                    }
                    return;
                }
                try {
                    return originalProcessData.apply(this, arguments);
                } catch (e2) {
                    if (!this.__patchV33HexMapProcessWarned) {
                        this.__patchV33HexMapProcessWarned = true;
                        console.warn("[PATCH V33] HexMap.processData suppressed:", e2);
                    }
                    if (!hasRenderableCells) {
                        safeFinishHexMap(this);
                    }
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
            var regionId = 0;
            var mapId = 1;
            var checksum = 515646777;
            var regionStride = 500;
            var playerId = 123456;
            var homeEntityId = 500001;
            var homeX = 250;
            var homeY = 250;
            var playerInfo = null;

            try {
                if (window.ja && window.ja.playerInfo) {
                    playerInfo = window.ja.playerInfo;
                    if (playerInfo.worldMapNumber != null && isFinite(playerInfo.worldMapNumber) && (playerInfo.worldMapNumber | 0) > 0) {
                        sectorId = playerInfo.worldMapNumber | 0;
                    }
                    if (playerInfo.worldMapId != null && String(playerInfo.worldMapId).length > 0) {
                        mapId = playerInfo.worldMapId;
                    }
                    if (typeof window.ja.playerInfo.get_id === "function") {
                        var pid = window.ja.playerInfo.get_id();
                        if (pid != null) playerId = pid;
                    }
                    if (typeof window.ja.playerInfo.get_homeBaseEntityId === "function") {
                        var hid = window.ja.playerInfo.get_homeBaseEntityId();
                        if (hid != null && hid !== 0) homeEntityId = hid;
                    }
                    if (typeof window.ja.playerInfo.get_homeBase === "function") {
                        var hb = window.ja.playerInfo.get_homeBase();
                        if (hb) {
                            if (hb.x != null && isFinite(hb.x)) homeX = hb.x | 0;
                            if (hb.y != null && isFinite(hb.y)) homeY = hb.y | 0;
                            if (hb.sector != null && isFinite(hb.sector) && (hb.sector | 0) > 0) sectorId = hb.sector | 0;
                            if (hb.region != null && isFinite(hb.region) && (hb.region | 0) >= 0) regionId = hb.region | 0;
                        }
                    }
                }
            } catch (_playerInfoErr) { }

            window.__PATCH_V33_SYNTH_HOME_COORD__ = {
                x: homeX,
                y: homeY,
                sector: sectorId,
                region: regionId
            };

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

            // Guard against null worldMapNumber; the runtime's onVisibleSectorUpdate
            // only auto-selects active sector when this is exactly 0.
            try {
                var runtimePlayerInfo = playerInfo || (window.ja && window.ja.playerInfo ? window.ja.playerInfo : null);
                if (runtimePlayerInfo && runtimePlayerInfo.worldMapNumber == null) {
                    runtimePlayerInfo.worldMapNumber = 0;
                }
            } catch (_wmNumberFixErr) { }

            if (typeof controller.onVisibleSectorUpdate === "function") {
                controller.onVisibleSectorUpdate({ update: visibleSectorUpdate });
            }

            var regionTemplate = new RegionTemplate();
            regionTemplate.set_checksum(checksum);
            regionTemplate.set_layout(3);
            regionTemplate.set_stride(regionStride);
            var templateCellCount = regionStride * regionStride;
            var templateCells = window.__PATCH_V33_SYNTH_REGION_TEMPLATE_CELLS__;
            if (!templateCells || templateCells.length !== templateCellCount) {
                if (!ensureSyntheticRegionTemplateCellsLoaded(regionStride)) {
                    return false;
                }
                templateCells = window.__PATCH_V33_SYNTH_REGION_TEMPLATE_CELLS__;
            }
            if (!templateCells || templateCells.length !== templateCellCount) {
                return false;
            }
            var templateBytes = getSyntheticRegionTemplateBytes(hx, templateCells);
            regionTemplate.set_cells(templateBytes || templateCells);

            var sectorManager = controller._sectorManager || null;
            if (sectorManager && typeof sectorManager.onRegionTemplate === "function") {
                try {
                    sectorManager.onRegionTemplate({
                        get_template: function () { return regionTemplate; }
                    });
                } catch (_cacheTemplateErr) { }
            }

            try {
                if (sectorManager && typeof sectorManager.getSectorBySectorId === "function" && typeof controller.setActiveSector === "function") {
                    var activeSector = sectorManager.getSectorBySectorId(sectorId);
                    if (activeSector) {
                        controller.setActiveSector(activeSector);
                    }
                }
            } catch (_setActiveSectorErr) { }

            if (!hasUsableHexMapCells(hx) && typeof controller.onRegionTemplate === "function") {
                controller.onRegionTemplate(regionTemplate);
            }

            if (typeof controller.OnSharedConfigsInfo === "function") {
                controller.OnSharedConfigsInfo({ configs: [] });
            }

            var realVisibleCount = 0;
            try {
                var existingVisibleMap = controller._visibleEntityMap || null;
                if (existingVisibleMap && typeof existingVisibleMap.getValues === "function") {
                    var existingValues = existingVisibleMap.getValues();
                    if (existingValues) {
                        if (Array.isArray(existingValues)) {
                            realVisibleCount = existingValues.length | 0;
                        } else if (typeof existingValues.length === "number") {
                            realVisibleCount = existingValues.length | 0;
                        } else if (typeof existingValues.get_length === "function") {
                            realVisibleCount = existingValues.get_length() | 0;
                        } else if (existingValues.h && typeof existingValues.h === "object") {
                            realVisibleCount = Object.keys(existingValues.h).length | 0;
                        }
                    }
                } else if (existingVisibleMap && existingVisibleMap.h && typeof existingVisibleMap.h === "object") {
                    realVisibleCount = Object.keys(existingVisibleMap.h).length | 0;
                }
            } catch (_realVisibleProbeErr) { }

            // Avoid replacing real world-map data when live-like rows are already present.
            if (realVisibleCount < 8) {
                var visibleEntityUpdate = new VisibleEntityUpdate();
                function pushEntity(entityId, entityType, x, y, owner, status, extraAttrs) {
                    var entity = new MapEntity();
                    entity.set_entityId(entityId);
                    entity.set_type(entityType);
                    if (owner != null && typeof entity.set_ownerId === "function") {
                        entity.set_ownerId(owner);
                    }
                    entity.set_status(status);

                    var eCoord = new Coord();
                    eCoord.set_sector(sectorId);
                    eCoord.set_region(regionId);
                    eCoord.set_x(x);
                    eCoord.set_y(y);
                    entity.set_coord(eCoord);

                    var attrDp = new Attribute();
                    attrDp.set_key("dp");
                    attrDp.set_value("0");
                    entity.get_attributes().push(attrDp);

                    var attrThorium = new Attribute();
                    attrThorium.set_key("thoriumTotal");
                    attrThorium.set_value("0");
                    entity.get_attributes().push(attrThorium);

                    if (owner != null) {
                        var attrSu = new Attribute();
                        attrSu.set_key("su");
                        attrSu.set_value(String(owner));
                        entity.get_attributes().push(attrSu);
                    }
                    if (extraAttrs && extraAttrs.length) {
                        for (var ai = 0; ai < extraAttrs.length; ai++) {
                            var row = extraAttrs[ai];
                            if (!row || row.length < 2) continue;
                            var attr = new Attribute();
                            attr.set_key(String(row[0] || ""));
                            attr.set_value(String(row[1] == null ? "" : row[1]));
                            entity.get_attributes().push(attr);
                        }
                    }
                    visibleEntityUpdate.get_entities().push(entity);
                }

                function buildOffsets(maxCount) {
                    var out = [];
                    var step = 3;
                    var radius = 0;
                    while (out.length < maxCount && radius < 64) {
                        for (var dx = -radius; dx <= radius; dx++) {
                            for (var dy = -radius; dy <= radius; dy++) {
                                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
                                out.push([dx * step, dy * step]);
                                if (out.length >= maxCount) break;
                            }
                            if (out.length >= maxCount) break;
                        }
                        radius += 1;
                    }
                    return out;
                }

                var denseOffsets = buildOffsets(180);
                var offsetIndex = 0;
                var nextEntityId = homeEntityId;

                function takeOffset() {
                    if (offsetIndex >= denseOffsets.length) return [0, 0];
                    var pair = denseOffsets[offsetIndex++];
                    return [pair[0] | 0, pair[1] | 0];
                }

                // Home base anchor.
                pushEntity(nextEntityId++, 1, homeX, homeY, playerId, 1, [
                    ["baseId", String(homeEntityId)],
                    ["level", "44"],
                    ["damage", "0"],
                    ["cCLevel", "22"]
                ]);

                // Dense player-base cluster.
                for (var pi = 0; pi < 23; pi++) {
                    var po = takeOffset();
                    var playerAttrs = [
                        ["baseId", String(homeEntityId + pi + 1)],
                        ["level", String(30 + (pi % 15))],
                        ["damage", "100"],
                        ["cCLevel", String(8 + (pi % 14))]
                    ];
                    // Companion-style event markers use player-base entities.
                    if (pi < 6) {
                        playerAttrs.push(["specialAttributes", "companion"]);
                        playerAttrs.push(["rogueFactionId", "1"]);
                        playerAttrs.push(["rogueFactionType", "8"]);
                    }
                    pushEntity(
                        nextEntityId++,
                        1,
                        Math.max(0, homeX + po[0]),
                        Math.max(0, homeY + po[1]),
                        playerId + pi + 1,
                        1,
                        playerAttrs
                    );
                }

                // Event/faction/retaliation rogue-base cluster.
                for (var ri = 0; ri < 102; ri++) {
                    var ro = takeOffset();
                    var rogueType = (ri % 3 === 0) ? 1 : ((ri % 3 === 1) ? 42 : 43);
                    var special = (ri % 5 === 0) ? "fortress" : ((ri % 5 === 1) ? "satellite" : "");
                    var attrs = [
                        ["rogueFactionId", String(6 + (ri % 14))],
                        ["rogueFactionType", String(rogueType)],
                        ["level", String(10 + (ri % 40))],
                        ["analyticsTag", (rogueType === 42 ? "faction" : (rogueType === 43 ? "retaliation" : "event"))],
                        ["spawnRuleName", (rogueType === 42 ? "faction_base_alpha_sector" : (rogueType === 43 ? "retaliation_base2_test_f_sector" : "supplydepot_range_10_100"))]
                    ];
                    if (special) attrs.push(["specialAttributes", special]);
                    pushEntity(
                        nextEntityId++,
                        3,
                        Math.max(0, homeX + ro[0]),
                        Math.max(0, homeY + ro[1]),
                        null,
                        1,
                        attrs
                    );
                }

                // Challenge/infestation markers.
                for (var ci = 0; ci < 24; ci++) {
                    var co = takeOffset();
                    pushEntity(
                        nextEntityId++,
                        10,
                        Math.max(0, homeX + co[0]),
                        Math.max(0, homeY + co[1]),
                        null,
                        1,
                        [
                            ["rogueFactionId", String(1 + (ci % 3))],
                            ["rogueFactionType", "44"],
                            ["level", String(10 + ci)],
                            ["specialAttributes", "challenge"]
                        ]
                    );
                }

                if (typeof controller.onVisibleEntityUpdate === "function") {
                    try {
                        controller.onVisibleEntityUpdate({
                            get_response: function () { return visibleEntityUpdate; }
                        });
                    } catch (visibleEntityErr) {
                        console.warn("[PATCH V33] Synthetic visible-entity bootstrap fallback:", visibleEntityErr);
                    }
                }
            }

            // If connection is available, ask for real nearby slices to replace
            // synthetic rows with server-backed entities.
            try {
                var mapService = controller._mapService || null;
                if (mapService && typeof mapService.nearby === "function") {
                    mapService.nearby(sectorId, regionId, homeX, homeY, 5, null, null, null);
                    mapService.nearby(sectorId, regionId, homeX, homeY, 4, null, null, null);
                    mapService.nearby(sectorId, regionId, homeX, homeY, 6, null, null, null);
                    mapService.nearby(sectorId, regionId, homeX, homeY, 7, null, null, null);
                    mapService.nearby(sectorId, regionId, homeX, homeY, 8, null, null, null);
                    mapService.nearby(sectorId, regionId, homeX, homeY, 10, null, null, null);
                }
            } catch (_syntheticNearbyErr) { }

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
        if (DISABLE_SYNTHETIC_WORLDMAP_BOOTSTRAP) {
            if (!window.__PATCH_V33_SYNTH_WM_DISABLED_LOGGED__) {
                window.__PATCH_V33_SYNTH_WM_DISABLED_LOGGED__ = true;
                console.warn("[PATCH V33] Synthetic worldmap bootstrap disabled.");
            }
            return;
        }
        if (!window._hx_classes) return;

        var hx = window._hx_classes || {};
        var Worldmap = hx["com.cc.worldmap.Worldmap"];
        var controller = Worldmap && Worldmap._controller ? Worldmap._controller : null;
        if (!controller) return;

        if (Worldmap && Worldmap._mapView) {
            window.__PATCH_V33_SYNTH_WM_DONE__ = true;
            window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ = 0;
            return;
        }

        // Worldmap controller instances can be recreated after login or reconnect.
        // Track attempts per controller instance so bootstrap can run again if state resets.
        if (!controller.__patchV33SynthControllerId) {
            window.__PATCH_V33_SYNTH_WM_CONTROLLER_COUNTER__ = (window.__PATCH_V33_SYNTH_WM_CONTROLLER_COUNTER__ || 0) + 1;
            controller.__patchV33SynthControllerId = window.__PATCH_V33_SYNTH_WM_CONTROLLER_COUNTER__;
        }
        var controllerId = controller.__patchV33SynthControllerId;
        if (window.__PATCH_V33_SYNTH_WM_ACTIVE_CONTROLLER_ID__ !== controllerId) {
            window.__PATCH_V33_SYNTH_WM_ACTIVE_CONTROLLER_ID__ = controllerId;
            window.__PATCH_V33_SYNTH_WM_ATTEMPTS__ = 0;
            window.__PATCH_V33_SYNTH_WM_LAST_ATTEMPT_AT__ = 0;
            window.__PATCH_V33_SYNTH_WM_DONE__ = false;
        }

        var worldState = getWorldmapStateFlag(hx);
        var pendingWorldState = getPendingWorldmapStateFlag(hx);
        var changingState = getActiveStateChangingFlag(hx);
        var inWorldmapFlow = (worldState === true || pendingWorldState === true || changingState === true);
        if (!inWorldmapFlow) {
            window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ = 0;
            return;
        }

        var now = Date.now();
        var flowStartedAt = window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ || 0;
        if (!flowStartedAt) {
            window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ = now;
            flowStartedAt = now;
        }

        if (isWorldmapStableAndUsable(hx)) {
            window.__PATCH_V33_SYNTH_WM_DONE__ = true;
            window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ = 0;
            return;
        }

        try {
            if (typeof controller.get_hasReceivedAllInfo === "function" && controller.get_hasReceivedAllInfo()) {
                window.__PATCH_V33_SYNTH_WM_DONE__ = true;
                window.__PATCH_V33_SYNTH_WM_FLOW_STARTED_AT__ = 0;
                return;
            }
        } catch (_readyErr) { }

        // Measure fallback timeout from active world-map transition, not total game
        // uptime, so we do not overwrite valid gateway data after long idle sessions.
        var elapsedMs = now - flowStartedAt;
        if (elapsedMs < WORLDMAP_SYNTHETIC_BOOTSTRAP_MIN_MS) return;

        var attempts = window.__PATCH_V33_SYNTH_WM_ATTEMPTS__ || 0;
        if (attempts >= 4) return;

        var lastAttemptAt = window.__PATCH_V33_SYNTH_WM_LAST_ATTEMPT_AT__ || 0;
        if (lastAttemptAt && (now - lastAttemptAt) < 5000) return;
        if (!ensureSyntheticRegionTemplateCellsLoaded(500)) return;

        var missingCriticalData = false;
        try {
            var hasMapHeader = controller.get_hasMapHeader ? !!controller.get_hasMapHeader() : !!controller._hasMapHeader;
            var hasSharedConfigs = controller.get_hasSharedConfigs ? !!controller.get_hasSharedConfigs() : !!controller._hasSharedConfigs;
            var hasBaseInfo = controller.get_hasBaseInfo ? !!controller.get_hasBaseInfo() : !!controller._hasBaseInfo;
            var hasVisibleEntityInfo = controller.get_hasVisibleEntityInfo ? !!controller.get_hasVisibleEntityInfo() : !!controller._hasVisibleEntityInfo;
            var hasDepositInfo = controller.get_hasDepositInfo ? !!controller.get_hasDepositInfo() : !!controller._hasDepositInfo;
            var hasTuningData = controller.get_hasTuningData ? !!controller.get_hasTuningData() : !!controller._hasTuningData;

            missingCriticalData = !hasMapHeader || !hasSharedConfigs || !hasBaseInfo || !hasVisibleEntityInfo || !hasDepositInfo || !hasTuningData;
        } catch (_missingInfoReadErr) {
            missingCriticalData = true;
        }
        if (!missingCriticalData) return;

        window.__PATCH_V33_SYNTH_WM_ATTEMPTS__ = attempts + 1;
        window.__PATCH_V33_SYNTH_WM_LAST_ATTEMPT_AT__ = now;

        var ok = synthesizeWorldmapControllerData(controller);
        if (ok) {
            window.__PATCH_V33_SYNTH_WM_DONE__ = true;
            console.warn("[PATCH V33] Synthetic worldmap bootstrap succeeded (controller " + controllerId + ", attempt " + (attempts + 1) + ").");
        } else if (attempts < 2) {
            console.warn("[PATCH V33] Synthetic worldmap bootstrap attempt failed (controller " + controllerId + ", attempt " + (attempts + 1) + ").");
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

    function patchDirectEnyoSocketFallback() {
        var hx = window._hx_classes || {};
        var DirectSock = hx["com.kixeye.net.DirectEnyoSocketConnection"];
        if (!DirectSock || !DirectSock.prototype || DirectSock.prototype.__patchedLocalNoTlsShim) return;

        if (typeof DirectSock.prototype.createConnection === "function") {
            var originalCreateConnection = DirectSock.prototype.createConnection;
            DirectSock.prototype.createConnection = function (host, port) {
                try {
                    this._currentHost = host || "127.0.0.1";
                    this._currentPort = (port | 0) || 8089;
                    this.__patchV33DirectConnected = true;
                    this.connecting = false;
                    this.socket = null;
                    var self = this;
                    setTimeout(function () {
                        try {
                            if (typeof self.onConnect === "function") {
                                self.onConnect({ type: "connect", forced: true });
                            }
                        } catch (e) {
                            console.warn("[PATCH V33] DirectEnyo local connect dispatch failed:", e);
                        }
                    }, 0);
                    return;
                } catch (shimErr) {
                    console.warn("[PATCH V33] DirectEnyo local createConnection shim failed, falling back:", shimErr);
                    return originalCreateConnection.apply(this, arguments);
                }
            };
        }

        if (typeof DirectSock.prototype.get_connected === "function") {
            var originalGetConnected = DirectSock.prototype.get_connected;
            DirectSock.prototype.get_connected = function () {
                if (this.__patchV33DirectConnected) return true;
                try {
                    return originalGetConnected.apply(this, arguments);
                } catch (e) {
                    return false;
                }
            };
        }

        if (typeof DirectSock.prototype.sendDirectMessage === "function") {
            var originalSendDirectMessage = DirectSock.prototype.sendDirectMessage;
            DirectSock.prototype.sendDirectMessage = function () {
                if (this.__patchV33DirectConnected) {
                    return;
                }
                return originalSendDirectMessage.apply(this, arguments);
            };
        }

        if (typeof DirectSock.prototype.closeConnection === "function") {
            var originalCloseConnection = DirectSock.prototype.closeConnection;
            DirectSock.prototype.closeConnection = function () {
                this.__patchV33DirectConnected = false;
                return originalCloseConnection.apply(this, arguments);
            };
        }

        if (typeof DirectSock.prototype.resetConnection === "function") {
            var originalResetConnection = DirectSock.prototype.resetConnection;
            DirectSock.prototype.resetConnection = function () {
                this.__patchV33DirectConnected = false;
                return originalResetConnection.apply(this, arguments);
            };
        }

        DirectSock.prototype.__patchedLocalNoTlsShim = true;
        console.log("[PATCH V33] DirectEnyoSocketConnection local no-TLS shim enabled.");
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

    function patchUnitCardSafety() {
        var hx = window._hx_classes || {};
        var WidgetCard = hx["com.cc.widget.cards.WidgetCard"];
        var WidgetUnitCard = hx["com.cc.widget.cards.WidgetUnitCard"];

        function shouldSuppressCardError(err) {
            var msg = String((err && err.message) || err || "");
            return msg.indexOf("addChild") !== -1 ||
                msg.indexOf("removeChild") !== -1 ||
                msg.indexOf("contains") !== -1 ||
                msg.indexOf("null") !== -1;
        }

        function ensureCardInitialized(card) {
            if (!card || card._background) return !!(card && card._background);

            try {
                if (typeof card.buildIfReady === "function") {
                    card.buildIfReady();
                }
            } catch (_buildErr) { }

            if (card._background) return true;

            try {
                if (typeof card.areAssetsLoaded === "function" && card.areAssetsLoaded() && typeof card.initialize === "function") {
                    card.initialize();
                }
            } catch (_initErr) { }

            return !!card._background;
        }

        function createFallbackFrame() {
            var Sprite = hx["openfl.display.Sprite"] ||
                hx["openfl.display.MovieClip"] ||
                (window.openfl && window.openfl.display && window.openfl.display.Sprite);
            if (!Sprite) return null;
            try {
                return new Sprite();
            } catch (_spriteErr) {
                return null;
            }
        }

        if (WidgetCard && WidgetCard.prototype && !WidgetCard.prototype.__patchedSafeWidgetCard) {
            var cardProto = WidgetCard.prototype;

            if (typeof cardProto.initialize === "function") {
                var originalInitialize = cardProto.initialize;
                cardProto.initialize = function () {
                    var result = originalInitialize.apply(this, arguments);
                    try {
                        if (this.__pendingCardTitle != null && this._title && typeof this._title.set_text === "function") {
                            this._title.set_text(this.__pendingCardTitle);
                        }
                    } catch (_pendingTitleErr) { }
                    try {
                        if (this.__pendingCardBottomText != null && this._bottomText && typeof this._bottomText.set_text === "function") {
                            this._bottomText.set_text(this.__pendingCardBottomText);
                        }
                    } catch (_pendingBottomErr) { }
                    try {
                        if (this.__pendingCardArtId != null && typeof this.setBackgroundFromRarityArtId === "function") {
                            this.setBackgroundFromRarityArtId(this.__pendingCardArtId);
                        }
                    } catch (_pendingArtErr) { }
                    return result;
                };
            }

            if (typeof cardProto.setBackgroundFromRarityArtId === "function") {
                var originalSetBackgroundFromRarityArtId = cardProto.setBackgroundFromRarityArtId;
                cardProto.setBackgroundFromRarityArtId = function (artId) {
                    this._artId = (artId == null || artId === "") ? "default" : artId;
                    this.__pendingCardArtId = this._artId;
                    try {
                        ensureCardInitialized(this);
                        if (!this._background || typeof this._background.addChild !== "function") return;
                        return originalSetBackgroundFromRarityArtId.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        try {
                            if (this._background && typeof this._background.addChild === "function") {
                                if (typeof H !== "undefined" && H && typeof H.clearChildren === "function") {
                                    H.clearChildren(this._background);
                                }
                                var frame = null;
                                try {
                                    frame = (typeof this.getFrameFromArtId === "function") ? this.getFrameFromArtId(this._artId) : null;
                                } catch (_frameErr) { }
                                if (!frame) frame = createFallbackFrame();
                                if (frame) this._background.addChild(frame);
                                if (typeof this.updateLength === "function") this.updateLength();
                            }
                        } catch (_fallbackErr) { }
                        console.warn("[PATCH V33] WidgetCard.setBackgroundFromRarityArtId suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.set_title === "function") {
                var originalSetTitle = cardProto.set_title;
                cardProto.set_title = function (value) {
                    this.__pendingCardTitle = value;
                    try {
                        ensureCardInitialized(this);
                        if (!this._title || typeof this._title.set_text !== "function") return value;
                        return originalSetTitle.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.set_title suppressed:", e);
                        return value;
                    }
                };
            }

            if (typeof cardProto.set_bottomText === "function") {
                var originalSetBottomText = cardProto.set_bottomText;
                cardProto.set_bottomText = function (value) {
                    this.__pendingCardBottomText = value;
                    try {
                        ensureCardInitialized(this);
                        if (!this._bottomText || typeof this._bottomText.set_text !== "function") return value;
                        return originalSetBottomText.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.set_bottomText suppressed:", e);
                        return value;
                    }
                };
            }

            if (typeof cardProto.set_isSelected === "function") {
                var originalSetIsSelected = cardProto.set_isSelected;
                cardProto.set_isSelected = function (value) {
                    this._isSelected = !!value;
                    try {
                        ensureCardInitialized(this);
                        if (!this._backgroundButton || typeof this._backgroundButton.set_selected !== "function") return this._isSelected;
                        return originalSetIsSelected.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.set_isSelected suppressed:", e);
                        return this._isSelected;
                    }
                };
            }

            if (typeof cardProto.isClickable === "function") {
                var originalIsClickable = cardProto.isClickable;
                cardProto.isClickable = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._backgroundButton || typeof this._backgroundButton.set_enabled !== "function") return;
                        return originalIsClickable.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.isClickable suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.addToCenterOverlay === "function") {
                var originalAddToCenterOverlay = cardProto.addToCenterOverlay;
                cardProto.addToCenterOverlay = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._centerContainer || typeof this._centerContainer.addChild !== "function") return;
                        return originalAddToCenterOverlay.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.addToCenterOverlay suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.clearCenterOverlay === "function") {
                var originalClearCenterOverlay = cardProto.clearCenterOverlay;
                cardProto.clearCenterOverlay = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._centerContainer) return;
                        return originalClearCenterOverlay.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.clearCenterOverlay suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.removeFromCenterOverlay === "function") {
                var originalRemoveFromCenterOverlay = cardProto.removeFromCenterOverlay;
                cardProto.removeFromCenterOverlay = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._centerContainer || typeof this._centerContainer.contains !== "function") return;
                        return originalRemoveFromCenterOverlay.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.removeFromCenterOverlay suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.updateLength === "function") {
                var originalUpdateLength = cardProto.updateLength;
                cardProto.updateLength = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._background) return;
                        return originalUpdateLength.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.updateLength suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof cardProto.hideBackground === "function") {
                var originalHideBackground = cardProto.hideBackground;
                cardProto.hideBackground = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._background) return;
                        return originalHideBackground.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetCard.hideBackground suppressed:", e);
                        return;
                    }
                };
            }

            WidgetCard.prototype.__patchedSafeWidgetCard = true;
        }

        if (WidgetUnitCard && WidgetUnitCard.prototype && !Object.prototype.hasOwnProperty.call(WidgetUnitCard.prototype, "__patchedSafeWidgetUnitCard")) {
            var unitProto = WidgetUnitCard.prototype;

            if (typeof unitProto.populatePortrait === "function") {
                var originalPopulatePortrait = unitProto.populatePortrait;
                unitProto.populatePortrait = function () {
                    try {
                        ensureCardInitialized(this);
                        if (!this._foreground || typeof this._foreground.addChild !== "function") return;
                        return originalPopulatePortrait.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetUnitCard.populatePortrait suppressed:", e);
                        return;
                    }
                };
            }

            if (typeof unitProto.set_promotionId === "function") {
                var originalSetPromotionId = unitProto.set_promotionId;
                unitProto.set_promotionId = function () {
                    try {
                        return originalSetPromotionId.apply(this, arguments);
                    } catch (e) {
                        if (!shouldSuppressCardError(e)) throw e;
                        console.warn("[PATCH V33] WidgetUnitCard.set_promotionId suppressed:", e);
                        return this._promotionId || 0;
                    }
                };
            }

            WidgetUnitCard.prototype.__patchedSafeWidgetUnitCard = true;
        }
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
        var hx = window._hx_classes || {};
        var STORE = hx["com.cc.purchase.store.StoreManager"] || hx["STORE"];
        var STORE_ALIAS = hx["STORE"];
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

        function ensureStoreStatics() {
            var now = (Date.now() / 1000) | 0;
            var fallbackStoreId = "Daily Deals";
            var fallbackCategory = "All";
            var fallbackSubcategory = "All";
            function makeIterableMap(hash) {
                var data = (hash && typeof hash === "object") ? hash : {};
                return {
                    h: data,
                    iterator: function () {
                        var keys = Object.keys(this.h || {});
                        var index = 0;
                        var self = this;
                        return {
                            hasNext: function () {
                                return index < keys.length;
                            },
                            next: function () {
                                var key = keys[index++];
                                return self.h[key];
                            }
                        };
                    }
                };
            }

            var fallbackUIConfig = {
                storeToConfig: makeIterableMap({}),
                getSortedStoreIds: function () {
                    return [fallbackStoreId];
                }
            };
            fallbackUIConfig.storeToConfig.h[fallbackStoreId] = {
                displayName: fallbackStoreId,
                storeIcon: "",
                costSku: "gold"
            };

            var fallbackHierarchy = makeIterableMap({});
            fallbackHierarchy.h[fallbackStoreId] = {
                sortedCategories: [fallbackCategory],
                categories: {
                    h: {
                        All: {
                            subcategories: { h: { All: true } }
                        }
                    }
                },
                sortedSubcategoriesByCategory: {
                    h: {
                        All: [fallbackSubcategory]
                    }
                }
            };

            var fallbackStoreData = {
                storeToData: makeIterableMap({})
            };
            fallbackStoreData.storeToData.h[fallbackStoreId] = {
                itemsData: makeIterableMap({}),
                availabilities: [{ to: now + 86400 }]
            };
            var fallbackItemListByStore = makeIterableMap({});
            fallbackItemListByStore.h[fallbackStoreId] = [];

            function ensureSignal(name) {
                var signal = STORE[name];
                if (!signal || typeof signal.add !== "function" || typeof signal.remove !== "function") {
                    STORE[name] = {
                        add: function () { },
                        remove: function () { }
                    };
                }
            }

            var originalGetStoreUIConfig = (typeof STORE.get_storeUIConfig === "function") ? STORE.get_storeUIConfig : null;
            STORE.get_storeUIConfig = function () {
                var uiConfig = null;
                try {
                    uiConfig = originalGetStoreUIConfig ? originalGetStoreUIConfig.apply(this, arguments) : null;
                } catch (_uiErr) {
                    uiConfig = null;
                }
                if (!uiConfig || typeof uiConfig !== "object") return fallbackUIConfig;
                if (!uiConfig.storeToConfig || typeof uiConfig.storeToConfig !== "object") uiConfig.storeToConfig = makeIterableMap({});
                if (!uiConfig.storeToConfig.h || typeof uiConfig.storeToConfig.h !== "object") uiConfig.storeToConfig.h = {};
                if (typeof uiConfig.storeToConfig.iterator !== "function") {
                    uiConfig.storeToConfig.iterator = makeIterableMap(uiConfig.storeToConfig.h).iterator;
                }
                if (typeof uiConfig.getSortedStoreIds !== "function") {
                    uiConfig.getSortedStoreIds = function () {
                        var keys = Object.keys(uiConfig.storeToConfig.h || {});
                        return keys.length ? keys : [fallbackStoreId];
                    };
                }
                if (!uiConfig.storeToConfig.h[fallbackStoreId]) {
                    uiConfig.storeToConfig.h[fallbackStoreId] = fallbackUIConfig.storeToConfig.h[fallbackStoreId];
                }
                return uiConfig;
            };

            var originalGetStoreHierarchy = (typeof STORE.get_storeHierarchy === "function") ? STORE.get_storeHierarchy : null;
            STORE.get_storeHierarchy = function () {
                var hierarchy = null;
                try {
                    hierarchy = originalGetStoreHierarchy ? originalGetStoreHierarchy.apply(this, arguments) : null;
                } catch (_hierErr) {
                    hierarchy = null;
                }
                if (!hierarchy || typeof hierarchy !== "object") return fallbackHierarchy;
                if (!hierarchy.h || typeof hierarchy.h !== "object") hierarchy.h = {};
                if (typeof hierarchy.iterator !== "function") {
                    hierarchy.iterator = makeIterableMap(hierarchy.h).iterator;
                }
                if (!hierarchy.h[fallbackStoreId]) hierarchy.h[fallbackStoreId] = fallbackHierarchy.h[fallbackStoreId];
                return hierarchy;
            };

            var originalGetStoreData = (typeof STORE.get_storeData === "function") ? STORE.get_storeData : null;
            STORE.get_storeData = function () {
                var data = null;
                try {
                    data = originalGetStoreData ? originalGetStoreData.apply(this, arguments) : null;
                } catch (_dataErr) {
                    data = null;
                }
                if (!data || typeof data !== "object") return fallbackStoreData;
                if (!data.storeToData || typeof data.storeToData !== "object") data.storeToData = makeIterableMap({});
                if (!data.storeToData.h || typeof data.storeToData.h !== "object") data.storeToData.h = {};
                if (typeof data.storeToData.iterator !== "function") {
                    data.storeToData.iterator = makeIterableMap(data.storeToData.h).iterator;
                }
                if (!data.storeToData.h[fallbackStoreId]) data.storeToData.h[fallbackStoreId] = fallbackStoreData.storeToData.h[fallbackStoreId];
                if (!data.storeToData.h[fallbackStoreId].itemsData || typeof data.storeToData.h[fallbackStoreId].itemsData !== "object") {
                    data.storeToData.h[fallbackStoreId].itemsData = makeIterableMap({});
                }
                if (!data.storeToData.h[fallbackStoreId].itemsData.h || typeof data.storeToData.h[fallbackStoreId].itemsData.h !== "object") {
                    data.storeToData.h[fallbackStoreId].itemsData.h = {};
                }
                if (typeof data.storeToData.h[fallbackStoreId].itemsData.iterator !== "function") {
                    data.storeToData.h[fallbackStoreId].itemsData.iterator = makeIterableMap(data.storeToData.h[fallbackStoreId].itemsData.h).iterator;
                }
                return data;
            };

            var originalGetItemListByStore = (typeof STORE.get_itemListByStore === "function") ? STORE.get_itemListByStore : null;
            STORE.get_itemListByStore = function () {
                var itemListByStore = null;
                try {
                    itemListByStore = originalGetItemListByStore ? originalGetItemListByStore.apply(this, arguments) : null;
                } catch (_itemListErr) {
                    itemListByStore = null;
                }
                if (!itemListByStore || typeof itemListByStore !== "object") itemListByStore = fallbackItemListByStore;
                if (!itemListByStore.h || typeof itemListByStore.h !== "object") itemListByStore.h = {};
                if (!Array.isArray(itemListByStore.h[fallbackStoreId])) itemListByStore.h[fallbackStoreId] = [];
                if (typeof itemListByStore.iterator !== "function") {
                    itemListByStore.iterator = makeIterableMap(itemListByStore.h).iterator;
                }
                STORE._itemListByStore = itemListByStore;
                return itemListByStore;
            };

            if (typeof STORE.get_storeTime !== "function") {
                STORE.get_storeTime = function () {
                    return (Date.now() / 1000) | 0;
                };
            }
            if (typeof STORE.isSimulatingStoreTime !== "function") {
                STORE.isSimulatingStoreTime = function () {
                    return false;
                };
            }
            if (typeof STORE.getStoreSimulatedTime !== "function") {
                STORE.getStoreSimulatedTime = function () {
                    return "";
                };
            }
            if (typeof STORE.getPlayerPlatformName !== "function") {
                STORE.getPlayerPlatformName = function () {
                    return "All";
                };
            }

            if (!STORE._itemListByStore || typeof STORE._itemListByStore !== "object") {
                STORE._itemListByStore = fallbackItemListByStore;
            }
            if (!STORE._itemListByStore.h || typeof STORE._itemListByStore.h !== "object") {
                STORE._itemListByStore.h = {};
            }
            if (!Array.isArray(STORE._itemListByStore.h[fallbackStoreId])) {
                STORE._itemListByStore.h[fallbackStoreId] = [];
            }
            if (typeof STORE._itemListByStore.iterator !== "function") {
                STORE._itemListByStore.iterator = makeIterableMap(STORE._itemListByStore.h).iterator;
            }

            ensureSignal("storeUpdatedSignal");
            ensureSignal("storeItemUnlocked");
        }

        ensureStoreStatics();

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

        if (STORE_ALIAS && STORE_ALIAS !== STORE && !STORE_ALIAS.__patchedSafeStore) {
            STORE_ALIAS.get_storeUIConfig = function () { return STORE.get_storeUIConfig.apply(STORE, arguments); };
            STORE_ALIAS.get_storeHierarchy = function () { return STORE.get_storeHierarchy.apply(STORE, arguments); };
            STORE_ALIAS.get_storeData = function () { return STORE.get_storeData.apply(STORE, arguments); };
            STORE_ALIAS.get_itemListByStore = function () { return STORE.get_itemListByStore.apply(STORE, arguments); };
            STORE_ALIAS.get_storeTime = function () { return STORE.get_storeTime.apply(STORE, arguments); };
            STORE_ALIAS.isSimulatingStoreTime = function () { return STORE.isSimulatingStoreTime.apply(STORE, arguments); };
            STORE_ALIAS.getStoreSimulatedTime = function () { return STORE.getStoreSimulatedTime.apply(STORE, arguments); };
            STORE_ALIAS.getPlayerPlatformName = function () { return STORE.getPlayerPlatformName.apply(STORE, arguments); };
            STORE_ALIAS._itemListByStore = STORE._itemListByStore;
            STORE_ALIAS.storeUpdatedSignal = STORE.storeUpdatedSignal;
            STORE_ALIAS.storeItemUnlocked = STORE.storeItemUnlocked;
            STORE_ALIAS.__patchedSafeStore = true;
        }
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
    var HEAVY_WORLD_PATCH_EVERY = 4;
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
        patchTutorialCompletionSafety();
        patchLoginProcess();
        patchGameInitParams();
        patchWorldmapDisconnectSafety();
        patchGatewayHttpBootstrap();
        patchGatewayAuthBootstrap();
        patchUInt64Safety();
        patchDisplayListSafety();
        patchDailyMissionHudSafety();
        patchMissionToolServiceSafety();
        patchAttackLogServiceFallback();
        patchAttackLogTimeoutSafety();
        patchTimeSync();
        patchContractLoader();
        patchCDNLoader();
        patchBuildingDataSafety();
        patchBaseSafety();
        patchDefenderFireteamSafety();
        patchFootprintSafety();
        patchBattleSafety();
        patchDirectEnyoSocketFallback();
        patchReticleSafety();
        patchSwfAssetBitmapFallback();
        patchWidgetColorBarSafety();
        patchUnitCardSafety();
        patchPlatoonManifestDefaults();
        patchUpdatesCheck();
        patchStoreSafety();
        patchHudMapButtonsFallback();
        patchWorldmapDragInputFallback();
        patchWorldmapNavigationSafety();
        patchWorldmapSubEventSafety();
        bootstrapGameDataIfMissing();
        clearConnectionPopups();
        ensureCDNManifestInitialized();
        nudgeBlockingLoaders();
        autoLoadSharedConfigs();
        forceGameStart();

        if (loopCount % HEAVY_WORLD_PATCH_EVERY === 0) {
            patchMapResetSafety();
            ensureHexMapLoadProgress();
            stabilizeWorldmapStateTransition();
            patchWorldmapViewBootstrap();
            syncWorldmapMapViewVisibility();
            ensureWorldmapCenteredOnHome();
            primeWorldmapNearbyEntities();
            patchMapLayerCallSafety();
            patchHexMapSafety();
            reconcileDetachedBaseRender();
        }
        if (loopCount % (HEAVY_WORLD_PATCH_EVERY * 2) === 0) {
            trySyntheticWorldmapBootstrap();
        }

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
    }, 100); // 100ms loop with throttled heavy world-map patches

    // --- EXPOSE GLOBAL PATCHER ---
    window.applyPatchesNow = function () {
        console.log("[PATCH V33] Force applying patches now...");
        hookUrlLoader();
        patchLocalization();
        patchGlobalErrorHandling();
        patchTutorialCompletionSafety();
        patchLoginProcess();
        patchGameInitParams();
        patchWorldmapDisconnectSafety();
        patchGatewayHttpBootstrap();
        patchGatewayAuthBootstrap();
        patchUInt64Safety();
        patchMapResetSafety();
        ensureHexMapLoadProgress();
        stabilizeWorldmapStateTransition();
        patchWorldmapViewBootstrap();
        syncWorldmapMapViewVisibility();
        ensureWorldmapCenteredOnHome();
        primeWorldmapNearbyEntities();
        patchMapLayerCallSafety();
        patchHexMapSafety();
        reconcileDetachedBaseRender();
        trySyntheticWorldmapBootstrap();
        patchDisplayListSafety();
        patchDailyMissionHudSafety();
        patchMissionToolServiceSafety();
        patchAttackLogServiceFallback();
        patchAttackLogTimeoutSafety();
        patchTimeSync();
        patchBuildingDataSafety();
        patchBaseSafety();
        patchDefenderFireteamSafety();
        patchFootprintSafety();
        patchBattleSafety();
        patchDirectEnyoSocketFallback();
        patchReticleSafety();
        patchSwfAssetBitmapFallback();
        patchWidgetColorBarSafety();
        patchUnitCardSafety();
        patchUpdatesCheck();
        patchStoreSafety();
        patchHudMapButtonsFallback();
        patchWorldmapDragInputFallback();
        patchWorldmapNavigationSafety();
        patchWorldmapSubEventSafety();
        bootstrapGameDataIfMissing();
        clearConnectionPopups();
    };

})();
