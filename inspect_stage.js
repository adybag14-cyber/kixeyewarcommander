(function () {
    var output = [];
    output.push("=== RENDERING & FLAGS DEBUG ===");

    // 1. Check Stage / Rendering Root
    // Possible roots: GAME.stage, lime.stage, createjs.Stage
    var stage = null;
    if (window.GAME && window.GAME.stage) stage = window.GAME.stage;
    else if (window.stage) stage = window.stage;

    if (stage) {
        output.push("Stage found: YES");
        if (stage.children) {
            output.push("Stage children count: " + stage.children.length);
            // Dump first level children
            for (var i = 0; i < stage.children.length; i++) {
                var c = stage.children[i];
                output.push("Child[" + i + "]: " + c + " (visible: " + c.visible + ", alpha: " + c.alpha + ")");
            }
        } else {
            output.push("Stage has no children array.");
        }
    } else {
        output.push("Stage found: NO");
    }

    // 2. Check Flags State in Logic (if accessible)
    // We patched wc_config, but internal game logic might store it elsewhere.

    return output.join("\n");
})();
