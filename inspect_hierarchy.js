(function () {
    var out = [];
    out.push("=== HIERARCHY INSPECTION ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;

        out.push("GAME._instance:");
        out.push("  visible: " + inst.visible);
        out.push("  alpha: " + inst.alpha);
        out.push("  x/y: " + inst.x + "," + inst.y);
        out.push("  numChildren: " + (inst.numChildren !== undefined ? inst.numChildren : (inst.children ? inst.children.length : "N/A")));

        if (inst.parent) {
            out.push("Parent: " + inst.parent + " (name: " + (inst.parent.name || "N/A") + ")");
        } else {
            out.push("Parent: NULL");
        }

        if (inst.stage) {
            out.push("Stage: " + inst.stage);
            out.push("Stage children: " + (inst.stage.children ? inst.stage.children.length : "N/A"));
        }

        // Inspect children of GAME
        if (typeof inst.getChildAt === 'function') {
            var count = inst.numChildren || 0;
            for (var i = 0; i < count; i++) {
                var c = inst.getChildAt(i);
                out.push("  Child[" + i + "]: " + c + " name='" + (c.name) + "' vis=" + c.visible);
            }
        }
    } else {
        out.push("GAME instance not found.");
    }

    return out.join("\n");
})();
