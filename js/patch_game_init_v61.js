/**
 * PATCH GAME INIT V61
 * - MANUAL MAP INSTANTIATION
 * - BYPASS CREATEMAPVIEW CRASH
 */

(function () {
    console.log("!!! [PATCH] V61 SCRIPT STARTING !!!");

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

        // ASSET MOCKING
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
        if (loopCount > 20) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V61] STAGE FOUND via GAME !!!");

            // 1. NUKE STAGE
            try {
                if (stage.removeChildren) {
                    stage.removeChildren();
                } else if (stage.removeChildAt) {
                    while (stage.numChildren > 0) stage.removeChildAt(0);
                } else if (stage.__children) {
                    stage.__children = [];
                }
                console.log("[V61] Stage Nuked.");
            } catch (e) { console.error("Nuke Fail", e); }


            // 2. MANUAL WORLDMAP
            try {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                var HexView = window._hx_classes["com.cc.worldmap.HexWorldmapView"];

                if (Worldmap && HexView) {
                    console.log("[V61] Attempting Manual View Creation...");

                    if (Worldmap.Setup) {
                        try { Worldmap.Setup(); } catch (e) { console.log("Setup err: " + e); }
                    }

                    // Create View Manually
                    var view = new HexView();
                    Worldmap._mapView = view;
                    console.log("[V61] Created HexWorldmapView instance.");

                    // Add to Stage
                    view.visible = true;
                    if (stage.addChild) stage.addChild(view);
                    else if (stage.__children) stage.__children.push(view);
                    console.log("[V61] Added MapView to Stage.");
                } else {
                    console.error("[V61] Classes Missing: Worldmap=" + !!Worldmap + ", HexView=" + !!HexView);
                }

                // 3. FALLBACK GREEN BOX (To Confirm Nuke Success visually)
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    box.name = "GREEN_BOX_V61";
                    var g = box.graphics || box.get_graphics();
                    if (g) {
                        g.beginFill(0x0000FF); // BLUE for V61
                        g.drawRect(20, 20, 100, 100);
                        g.endFill();
                        if (stage.addChild) stage.addChild(box);
                        else stage.__children.push(box);
                        console.log("[V61] Added Blue Box.");
                    }
                }

            } catch (e) { console.error("Map Manual Init Fail", e); }

            loopCount = 100; // Done
        }

    }, 2000);

})();
