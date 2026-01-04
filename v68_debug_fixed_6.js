var window = {}; var document = {}; var console = { warn: function(){}, log: function(){}, error: function(){} };
        window.__LOGS__ = [];
        (function () {
            window.ANTIGRAVITY_V68_LOADED = true;
            window.V68_STATUS = {
                started: true,
                patchNetwork: 0,
                patchAsset: 0,
                stageFound: false,
                greenBoxDrawn: false,
                attempts: 0,
                stageSource: null
            };
            console.warn("ANTIGRAVITY V68: STARTING PATCH (AssetLoader & Map Fix) - INLINE HEAD");
            console.log("ANTIGRAVITY SCRIPT START - SANITY CHECK");

            // [V68] REVERTED TO SIMPLE POLLER (Proxy was blocking)
            console.warn("ANTIGRAVITY V68: STARTING PATCH (Simple Poller Mode)");

            // [V68] POLLER (HEAD INJECTION - REPAIRED)
            (function () {
                console.error("[V68-LOGIN-HEAD] POLLER STARTED (1ms)!");
                var maxAttempts = 5000;
                var attempts = 0;

                window.findStage = function () {
                    if (window.V68_STAGE_REF) return window.V68_STAGE_REF;
                    try {
                        if (window.GAME) {
                            var inst = window.GAME._instance || window.GAME.instance;
                            if (inst && inst.stage) return inst.stage;
                        }
                        if (window._hx_classes) {
                            var Lib = window._hx_classes["openfl.Lib"];
                            if (Lib && Lib.current && Lib.current.stage) return Lib.current.stage;
                        }
                    } catch (e) { console.error("[V68] findStage Error", e); }
                    return null;
                };
                window.drawGreenBox = function (stage) {
                    try {
                        if (!window._hx_classes) return;
                        var Sprite = window._hx_classes["openfl.display.Sprite"];
                        var TextField = window._hx_classes["openfl.text.TextField"];
                        var TextFormat = window._hx_classes["openfl.text.TextFormat"];

                        var bg = new Sprite();
                        var g = bg.get_graphics ? bg.get_graphics() : bg.graphics;
                        if (g) {
                            g.beginFill(0x0000FF);
                            g.drawRect(0, 0, 50, 50); // Small corner box
                            g.endFill();
                            stage.addChild(bg);
                        }

                        // Also Patch MAP if available (JIT)
                        try {
                            if (window._hx_classes && window._hx_classes["com.cc.core.MAP"]) {
                                var M = window._hx_classes["com.cc.core.MAP"];
                                if (M.Init && !M.Init.patched) {
                                    var origInit = M.Init;
                                    M.Init = function () {
                                        console.warn("[V68-MAP] MAP.Init Called!");
                                        var ret;
                                        try {
                                            ret = origInit.apply(this, arguments);
                                            console.warn("[V68-MAP] Init Executed.");
                                            console.warn("[V68-MAP] Instance Keys:", Object.keys(this));

                                            // Try Reset if layers missing
                                            if (M.Reset) {
                                                console.warn("[V68-MAP] Calling MAP.Reset()...");
                                                M.Reset();
                                            }
                                        } catch (e) { console.error("[V68-MAP] Init/Reset Error", e); }

                                        // FORCE TERRAIN MANAGER LOAD
                                        try {
                                            if (this.get_terrainManager) {
                                                var tm = this.get_terrainManager();
                                                if (tm) {
                                                    console.warn("[V68-MAP] Forcing Terrain Load (tm found)...");
                                                    if (tm.attemptToLoadTerrain) {
                                                        tm.attemptToLoadTerrain(null);
                                                    } else {
                                                        console.warn("[V68-MAP] tm.attemptToLoadTerrain missing?");
                                                    }
                                                }
                                            }
                                        } catch (e) { console.error("[V68-MAP] Force Terrain Error", e); }

                                        // FORCE CAMERA FOCUS
                                        try {
                                            console.warn("[V68-MAP] Forcing Camera Focus (100,100)...");
                                            if (M.FocusToMapCoord) M.FocusToMapCoord(100, 100);
                                            else if (M.FocusTo) M.FocusTo(100, 100);
                                        } catch (e) { console.error("[V68-MAP] Focus Error", e); }

                                        return ret;
                                    };
                                    M.Init.patched = true;

                                    // Patch Layer Adding
                                    if (M.addNewLayer) {
                                        var origAdd = M.addNewLayer;
                                        M.addNewLayer = function (layer, depth) {
                                            console.warn("[V68-MAP] addNewLayer called!", layer, depth);
                                            return origAdd.apply(this, arguments);
                                        };
                                    }
                                }

                                // [V68] Patch TerrainManager (Nc)
                                var TM = window._hx_classes["com.cc.environment.terrain.TerrainManager"];
                                if (TM && !TM.patched) {
                                    console.warn("[V68-TERRAIN] TerrainManager Found:", TM);
                                    var tmProto = TM.prototype;
                                    try {
                                        // console.warn("[V68-TERRAIN] TM.prototype keys:", Object.getOwnPropertyNames(tmProto));
                                    } catch (e) { console.warn("Error logging keys", e); }

                                    if (tmProto.attemptToLoadTerrain) {
                                        var origAtt = tmProto.attemptToLoadTerrain;
                                        tmProto.attemptToLoadTerrain = function (location) {
                                            console.warn("[V68-TERRAIN] attemptToLoadTerrain called! Location:", location);
                                            try {
                                                console.warn("[V68-TERRAIN] getTerrainType returns:", this.getTerrainType ? this.getTerrainType() : "N/A");
                                                var BTS = window._hx_classes["com.cc.environment.terrain.BackgroundTerrainSizes"];
                                                if (BTS) {
                                                    // var keys = BTS.data && BTS.data.h ? Object.keys(BTS.data.h) : "No data/h";
                                                    // console.warn("[V68-TERRAIN] BackgroundTerrainSizes found. Keys:", keys);
                                                } else {
                                                    console.warn("[V68-TERRAIN] BackgroundTerrainSizes NOT FOUND");
                                                }
                                            } catch (e) { console.error("Terrain debug error", e); }
                                            return origAtt.apply(this, arguments);
                                        };
                                    } else { console.warn("[V68-TERRAIN] attemptToLoadTerrain NOT FOUND on prototype"); }


                                    if (tmProto.renderTerrain) {
                                        var origRender = tmProto.renderTerrain;
                                        tmProto.renderTerrain = function (displayObj) {
                                            console.warn("[V68-TERRAIN] renderTerrain called!");
                                            return origRender.apply(this, arguments);
                                        };
                                    } else { console.warn("[V68-TERRAIN] renderTerrain NOT FOUND"); }

                                    // Existing creation patch
                                    if (tmProto.createTerrainShape) {
                                        var origCreate = tmProto.createTerrainShape;
                                        tmProto.createTerrainShape = function (type, color) {
                                            try {
                                                var BTS = window._hx_classes["com.cc.environment.terrain.BackgroundTerrainSizes"];
                                                if (BTS && BTS.data && BTS.data.h) {
                                                    // PRE-POPULATE FIX
                                                    if (!BTS.data.h['1'] || !BTS.data.h[1]) {
                                                        console.warn("[V68-TERRAIN] Pre-populating Missing Terrain Sizes (1-100)...");
                                                        var fb = { x: 6000, y: 3000 };
                                                        var keys = Object.keys(BTS.data.h);
                                                        if (keys.length > 0) fb = BTS.data.h[keys[0]];

                                                        for (var i = 1; i <= 100; i++) {
                                                            var k = "" + i; // String
                                                            var ki = i;     // Int
                                                            if (!BTS.data.h[k]) BTS.data.h[k] = { x: fb.x, y: fb.y };
                                                            if (!BTS.data.h[ki]) BTS.data.h[ki] = { x: fb.x, y: fb.y };
                                                        }
                                                    }
                                                }
                                            } catch (e) { console.error("Error patching terrain size", e); }
                                            return origCreate.apply(this, arguments);
                                        };
                                    } else { console.warn("[V68-TERRAIN] createTerrainShape NOT FOUND"); }

                                    if (tmProto.updateBackgroundImageFromTerrainData) {
                                        var origUpd = tmProto.updateBackgroundImageFromTerrainData;
                                        tmProto.updateBackgroundImageFromTerrainData = function (type, data) {
                                            console.warn("[V68-TERRAIN] updateBackgroundImageFromTerrainData called! Type:", type);

                                            // [Fix] Cache Busting: Patch the data object's string getters
                                            if (data) {
                                                ['get_lowResImageURL', 'get_medLowResImageURL', 'get_medHighResImageURL', 'get_highResImageURL'].forEach(function (fname) {
                                                    if (data[fname] && !data[fname]._patched) {
                                                        var origGetter = data[fname];
                                                        data[fname] = function () {
                                                            var url = origGetter.apply(this, arguments);
                                                            if (url && url.indexOf('?') === -1) {
                                                                return url + "?t=" + new Date().getTime();
                                                            }
                                                            return url;
                                                        };
                                                        data[fname]._patched = true;
                                                    }
                                                });
                                            }
                                            return origUpd.apply(this, arguments);
                                        };
                                    } else { console.warn("[V68-TERRAIN] updateBackgroundImageFromTerrainData NOT FOUND on prototype"); }

                                    TM.patched = true;
                                }
                            }
                        } catch (e) { }

                        var tf = new TextField();
                        tf.width = 800; tf.height = 100; tf.x = 50; tf.y = 50;
                        tf.text = "ANTIGRAVITY V68: LOGIN BYPASSED (HEAD)\nGreenBox & Map Patch Active";
                        var fmt = new TextFormat();
                        fmt.size = 24; fmt.color = 0x00FF00;
                        tf.setTextFormat(fmt); tf.defaultTextFormat = fmt;
                        stage.addChild(tf);
                        console.error("[V68-LOGIN] GREEN BOX DRAWN!");
                    } catch (e) { console.error("[V68-LOGIN] Green Box Error:", e); }
                };

                // AGGRESSIVE PATCH POLLER
                var patchInterval = setInterval(function () {
                    if (window._hx_classes) {
                        if (typeof patchURLoader !== "undefined") {
                            ["openfl.net.URLLoader", "URLLoaderApi", "MultipleAttemptURLLoader"].forEach(function (n) {
                                var cls = window._hx_classes[n];
                                if (cls && cls.prototype && cls.prototype.load && !cls.prototype.load.patched) {
                                    console.warn("[V68-FAST] Patching " + n + " NOW!");
                                    patchURLoader(cls);
                                }
                            });
                        }
                        // Stop if we have patched what we need, or keep running to catch lazy-loaded classes?
                        // Let's keep it running but check .patched property to avoid overhead.
                    }
                }, 10);

                var poller = setInterval(function () {
                    attempts++;
                    if (attempts > maxAttempts) {
                        console.error("[V68-LOGIN-HEAD] Poller TIMEOUT. Forcing Finish Init...");
                        clearInterval(poller);
                        finishInit(); // FORCE INIT ON TIMEOUT
                        return;
                    }
                    checkLogin();
                    if (window._hx_classes && window._hx_classes["openfl.net.Socket"] && window.V68_patchSocket) {
                        window.V68_patchSocket(window._hx_classes["openfl.net.Socket"]);
                    }
                    if (window._hx_classes && window.V68_patchWS) {
                        if (window._hx_classes["com.smartfoxserver.v2.bitswarm.wsocket.WSClient"])
                            window.V68_patchWS(window._hx_classes["com.smartfoxserver.v2.bitswarm.wsocket.WSClient"]);
                        if (window._hx_classes["com.smartfoxserver.v2.bitswarm.BitSwarmClient"])
                            window.V68_patchWS(window._hx_classes["com.smartfoxserver.v2.bitswarm.BitSwarmClient"]);
                    }
                    if (window._hx_classes && window.V68_patchMouse) {
                        // com.cc.ui.MouseHandler
                        if (window._hx_classes["com.cc.ui.MouseHandler"]) window.V68_patchMouse(window._hx_classes["com.cc.ui.MouseHandler"]);
                    }
                    if (window._hx_classes && window.V68_patchTexture) {
                        // openfl.display3D.textures.Texture
                        if (window._hx_classes["openfl.display3D.textures.Texture"]) window.V68_patchTexture(window._hx_classes["openfl.display3D.textures.Texture"]);
                    }


                }, 1); // 1ms polling

                function checkLogin() {
                    try {
                        if (window._hx_classes) {
                            // FAST BOOT: Proceed if MAP class is ready
                            if (window._hx_classes["com.cc.core.MAP"] && !window.V68_STATUS.fastBootDone) {
                                console.warn("[V68-LOGIN] MAP Class Found! Fast Booting (No Timeout needed)...");
                                window.V68_STATUS.fastBootDone = true;
                                finishInit();
                                return;
                            }

                            // STRATEGY 1: Check GAME instance (Most reliable)
                            var GAME = window._hx_classes["GAME"];
                            if (GAME && ((GAME._instance && GAME._instance.login) || (GAME.instance && GAME.instance.login))) {
                                var inst = GAME._instance || GAME.instance;
                                var login = inst.login;

                                if (login && login.handleLoadSuccess && !login.handleLoadSuccess.patched) {
                                    console.warn("[V68-LOGIN] Found GAME instance login! Patching & Forcing...");

                                    login.handleLoadSuccess = (function (orig) {
                                        return function (data) {
                                            console.warn("[V68-LOGIN] handleLoadSuccess interception (GAME)", data);
                                            return orig.apply(this, arguments);
                                        }
                                    })(login.handleLoadSuccess);
                                    login.handleLoadSuccess.patched = true;

                                    // Force it
                                    login.handleLoadSuccess({ success: true, error_code: 0 });
                                    finishInit();
                                    return;
                                }
                            }

                            // STRATEGY 2: Just find the stage and force MAP.Init
                            var stage = findStage();
                            if (stage && !window.V68_STATUS.greenBoxDrawn) {
                                console.warn("[V68-LOGIN] Stage found. Bypassing Login Class check...");
                                finishInit();
                            }
                        }
                    } catch (e) { console.error("[V68-LOGIN-HEAD] POLLER ERROR", e); }
                }



                // Immediate Sniffer Removed



                // [Duplicate patchURLoader removed]

                function finishInit() {
                    console.warn("[V68] finishInit called (REPAIRED).");
                    if (window._hx_classes) {
                        try {
                            if (window.V68_patchSocket && window._hx_classes["openfl.net.Socket"])
                                window.V68_patchSocket(window._hx_classes["openfl.net.Socket"]);
                            if (window.V68_patchWS) {
                                if (window._hx_classes["com.smartfoxserver.v2.bitswarm.wsocket.WSClient"])
                                    window.V68_patchWS(window._hx_classes["com.smartfoxserver.v2.bitswarm.wsocket.WSClient"]);
                                if (window._hx_classes["com.smartfoxserver.v2.bitswarm.BitSwarmClient"])
                                    window.V68_patchWS(window._hx_classes["com.smartfoxserver.v2.bitswarm.BitSwarmClient"]);
                            }
                            if (typeof patchURLoader !== "undefined") {
                                ["openfl.net.URLLoader", "URLLoaderApi", "MultipleAttemptURLLoader"].forEach(function (n) {
                                    if (window._hx_classes[n]) patchURLoader(window._hx_classes[n]);
                                });
                            }
                        } catch (e) { console.error("[V68] Patch Error", e); }
                    }

                    clearInterval(poller);

                    try {
                        var stage = findStage();
                        if (stage) {
                            try { drawGreenBox(stage); } catch (e) { }

                            // Map Init
                            if (window._hx_classes["com.cc.core.MAP"]) {
                                try { window._hx_classes["com.cc.core.MAP"].Init(); } catch (e) { console.warn("Map Init fail", e); }
                            }
                        }
                    } catch (e) { }

                    // ViewManager
                    try {
                        var VM = window._hx_classes["com.cc.ui.ViewManager"];
                        if (VM) {
                            var inst = VM.getInstance ? VM.getInstance() : (VM.instance || VM._instance);
                            if (inst) {
                                if (inst.init) inst.init();
                                if (inst.show) inst.show();
                                if (inst.changeView) inst.changeView(1);
                            }
                        }
                    } catch (e) { }
                }

                function patchGameData(val) {
                    if (val && val.prototype && val.prototype.Data && !val.prototype.Data.patched) {
                        console.warn("[V68] Patching GAME.Data...");
                        var originalFn = val.prototype.Data;
                        val.prototype.Data = function (a, b) {
                            // JIT PATCH (Network)
                            if (window._hx_classes && !window._V68_JIT) {
                                try {
                                    // Proxy handles Login, we handle URLLoader here just in case
                                    var target = window._hx_classes["MultipleAttemptURLLoader"];
                                    if (target && typeof patchURLoader !== "undefined") {
                                        console.warn("[V68] JIT Patching MultipleAttemptURLLoader");
                                        patchURLoader(target);
                                    }
                                    window._V68_JIT = true;
                                } catch (e) { console.error("[V68] JIT Error", e); }
                            }
                            try {
                                return originalFn ? originalFn.call(this, a, b) : null;
                            } catch (e) { console.error("Data Crash", e); }
                        };
                        val.prototype.Data.patched = true;
                        if (window.V68_STATUS) window.V68_STATUS.gamePatched = true;

                        // ALSO PATCH setupStage
                        if (!val.prototype.setupStage.patched) {
                            console.warn("[V68] Patching GAME.setupStage for Capture...");
                            var originalSetup = val.prototype.setupStage;
                            val.prototype.setupStage = function () {
                                console.warn("[V68] GAME.setupStage Intercepted!");
                                var ret = originalSetup.apply(this, arguments);
                                // CAPTURE STAGE
                                if (this.stage) {
                                    window.V68_STAGE_REF = this.stage;
                                    console.warn("[V68] ST AGE CAPTURED GLOBALLY!", this.stage);
                                }
                                return ret;
                            };
                            val.prototype.setupStage.patched = true;
                        }
                    }
                };



                window.V68_patchWS = function (val) {
                    console.warn("[V68] V68_patchWS called.", val);
                    if (val && val.prototype && val.prototype.connect && !val.prototype.connect.patched) {
                        console.warn("[V68] PATCHING WSClient.connect NOW!");
                        var originalConnect = val.prototype.connect;
                        val.prototype.connect = function (host, port) {
                            console.warn("[V68] WSClient.connect INTERCEPTED (" + host + ":" + port + ")");
                            var self = this;
                            setTimeout(function () {
                                console.warn("[V68] Mocking WSClient CONNECT/OPEN event...");
                                // WSClient likely uses SFS events or just callbacks?
                                // BitSwarmClient listens to it.
                                // Usually openfl.net.Socket dispatches "connect".
                                // WSClient might dispatch "open" or "connect".

                                // Try standard Event "connect" and "open"
                                var Event = window._hx_classes["openfl.events.Event"];
                                if (Event) {
                                    try {
                                        if (self.dispatchEvent) {
                                            self.dispatchEvent(new Event("connect", false, false));
                                            self.dispatchEvent(new Event("open", false, false));
                                            // SFS might listen for "socketOpen"
                                            self.dispatchEvent(new Event("socketOpen", false, false));
                                        }

                                        // ALSO: If this is an SFS wrapper, it might have onOpen() callback?
                                        if (self.onOpen) self.onOpen();
                                        if (self.socket_onOpen) self.socket_onOpen(); // OpenFL style

                                    } catch (e) { console.error("[V68] WS Event Error", e); }
                                }
                            }, 500);
                            return originalConnect.call(this, host, port);
                        };
                        val.prototype.connect.patched = true;
                    }
                };

                window.V68_TEXTURES = [];
                window.V68_patchTexture = function (val) {
                    if (val && val.prototype && val.prototype.uploadFromBitmapData && !val.prototype.uploadFromBitmapData.patched) {
                        console.warn("[V68-GPU] Patching Texture.uploadFromBitmapData...");
                        var origUpload = val.prototype.uploadFromBitmapData;
                        val.prototype.uploadFromBitmapData = function (source, miplevel) {
                            try {
                                if (source && !window.V68_LOGGED_TEX_KEYS) {
                                    // Log keys of the FIRST source object to understand structure
                                    console.warn("[V68-GPU] Inspecting BitmapData Source:", source);
                                    try {
                                        var keys = [];
                                        for (var k in source) keys.push(k);
                                        console.warn("[V68-GPU] Source Keys:", keys);

                                        // Check common openfl props
                                        console.warn("[V68-GPU] .image:", source.image, " .canvas:", source.canvas, " .__texture:", source.__texture);
                                        if (source.get_image) console.warn("[V68-GPU] get_image():", source.get_image());
                                    } catch (e) { console.warn("Key inspect error", e); }
                                    window.V68_LOGGED_TEX_KEYS = true;
                                }

                                if (source) {
                                    var imgSrc = null;
                                    if (source.image && source.image.src) imgSrc = source.image.src;
                                    else if (source.canvas && source.canvas.toDataURL) imgSrc = source.canvas.toDataURL();
                                    else if (source.__image && source.__image.src) imgSrc = source.__image.src;
                                    else if (source.__canvas && source.__canvas.toDataURL) imgSrc = source.__canvas.toDataURL();
                                    // Direct Image element?
                                    else if (source.src) imgSrc = source.src;

                                    if (imgSrc) {
                                        // Avoid duplicates?? No, keep everything for now.
                                        var meta = {
                                            w: source.width, h: source.height,
                                            src: imgSrc,
                                            len: imgSrc.length,
                                            timestamp: new Date().getTime()
                                        };
                                        window.V68_TEXTURES.push(meta);
                                        // console.warn("[V68-GPU] Captured Texture ("+meta.w+"x"+meta.h+")");
                                        if (window.V68_updateSniffer) window.V68_updateSniffer();
                                    }
                                }
                            } catch (e) { console.error("[V68-GPU] Rip Error", e); }
                            return origUpload.apply(this, arguments);
                        };
                        val.prototype.uploadFromBitmapData.patched = true;
                    }
                };

                window.V68_patchMouse = function (val) {
                    if (val && val.prototype && !val.prototype.patchedMouse) {
                        console.warn("[V68-INPUT] Patching MouseHandler...");
                        // Try to finding 'onMouseDown', 'onClick'
                        ['onMouseDown', 'onMouseUp', 'onClick', 'handleMouseDown', 'handleMouseUp'].forEach(function (fn) {
                            if (val.prototype[fn]) {
                                var orig = val.prototype[fn];
                                val.prototype[fn] = function (e) {
                                    console.warn("[V68-INPUT] " + fn + " triggered!", e);
                                    return orig.apply(this, arguments);
                                };
                            }
                        });

                        // Force Enable
                        if (val.prototype.set_enabled) {
                            var origSet = val.prototype.set_enabled;
                            val.prototype.set_enabled = function (v) {
                                console.warn("[V68-INPUT] set_enabled called with:", v);
                                return origSet.call(this, true); // FORCE TRUE
                            };
                        }
                        val.prototype.patchedMouse = true;
                    }
                };



                window.V68_patchSocket = function (val) {
                    console.warn("[V68] V68_patchSocket called.", val);
                    if (!val) { console.error("[V68] Val is null"); return; }
                    if (!val.prototype) { console.error("[V68] Prototype null"); return; }
                    console.warn("[V68] Connect exists?", !!val.prototype.connect);
                    if (val.prototype.connect && val.prototype.connect.patched) console.warn("[V68] Already patched. Repatching anyway for debug.");

                    if (val.prototype.connect) {
                        console.warn("[V68] PATCHING openfl.net.Socket.connect NOW!");
                        var originalConnect = val.prototype.connect;
                        val.prototype.connect = function (host, port) {
                            console.warn("[V68] Socket.connect INTERCEPTED (" + host + ":" + port + ")");
                            var self = this;
                            setTimeout(function () {
                                console.warn("[V68] Mocking Socket CONNECT event...");
                                var Event = window._hx_classes["openfl.events.Event"];
                                if (Event) {
                                    try {
                                        var evt = new Event("connect", false, false);
                                        if (self.dispatchEvent) self.dispatchEvent(evt);
                                        else console.error("[V68] dispatchEvent not found on socket instance");
                                    } catch (e) { console.error("[V68] Socket Event Error", e); }
                                } else {
                                    console.error("[V68] openfl.events.Event not found!");
                                }
                            }, 500);
                            // return originalConnect ? originalConnect.call(this, host, port) : null; 
                            // Actually, if we want to bypass connection completely, we might NOT return original?
                            // But original connect might set up internal state.
                            // Let's keep calling it for now, but rely on our mock event.
                            return originalConnect.call(this, host, port);
                        };
                        val.prototype.connect.patched = true;
                    } else {
                        console.error("[V68] val.prototype.connect MISSING!");
                    }
                };

                var patchGlobal = function () {
                    try {
                        var classes = window._hx_classes || {};
                        var GLOBAL = classes["com.cc.core.GLOBAL"] || classes["GLOBAL"] || window.GLOBAL;
                        if (GLOBAL && GLOBAL.showErrorMessage && !GLOBAL.showErrorMessage.patched) {
                            console.warn("[V68] Patching GLOBAL.showErrorMessage...");
                            var originalShow = GLOBAL.showErrorMessage;
                            GLOBAL.showErrorMessage = function (code, msg) {
                                console.warn("[V68] Intercepted Error Message. Code:", code, "Msg:", msg);
                                if (code == 2005 || code == "2005") {
                                    console.warn("[V68] SUPPRESSED FATAL ERROR 2005 (Nuclear Option)");

                                    // FORCE SUCCESS
                                    try {
                                        console.warn("[V68] Attempting Force Success Logic...");
                                        var Login = window._hx_classes ? window._hx_classes["ja.Login"] : null;
                                        console.warn("[V68] Login Class:", Login ? "FOUND" : "NOT FOUND");

                                        if (Login) {
                                            var inst = Login._instance || Login.instance;
                                            console.warn("[V68] Login Instance (Static):", inst ? "FOUND" : "NOT FOUND");

                                            if (!inst && Login.prototype && Login.prototype.handleLoadSuccess) {
                                                var GAME = window._hx_classes["GAME"];
                                                if (GAME && GAME._instance && GAME._instance.login) {
                                                    inst = GAME._instance.login;
                                                    console.warn("[V68] Login Instance (via GAME):", inst ? "FOUND" : "NOT FOUND");
                                                }
                                            }

                                            if (inst && inst.handleLoadSuccess) {
                                                console.warn("[V68] FORCING LOGIN SUCCESS via Instance!");
                                                inst.handleLoadSuccess({ success: true, error_code: 0 });
                                            }
                                        }

                                        // Also draw green box immediately via fallback
                                        console.warn("[V68] Attempting Immediate Green Box...");
                                        var s = window.findStage ? window.findStage() : null;
                                        console.warn("[V68] Stage Found?", s ? "YES" : "NO");

                                        if (s && window.drawGreenBox) {
                                            window.drawGreenBox(s);
                                            // MAP
                                            if (window._hx_classes["com.cc.core.MAP"]) {
                                                console.warn("[V68] Force-Init MAP...");
                                                window._hx_classes["com.cc.core.MAP"].Init();
                                            }
                                        }
                                    } catch (err) { console.error("[V68] Force Success Failed", err); }

                                    return; // SWALLOW IT
                                }
                                return originalShow.apply(this, arguments);
                            };
                            GLOBAL.showErrorMessage.patched = true;
                        }
                    } catch (e) { console.error("[V68] Global Patch Error", e); }
                };

                // 1. Window Interceptor
                var _GAME_VAL = undefined;
                Object.defineProperty(window, "GAME", {
                    get: function () { return _GAME_VAL; },
                    set: function (val) {
                        _GAME_VAL = val;
                        patchGameData(val);
                    },
                    configurable: true
                });

                // 2. HxClasses Interceptor (The likely path)
                var patchURLoader = function (val) {
                    if (val && val.prototype && val.prototype.load && !val.prototype.load.patched) {
                        val.prototype.originalLoad = val.prototype.load;
                        val.prototype.load = function (req) {
                            var url = (req && req.url) ? String(req.url) : "null";
                            console.warn("[V68-NET] URLoader.load called with: " + url);

                            if (url.indexOf("assets/json") !== -1) {
                                console.warn("[V68-NET] Assets JSON detected!");
                                if (!window.MISSING_ASSETS) window.MISSING_ASSETS = [];
                                // Avoid duplicates
                                if (window.MISSING_ASSETS.indexOf(url) === -1) window.MISSING_ASSETS.push(url);

                                var self = this;
                                setTimeout(function () {
                                    self.data = JSON.stringify({ success: true, resource: [], version: 1 });
                                    var evt = { type: "complete", target: self };
                                    try { if (self.dispatchEvent) self.dispatchEvent(evt); else if (self.onComplete) self.onComplete(evt); } catch (e) { }
                                }, 100);
                                console.warn("[V68-NET] MOCKED (Assets): " + url);
                                return;
                            }

                            if (url.indexOf("getflags") !== -1 || url.indexOf("loadidata") !== -1 || url.indexOf("api/login") !== -1 || url.indexOf("api/player/getinfo") !== -1) {
                                console.warn("[V68-NET] API Call intercepted: " + url);
                                var self = this;
                                setTimeout(function () {
                                    var richData = {
                                        success: true,
                                        error_code: 0,
                                        resource: [],
                                        flags: { example: 1 },
                                        data: {
                                            player_id: 12345,
                                            user_id: 12345,
                                            name: "Commander",
                                            base_id: 100,
                                            world_id: 1,
                                            faction_id: 1,
                                            level: 10,
                                            level_id: 10
                                        },
                                        player: { id: 12345, name: "Commander" } // Added for getinfo
                                    };
                                    self.data = JSON.stringify(richData);
                                    var evt = { type: "complete", target: self };
                                    try { if (self.dispatchEvent) self.dispatchEvent(evt); else if (self.onComplete) self.onComplete(evt); } catch (e) { }
                                }, 50);
                                console.warn("[V68-NET] MOCKED (API) SUCCESS: " + url);
                                return;
                            }
                            console.warn("[V68-NET] Passthrough: " + url);
                            if (this.originalLoad) return this.originalLoad(req);
                        };
                        val.prototype.load.patched = true;
                        console.warn("[V68] Patching URLoaderApi (Immediate)...");
                        if (window.V68_STATUS) window.V68_STATUS.patchNetwork++;
                    }

                    // Patch Login Error Handler (ja.Login?)
                    // We don't have the class ref here, but we can try to find it globally
                    try {
                        var loginClass = window._hx_classes && window._hx_classes["ja.Login"];
                        if (loginClass && loginClass.prototype && loginClass.prototype.handleLoadError && !loginClass.prototype.handleLoadError.patched) {
                            console.warn("[V68] Patching ja.Login.handleLoadError...");
                            loginClass.prototype.handleLoadError = function (e) {
                                console.warn("[V68] SUPPRESSED LOGIN ERROR:", e);
                                // Force Success?
                                if (this.handleLoadSuccess) this.handleLoadSuccess(null);
                            };
                            loginClass.prototype.handleLoadError.patched = true;
                        }
                    } catch (e) { console.warn("[V68] Login Patch Error", e); }
                };

                // 2. HxClasses Interceptor (Catch everything)
                // 2. HxClasses Interceptor (Catch everything)
                var setupHxHook = function (hxObj) {
                    if (!hxObj) return;
                    try {
                        // Hook REDO: ja.Login hook REMOVED (Blocking)


                        // Hook GAME
                        var _HX_GAME = undefined;
                        Object.defineProperty(hxObj, "GAME", {
                            get: function () { return _HX_GAME; },
                            set: function (val) {
                                _HX_GAME = val;
                                console.warn("[V68] Intercepted _hx_classes['GAME'] assignment");
                                patchGameData(val);
                            },
                            configurable: true
                        });
                        if (hxObj["GAME"]) patchGameData(hxObj["GAME"]);

                        // Hook URLoaderApi
                        var _HX_URL = undefined;
                        Object.defineProperty(hxObj, "URLoaderApi", {
                            get: function () { return _HX_URL; },
                            set: function (val) {
                                _HX_URL = val;
                                console.warn("[V68] Intercepted _hx_classes['URLoaderApi'] assignment");
                                patchURLoader(val);
                            },
                            configurable: true
                        });
                        if (hxObj["URLoaderApi"]) patchURLoader(hxObj["URLoaderApi"]);

                        // Hook URLLoaderApi (Double L)
                        var _HX_URL2 = undefined;
                        Object.defineProperty(hxObj, "URLLoaderApi", {
                            get: function () { return _HX_URL2; },
                            set: function (val) {
                                _HX_URL2 = val;
                                console.warn("[V68] Intercepted _hx_classes['URLLoaderApi'] (Double L) assignment");
                                patchURLoader(val);
                            },
                            configurable: true
                        });
                        if (hxObj["URLLoaderApi"]) patchURLoader(hxObj["URLLoaderApi"]);

                        // Hook openfl.net.URLLoader
                        var _HX_OPENFL = undefined;
                        Object.defineProperty(hxObj, "openfl.net.URLLoader", {
                            get: function () { return _HX_OPENFL; },
                            set: function (val) {
                                _HX_OPENFL = val;
                                console.warn("[V68] Intercepted _hx_classes['openfl.net.URLLoader'] assignment");
                                patchURLoader(val);
                            },
                            configurable: true
                        });
                        if (hxObj["openfl.net.URLLoader"]) patchURLoader(hxObj["openfl.net.URLLoader"]);

                        // Hook MultipleAttemptURLLoader (The Answer)
                        var _HX_MULTI = undefined;
                        Object.defineProperty(hxObj, "MultipleAttemptURLLoader", {
                            get: function () { return _HX_MULTI; },
                            set: function (val) {
                                _HX_MULTI = val;
                                console.warn("[V68] Intercepted _hx_classes['MultipleAttemptURLLoader'] assignment");
                                patchURLoader(val);
                            },
                            configurable: true
                        });
                        if (hxObj["MultipleAttemptURLLoader"]) patchURLoader(hxObj["MultipleAttemptURLLoader"]);

                    } catch (e) { console.warn("[V68] Hook Hook Error", e); }
                };

                if (window._hx_classes) {
                    setupHxHook(window._hx_classes);
                } else {
                    var _HX_VAL = undefined;
                    Object.defineProperty(window, "_hx_classes", {
                        get: function () { return _HX_VAL; },
                        set: function (val) {
                            _HX_VAL = val;
                            console.warn("[V68] Intercepted window._hx_classes assignment");
                            setupHxHook(val);
                        },
                        configurable: true
                    });
                }

                var _URL_VAL = undefined;
                Object.defineProperty(window, "URLoaderApi", {
                    get: function () { return _URL_VAL; },
                    set: function (val) {
                        _URL_VAL = val;
                        console.warn("[V68] Intercepted URLoaderApi assignment. Patching load...");
                        if (val && val.prototype && val.prototype.load) {
                            val.prototype.originalLoad = val.prototype.load;
                            val.prototype.load = function (req) {
                                console.warn("[V68] Intercepted URLoader.load: " + (req ? req.url : "null"));
                                if (req.url.indexOf("getflags") !== -1 || req.url.indexOf("loadidata") !== -1 || req.url.indexOf("assets/json") !== -1) {
                                    var self = this;
                                    setTimeout(function () {
                                        self.data = JSON.stringify({ success: true, error_code: 0, flags: { example: 1 }, data: {} });
                                        try { if (self.dispatchEvent) self.dispatchEvent({ type: "complete", target: self }); else if (self.onComplete) self.onComplete({ type: "complete", target: self }); } catch (e) { }
                                    }, 50);
                                    console.warn("[V68] Mocked Network Call (Early): " + req.url);
                                    return;
                                }
                                if (this.originalLoad) return this.originalLoad(req);
                            };
                            val.prototype.load.patched = true;
                        }
                    },
                    configurable: true
                });

                var patchNetwork = function () {
                    try {
                        if (window.V68_STATUS) window.V68_STATUS.patchNetwork++;
                        if (typeof patchGlobal === "function") patchGlobal();

                        // Patch GAME.Data via helper (Fixed Version)
                        var GameClass = window._hx_classes && window._hx_classes["GAME"] ? window._hx_classes["GAME"] : window.GAME;
                        if (GameClass) patchGameData(GameClass);

                        // BRUTE FORCE SCAN for URLLoader
                        if (window._hx_classes) {
                            var keys = Object.keys(window._hx_classes);
                            for (var i = 0; i < keys.length; i++) {
                                var k = keys[i];
                                // Match "URLLoader" (Case sensitive? "URLLoader" or "URLoader")
                                if (k.indexOf("URLLoader") !== -1 || k.indexOf("URLoader") !== -1) {
                                    var cls = window._hx_classes[k];
                                    if (cls && cls.prototype && cls.prototype.load && !cls.prototype.load.patched) {
                                        console.warn("[V68] FOUND URLLoader CANDIDATE via SCAN:", k);
                                        patchURLoader(cls);
                                    }
                                }
                            }
                        }

                        // Fallback: Check window.URLoaderApi (One L)
                        if (window.URLoaderApi) patchURLoader(window.URLoaderApi);
                    } catch (e) { console.error("[V68] Network Patch Error", e); }
                };

                // =========================================================================
                // 1. STAGE DISCOVERY & NUKE (From V65/V66)
                // =========================================================================
                var findStage = function () {
                    if (window.GAME && window.GAME._instance && window.GAME._instance.stage) {
                        return window.GAME._instance.stage;
                    }
                    if (window._hx_classes && window._hx_classes["openfl.Lib"]) {
                        var Lib = window._hx_classes["openfl.Lib"];
                        if (Lib.current && Lib.current.stage) return Lib.current.stage;
                    }
                    return null;
                };

                var nukeStage = function (stage) {
                    console.warn("[V68] NUKING STAGE");
                    try {
                        while (stage.numChildren > 0) {
                            stage.removeChildAt(0);
                        }
                    } catch (e) {
                        console.error("[V68] Nuke failed partially:", e);
                    }
                };

                // =========================================================================
                // 2. GREEN BOX SETUP (Visual Stability)
                // =========================================================================
                var drawGreenBox = function (stage) {
                    console.warn("[V68] Drawing Green Box");
                    if (window.V68_STATUS) window.V68_STATUS.greenBoxDrawn = true;
                    try {
                        if (!window._hx_classes) return;
                        var Sprite = window._hx_classes["openfl.display.Sprite"];
                        var TextField = window._hx_classes["openfl.text.TextField"];
                        var TextFormat = window._hx_classes["openfl.text.TextFormat"];

                        var bg = new Sprite();
                        bg.graphics.beginFill(0x003300); // Dark Green
                        bg.graphics.drawRect(0, 0, 2000, 2000);
                        bg.graphics.endFill();
                        stage.addChild(bg);

                        var tf = new TextField();
                        tf.width = 800;
                        tf.height = 100;
                        tf.x = 50;
                        tf.y = 50;
                        tf.text = "ANTIGRAVITY V68: ACTIVE\nAssetLoader Patched (INLINE HEAD)";

                        var fmt = new TextFormat();
                        fmt.size = 24;
                        fmt.color = 0x00FF00;
                        tf.setTextFormat(fmt); // Apply to all text
                        tf.defaultTextFormat = fmt;

                        stage.addChild(tf);
                        console.warn("[V68] Green Box Drawn");
                    } catch (e) {
                        console.error("[V68] Green Box Error:", e);
                    }
                };

                // =========================================================================
                // 3. ASSET LOADER PATCH (The Fix)
                // =========================================================================
                var patchAssetLoader = function () {
                    if (!window._hx_classes) return false;
                    var AssetLoader = window._hx_classes["com.cc.assets.AssetLoader"];

                    if (!AssetLoader) {
                        // Wait for it
                        return false;
                    }

                    if (AssetLoader.prototype.loadAsset_patched) {
                        return true;
                    }

                    console.warn("[V68] Patching AssetLoader...");
                    var originalLoadAsset = AssetLoader.prototype.loadAsset;

                    AssetLoader.prototype.loadAsset = function () {
                        console.warn("[V68-ASSET] AssetLoader.loadAsset calling:", this._versionedAssetUrl);

                        // 1. Validation
                        if (!this._versionedAssetUrl) {
                            console.warn("[V68] BLOCKED: AssetLoader called with NULL URL!");
                            if (this._errorCallback) {
                                try { this._errorCallback("Antigravity: Blocked Null URL"); } catch (e) { }
                            }
                            return;
                        }

                        // 2. Crash Suppression
                        try {
                            originalLoadAsset.apply(this, arguments);
                        } catch (e) {
                            console.error("[V68] CRASH INTERCEPTED in loadAsset for url:", this._versionedAssetUrl, e);
                            // Call error callback to handle it gracefully down the chain
                            if (this._errorCallback) {
                                try { this._errorCallback("Antigravity: Crash Intercepted: " + e); } catch (e2) { }
                            }
                        }
                    };

                    AssetLoader.prototype.loadAsset_patched = true;
                    console.warn("[V68] AssetLoader successfully patched!");
                    return true;
                };

                // =========================================================================
                // 5. MAIN INIT LOOP
                // =========================================================================
                var initialized = false;
                var attemptLimit = 0;

                var mainLoop = setInterval(function () {
                    attemptLimit++;
                    if (window.V68_STATUS) window.V68_STATUS.attempts = attemptLimit;

                    // 0. Patch Network
                    if (typeof patchNetwork === "function") patchNetwork();

                    // 1. Patch AssetLoader
                    patchAssetLoader();

                    // 2. Wait for Stage
                    var stage = findStage();
                    if (stage) {
                        if (window.V68_STATUS) window.V68_STATUS.stageFound = true;
                    }

                    if (stage && !initialized) {
                        console.warn("[V68] Stage found. Initializing...");
                        initialized = true;

                        // Clear Popups
                        nukeStage(stage);
                        drawGreenBox(stage);

                        // Attempt Map Init Logic
                        setTimeout(function () {
                            console.warn("[V68] Attempting Worldmap Setup...");
                            if (window.Worldmap) {
                                try {
                                    console.warn("[V68] Calling Worldmap.CreateMapView()...");
                                    window.Worldmap.CreateMapView();
                                    console.warn("[V68] Worldmap.CreateMapView() returned.");
                                } catch (e) {
                                    console.error("[V68] Worldmap Init Failed:", e);
                                }
                            } else {
                                console.error("[V68] Worldmap class not found!");
                            }
                        }, 2000); // Wait 2s after nuking
                    }

                    if (attemptLimit > 600) { // 60 seconds (extended)
                        clearInterval(mainLoop);
                    }

                }, 100);

            })();
}
}
}
}
}
}
