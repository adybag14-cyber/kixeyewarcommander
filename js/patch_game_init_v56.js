/**
 * PATCH GAME INIT V56
 * - SINGLETON STAGE HUNTER
 * - NUKE
 */

(function () {
    console.log("!!! [PATCH] V56 SCRIPT STARTING !!!");

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
    } catch (e) { }

    // SINGLETON HUNT LOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 10) return;
        loopCount++;

        var stage = null;
        var foundVia = "";

        if (window._hx_classes) {
            var keys = Object.keys(window._hx_classes);
            // console.log("[V56] Scanning " + keys.length + " classes for stage...");

            for (var i = 0; i < keys.length; i++) {
                var name = keys[i];
                var cls = window._hx_classes[name];
                if (cls) {
                    // Check _instance
                    var inst = cls._instance || cls.instance || cls.getInstance ? cls.getInstance() : null;
                    if (inst) {
                        try {
                            if (inst.stage) {
                                stage = inst.stage;
                                foundVia = name + "._instance";
                                break;
                            }
                            if (inst.get_stage) {
                                stage = inst.get_stage();
                                foundVia = name + ".get_stage()";
                                break;
                            }
                        } catch (e) { }
                    }
                }
            }
        }

        if (stage) {
            console.log("!!! [V56] STAGE FOUND via " + foundVia + " !!!");

            // NUKE
            try {
                var num = 0; try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { } }
                console.log("[V56] Children: " + num);

                if (num > 0 && stage.getChildAt(0).name !== "GREEN_BOX") {
                    console.log("[V56] NUKING...");
                    while (num > 0) {
                        try { stage.removeChildAt(0); } catch (e) { }
                        try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { num--; } }
                    }

                    // ADD GREEN BOX
                    var Sprite = window._hx_classes["openfl.display.Sprite"];
                    if (Sprite) {
                        var box = new Sprite();
                        box.name = "GREEN_BOX";
                        box.graphics.beginFill(0x00FF00);
                        box.graphics.drawRect(0, 0, 1000, 1000);
                        stage.addChild(box);
                        console.log("[V56] GREEN BOX ADDED");
                    }
                }
            } catch (e) { console.error("Nuke Fail", e); }

        } else {
            console.log("[V56] Stage Scan Failed (Loop " + loopCount + ")");
        }

    }, 2000);

})();
