const puppeteer = require('puppeteer');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to game...');
        await page.goto('http://localhost:8088', { waitUntil: 'networkidle0' });

        console.log('Waiting for game to load (30s)...');
        await new Promise(r => setTimeout(r, 30000));

        // Take initial screenshot
        await page.screenshot({ path: 'verify_load.png' });
        console.log('Screenshot verify_load.png saved');

        // Check for canvas
        const canvas = await page.$('canvas');
        if (canvas) {
            console.log('Game canvas found!');

            // Get canvas metrics
            const box = await canvas.boundingBox();
            const x = box.x + box.width / 2;
            const y = box.y + box.height / 2;

            console.log(`Clicking center at ${x}, ${y}`);
            await page.mouse.click(x, y);

            await new Promise(r => setTimeout(r, 2000));

            await page.screenshot({ path: 'verify_click.png' });
            console.log('Screenshot verify_click.png saved');

            // Try to find "Upgrade" text in the page content (might be canvas text though, which is hard)
            // But we can check if any DOM elements appeared

        } else {
            console.error('Game canvas NOT found!');
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
        console.log('Done');
    }
})();
