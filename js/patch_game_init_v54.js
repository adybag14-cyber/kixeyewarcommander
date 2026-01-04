/**
 * PATCH GAME INIT V54
 * - DEBUG STAGE SEARCH
 * - DEBUG POPUP SHOW
 */

(function () {
    console.log("!!! [PATCH] V54 SCRIPT STARTING !!!");

    // 1. DATA PATCH & URLOADER (Same as V53)
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

    // 2. DEBUG POPUP SHOW LOGIC
    var popupDebugDone = false;
    setInterval(function () {
        if (!window._hx_classes) return;
        if (popupDebugDone) return;

        var targets = ["PLEASEWAIT", "POPUPS", "com.cc.popups.PopupSystem", "com.cc.popups.PopupGeneric"];
        for (var i = 0; i < targets.length; i++) {
            var cls = window._hx_classes[targets[i]];
            if (cls && cls.Show && !cls.Show.patched) {
                console.log("[V54] Patching " + targets[i] + ".Show");
                var origShow = cls.Show;
                cls.Show = function () {
                    var msg = arguments[0];
                    console.log("[V54] Capture Popup Show: " + msg);
                    if (typeof msg === 'string' && (msg.indexOf("Connecting") !== -1 || msg.indexOf("Please wait") !== -1 || msg.indexOf("Satellite") !== -1)) {
                        console.log(">> BLOCKING POPUP: " + msg);
                        return; // SUPPRESS
                    }
                    return origShow.apply(this, arguments);
                };
                cls.Show.patched = true;
            }
        }
        popupDebugDone = true;
    }, 1000);

    // 3. DEBUG STAGE SEARCH
    var stageLogDone = false;
    setInterval(function () {
        if (stageLogDone) return;
        if (!window._hx_classes) return;

        console.log("[V54] Haxe Classes Ready. Hunting Stage...");

        // Dump Lib
        var Lib = window._hx_classes["openfl.Lib"];
        if (Lib) {
            console.log("[V54] Lib Found.");
            try { console.log("Lib.current: ", Lib.current); } catch (e) { }
            try { console.log("Lib.current.stage: ", Lib.current ? Lib.current.stage : "null"); } catch (e) { }
            try { console.log("Lib.application: ", Lib.application); } catch (e) { }
            try { console.log("Lib.get_current(): ", Lib.get_current ? Lib.get_current() : "null"); } catch (e) { }
        } else {
            console.log("[V54] openfl.Lib NOT FOUND in _hx_classes");
        }

        // Search ANY DisplayObject
        var keys = Object.keys(window._hx_classes);
        for (var i = 0; i < Math.min(keys.length, 50); i++) {
            // Just sample
        }

        stageLogDone = true;
    }, 2000);

    // 4. NUKE (If found)
    setInterval(function () {
        var stage = null;
        try { if (window._hx_classes["openfl.Lib"]) stage = window._hx_classes["openfl.Lib"].current.stage; } catch (e) { }

        if (stage) {
            // Nuke
            try {
                if (stage.numChildren > 0) {
                    console.log("[V54] NUKING STAGE");
                    while (stage.numChildren > 0) stage.removeChildAt(0);

                    // Add Box
                    var Sprite = window._hx_classes["openfl.display.Sprite"];
                    var box = new Sprite();
                    box.graphics.beginFill(0x00FF00); // GREEN
                    box.graphics.drawRect(0, 0, 1000, 1000);
                    stage.addChild(box);
                }
            } catch (e) { }
        }
    }, 500);

})();
