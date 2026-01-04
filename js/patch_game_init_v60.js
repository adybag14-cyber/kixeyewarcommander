/**
 * PATCH GAME INIT V60
 * - RENDER WORLD MAP
 * - SMART NUKE
 */

(function () {
    console.log("!!! [PATCH] V60 SCRIPT STARTING !!!");

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

        // ASSET MOCKING (Keep existing)
        var Loader = window._hx_classes["openfl.display.Loader"];
        if (Loader && !Loader.prototype.load.patched) {
            Loader.prototype.load = function (req) {
                // Mock images
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
            console.log("!!! [V60] STAGE FOUND via GAME !!!");

            // 1. NUKE STAGE
            try {
                // Try aggressive removal
                if (stage.removeChildren) {
                    stage.removeChildren();
                    console.log("[V60] Executed removeChildren()");
                } else if (stage.removeChildAt) {
                    while (stage.numChildren > 0) stage.removeChildAt(0);
                } else if (stage.__children) {
                    // Direct array clear (Dangerous but guaranteed)
                    stage.__children = [];
                    console.log("[V60] Cleared __children array");
                }
                // Double check with adding Green Box if nuke fails partially
            } catch (e) { console.error("Nuke Error", e); }


            // 2. INIT WORLDMAP
            try {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                if (Worldmap) {
                    console.log("[V60] Worldmap Class Found. Setting up...");

                    if (Worldmap.Setup) {
                        try { Worldmap.Setup(); } catch (e) { console.log("Setup err: " + e); }
                    }
                    if (Worldmap.CreateMapView) {
                        try { Worldmap.CreateMapView(); } catch (e) { console.log("CreateMapView err: " + e); }
                    }

                    // 3. ADD TO STAGE
                    var mapView = Worldmap._mapView;
                    if (mapView) {
                        console.log("[V60] MapView Instance Found.");
                        mapView.visible = true;
                        // mapView.alpha = 1; // Sometimes alpha is 0

                        if (stage.addChild) {
                            stage.addChild(mapView);
                            console.log("[V60] MapView Added to Stage!");
                        } else if (stage.__children) {
                            stage.__children.push(mapView);
                            console.log("[V60] MapView pushed to __children!");
                        }
                    } else {
                        console.error("[V60] MapView is Null!");
                    }
                }
            } catch (e) { console.error("Map Init Fail", e); }

            loopCount = 100; // Done
        }

    }, 2000);

})();
