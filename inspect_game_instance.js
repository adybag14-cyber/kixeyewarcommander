(function () {
    var output = [];
    output.push("=== GAME INSTANCE INSPECTION ===");

    // 1. Inspect GAME._instance
    if (window._hx_classes && window._hx_classes.GAME) {
        var GameClass = window._hx_classes.GAME;
        if (GameClass._instance) {
            output.push("GAME._instance found.");
            var inst = GameClass._instance;

            // Dump keys of instance
            var keys = [];
            for (var k in inst) {
                try {
                    var val = inst[k];
                    var type = typeof val;
                    if (type === 'function') keys.push(k + "()");
                    else if (type === 'object' && val !== null) keys.push(k + ":obj");
                    else keys.push(k + ":" + val);
                } catch (e) { }
            }
            output.push("Instance Keys: " + keys.join(", "));

            // Check for stage/view
            if (inst.stage) output.push("instance.stage exists");
            if (inst.view) output.push("instance.view exists");
        } else {
            output.push("GAME._instance is null/undefined.");
        }
    }

    // 2. Check Lime Application
    // Haxe/Lime apps often expose `lime.app.Application`
    if (window.lime && window.lime.app && window.lime.app.Application && window.lime.app.Application.current) {
        output.push("lime.app.Application.current found.");
        var app = window.lime.app.Application.current;
        if (app.window) {
            output.push("App Window found: " + app.window.width + "x" + app.window.height);
        }
    }

    return output.join("\n");
})();
