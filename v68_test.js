var window = {}; var document = {}; var console = { warn: function(){}, log: function(){}, error: function(){} };
        window.__LOGS__ = [];
        (function () {
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


})();