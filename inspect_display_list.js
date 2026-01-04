(function () {
    function getHierarchy(node, depth) {
        if (!node) return "null";
        var info = "  ".repeat(depth) + (node.name || "Scene") + " (" + (node.__name__ || node.constructor.name) + ")";

        // Add coordinates and visible
        if (node.get_x) info += " x:" + node.get_x();
        if (node.get_y) info += " y:" + node.get_y();
        if (node.get_visible) info += " vis:" + node.get_visible();
        if (node.get_alpha) info += " alpha:" + node.get_alpha();

        var children = [];
        if (node.get_numChildren) {
            var num = node.get_numChildren();
            info += " children:" + num;
            for (var i = 0; i < num; i++) {
                children.push(node.getChildAt(i));
            }
        } else if (node.__children) {
            info += " __children:" + node.__children.length;
            children = node.__children;
        }

        var res = [info];
        if (depth < 4) { // limit depth
            for (var i = 0; i < children.length; i++) {
                res.push(getHierarchy(children[i], depth + 1));
            }
        }
        return res.join("\n");
    }

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var stage = window._hx_classes.GAME._instance.get_stage ? window._hx_classes.GAME._instance.get_stage() : window._hx_classes.GAME._instance.stage;
        if (!stage) stage = window._hx_classes.GAME._instance; // Fallback

        return getHierarchy(stage, 0);
    }
    return "GAME instance not found";
})();
