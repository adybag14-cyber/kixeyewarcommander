const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const logs = [];

    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type().toUpperCase();
        logs.push(`[CONSOLE] ${type}: ${text}`);
        console.log(`[CONSOLE] ${type}: ${text}`);
    });

    page.on('pageerror', err => {
        logs.push(`[ERROR] ${err.toString()}`);
        console.error(`[PAGE ERROR]: ${err.toString()}`);
    });

    page.on('requestfailed', request => {
        logs.push(`[NET FAIL] ${request.url()} - ${request.failure().errorText}`);
        console.error(`[NET FAIL]: ${request.url()} - ${request.failure().errorText}`);
    });

    try {
        console.log("Navigating to http://127.0.0.1:8888/index.html...");
        await page.goto('http://127.0.0.1:8888/index.html', { waitUntil: 'load', timeout: 30000 });
        
        console.log("Page loaded. Waiting 120 seconds for game init...");
        await new Promise(resolve => setTimeout(resolve, 120000));

        await page.screenshot({ path: 'game_capture.png' });
        console.log("Screenshot saved to game_capture.png");

        const state = await page.evaluate(() => {
            const hx = window._hx_classes || {};
            const GameClass = hx["GAME"];
            const inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
            
            const keys = Object.keys(hx);
            const kbKey = keys.find(k => k.includes("ConfigDataLoader"));

            return {
                lime: !!window.lime,
                hx_classes: keys.length,
                config_loader_key: kbKey || "Not Found",
                game_instance: !!inst,
                has_world_map: inst ? !!inst.worldMap : false,
                has_player: inst ? !!inst.player : false,
                last_error: window.__LAST_ERROR_MSG || "None",
                configs_loaded: window.__CONFIGS_LOADED__ || "No",
                url: window.location.href
            };
        });
        console.log("Game State:", JSON.stringify(state, null, 2));
        logs.push(`[STATE] ${JSON.stringify(state)}`);

    } catch (err) {
        console.error("Error:", err);
        logs.push(`[FATAL] ${err.toString()}`);
    } finally {
        fs.writeFileSync('game_session_logs.txt', logs.join('\n'));
        await browser.close();
    }
})();
