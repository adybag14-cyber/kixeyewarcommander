/**
 * PATCH GAME INIT V67
 * - ASSET LOADER INTERCEPTOR (mj)
 * - REMOVE IMAGE MOCKS (Real Assets Attempt)
 * - FIX CRASH
 */

(function () {
    console.log("!!! [PATCH] V67 SCRIPT STARTING !!!");

    // 1. URLOADER PATCH (Keep for Flags/Config, but allow other assets)
    try {
        var GameClass = window._hx_classes && window._hx_classes["GAME"] ? window._hx_classes["GAME"] : window.GAME;
        if (GameClass && !GameClass.prototype.Data.patched) {
            GameClass.prototype.Data = function (a, b) {
                if (!a) a = {};
                var localhost = "http://localhost:8088/";
                if (!a.baseurl) a.baseurl = localhost + "assets/";
                if (!a.apiurl) a.apiurl = localhost + "api/";
                try { return this.originalData ? this.originalData(a, b) : null; } catch (e) { }
            };
            GameClass.prototype.Data.patched = true;
        }
        var URLLoader = window.URLoaderApi || (window._hx_classes && window._hx_classes["URLoaderApi"]);
        if (URLLoader && !URLLoader.prototype.load.patched) {
            URLLoader.prototype.load = function (req) {
                // Only mock SPECIFIC API calls
                if (req.url.indexOf("getflags") !== -1 || req.url.indexOf("loadidata") !== -1 || req.url.indexOf("assets/json") !== -1) {
                    var self = this;
                    setTimeout(function () {
                        self.data = JSON.stringify({ success: true, flags: { example: 1 }, data: {} });
                        try { if (self.dispatchEvent) self.dispatchEvent({ type: "complete" }); else if (self.onComplete) self.onComplete({ type: "complete" }); } catch (e) { }
                    }, 10);
                    return;
                }
                if (this.originalLoad) return this.originalLoad(req);
            };
            URLLoader.prototype.load.patched = true;
        }
    } catch (e) { }

    // 2. DISABLE IMAGE MOCKS (User Request: "Pull from original")
    // We do NOT patch openfl.display.Loader to return bitamp data.
    // If the files exist in /assets/, they will load. If not, they will 404 (but hopefully not crash).

    // 3. MJ INTERCEPTOR (Fix the Crash)
    // The crash is "Cannot read properties of null (reading 'url')" in mj.load
    // We define a setter to catch when 'mj' is assigned.

    var _mjVal = undefined;

    Object.defineProperty(window, "mj", {
        get: function () { return _mjVal; },
        set: function (val) {
            console.log("[V67] Intercepted 'mj' assignment!");
            _mjVal = val;

            if (val && val.load && !val.load.patched) {
                console.log("[V67] Patching mj.load now!");
                val.originalLoad = val.load;

                val.load = function (a, b, c) {
                    // CRASH FIX: Check for null 'a' or 'a.url'
                    if (!a) {
                        console.warn("[V67] mj.load BLOCKED (arg is null)");
                        if (b && typeof b === "function") b(null); // callback
                        return null;
                    }
                    if (a.url === null || a.url === undefined) {
                        // Some calls pass a string directly?
                        if (typeof a !== "string") {
                            console.warn("[V67] mj.load BLOCKED (url is null)");
                            if (b && typeof b === "function") b(null);
                            return null;
                        }
                    }

                    // Proceed
                    try {
                        return this.originalLoad(a, b, c);
                    } catch (e) {
                        console.error("[V67] mj.load THREW ERROR", e);
                        if (b && typeof b === "function") b(null);
                        return null;
                    }
                };
                val.load.patched = true;
            }
        },
        configurable: true
    });

    // Also check if it's already there (race condition)
    if (window.mj) window.mj = window.mj; // Trigger setter


    // 4. MAIN LOOP (Stage Control)
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 20) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V67] STAGE FOUND !!!");

            // NUKE
            try {
                if (stage.removeChildren) stage.removeChildren();
                else if (stage.removeChildAt) while (stage.numChildren > 0) stage.removeChildAt(0);
                else if (stage.__children) stage.__children = [];
            } catch (e) { }

            // MANUAL MAP ATTEMPT
            try {
                var HexView = window._hx_classes["com.cc.worldmap.HexWorldmapView"];
                if (HexView) {
                    // With mj.load patched, this MIGHT work now
                    var view = new HexView();
                    view.visible = true;
                    if (stage.addChild) stage.addChild(view);
                    else stage.__children.push(view);
                    console.log("[V67] Added MapView (Real Assets Attempt).");
                }
            } catch (e) { console.error("Map Init Fail V67", e); }

            // FALLBACK BOX (Green = OK)
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    var g = box.graphics || box.get_graphics();
                    if (g) { g.beginFill(0x00FF00); g.drawRect(0, 0, 50, 50); g.endFill(); } // Small box
                    if (stage.addChild) stage.addChild(box);
                    else stage.__children.push(box);
                }
            } catch (e) { }

            loopCount = 100;
        }

    }, 2000);

})();
