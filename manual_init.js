(function () {
    var output = [];
    output.push("=== MANUAL INIT ATTEMPT ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;

        // 1. Call setupStage()
        if (typeof inst.setupStage === 'function') {
            output.push("Calling GAME._instance.setupStage()...");
            try {
                inst.setupStage();
                output.push("setupStage() call successful.");
            } catch (e) {
                output.push("Error calling setupStage: " + e);
            }
        } else {
            output.push("setupStage not found on instance.");
        }

        // 2. Call init()
        if (typeof inst.init === 'function') {
            output.push("Calling GAME._instance.init()...");
            try {
                inst.init();
                output.push("init() call successful.");
            } catch (e) {
                output.push("Error calling init: " + e);
            }
        }

        // 3. Check Stage Children
        if (inst.stage && inst.stage.children) {
            output.push("Stage Children after calls: " + inst.stage.children.length);
        }

    } else {
        output.push("GAME instance not found for init.");
    }

    return output.join("\n");
})();
