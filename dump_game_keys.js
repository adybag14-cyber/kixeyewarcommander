(function () {
    var output = [];
    output.push("=== GAME CLASS INSPECTION ===");

    if (window._hx_classes && window._hx_classes.GAME) {
        var cls = window._hx_classes.GAME;

        // Static Keys
        output.push("\n[STATIC KEYS]");
        output.push(Object.getOwnPropertyNames(cls).join(", "));

        // Prototype Keys
        if (cls.prototype) {
            output.push("\n[PROTOTYPE KEYS]");
            output.push(Object.getOwnPropertyNames(cls.prototype).join(", "));
        }

        // Instance Keys
        if (cls._instance) {
            output.push("\n[INSTANCE KEYS]");
            var inst = cls._instance;
            var keys = [];
            for (var k in inst) keys.push(k); // Enumerable
            output.push(keys.join(", "));
        } else {
            output.push("\nINSTANCE NOT FOUND");
        }

    }

    return output.join("\n");
})();
