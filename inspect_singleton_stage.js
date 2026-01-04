(function () {
    var output = [];
    output.push("=== STAGE INSPECTION (SINGLETON) ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;
        var stage = inst.stage;

        output.push("GAME instance found.");

        if (stage) {
            output.push("Stage Properties:");
            output.push("  visible: " + stage.visible);
            output.push("  alpha: " + stage.alpha);
            output.push("  x/y: " + stage.x + "," + stage.y);
            output.push("  scale: " + stage.scaleX + "," + stage.scaleY);
            output.push("  width/height: " + (stage.width || "N/A") + "x" + (stage.height || "N/A")); // Might depend on content

            if (stage.children) {
                output.push("Children Count: " + stage.children.length);
                for (var i = 0; i < Math.min(stage.children.length, 10); i++) {
                    var c = stage.children[i];
                    // Get class name if possible
                    var type = c.constructor ? c.constructor.name : "Unknown";
                    // Haxe classes often have __name__
                    try { if (c.__name__) type = c.__name__.join("."); } catch (e) { }

                    output.push("  Child[" + i + "]: " + type + " (vis:" + c.visible + ", a:" + c.alpha + ", x:" + c.x + ", y:" + c.y + ")");
                }
            } else {
                output.push("Stage has no 'children' array.");
            }
        } else {
            output.push("GAME._instance.stage is null/undefined.");
        }
    } else {
        output.push("GAME._instance NOT FOUND (accessed directly).");
    }

    return output.join("\n");
})();
