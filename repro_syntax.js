var h = function (a, b) { return function () { }; };
var S = { getClass: function () { return { __name__: "foo" } } };
var v = { fields: function () { }, field: function () { } };
var q = function (a, b) { return a };
var Us = function (a) { };
var window = { addEventListener: function () { }, setTimeout: function () { }, requestAnimationFrame: function () { } };
var CanvasRenderingContext2D = { prototype: {} };
var Date = { now: function () { } };
var performance = { timing: {} };

Us.prototype = {
    gameDeviceCache: null, accelerometer: null, currentUpdate: null, deltaTime: null, framePeriod: null, lastUpdate: null, nextUpdate: null, parent: null, convertKeyCode: function (a) {
        if (65 <= a && 90 >= a) return a + 32; switch (a) {
            case 12: return 1073741980;
        }return a
    }, exec: function () {
        window.addEventListener("keydown", h(this, this.handleKeyEvent), !1); window.addEventListener("keyup", h(this, this.handleKeyEvent), !1); window.addEventListener("focus", h(this, this.handleWindowEvent), !1); window.addEventListener("blur",
            h(this, this.handleWindowEvent), !1); window.addEventListener("resize", h(this, this.handleWindowEvent), !1); window.addEventListener("beforeunload", h(this, this.handleWindowEvent), !1); CanvasRenderingContext2D.prototype.isPointInStroke || (CanvasRenderingContext2D.prototype.isPointInStroke = function (a, b, c) { return !1 }); CanvasRenderingContext2D.prototype.isPointInPath || (CanvasRenderingContext2D.prototype.isPointInPath = function (a, b, c) { return !1 }); 0 == "performance" in window && (window.performance = {}); if (0 == "now" in window.performance) {
                var a =
                    Date.now(); performance.timing && performance.timing.navigationStart && (a = performance.timing.navigationStart); window.performance.now = function () { return Date.now() - a }
            } for (var b = 0, c = ["ms", "moz", "webkit", "o"], d = 0; d < c.length && !window.requestAnimationFrame; ++d)window.requestAnimationFrame = window[c[d] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[c[d] + "CancelAnimationFrame"] || window[c[d] + "CancelRequestAnimationFrame"]; window.requestAnimationFrame || (window.requestAnimationFrame = function (a, c) {
                var d =
                    (new Date).getTime(), e = Math.max(0, 16 - (d - b)); c = window.setTimeout(function () { a(d + e) }, e); b = d + e; return c
            }); window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) { clearTimeout(a) }); window.requestAnimFrame = window.requestAnimationFrame; this.lastUpdate = (new Date).getTime(); this.handleApplicationEvent(); return 0
    },
    exit: function () {
    },
    handleApplicationEvent: function (a) {
        console.warn("handleApplicationEvent: ENTER");
        var b;
        var c = 0;
        for (b = this.parent.__windows; c < b.length;) {
            a = b[c];
            ++c;
            a.__backend.updateSize();
        }
        this.currentUpdate = (new Date).getTime();
        if (this.currentUpdate >= this.nextUpdate) {
            this.deltaTime = this.currentUpdate - this.lastUpdate;
            c = 0;
            console.warn("handleApplicationEvent: Dispatching Update. Delta: " + this.deltaTime);
            for (b = this.parent.__windows; c < b.length;) {
                a = b[c];
                ++c;
                this.parent.onUpdate.dispatch(this.deltaTime | 0);
                if (null != a.context) {
                    a.onRender.dispatch(a.context);
                }
            }
            console.warn("handleApplicationEvent: Update Dispatched");
            this.nextUpdate = 0 > this.framePeriod ? this.currentUpdate : this.currentUpdate - this.currentUpdate % this.framePeriod + this.framePeriod;
            this.lastUpdate = this.currentUpdate;
        }
        console.warn("handleApplicationEvent: Requesting next frame");
        window.requestAnimationFrame(h(this, this.handleApplicationEvent));
    }, handleKeyEvent: function (a) {
        if (null !=
            this.parent.__window) { var b = this.convertKeyCode(null != a.keyCode ? a.keyCode : a.which), c = (a.shiftKey ? 3 : 0) | (a.ctrlKey ? 192 : 0) | (a.altKey ? 768 : 0) | (a.metaKey ? 3072 : 0); "keydown" == a.type ? (this.parent.__window.onKeyDown.dispatch(b, c), this.parent.__window.onKeyDown.canceled && a.cancelable && a.preventDefault()) : (this.parent.__window.onKeyUp.dispatch(b, c), this.parent.__window.onKeyUp.canceled && a.cancelable && a.preventDefault()) }
    }, handleSensorEvent: function (a) {
        this.accelerometer.onUpdate.dispatch(a.accelerationIncludingGravity.x,
            a.accelerationIncludingGravity.y, a.accelerationIncludingGravity.z)
    }, handleWindowEvent: function (a) { if (null != this.parent.__window) switch (a.type) { case "blur": this.parent.__window.onFocusOut.dispatch(); this.parent.__window.onDeactivate.dispatch(); break; case "focus": this.parent.__window.onFocusIn.dispatch(); this.parent.__window.onActivate.dispatch(); break; case "resize": this.parent.__window.__backend.handleResizeEvent(a) } }, updateGameDevices: function () {
        // Mock body
    }, __class__: Us
};
