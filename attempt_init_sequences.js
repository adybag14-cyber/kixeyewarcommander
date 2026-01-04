(function () {
    var output = [];
    output.push("=== INIT SEQUENCES & VIEW SCAN ===");

    // 1. Scan for View classes
    if (window._hx_classes) {
        var views = [];
        for (var k in window._hx_classes) {
            if (k.toLowerCase().indexOf("view") !== -1 || k.toLowerCase().indexOf("ui") !== -1) {
                views.push(k);
            }
        }
        output.push("View/UI Classes Found: " + views.length);
        // output.push(views.join(", ")); // Might be too long, maybe just top 10?
        if (views.length > 0) output.push("Example: " + views[0]);
    }

    // 2. Init Attempts
    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;
        var config = window.wc_config || {};

        // Attempt 1: init(wc_config)
        output.push("Attempting init(window.wc_config)...");
        try {
            inst.setupStage(); // Ensure stage is ready
            inst.init(config);
            output.push("init(config) Success!");
        } catch (e) {
            output.push("init(config) Failed: " + e);
        }

        // Attempt 2: init(config.flags)
        if (config.flags) {
            output.push("Attempting init(window.wc_config.flags)...");
            try {
                inst.setupStage();
                inst.init(config.flags);
                output.push("init(flags) Success!");
            } catch (e) {
                output.push("init(flags) Failed: " + e);
            }
        }

        // Attempt 3: init([config]) (Array wrapper?)
        output.push("Attempting init([window.wc_config])...");
        try {
            inst.setupStage();
            inst.init([config]);
            output.push("init([config]) Success!");
        } catch (e) {
            output.push("init([config]) Failed: " + e);
        }

        // Check Stage
        if (inst.stage) {
            output.push("Stage Children: " + (inst.stage.children ? inst.stage.children.length : "0"));
            // Force update?
            if (inst.stage.invalidate) inst.stage.invalidate();
        }
    }

    return output.join("\n");
})();
