/**
 * PATCH GAME INIT V66
 * - PROOF OF LIFE
 * - DOM OVERLAY
 */

(function () {
    console.log("!!! [PATCH] V66 SCRIPT STARTING !!!");

    // KEEP DATA PATCH
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
    } catch (e) { }

    // ASSET MOCKS (Keep Green Box Loader)
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

    // 1. CREATE DOM OVERLAY (Immediate)
    var overlay = document.createElement("div");
    overlay.id = "antigravity-overlay";
    overlay.style.position = "absolute";
    overlay.style.top = "50px";
    overlay.style.left = "50px";
    overlay.style.zIndex = "99999";
    overlay.style.color = "#00FF00";
    overlay.style.fontFamily = "monospace";
    overlay.style.fontSize = "24px";
    overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
    overlay.style.padding = "20px";
    overlay.style.border = "2px solid #00FF00";
    overlay.innerHTML = "ANTIGRAVITY CONTROL ESTABLISHED<br>Display List Nuked<br>Ready for Map Logic";
    document.body.appendChild(overlay);


    // MAIN LOOP (OpenFL Nuke)
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 20) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V66] STAGE FOUND !!!");

            // 2. NUKE
            try {
                if (stage.removeChildren) stage.removeChildren();
                else if (stage.removeChildAt) while (stage.numChildren > 0) stage.removeChildAt(0);
                else if (stage.__children) stage.__children = [];
                console.log("[V66] Stage Nuked.");
            } catch (e) { }

            // 3. FALLBACK BG
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    var g = box.graphics || box.get_graphics();
                    if (g) { g.beginFill(0x001100); g.drawRect(0, 0, 2000, 2000); g.endFill(); }
                    if (stage.addChild) stage.addChild(box);
                    else stage.__children.push(box);
                }
            } catch (e) { }

            loopCount = 100;
        }

    }, 2000);

})();
