(function () {
    var out = [];
    out.push("=== KEYS in window.wc_config ===");
    if (window.wc_config) {
        out.push(Object.keys(window.wc_config).join(", "));
    } else {
        out.push("window.wc_config not found");
    }

    out.push("\n=== SOURCE OF GAME.prototype.Data ===");
    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME.prototype.Data) {
        var src = window._hx_classes.GAME.prototype.Data.toString();
        // Clear body and write source for easy reading
        document.body.innerHTML = "<pre id='code_dump'>" + src.replace(/</g, "&lt;") + "</pre>";
        out.push("Source dumped to body");
    } else {
        out.push("GAME.prototype.Data NOT FOUND");
    }

    return out.join("\n");
})();
