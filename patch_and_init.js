(function () {
    var output = [];
    output.push("=== PATCH LOADERINFO & INIT ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var GameClass = window._hx_classes.GAME;
        var inst = GameClass._instance;

        // 1. Patch get_loaderInfo
        // Preserving original just in case, but determining what it does first would be good.
        // For now, aggressive patch.

        GameClass.prototype.get_loaderInfo = function () {
            output.push("Custom get_loaderInfo called");
            return {
                parameters: window.wc_config || {},
                url: "http://localhost:8088/",
                uncaughtErrorEvents: {
                    addEventListener: function (type, listener) {
                        output.push("EventListener added for: " + type);
                    }
                }
            };
        };
        output.push("Patched GAME.prototype.get_loaderInfo");

        // 2. Call init()
        output.push("Calling GAME._instance.init()...");
        try {
            inst.init();
            output.push("init() Success!");
        } catch (e) {
            output.push("init() Failed: " + e + " stack: " + e.stack);
        }

        // 3. Check Stage
        if (inst.stage) {
            output.push("Stage Children: " + (inst.stage.children ? inst.stage.children.length : "0"));
            if (inst.view) output.push("View: " + inst.view);
        }

    } else {
        output.push("GAME instance not found.");
    }

    return output.join("\n");
})();
