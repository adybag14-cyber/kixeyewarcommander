(function () {
    var output = [];
    output.push("=== DEEP INSPECTION V2 ===");

    // 1. Check Canvas
    var canvases = document.getElementsByTagName('canvas');
    output.push("Canvases found: " + canvases.length);
    for (var i = 0; i < canvases.length; i++) {
        var c = canvases[i];
        output.push("Canvas[" + i + "]: ID=" + c.id + ", W=" + c.width + ", H=" + c.height + ", Display=" + c.style.display);
    }

    // 2. Check GAME object
    if (window.GAME) {
        output.push("window.GAME type: " + typeof window.GAME);
        var keys = [];
        for (var k in window.GAME) {
            if (typeof window.GAME[k] === 'function') keys.push(k + "()");
            else keys.push(k + "=" + window.GAME[k]);
        }
        output.push("GAME keys: " + keys.join(", "));
    } else {
        output.push("window.GAME not found");
    }

    // 3. Scan _hx_classes for "Game"
    if (window._hx_classes) {
        var matches = [];
        for (var k in window._hx_classes) {
            if (k.toLowerCase().indexOf("game") !== -1 || k.toLowerCase().indexOf("main") !== -1) {
                matches.push(k);
            }
        }
        output.push("_hx_classes Matches: " + matches.join(", "));
    }

    return output.join("\n");
})();
