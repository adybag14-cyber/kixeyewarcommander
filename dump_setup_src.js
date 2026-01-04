(function () {
    var out = [];
    var dump = function (name, path) {
        if (path) {
            var src = path.toString();
            // Clean up for display
            out.push("\n=== " + name + " ===");
            out.push(src);
        } else {
            out.push(name + " NOT FOUND");
        }
    };

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME.prototype) {
        var proto = window._hx_classes.GAME.prototype;
        dump("setupStage", proto.setupStage);
        dump("onDataFinishedLoading", proto.onDataFinishedLoading);
    }

    document.body.innerHTML = "<pre id='code_dump'>" + out.join("\n").replace(/</g, "&lt;") + "</pre>";
    return "Source dumped";
})();
