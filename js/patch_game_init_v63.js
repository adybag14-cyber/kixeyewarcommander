/**
 * PATCH GAME INIT V63
 * - DEBUG MAP CRASH
 * - SOURCE INSPECTION
 */

(function () {
    console.log("!!! [PATCH] V63 SCRIPT STARTING !!!");

    // DATA & URLOADER PATCH
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
        // ASSET MOCKS OK
        var Loader = window._hx_classes["openfl.display.Loader"];
        if (Loader && !Loader.prototype.load.patched) {
            Loader.prototype.load = function (req) {
                if (req.url.indexOf(".png") !== -1 || req.url.indexOf(".jpg") !== -1) {
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
        if (loopCount > 10) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V63] STAGE FOUND !!!");

            // 1. NUKE (Maintain Control)
            try {
                if (stage.removeChildAt) while (stage.numChildren > 0) stage.removeChildAt(0);
                else if (stage.__children) stage.__children = [];
                console.log("[V63] Stage Nuked.");
            } catch (e) { }

            // 2. DEBUG WORLDMAP CRASH
            try {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                if (Worldmap) {
                    console.log("[V63] Inspecting Worldmap...");

                    // Log Source
                    if (Worldmap.CreateMapView) {
                        var src = Worldmap.CreateMapView.toString();
                        console.warn("[V63] CreateMapView Source:\n" + src.substring(0, 500)); // First 500 chars

                        // Search for cleanUp
                        var idx = src.indexOf("cleanUp");
                        if (idx !== -1) {
                            console.warn("[V63] cleanUp found at: " + src.substring(Math.max(0, idx - 50), Math.min(src.length, idx + 50)));
                        }
                    }

                    // Log Properties
                    try {
                        console.warn("[V63] Worldmap Props: " + Object.keys(Worldmap).join(", "));
                    } catch (e) { }
                } else {
                    console.error("[V63] Worldmap Class NOT FOUND");
                }
            } catch (e) { console.error("Debug Fail", e); }

            // Add Green BG again to keep visual
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    var g = box.graphics || box.get_graphics();
                    if (g) { g.beginFill(0x330033); g.drawRect(0, 0, 2000, 2000); g.endFill(); } // Dark Purple V63
                    if (stage.addChild) stage.addChild(box);
                    else stage.__children.push(box);
                }
            } catch (e) { }

            loopCount = 100; // Done
        }

    }, 2000);

})();
