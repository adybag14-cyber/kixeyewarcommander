(function () {
    var output = [];
    output.push("=== INIT CRASH SOLVER & VIEW SCAN ===");

    // 1. Mock loaderInfo
    window.loaderInfo = {
        parameters: window.wc_config || {}
    };
    output.push("Mocked window.loaderInfo");

    // 2. Scan for specific View classes
    if (window._hx_classes) {
        var potentialViews = [];
        for (var k in window._hx_classes) {
            var lower = k.toLowerCase();
            if (lower.indexOf("gameview") !== -1 || lower.indexOf("mainview") !== -1 || lower.indexOf("rootview") !== -1 || k === "View") {
                potentialViews.push(k);
            }
        }
        output.push("Potential Main Views: " + potentialViews.join(", "));
    }

    // 3. Init with Polyfill Object
    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;

        // Construct a 'rich' config object
        var richConfig = Object.assign({}, window.wc_config);
        richConfig.platform = "facebook"; // Common check
        richConfig.browser = "chrome";
        richConfig.user_id = "100";
        richConfig.game_id = "1";

        output.push("Attempting init(richConfig)...");
        try {
            inst.init(richConfig);
            output.push("init(richConfig) Success!");
        } catch (e) {
            output.push("init(richConfig) Failed: " + e);
        }

        // Attempt with string? (Maybe it expects session_id?)
        output.push("Attempting init('dummy_string')...");
        try {
            inst.init("dummy_string");
            output.push("init(string) Success!");
        } catch (e) {
            output.push("init(string) Failed: " + e);
        }
    }

    return output.join("\n");
})();
