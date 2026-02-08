const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();
    const logs = [];

    page.on('response', response => {
        if (response.status() === 404) {
            logs.push(`[404] ${response.url()}`);
            console.log(`[404] ${response.url()}`);
        }
    });

    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type().toUpperCase();
        logs.push(`[CONSOLE] ${type}: ${text}`);
    });

    page.on('pageerror', err => {
        logs.push(`[ERROR] ${err.toString()}`);
        console.error(`[PAGE ERROR]: ${err.toString()}`);
    });

    page.on('requestfailed', request => {
        logs.push(`[NET FAIL] ${request.url()} - ${request.failure().errorText}`);
    });

    try {
        console.log("Navigating to http://127.0.0.1:8888/index.html...");
        await page.goto('http://127.0.0.1:8888/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
        
        console.log("Page loaded. Waiting 30 seconds for game init...");
        await new Promise(resolve => setTimeout(resolve, 30000));

        await page.screenshot({ path: 'game_capture_fast.png' });
        console.log("Screenshot saved to game_capture_fast.png");

        const state = await page.evaluate(() => {
            const hx = window._hx_classes || {};
            const GameClass = hx["GAME"];
            const inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
            
            return {
                lime: !!window.lime,
                hx_classes: Object.keys(hx).length,
                game_instance: !!inst,
                has_world_map: inst ? !!inst.worldMap : false,
                has_player: inst ? !!inst.player : false,
                last_error_msg: window.__LAST_ERROR_MSG || "None",
                last_error_code: window.__LAST_ERROR_CODE || "None",
                login_entered: !!window.__LOGIN_ENTERED,
                login_exception: window.__LOGIN_EXCEPTION || "None",
                url: window.location.href
            };
        });
        console.log("Game State:", JSON.stringify(state, null, 2));
        logs.push(`[STATE] ${JSON.stringify(state)}`);

    } catch (err) {
        console.error("Error:", err);
        logs.push(`[FATAL] ${err.toString()}`);
    } finally {
        fs.writeFileSync('game_session_logs_fast.txt', logs.join('\n'));
        await browser.close();
        console.log("Log saved to game_session_logs_fast.txt");
    }
})();