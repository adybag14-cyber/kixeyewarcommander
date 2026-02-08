import asyncio, json, os, subprocess, sys, time, urllib.request
from playwright.async_api import async_playwright
ROOT=os.path.abspath(os.path.dirname(__file__))
def wait(url,timeout=45):
    end=time.time()+timeout
    while time.time()<end:
        try:
            with urllib.request.urlopen(url,timeout=2) as r:
                if r.status==200:return True
        except Exception: pass
        time.sleep(0.5)
    return False
async def run():
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True)
        page=await b.new_page(viewport={"width":1280,"height":720})
        logs=[]
        page.on('console', lambda m: logs.append(f"[{m.type}] {m.text}"))
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(90000)
        # Click world map button near bottom right
        await page.mouse.click(1230, 565)
        await page.wait_for_timeout(12000)
        # Click attack log button near top right
        await page.mouse.click(1230, 82)
        await page.wait_for_timeout(3000)
        out = await page.evaluate('''() => {
            const hx = window._hx_classes || {};
            const GLOBAL = hx['GLOBAL'];
            const Worldmap = hx['com.cc.worldmap.Worldmap'];
            const G = hx['GAME'] || window.GAME;
            const g = G ? (G._instance || G.instance) : null;
            const popupList=[];
            if (GLOBAL && GLOBAL._layerTop && GLOBAL._layerTop.get_numChildren) {
                const n = GLOBAL._layerTop.get_numChildren();
                for (let i=0;i<n;i++) {
                    const c = GLOBAL._layerTop.getChildAt(i);
                    let text = null;
                    try {
                        if (c && c.body && c.body._label && c.body._label.get_text) text = c.body._label.get_text();
                        else if (c && c._body && c._body._label && c._body._label.get_text) text = c._body._label.get_text();
                    } catch (_) {}
                    popupList.push({
                        cls: c && c.__class__ && c.__class__.__name__ ? c.__class__.__name__ : null,
                        text
                    });
                }
            }
            return {
                game: g ? {
                    mapId: g.map_id ?? null,
                    worldMapTruthy: !!g.worldMap,
                    hasActiveState: !!g._activeState,
                } : null,
                worldmap: Worldmap ? {
                    hasMapView: !!Worldmap._mapView,
                    hasController: !!Worldmap._controller,
                    hasHexMap: !!Worldmap._hexMap,
                    hasFinishedLoading: Worldmap._hasFinishedLoading ?? null,
                    attemptedLoad: Worldmap._attemptedLoad ?? null,
                } : null,
                popups: popupList,
                lastError: window.__LAST_ERROR_MSG || null,
            };
        }''')
        print('RESULT', json.dumps(out, ensure_ascii=True))
        print('CONSOLE_MATCH_START')
        for line in logs:
            low=line.lower()
            if ('attack' in low or 'chat' in low or 'worldmap' in low or 'error' in low or 'synthetic' in low):
                print(line)
        print('CONSOLE_MATCH_END')
        await page.screenshot(path='tmp_playability_worldmap_then_attacklog.png')
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_playability_probe_server_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_playability_probe_server_err.log'),'w',encoding='utf-8')
    proc=subprocess.Popen([sys.executable,'server.py'], cwd=ROOT, stdout=out_f, stderr=err_f, text=True)
    try:
        if not wait('http://127.0.0.1:8089/index.html'): print('server not ready', file=sys.stderr); return 2
        asyncio.run(run()); return 0
    finally:
        try: proc.terminate(); proc.wait(timeout=10)
        except Exception:
            try: proc.kill()
            except Exception: pass
        out_f.close(); err_f.close()
if __name__=='__main__': raise SystemExit(main())
