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
                            // Debug keys if failed
                            // console.warn("[V68-DEBUG] HxClasses Keys: " + Object.keys(window._hx_classes).length);
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

})();
