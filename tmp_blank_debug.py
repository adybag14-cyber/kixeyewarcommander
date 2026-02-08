import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        page = await b.new_page(viewport={"width":1280,"height":720})
        msgs=[]
        page.on('console', lambda m: msgs.append(f"[{m.type}] {m.text}"))
        page.on('pageerror', lambda e: msgs.append(f"[pageerror] {e}"))
        await page.goto('http://localhost:8089/index.html', wait_until='domcontentloaded', timeout=90000)
        await page.wait_for_timeout(90000)
        st = await page.evaluate('''() => {
            const hx = window._hx_classes || {};
            const G = hx['GAME'] || window.GAME;
            const g = G ? (G._instance || G.instance) : null;
            return {
              hasGameClass: !!G,
              hasGameInstance: !!g,
              gameKeys: g ? Object.getOwnPropertyNames(g) : [],
              hasGlobalRoot: !!(hx['GLOBAL'] && hx['GLOBAL']._ROOT),
              hasAppMain: !!hx['ApplicationMain'],
              bodyChildren: document.body ? document.body.children.length : null,
              canvasCount: document.querySelectorAll('canvas').length,
              canvasInfo: Array.from(document.querySelectorAll('canvas')).map(c=>({w:c.width,h:c.height,clientW:c.clientWidth,clientH:c.clientHeight,display:getComputedStyle(c).display,visibility:getComputedStyle(c).visibility})),
              holderChildren: (()=>{ const el=document.getElementById('game-holder'); return el?el.children.length:null;})(),
              holderHtml: (()=>{ const el=document.getElementById('game-holder'); return el?el.innerHTML.slice(0,500):null;})(),
            };
        }''')
        print('STATE', json.dumps(st, ensure_ascii=True))
        print('CONSOLE_START')
        for m in msgs[-200:]:
            print(m)
        print('CONSOLE_END')
        await page.screenshot(path='tmp_blank_debug.png')
        await b.close()

if __name__=='__main__':
    asyncio.run(main())
