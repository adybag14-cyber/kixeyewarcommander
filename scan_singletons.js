(function () {
    var output = [];
    output.push("=== SINGLETON SCAN ===");

    if (window._hx_classes) {
        var found = 0;
        for (var name in window._hx_classes) {
            var cls = window._hx_classes[name];
            // Check for _instance static property
            try {
                if (cls && cls._instance) {
                    output.push("Found Singleton: " + name);
                    // Check if it has a view or stage
                    var inst = cls._instance;
                    var details = [];
                    if (inst.view) details.push("has view");
                    if (inst.stage) details.push("has stage");
                    if (inst.root) details.push("has root");
                    if (details.length > 0) output.push("  -> " + details.join(", "));
                    found++;
                }
            } catch (e) { }
        }
        output.push("Total Singletons Found: " + found);
    } else {
        output.push("_hx_classes not found");
    }

    return output.join("\n");
})();
