(function () {
    console.log("[PATCH V32] Initializing Runtime Patches v3 CHECK...");

    var attempts = { setupStage: 0, initLocal: 0, onDataFinishedLoading: 0, worldMap: 0 };
    var success = { setupStage: false, initLocal: false, onDataFinishedLoading: false };
    var MAX_ATTEMPTS = 5;

    // --- PATCH: Intercept XHR for Assets ---
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.indexOf("http") === -1 || url.indexOf("localhost") !== -1) {
            // Redirect to our local server on 8089 if not already
            if (url.indexOf("http://localhost:8089") === -1) {
                var newUrl = url;
                if (url.startsWith("/")) newUrl = "http://localhost:8089" + url;
                else newUrl = "http://localhost:8089/" + url;
                // console.log("[PATCH V32] Redirecting XHR: " + url + " -> " + newUrl);
                url = newUrl;
            }
        }
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
                var url = urlRequest.url;

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

        // --- PATCH: Hook Loader (for Images) ---
        var LoaderClass = (window._hx_classes && window._hx_classes["openfl.display.Loader"]) || (window.openfl && window.openfl.display && window.openfl.display.Loader);
        if (LoaderClass && LoaderClass.prototype && !LoaderClass.prototype.__patched) {
            console.log("[PATCH V32] Hooking Loader.load");
            var originalLoaderLoad = LoaderClass.prototype.load;
            LoaderClass.prototype.load = function (urlRequest) {
                var url = urlRequest.url;
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
                            var fallbacks = {
                                "common__error": "Error",
                                "global_body__reload_to_continue_error": "A critical error occurred. Please reload.",
                                "error_code__error_wrapper": "Error Code: {code} - {message}",
                                "common_button__reconnect": "Reconnect",
                                "common__processing": "Processing...",
                                "updates_title__welcome_back": "Welcome Back!",
                                "updates_body__welcome_back": "Loading your base...",
                                "global_header__error": "Initialization Error"
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

    // --- PATCH: Time Synchronization ---
    function patchTimeSync() {
        console.log("DEBUG: patchTimeSync running");
        var GLOBAL = (window._hx_classes && window._hx_classes["GLOBAL"]);
        console.log("DEBUG: GLOBAL is " + (GLOBAL ? "FOUND" : "MISSING"));

        if (GLOBAL) {
            console.log("[PATCH V32] Hooking GLOBAL.setServerTimestampSeconds & setLocalTimestampSeconds");

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

                // console.log("[ANTIGRAVITY_DEBUG] setLocalTimestampSeconds set to: " + a);
            };

            GLOBAL.__patchedTime = true;
        }
    }

    // --- MAIN LOOP ---
    var loopCount = 0;
    var mainInterval = setInterval(function () {
        loopCount++;

        // Aggressively try to hook
        hookUrlLoader();
        patchLocalization();
        patchGlobalErrorHandling();
        patchLoginProcess();
        patchTimeSync();

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
        console.log("[PATCH V32] Force applying patches now...");
        hookUrlLoader();
        patchLocalization();
        patchGlobalErrorHandling();
        patchLoginProcess();
        patchTimeSync();
    };

})();
