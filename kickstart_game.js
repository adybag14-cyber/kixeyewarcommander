(function () {
    var output = [];
    output.push("=== MANUAL KICKSTART ATTEMPT ===");

    if (window._hx_classes && window._hx_classes.GAME) {
        var cls = window._hx_classes.GAME;

        if (typeof cls.handleRelocate === 'function') {
            output.push("Calling GAME.handleRelocate()...");
            try {
                cls.handleRelocate();
                output.push("Call successful (no error).");
            } catch (e) {
                output.push("Error calling handleRelocate: " + e);
            }
        } else {
            output.push("GAME.handleRelocate not found or not a function.");
            // Try _instance.init?
            if (cls._instance && typeof cls._instance.init === 'function') {
                output.push("Calling GAME._instance.init()...");
                cls._instance.init();
            }
        }

    } else {
        output.push("GAME class not found.");
    }

    return output.join("\n");
})();
