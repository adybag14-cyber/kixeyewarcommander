(function () {
    var output = [];
    output.push("=== OPENFL/HAXE INSPECTION ===");

    // 1. Check OpenFL Root
    if (window.openfl) {
        output.push("OpenFL found.");
        if (window.openfl.Lib && window.openfl.Lib.current) {
            output.push("openfl.Lib.current found.");
            if (window.openfl.Lib.current.stage) {
                output.push("openfl.Lib.current.stage found.");
                output.push("Stage color: " + window.openfl.Lib.current.stage.color);
                output.push("Stage children: " + (window.openfl.Lib.current.stage.children ? window.openfl.Lib.current.stage.children.length : "N/A"));
            } else {
                output.push("openfl.Lib.current.stage NOT found.");
            }
        }
    } else {
        output.push("OpenFL NOT found.");
    }

    // 2. Check Lime Root
    if (window.lime) {
        output.push("Lime found.");
        if (window.lime.embed) output.push("lime.embed exists.");
    }

    // 3. Inspect _hx_classes.GAME (Class Definition)
    if (window._hx_classes && window._hx_classes.GAME) {
        var cls = window._hx_classes.GAME;
        output.push("_hx_classes.GAME found.");
        var props = Object.getOwnPropertyNames(cls);
        output.push("Static Props: " + props.join(", "));

        if (cls.main) output.push("GAME.main() exists.");
        if (cls.init) output.push("GAME.init() exists.");
    }

    return output.join("\n");
})();
