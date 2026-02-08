import asyncio
from playwright.async_api import async_playwright
import json
import time

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Capture logs
        logs = []
        page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda exc: logs.append(f"[ERROR] {exc}"))

        print("Navigating to http://localhost:8089/index.html...")
        try:
            await page.goto("http://localhost:8089/index.html", timeout=60000)
        except Exception as e:
            print(f"Navigation failed: {e}")
            await browser.close()
            return

        print("Monitoring game loading for 120 seconds...")
        
        # Poll state every 10 seconds
        for i in range(12):
            await asyncio.sleep(10)
            elapsed = (i + 1) * 10
            
            try:
                state = await page.evaluate("""() => {
                    var assets = window.lime && window.lime.utils && window.lime.utils.Assets;
                    var cache = assets ? assets.cache : null;
                    
                    var GameClass = (window._hx_classes && window._hx_classes["GAME"]) || window.GAME;
                    var gameInstance = GameClass ? (GameClass._instance || GameClass.instance) : null;
                    
                    var canvas = document.querySelector('canvas');
                    
                    return {
                        title: document.title,
                        lastError: window.__LAST_ERROR_MSG,
                        assetsReady: window.__ASSETS_READY__,
                        gameExists: !!GameClass,
                        gameInstance: !!gameInstance,
                        loaderRoot: gameInstance && gameInstance._loaderRoot ? true : false,
                        preloader: window.ApplicationMain && window.ApplicationMain.preloader ? true : false,
                        imageCount: cache && cache.image && cache.image.h ? Object.keys(cache.image.h).length : 0,
                        textCount: cache && cache.text && cache.text.h ? Object.keys(cache.text.h).length : 0,
                        canvasValid: !!canvas,
                        canvasWidth: canvas ? canvas.width : 0,
                        canvasHeight: canvas ? canvas.height : 0,
                        globalSource: (GameClass && window._hx_classes["GLOBAL"] && window._hx_classes["GLOBAL"].setLocalTimestampSeconds) ? window._hx_classes["GLOBAL"].setLocalTimestampSeconds.toString() : "missing"
                    };
                }""")
                
                print(f"[{elapsed}s] Game Exists: {state['gameExists']}, Images Loaded: {state['imageCount']}, LoaderRoot: {state['loaderRoot']}")
                print(f"GLOBAL.setLocalTimestampSeconds source: {state['globalSource'][:100]}...")
                
                if state['lastError']:
                    print(f"CRITICAL ERROR DETECTED: {state['lastError']}")
                    break
                    
                # detailed check
                if state['gameInstance']:
                     details = await page.evaluate("""() => {
                        var GameClass = (window._hx_classes && window._hx_classes["GAME"]) || window.GAME;
                        var inst = GameClass ? (GameClass._instance || GameClass.instance) : null;
                        if (!inst) return "Inst lost via race condition?";
                        return {
                            className: GameClass.__name__ || "Unknown",
                            hasWorldMap: !!inst.worldMap,
                            hasPlayer: !!inst.player,
                            sfsConnected: !!inst.sfs,
                            currentMapId: inst.map_id,
                        };
                     }""")
                     print(f"[{elapsed}s] Details: {json.dumps(details)}")

                # If game is fully loaded (heuristic), we could stop, but let's observe
                if state['gameInstance'] and state['loaderRoot']:
                    print("Game seems initialized!")
                    
            except Exception as e:
                print(f"[{elapsed}s] State check failed: {e}")

        # Final full state dump
        print(f"\nFinal State: {json.dumps(state, indent=2)}")

        # Take screenshot
        await page.screenshot(path="playwright_verification.png")
        print("Screenshot saved to playwright_verification.png")

        # Print captured logs (filtered)
        print("\n--- Console Logs (Relevant) ---")
        for log in logs:
            if any(k in log for k in ["[BOOT]", "[PATCH", "error", "warn", "AssetPreloader", "Preloaded", "URLLoader", "Loader"]):
                print(log)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
