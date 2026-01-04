(function () {
    var found = [];
    if (window._hx_classes) {
        for (var name in window._hx_classes) {
            var cls = window._hx_classes[name];
            if (cls && cls.DisplayWorldmapDown) {
                found.push("FOUND DIRECT: " + name);
            }
            if (cls && cls.prototype && cls.prototype.DisplayWorldmapDown) {
                found.push("FOUND PROTO: " + name);
            }
            // Check for loose match on name if minified
            if (name.indexOf("POPUPS") !== -1) {
                found.push("FOUND NAME MATCH: " + name);
            }
        }
    }
    return found.join("\n");
})();
