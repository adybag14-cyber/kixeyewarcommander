/**
 * PATCH GAME INIT V58
 * - STAGE INSPECTION
 * - FORCE ADD CHILD
 * - HIDE POPUP INSTANCE
 */

(function () {
    console.log("!!! [PATCH] V58 SCRIPT STARTING !!!");

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

    // LOOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 20) return;
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.log("!!! [V58] STAGE FOUND !!!");

            // 1. INSPECT KEYS
            try {
                var keys = Object.keys(stage);
                console.log("[V58] Stage Keys Sample: " + keys.slice(0, 20).join(","));
            } catch (e) { }

            // 2. FORCE ADD GREEN BOX
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    // Check if already added
                    var already = false;
                    // We can't iterate children properly if numChildren is undefined, but check if we can access children array?
                    if (stage.__children && stage.__children.length) {
                        for (var i = 0; i < stage.__children.length; i++) {
                            if (stage.__children[i].name === "GREEN_BOX_V58") already = true;
                        }
                    }

                    if (!already) {
                        var box = new Sprite();
                        box.name = "GREEN_BOX_V58";
                        box.graphics.beginFill(0x00FF00);
                        box.graphics.drawRect(50, 50, 500, 500);
                        box.graphics.endFill();

                        // Try standard addChild
                        if (stage.addChild) {
                            stage.addChild(box);
                            console.log("[V58] Called stage.addChild(box)");
                        }
                        // Try adding to __children direct
                        else if (stage.__children) {
                            stage.__children.push(box);
                            if (box.set_parent) box.set_parent(stage);
                            console.log("[V58] Pushed to stage.__children");
                        }
                    }
                }
            } catch (e) { console.error("Add Box Fail", e); }

            // 3. FORCE HIDE POPUP
            try {
                var PopupClass = window._hx_classes["PLEASEWAIT"] || window._hx_classes["POPUPS"];
                if (PopupClass) {
                    var inst = PopupClass._instance || PopupClass.instance;
                    if (inst) {
                        console.log("[V58] Found Popup Instance. Hiding...");
                        if (inst.set_visible) inst.set_visible(false);
                        inst.visible = false;
                        inst.alpha = 0;
                        if (inst.parent && inst.parent.removeChild) inst.parent.removeChild(inst);
                    }
                }
                // Try PopupSystem
                var Sys = window._hx_classes["com.cc.popups.PopupSystem"];
                if (Sys && Sys._instance) {
                    // Maybe it has a list?
                }
            } catch (e) { }

            loopCount = 100; // Stop
        }

    }, 2000);

})();
