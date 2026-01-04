/**
 * PATCH GAME INIT V53
 * - ROBUST STAGE HUNTER
 * - NUKE & GREEN BOX
 */

(function () {
    console.log("!!! [PATCH] V53 SCRIPT STARTING !!!");

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

    // 2. URLOADER PATCH
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
    setInterval(function () {
        var stage = null;
        var method = "";

        // METHOD A: Globals
        try { if (window.openfl && window.openfl.Lib && window.openfl.Lib.current) { stage = window.openfl.Lib.current.stage; method = "GlobalOpenFL"; } } catch (e) { }

        // METHOD B: Haxe Classes
        if (!stage && window._hx_classes) {
            try {
                var Lib = window._hx_classes["openfl.Lib"];
                if (Lib && Lib.current && Lib.current.stage) { stage = Lib.current.stage; method = "HaxeLib"; }
            } catch (e) { }

            if (!stage) {
                try {
                    var Game = window._hx_classes["GAME"];
                    if (Game && Game._instance && Game._instance.stage) { stage = Game._instance.stage; method = "HaxeGame"; }
                } catch (e) { }
            }
            if (!stage) {
                try {
                    var Doc = window._hx_classes["DocumentClass"];
                    if (Doc && Doc._instance && Doc._instance.stage) { stage = Doc._instance.stage; method = "HaxeDoc"; }
                } catch (e) { }
            }
        }

        if (stage) {
            // console.log("[V53] Stage Found via " + method);

            // NUKE
            var num = 0; try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { } }

            if (num > 0) {
                // Check if it's just our box
                var c = stage.getChildAt(0);
                if (num === 1 && c.name === "GREEN_BOX") {
                    return; // All good
                }

                console.log("[V53] Stage has " + num + " children. NUKING...");
                while (num > 0) {
                    try { stage.removeChildAt(0); } catch (e) { }
                    try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { num--; } }
                }

                // ADD GREEN BOX
                console.log("[V53] Adding Green Box");
                try {
                    var Sprite = window.openfl ? window.openfl.display.Sprite : window._hx_classes["openfl.display.Sprite"];
                    if (Sprite) {
                        var box = new Sprite();
                        box.name = "GREEN_BOX";
                        box.graphics.beginFill(0x00FF00);
                        box.graphics.drawRect(50, 50, 500, 500);
                        box.graphics.endFill();
                        stage.addChild(box);
                    }
                } catch (e) { console.error("Box Fail", e); }
            } else if (num === 0) {
                // Empty, add box
                console.log("[V53] Stage Empty. Adding Green Box");
                try {
                    var Sprite = window.openfl ? window.openfl.display.Sprite : window._hx_classes["openfl.display.Sprite"];
                    if (Sprite) {
                        var box = new Sprite();
                        box.name = "GREEN_BOX";
                        box.graphics.beginFill(0x00FF00);
                        box.graphics.drawRect(50, 50, 500, 500);
                        box.graphics.endFill();
                        stage.addChild(box);
                    }
                } catch (e) { console.error("Box Fail", e); }
            }
        }

    }, 500);

})();
