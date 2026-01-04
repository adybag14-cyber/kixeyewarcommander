/**
 * PATCH GAME INIT V64
 * - FIX MJ.LOAD CRASH
 * - MANUAL MAP RENDER
 */

(function () {
    console.log("!!! [PATCH] V64 SCRIPT STARTING !!!");

    // MJ PATCH (AssetLoader?)
    try {
        var mj = window.mj || (window.GAME && window.GAME.mj);
        if (mj) {
            console.log("[V64] Found 'mj'. Patching load...");
            if (!mj.originalLoad) mj.originalLoad = mj.load;

            mj.load = function (a, b, c) {
                // Log usage
                // console.log("[V64] mj.load called with:", a);

                if (!a) {
                    console.warn("[V64] mj.load prevented NULL call!");
                    return null; // Swallow error
                }
                if (a.url === null || a.url === undefined) {
                    // Check if 'a' IS the url string?
                    if (typeof a === "string") {
                        // OK
                    } else {
                        console.warn("[V64] mj.load prevented NULL URL!");
                        return null;
                    }
                }

                // Proceed or Mock
                try {
                    return this.originalLoad(a, b, c);
                } catch (err) {
                    console.warn("[V64] mj.load crash swallowed:", err);
                    // Call callback if possible?
                    if (b && typeof b === "function") {
                        try { b(null); } catch (e) { } // Error callback?
                    }
                    return null;
                }
            };
        } else {
            console.warn("[V64] 'mj' NOT FOUND via window.mj");
        }
    } catch (e) { console.error("MJ Patch Fail", e); }

    // DATA & URLOADER PATCH (Keep existing)
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

    // ASSET MOCKS (Keep existing)
    try {
        var Loader = window._hx_classes["openfl.display.Loader"];
        if (Loader && !Loader.prototype.load.patched) {
            Loader.prototype.load = function (req) {
                if (req.url.indexOf("png") !== -1 || req.url.indexOf("jpg") !== -1) {
                    var BitmapData = window._hx_classes["openfl.display.BitmapData"];
                    if (BitmapData) {
                        var bmd = new BitmapData(64, 64, true, 0xFF00FF00);
                        this.contentLoaderInfo.content = new (window._hx_classes["openfl.display.Bitmap"])(bmd);
                        this.contentLoaderInfo.dispatchEvent(new (window._hx_classes["openfl.events.Event"])("complete"));
                        return;
                    }
                }
                return this.originalLoad(req);
            };
            Loader.prototype.load.patched = true;
        }
    } catch (e) { }


    // MAIN LOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 20) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V64] STAGE FOUND !!!");

            // 1. NUKE
            try {
                if (stage.removeChildren) stage.removeChildren();
                else if (stage.removeChildAt) while (stage.numChildren > 0) stage.removeChildAt(0);
                else if (stage.__children) stage.__children = [];
                console.log("[V64] Stage Nuked.");
            } catch (e) { }

            // 2. MANUAL MAP
            try {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                var HexView = window._hx_classes["com.cc.worldmap.HexWorldmapView"];
                if (Worldmap && HexView) {
                    var view = new HexView(); // Hopefully mj.load patch prevents crash
                    view.visible = true;
                    if (stage.addChild) stage.addChild(view);
                    else stage.__children.push(view);
                    console.log("[V64] Added MapView.");
                } else {
                    console.error("[V64] Map Classes Missing");
                }
            } catch (e) { console.error("Map Init Fail", e); }

            // 3. FALLBACK BLUE BOX
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    var g = box.graphics || box.get_graphics();
                    if (g) { g.beginFill(0x0000FF); g.drawRect(50, 50, 200, 200); g.endFill(); }
                    if (stage.addChild) stage.addChild(box);
                    else stage.__children.push(box);
                }
            } catch (e) { }

            loopCount = 100;
        }

    }, 2000);

})();
