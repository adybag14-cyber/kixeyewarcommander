(function () {
    function getDetails(node, depth) {
        if (!node) return "null";

        var name = node.name || "Node";
        var type = node.__name__ || (node.constructor ? node.constructor.name : "Unknown");

        var info = "  ".repeat(depth) + name + " [" + type + "]";

        // Geometry
        try {
            if (node.get_x) info += " xy:(" + node.get_x() + "," + node.get_y() + ")";
            if (node.get_width) info += " wh:(" + node.get_width() + "x" + node.get_height() + ")";
            if (node.get_scaleX) info += " scale:(" + node.get_scaleX() + "," + node.get_scaleY() + ")";
        } catch (e) { info += " (geo-error)"; }

        // Graphics/Content
        try {
            if (node.get_graphics) {
                var g = node.get_graphics();
                if (g) info += " [HasGraphics]";
            }
        } catch (e) { }

        // Specific Haxe/OpenFL props
        if (node._bitmapData) info += " [HasBitmap]";

        var children = [];
        try {
            if (node.get_numChildren) {
                var num = node.get_numChildren();
                for (var i = 0; i < num; i++) {
                    children.push(node.getChildAt(i));
                }
            } else if (node.__children) {
                children = node.__children;
            }
        } catch (e) { }

        var res = [info];
        if (depth < 6) {
            for (var i = 0; i < children.length; i++) {
                res.push(getDetails(children[i], depth + 1));
            }
        }
        return res.join("\n");
    }

    if (window._hx_classes && window._hx_classes.GAME && window._hx_classes.GAME._instance) {
        var root = window._hx_classes.GAME._instance;
        // Try to get stage or root container
        var target = root.get_stage ? root.get_stage() : root;

        return getDetails(target, 0);
    }
    return "GAME instance not found";
})();
