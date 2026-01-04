/**
 * PATCH GAME INIT V59
 * - FIX GRAPHICS
 * - RECURSIVE HIDE
 * - STAGE KEYS DUMP
 */

(function () {
    console.log("!!! [PATCH] V59 SCRIPT STARTING !!!");

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

    // LOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 20) return; // Stop after success or too many tries
        loopCount++;

        var stage = null;
        if (window._hx_classes && window._hx_classes["GAME"] && window._hx_classes["GAME"]._instance) {
            try { stage = window._hx_classes["GAME"]._instance.stage; } catch (e) { }
        }

        if (stage) {
            console.warn("!!! [V59] STAGE FOUND !!!");

            // 1. INSPECT KEYS (WARN LEVEL)
            try {
                var keys = Object.keys(stage);
                console.warn("[V59] Stage Keys: " + keys.join(", "));
            } catch (e) { }

            // 2. RECURSIVE HIDE POPUP
            try {
                // Try children access strategies
                var children = stage.__children || stage.children || stage._children;
                if (!children && stage.get_numChildren) {
                    children = [];
                    for (var i = 0; i < stage.get_numChildren(); i++) children.push(stage.getChildAt(i));
                }

                if (children) {
                    console.warn("[V59] Stage has " + children.length + " children.");
                    for (var i = 0; i < children.length; i++) {
                        var c = children[i];
                        var name = c.name || "unknown";
                        var clsName = c.__name__ || (c.constructor ? c.constructor.name : "unknown");
                        console.warn("[V59] Child " + i + ": " + name + " (" + clsName + ")");

                        // Check recursive if "ViewManager" or similar
                        if (clsName.indexOf("Manager") !== -1 || name === "ViewManager") {
                            // Dig deeper safely
                            // ...
                        }

                        // Hide Popup logic
                        if (clsName.indexOf("Popup") !== -1 || name.indexOf("Popup") !== -1 || name === "POPUPS") {
                            console.warn(">> HIDING POPUP: " + name);
                            if (c.set_visible) c.set_visible(false);
                            c.visible = false;
                            c.alpha = 0;
                            if (c.parent && c.parent.removeChild) c.parent.removeChild(c);
                        }
                    }
                } else {
                    console.warn("[V59] Could not access Stage children!");
                }
            } catch (e) { console.error("Recurse Fail", e); }


            // 3. FIX SPRITE DRAW
            try {
                var Sprite = window._hx_classes["openfl.display.Sprite"];
                if (Sprite) {
                    var box = new Sprite();
                    box.name = "GREEN_BOX_V59";

                    var g = null;
                    if (box.graphics) g = box.graphics;
                    else if (box.get_graphics) g = box.get_graphics();

                    if (g) {
                        if (g.beginFill) g.beginFill(0x00FF00);
                        if (g.drawRect) g.drawRect(50, 50, 500, 500);
                        if (g.endFill) g.endFill();

                        if (stage.addChild) {
                            // Check dupes
                            stage.addChild(box);
                            console.warn("[V59] Added Green Box (addChild)");
                        } else if (stage.addChildAt) {
                            stage.addChildAt(box, 0);
                        }
                    } else {
                        console.error("[V59] Sprite has no graphics API. Keys: " + Object.keys(box).join(","));
                    }
                }
            } catch (e) { console.error("Box Fail", e); }

            loopCount = 100; // Found & Tried
        }

    }, 2000);

})();
