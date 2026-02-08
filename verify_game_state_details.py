import asyncio
from playwright.async_api import async_playwright
import json

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navigating...")
        await page.goto("http://localhost:8089/index.html")
        
        print("Waiting for game load (60s)...")
        await asyncio.sleep(60)
        
        print(" inspecting game state...")
        details = await page.evaluate("""() => {
            var GameClass = (window._hx_classes && window._hx_classes["GAME"]) || window.GAME;
            
            if (!GameClass) {
                var keys = window._hx_classes ? Object.keys(window._hx_classes) : [];
                return { error: "Game Class not found", keys: keys.slice(0, 20) }; // first 20 keys
            }

            var inst = GameClass._instance || GameClass.instance;
            
            if (!inst) return { 
                error: "No Game Instance", 
                hasStaticInstance: !!GameClass._instance,
                hasInstance: !!GameClass.instance
            };
            
            var result = {
                className: GameClass.__name__ || "Unknown",
                hasWorldMap: !!inst.worldMap,
                hasPlayer: !!inst.player,
                sfsConnected: !!inst.sfs,
                currentMapId: inst.map_id,
            };
            
            // Try to dig deeper if possible
            if (inst.worldMap) {
               result.worldMapLoaded = true;
            }
            
            return result;
        }""")
        
        print("Game Details:", json.dumps(details, indent=2))
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
