/**
 * PATCH GAME INIT V52
 * - SIMPLIFIED STAGE NUKE
 * - GREEN BOX TEST
 */

(function () {
    console.log("!!! [PATCH] V52 SCRIPT STARTING !!!");

    // 1. DATA PATCH
    try {
        var GameClass = window._hx_classes && window._hx_classes["GAME"] ? window._hx_classes["GAME"] : window.GAME;
        if (GameClass) {
            GameClass.prototype.Data = function (a, b) {
                if (!a) a = {};
                var localhost = "http://localhost:8088/";
                if (!a.baseurl) a.baseurl = localhost + "assets/";
                if (!a.apiurl) a.apiurl = localhost + "api/";
                try { return this.originalData ? this.originalData(a, b) : null; } catch (e) { }
            };
        }
    } catch (e) { }

    // 2. URLOADER PATCH (For Flags)
    try {
        var URLLoader = window.URLoaderApi || (window._hx_classes && window._hx_classes["URLoaderApi"]);
        if (URLLoader) {
            URLLoader.prototype.load = function (req) {
                var url = req.url;
                if (url.indexOf("getflags") !== -1 || url.indexOf("loadidata") !== -1) {
                    var self = this;
                    setTimeout(function () {
                        self.data = JSON.stringify({ success: true, flags: { example: 1 }, data: {} });
                        try { if (self.dispatchEvent) self.dispatchEvent({ type: "complete" }); else if (self.onComplete) self.onComplete({ type: "complete" }); } catch (e) { }
                    }, 10);
                    return;
                }
                if (this.originalLoad) return this.originalLoad(req);
            };
        }
    } catch (e) { }

    // 3. MAIN LOOP
    var nukeDone = false;
    setInterval(function () {
        // console.log("[V52] Tick...");

        // Find Stage
        var stage = null;
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.current) stage = window.openfl.Lib.current.stage; } catch (e) { }
        if (!stage) try { if (window.GAME && window.GAME._instance) stage = window.GAME._instance.stage; } catch (e) { }

        if (stage) {
            // Nuke
            var num = 0; try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { } }

            // Log what we see
            if (num > 0) {
                console.log("[V52] Stage has " + num + " children. NUKING...");
                while (num > 0) {
                    try { stage.removeChildAt(0); } catch (e) { }
                    try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { num--; } }
                }

                // Add Green Box
                console.log("[V52] Adding Green Box");
                try {
                    var Sprite = window.openfl.display.Sprite;
                    if (!Sprite && window._hx_classes) Sprite = window._hx_classes["openfl.display.Sprite"];
                    if (Sprite) {
                        var box = new Sprite();
                        box.graphics.beginFill(0x00FF00);
                        box.graphics.drawRect(50, 50, 500, 500); // 500x500 Green Box
                        box.graphics.endFill();
                        stage.addChild(box);
                        console.log("[V52] Green Box Added!");
                    }
                } catch (e) {
                    console.error("[V52] Box Fail", e);
                }
            } else {
                // If 1 child and it's our box, good.
                // console.log("[V52] Stage clean / box present.");
            }
        } else {
            // console.log("[V52] Stage NOT found");
        }

    }, 500);

})();
