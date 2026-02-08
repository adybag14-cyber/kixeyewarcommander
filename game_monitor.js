const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();
    const logs = [];
    const missingAssets = new Set();

    page.on('console', msg => {
        const text = msg.text();
        logs.push(`[CONSOLE] ${msg.type().toUpperCase()}: ${text}`);
        console.log(`[CONSOLE]: ${text}`);
    });

    page.on('response', response => {
        if (response.status() === 404) {
            missingAssets.add(response.url());
            logs.push(`[404] ${response.url()}`);
        }
    });

    try {
        console.log("Navigating to http://127.0.0.1:8888/index.html...");
        await page.goto('http://127.0.0.1:8888/index.html', { waitUntil: 'load', timeout: 60000 });
        
        console.log("Waiting 60 seconds for game init and force start...");
        await new Promise(resolve => setTimeout(resolve, 60000));

        await page.screenshot({ path: 'game_gameplay_check.png' });
        console.log("Screenshot saved to game_gameplay_check.png");

        const gameState = await page.evaluate(() => {
            const hx = window._hx_classes || {};
            const GameClass = hx["GAME"];
            const inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
            
            // Try find units or buildings
            let unitCount = 0;
            let buildingCount = 0;
            if (inst && inst.player) {
                // This depends on the internal obfuscated names, but let's try common patterns
                // inst.player._buildings, inst.player._units etc.
                const player = inst.player;
                for (let k in player) {
                    if (Array.isArray(player[k])) {
                        if (k.toLowerCase().includes("build")) buildingCount = player[k].length;
                        if (k.toLowerCase().includes("unit")) unitCount = player[k].length;
                    }
                }
            }

            return {
                game_instance: !!inst,
                has_player: !!(inst && inst.player),
                unit_count: unitCount,
                building_count: buildingCount,
                last_error: window.__LAST_ERROR_MSG || "None"
            };
        });

        console.log("Game State:", JSON.stringify(gameState, null, 2));

        // Attempt a click in the middle of the canvas
        console.log("Attempting to click in the middle of the canvas...");
        const canvas = await page.$('canvas');
        if (canvas) {
            const box = await canvas.boundingBox();
            if (box) {
                await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
                console.log("Clicked at:", box.x + box.width / 2, box.y + box.height / 2);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        await page.screenshot({ path: 'game_after_click.png' });

    } catch (err) {
        console.error("Error:", err);
        logs.push(`[FATAL] ${err.toString()}`);
    } finally {
        fs.writeFileSync('game_monitor_logs.txt', logs.join('\n'));
        fs.writeFileSync('missing_assets.txt', Array.from(missingAssets).join('\n'));
        await browser.close();
        console.log("Done. Check game_monitor_logs.txt and missing_assets.txt");
    }
})();
