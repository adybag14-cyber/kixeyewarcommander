(function () {
    var output = [];
    output.push("=== RELOCATE AFTER INIT ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var GameClass = window._hx_classes.GAME;
        var inst = GameClass._instance;

        // 1. Inspect __children (OpenFL specific)
        if (inst.__children) {
            output.push("GAME.__children.length: " + inst.__children.length);
            if (inst.__children.length > 0) {
                var root = inst.__children[0];
                output.push("Child[0]: " + root + " name=" + (root.name || "N/A"));
                if (root.__children) output.push("  Root Children: " + root.__children.length);
            }
        } else {
            output.push("GAME.__children undefined. Trying get_numChildren()?");
            if (typeof inst.get_numChildren === 'function') output.push("get_numChildren: " + inst.get_numChildren());
        }

        // 2. Try handleRelocate
        output.push("Attempting GAME.handleRelocate()...");
        if (typeof GameClass.handleRelocate === 'function') {
            try {
                // inspect handleRelocate arguments length?
                output.push("handleRelocate.length: " + GameClass.handleRelocate.length);

                // Pass a dummy object just in case
                GameClass.handleRelocate({ x: 500, y: 500 });
                output.push("handleRelocate called successfully.");
            } catch (e) {
                output.push("handleRelocate Failed: " + e);
            }
        }

    } else {
        output.push("GAME instance not found.");
    }

    return output.join("\n");
})();
