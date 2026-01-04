/**
 * PATCH GAME INIT V65
 * - FIND MJ / ASSETLOADER
 * - PATCH LOAD
 */

(function () {
    console.log("!!! [PATCH] V65 SCRIPT STARTING !!!");

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

    // ASSET MOCKS
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

    // MJ / ASSETLOADER HUNT & PATCH
    setTimeout(function () {
        console.log("[V65] Hunting for 'mj' or AssetLoader...");

        // 1. Check _hx_classes for "AssetLoader"
        var hxKeys = window._hx_classes ? Object.keys(window._hx_classes) : [];
        for (var i = 0; i < hxKeys.length; i++) {
            if (hxKeys[i].toLowerCase().indexOf("assetloader") !== -1) {
                console.log("[V65] Found HX Class: " + hxKeys[i]);
                var cls = window._hx_classes[hxKeys[i]];
                // Patch static or prototype
                if (cls.load && !cls.load.patched) {
                    cls.originalLoad = cls.load;
                    cls.load = safeLoad;
                    cls.load.patched = true;
                    console.log("[V65] Patched " + hxKeys[i] + ".load");
                }
            }
        }

        // 2. Scan Window for 'mj'
        if (window.mj && window.mj.load && !window.mj.load.patched) {
            window.mj.originalLoad = window.mj.load;
            window.mj.load = safeLoad;
            window.mj.load.patched = true;
            console.log("[V65] Patched window.mj.load");
        }

        // 3. Scan global vars (expensive but necessary)
        // Only if not found locally?

    }, 100);

    function safeLoad(a, b, c) {
        if (!a || (a.url === null || a.url === undefined)) {
            console.warn("[V65] Prevented NULL load call!");
            if (b && typeof b === "function") try { b(null); } catch (e) { }
            return null;
        }
        try { return this.originalLoad(a, b, c); }
        catch (e) { console.error("Load crash", e); return null; }
    }


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
            console.log("!!! [V65] STAGE FOUND !!!");

            // 1. NUKE
            try {
                if (stage.removeChildren) stage.removeChildren();
                else if (stage.removeChildAt) while (stage.numChildren > 0) stage.removeChildAt(0);
                else if (stage.__children) stage.__children = [];
                // console.log("[V65] Stage Nuked.");
            } catch (e) { }

            // 2. MANUAL MAP
            try {
                var Worldmap = window._hx_classes["com.cc.worldmap.Worldmap"];
                var HexView = window._hx_classes["com.cc.worldmap.HexWorldmapView"];
                if (Worldmap && HexView) {
                    var view = new HexView();
                    view.visible = true;
                    if (stage.addChild) stage.addChild(view);
                    else stage.__children.push(view);
                    console.log("[V65] Added MapView.");
                }
            } catch (e) { console.error("Map Init Fail V65", e); }

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
