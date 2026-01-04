/**
 * PATCH GAME INIT V57
 * - ROBUST SINGLETON HUNTER
 * - SAFE CHECKS
 */

(function () {
    console.log("!!! [PATCH] V57 SCRIPT STARTING !!!");

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

    // ROBUST SINGLETON HUNT LOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 10) return;
        loopCount++;

        var stage = null;
        var foundVia = "";

        if (window._hx_classes) {
            var keys = Object.keys(window._hx_classes);

            for (var i = 0; i < keys.length; i++) {
                var name = keys[i];
                var cls = window._hx_classes[name];
                if (!cls) continue;

                try {
                    // Check Static Stage
                    if (cls.stage && cls.stage.addChild) {
                        stage = cls.stage;
                        foundVia = name + ".stage";
                        break;
                    }

                    // Check Instance Methods
                    var inst = null;
                    if (cls._instance) inst = cls._instance;
                    else if (cls.instance) inst = cls.instance;
                    else if (typeof cls.getInstance === 'function') inst = cls.getInstance();

                    if (inst) {
                        if (inst.stage && inst.stage.addChild) {
                            stage = inst.stage;
                            foundVia = name + "._instance.stage";
                            break;
                        }
                        if (inst.get_stage && typeof inst.get_stage === 'function') {
                            var s = inst.get_stage();
                            if (s && s.addChild) {
                                stage = s;
                                foundVia = name + "._instance.get_stage()";
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // console.log("Error checking " + name + ": " + e);
                }
            }
        }

        if (stage) {
            console.log("!!! [V57] STAGE FOUND via " + foundVia + " !!!");

            // NUKE
            try {
                var num = 0; try { num = stage.numChildren; } catch (e) { try { num = stage.get_numChildren(); } catch (e2) { } }
                console.log("[V57] Children: " + num);

                if (num > 0 && stage.getChildAt(0).name !== "GREEN_BOX") {
                    console.log("[V57] NUKING...");
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
                        console.log("[V57] GREEN BOX ADDED");
                    }
                }
            } catch (e) { console.error("Nuke Fail", e); }
            loopCount = 100; // Stop

        } else {
            if (loopCount % 5 === 0) console.log("[V57] Stage Scan Failed (Loop " + loopCount + ")");
        }

    }, 2000);

})();
