(function () {
    var output = [];
    output.push("=== INIT & DATA INSPECTION ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var cls = window._hx_classes.GAME;
        var inst = cls._instance;

        // 1. Check init signature
        if (inst.init) {
            output.push("GAME.init.length: " + inst.init.length);
        }

        // 2. Inspect Data
        output.push("GAME.Data type: " + typeof inst.Data);
        if (typeof inst.Data === 'object') {
            output.push("GAME.Data keys: " + Object.keys(inst.Data).join(", "));
        }

        // 3. Try calling onDataFinishedLoading
        if (typeof inst.onDataFinishedLoading === 'function') {
            output.push("Calling onDataFinishedLoading()...");
            try {
                inst.onDataFinishedLoading();
                output.push("onDataFinishedLoading call successful.");
            } catch (e) {
                output.push("Error onDataFinishedLoading: " + e);
            }
        }

        // 4. Try init with object
        if (typeof inst.init === 'function') {
            output.push("Calling init({})...");
            try {
                inst.init({});
                output.push("init({}) call successful.");
            } catch (e) {
                output.push("Error calling init({}): " + e);
            }
        }

        // 5. Check stage children again
        if (inst.stage) {
            output.push("Stage Children: " + (inst.stage.children ? inst.stage.children.length : "0"));
        }

    }

    return output.join("\n");
})();
