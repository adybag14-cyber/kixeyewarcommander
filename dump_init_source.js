(function () {
    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME.prototype.init) {
        var src = window._hx_classes.GAME.prototype.init.toString();
        // Clear body and write source for easy reading
        document.body.innerHTML = "<pre id='code_dump'>" + src.replace(/</g, "&lt;") + "</pre>";
        return "Source dumped to body";
    }
    return "GAME.prototype.init NOT FOUND";
})();
