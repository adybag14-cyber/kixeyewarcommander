/**
 * PATCH GAME INIT V62
 * - STABLE CONTROL TEST
 * - NUKE + TEXT
 * - NO MAP
 */

(function () {
    console.log("!!! [PATCH] V62 SCRIPT STARTING !!!");

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
            console.log("!!! [V62] STAGE FOUND via GAME !!!");

            // 1. NUKE STAGE
            try {
                if (stage.removeChildren) {
                    stage.removeChildren();
                } else if (stage.removeChildAt) {
                    while (stage.numChildren > 0) stage.removeChildAt(0);
                } else if (stage.__children) {
                    stage.__children = [];
                }
                console.log("[V62] Stage Nuked.");
            } catch (e) { console.error("Nuke Fail", e); }


            // 2. ADD GREEN BACKGROUND
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    box.name = "BG_V62";
                    var g = box.graphics || box.get_graphics();
                    if (g) {
                        g.beginFill(0x113311); // Dark Green
                        g.drawRect(0, 0, 2000, 2000); // Full Screen
                        g.endFill();

                        if (stage.addChild) stage.addChild(box);
                        else stage.__children.push(box);
                        console.log("[V62] Added Background.");
                    }
                }
            } catch (e) { console.error("BG Fail", e); }

            // 3. ADD TEXT
            try {
                var TF = window._hx_classes["openfl.text.TextField"];
                var TextFormat = window._hx_classes["openfl.text.TextFormat"];

                if (TF) {
                    var tf = new TF();
                    tf.text = "ANTIGRAVITY ACTIVE\nSTAGE CONTROL ASSUMED";
                    tf.x = 50;
                    tf.y = 50;
                    tf.width = 800;
                    tf.height = 200;

                    if (TextFormat) {
                        var fmt = new TextFormat("Arial", 40, 0xFFFFFF);
                        tf.defaultTextFormat = fmt;
                        tf.setTextFormat(fmt);
                    } else {
                        tf.textColor = 0xFFFFFF; // Fallback
                    }

                    if (stage.addChild) stage.addChild(tf);
                    else stage.__children.push(tf);
                    console.log("[V62] Added Text.");
                }
            } catch (e) { console.error("Text Fail", e); }

            loopCount = 100; // Done
        }

    }, 2000);

})();
