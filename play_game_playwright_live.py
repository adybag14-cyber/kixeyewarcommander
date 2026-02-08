import asyncio
from playwright.async_api import async_playwright


async def run() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=250)
        context = await browser.new_context(viewport={"width": 1280, "height": 720})
        page = await context.new_page()

        print("Opening game...")
        await page.goto("http://127.0.0.1:8089/index.html", wait_until="domcontentloaded", timeout=120000)

        # Let the game initialize and transition to playable state.
        await page.wait_for_timeout(90000)

        actions = [
            ("World Map", 1230, 565, 7000),
            ("Attack Log", 1230, 82, 3000),
            ("Close Popup (if present)", 873, 318, 2000),
            ("Buildings Tab", 1120, 565, 2500),
            ("Store Tab", 1170, 565, 2500),
            ("Platoons Tab", 1060, 565, 2500),
            ("World Map Tab", 1225, 565, 3000),
            ("Map Center Click", 640, 360, 2000),
        ]

        for name, x, y, wait_ms in actions:
            print(f"Action: {name} @ ({x}, {y})")
            await page.mouse.click(x, y)
            await page.wait_for_timeout(wait_ms)

        # Simple drag to emulate map movement.
        print("Action: Drag map")
        await page.mouse.move(720, 360)
        await page.mouse.down()
        await page.mouse.move(520, 360, steps=20)
        await page.mouse.up()
        await page.wait_for_timeout(3000)

        await page.screenshot(path="playwright_live_end.png")
        print("Saved screenshot: playwright_live_end.png")

        # Keep window open briefly so the user can observe final state.
        await page.wait_for_timeout(10000)
        await context.close()
        await browser.close()


if __name__ == "__main__":
    asyncio.run(run())

