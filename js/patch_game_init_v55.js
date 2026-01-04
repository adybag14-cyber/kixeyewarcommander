/**
 * PATCH GAME INIT V55
 * - LOUD INSPECTOR
 * - UNCONDITIONAL LOGGING
 */

(function () {
    console.log("!!! [PATCH] V55 SCRIPT STARTING (LOUD) !!!");

    // DATA & URLOADER (Required for Boot)
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
                if (req.url.indexOf("getflags") !== -1 || req.url.indexOf("loadidata") !== -1) {
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

    // LOUD LOOP
    var loopCount = 0;
    setInterval(function () {
        if (loopCount > 5) return; // Stop spamming after 5 tries
        loopCount++;

        console.log("=== [V55] INSPECT LOOP " + loopCount + " ===");

        // 1. Check Globals
        var hx = window._hx_classes;
        var ofl = window.openfl;
        var game = window.GAME;

        console.log("window._hx_classes: " + (hx ? "FOUND (" + Object.keys(hx).length + " keys)" : "UNDEFINED"));
        // console.log("window.openfl: " + (ofl ? "FOUND" : "UNDEFINED"));
        // console.log("window.GAME: " + (game ? "FOUND" : "UNDEFINED"));

        // 2. Dump Keys if HX exists
        if (hx) {
            if (loopCount === 1) {
                var keys = Object.keys(hx);
                var sample = keys.slice(0, 20).join(", ");
                console.log("HX Keys Sample: " + sample);
            }

            // Check Lib specifically
            var Lib = hx["openfl.Lib"];
            console.log("hx['openfl.Lib']: " + (Lib ? "FOUND" : "MISSING"));

            if (Lib) {
                try { console.log("Lib.current: " + Lib.current); } catch (e) { console.log("Lib.current access fail: " + e); }
                try {
                    if (Lib.current) console.log("Lib.current.stage: " + Lib.current.stage);
                } catch (e) { }
            }
        }

        // 3. Check Stage via GAME
        if (game && game._instance) {
            console.log("GAME._instance: FOUND");
            console.log("GAME._instance.stage: " + game._instance.stage);
        }

        console.log("================================");

    }, 2000);

})();
