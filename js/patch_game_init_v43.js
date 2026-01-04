/**
 * PATCH GAME INIT V43
 * - NUCLEAR VISUAL DIAGNOSTIC
 * - Clears Stage
 * - Draws Green Box
 * - Logs Stage Info
 */

(function () {
    console.log("[PATCH] V43 Script Loaded");

    var nukeCount = 0;

    setInterval(function () {
        var stage = null;
        if (window.openfl && window.openfl.Lib && window.openfl.Lib.get_current) try { stage = window.openfl.Lib.get_current().stage; } catch (e) { }

        if (stage) {
            // Log once
            if (nukeCount < 5) {
                console.log("[V43] Stage Found: " + stage);
                console.log(">> Children: " + (stage.get_numChildren ? stage.get_numChildren() : stage.numChildren));
                console.log(">> Width/Height: " + (stage.get_stageWidth ? stage.get_stageWidth() : stage.stageWidth) + "x" + (stage.get_stageHeight ? stage.get_stageHeight() : stage.stageHeight));
            }

            // NUKE CHILDREN
            try {
                var count = stage.get_numChildren ? stage.get_numChildren() : stage.numChildren;
                // Remove all
                while (count > 0) {
                    stage.removeChildAt(0);
                    count--;
                }
            } catch (e) { console.error("Nuke failed", e); }

            // DRAW BOX
            try {
                var SpriteClass = window.openfl.display.Sprite;
                var debugSprite = new SpriteClass();
                var g = debugSprite.get_graphics ? debugSprite.get_graphics() : debugSprite.graphics;
                g.beginFill(0x00FF00, 1); // Green
                g.drawRect(10, 10, 200, 200);
                g.endFill();
                stage.addChild(debugSprite);

                // Add Text if possible (Bonus)
                // var TextField = window.openfl.text.TextField;
                // if (TextField) { var tf = new TextField(); tf.text = "RENDERER OK"; tf.textColor = 0xFFFFFF; stage.addChild(tf); }
            } catch (e) { console.error("Draw failed", e); }

            nukeCount++;
        } else {
            console.log("[V43] Waiting for stage...");
        }

    }, 1000); // Run every second

})();
