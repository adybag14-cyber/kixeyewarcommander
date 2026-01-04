(function () {
    var output = [];
    output.push("=== INIT PROXY INSPECTION ===");

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var inst = window._hx_classes.GAME._instance;
        var accessedProps = [];

        if (typeof Proxy === 'undefined') {
            output.push("Proxy not supported in this browser!");
            return output.join("\n");
        }

        // Create a recursive proxy to handle nested accesses
        var createMock = function (name) {
            return new Proxy(function () { }, {
                get: function (target, prop) {
                    if (prop === 'toString') return function () { return name; };
                    // Log access
                    var path = name + "." + String(prop);
                    accessedProps.push(path);
                    output.push("Accessed: " + path);

                    // Return valid values for common types to keep execution going
                    if (prop === 'indexOf') return function () { return -1; };
                    if (prop === 'length') return 0;
                    if (prop === 'push') return function () { };

                    return createMock(path);
                },
                apply: function (target, thisArg, args) {
                    output.push("Called: " + name + "()");
                    return createMock(name + "()");
                }
            });
        };

        var proxyConfig = createMock("config");

        output.push("Calling init(proxyConfig)...");
        try {
            inst.init(proxyConfig);
            output.push("init(proxyConfig) finished without error.");
        } catch (e) {
            output.push("init(proxyConfig) Failed: " + e);
        }

        output.push("Accessed Properties List: " + accessedProps.join(", "));

    } else {
        output.push("GAME instance not found.");
    }

    return output.join("\n");
})();
