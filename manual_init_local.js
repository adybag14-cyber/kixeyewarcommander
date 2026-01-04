(function () {
    var output = [];
    output.push("=== MANUAL INIT LOCAL ATTEMPT ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;

        // 1. Call setupStage()
        try {
            inst.setupStage();
            output.push("setupStage() called.");
        } catch (e) { output.push("setupStage err: " + e); }

        // 2. Call initLocal()
        if (typeof inst.initLocal === 'function') {
            output.push("Calling GAME._instance.initLocal()...");
            try {
                inst.initLocal();
                output.push("initLocal() call successful.");
            } catch (e) {
                output.push("Error calling initLocal: " + e);
            }
        }

        // 3. Check Stage Children
        if (inst.stage) {
            output.push("Stage Children: " + (inst.stage.children ? inst.stage.children.length : "0 (no array)"));

            // Check viewport specifically (found 'view' key earlier?)
            // Step 2408 checked 'view' and failed? Step 2435 didn't verify view property.
            // Let's check view property
            output.push("inst.view: " + (inst.view ? "Exists" : "Null"));
        }

        // 4. Force visible
        if (inst.stage) {
            inst.stage.visible = true;
            inst.stage.alpha = 1;
        }

    }

    return output.join("\n");
})();
