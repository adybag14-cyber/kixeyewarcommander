(function () {
    var output = [];
    output.push("=== FIX INIT PARAMETERS ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var GameClass = window._hx_classes.GAME;
        var inst = GameClass._instance;

        // Helper to ensure valid string
        var ensureString = function (s) { return typeof s === 'string' ? s : "http://localhost:8088/"; };

        // Patch get_loaderInfo
        GameClass.prototype.get_loaderInfo = function () {
            output.push("Custom get_loaderInfo called");

            // Construct robust parameters
            var base = "http://localhost:8088/";
            var params = {
                baseurl: base,
                gameurl: base,
                apiurl: base + "wc/api/",
                wmbasemanurl: base + "wc/",
                statsurl: base + "stats",
                statsDURL: base + "statsd",
                mapurl: base + "map",
                logurl: base + "log",
                version: "71601",
                softversion: "1",
                locale: "en_US",
                gameversion: "1",
                _currency: "fbc",
                app_enable_response_checksum: "false",
                click_source: "manual",
                integ: "kxp", // or 'fbg'
                tlogsessionid: "debug_session",
                securecanvasurl: base + "canvas/",
                siu: base + "secure/",
                tutorialstage: 100, // Skip tutorial?

                // Polyfills for direct access if any
                _baseURL: base,
                _apiURL: base + "wc/api/",
                _gameURL: base
            };

            return {
                parameters: params,
                url: base,
                uncaughtErrorEvents: {
                    addEventListener: function (type, listener) {
                        output.push("EventListener added for: " + type);
                    }
                }
            };
        };
        output.push("Patched GAME.prototype.get_loaderInfo with valid URLs");

        // Call init()
        output.push("Calling GAME._instance.init()...");
        try {
            inst.init();
            output.push("init() Success!");
        } catch (e) {
            output.push("init() Failed: " + e + " stack: " + e.stack);
        }

        // Force loop?
        // lime.app.Application.current.window.onCreate.dispatch(); 

        // Check Stage
        if (inst.stage) {
            output.push("Stage Children: " + (inst.stage.children ? inst.stage.children.length : "0"));
            if (inst.stage.children && inst.stage.children.length > 0) {
                output.push("First Child: " + inst.stage.children[0]);
            }
        }

        if (inst.view) output.push("View: " + inst.view);

    } else {
        output.push("GAME instance not found.");
    }

    return output.join("\n");
})();
