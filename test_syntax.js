var Us = function (a) { };
Us.prototype = {
    gameDeviceCache: null, accelerometer: null, currentUpdate: null, deltaTime: null, framePeriod: null, lastUpdate: null, nextUpdate: null, parent: null, convertKeyCode: function (a) {
        if (65 <= a && 90 >= a) return a + 32; switch (a) {
            case 12: return 1073741980; case 16: return 1073742049; case 17: return 1073742048; case 18: return 1073742050; case 19: return 1073741896; case 20: return 1073741881; case 33: return 1073741899; case 34: return 1073741902; case 35: return 1073741901; case 36: return 1073741898;
            case 37: return 1073741904; case 38: return 1073741906; case 39: return 1073741903; case 40: return 1073741905; case 41: return 1073741943; case 43: return 1073741940; case 44: return 1073741894; case 45: return 1073741897; case 46: return 127; case 91: return 1073742051; case 92: return 1073742055; case 93: return 1073742055; case 95: return 1073742106; case 96: return 1073741922; case 97: return 1073741913; case 98: return 1073741914; case 99: return 1073741915; case 100: return 1073741916; case 101: return 1073741917; case 102: return 1073741918;
            case 103: return 1073741919; case 104: return 1073741920; case 105: return 1073741921; case 106: return 1073741909; case 107: return 1073741911; case 108: return 1073741923; case 109: return 1073741910; case 110: return 1073741923; case 111: return 1073741908; case 112: return 1073741882; case 113: return 1073741883; case 114: return 1073741884; case 115: return 1073741885; case 116: return 1073741886; case 117: return 1073741887; case 118: return 1073741888; case 119: return 1073741889; case 120: return 1073741890; case 121: return 1073741891;
            case 122: return 1073741892; case 123: return 1073741893; case 124: return 1073741928; case 125: return 1073741929; case 126: return 1073741930; case 127: return 1073741931; case 128: return 1073741932; case 129: return 1073741933; case 130: return 1073741934; case 131: return 1073741935; case 132: return 1073741936; case 133: return 1073741937; case 134: return 1073741938; case 135: return 1073741939; case 144: return 1073741907; case 145: return 1073741895; case 160: return 94; case 161: return 33; case 163: return 35; case 164: return 36;
            case 166: return 1073742094; case 167: return 1073742095; case 168: return 1073742097; case 169: return 41; case 170: return 42; case 171: return 96; case 172: return 1073741898; case 173: return 45; case 174: return 1073741953; case 175: return 1073741952; case 176: return 1073742082; case 177: return 1073742083; case 178: return 1073742084; case 179: return 1073742085; case 180: return 1073742089; case 181: return 1073742086; case 182: return 1073741953; case 183: return 1073741952; case 186: return 59; case 187: return 61; case 188: return 44;
            case 189: return 45; case 190: return 46; case 191: return 47; case 192: return 96; case 193: return 63; case 194: return 1073741923; case 219: return 91; case 220: return 92; case 221: return 93; case 222: return 39; case 223: return 96; case 224: return 1073742051; case 226: return 92
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
    }, exit: function () {
    }, handleApplicationEvent: function (a) {
        console.warn("handleApplicationEvent: ENTER");
        var b; var c = 0; for (b = this.parent.__windows; c < b.length;)a = b[c], ++c, a.__backend.updateSize(); this.currentUpdate = (new Date).getTime();
        if (this.currentUpdate >= this.nextUpdate) {
            this.deltaTime = this.currentUpdate - this.lastUpdate; c = 0;
            console.warn("handleApplicationEvent: Dispatching Update. Delta: " + this.deltaTime);
            for (b = this.parent.__windows; c < b.length;)a = b[c], ++c, this.parent.onUpdate.dispatch(this.deltaTime | 0), null != a.context && a.onRender.dispatch(a.context);
            console.warn("handleApplicationEvent: Update Dispatched");
            this.nextUpdate = 0 > this.framePeriod ? this.currentUpdate : this.currentUpdate - this.currentUpdate % this.framePeriod + this.framePeriod; this.lastUpdate = this.currentUpdate
        }
        console.warn("handleApplicationEvent: Requesting next frame");
        window.requestAnimationFrame(h(this, this.handleApplicationEvent))
    },
};
