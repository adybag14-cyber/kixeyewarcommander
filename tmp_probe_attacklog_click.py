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
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(85000)
        # ensure game instance exists
        state=await page.evaluate('''() => { const hx=window._hx_classes||{}; const G=hx['GAME']||window.GAME; const g=G?(G._instance||G.instance):null; return {hasGame:!!g, keys:g?Object.getOwnPropertyNames(g):[]}; }''')
        print('STATE85', json.dumps(state))
        # click attack log top-right
        await page.mouse.click(1220, 82)
        await page.wait_for_timeout(4000)
        data=await page.evaluate('''() => {
            const hx=window._hx_classes||{};
            const mapService = (window.com && window.com.kixeye && window.com.kixeye.service && window.com.kixeye.service.MapService && window.com.kixeye.service.MapService._instance) || null;
            const out={};
            out.lastError = window.__LAST_ERROR_MSG || null;
            out.popups = [];
            const GLOBAL = hx['GLOBAL'];
            if (GLOBAL && GLOBAL._layerTop && GLOBAL._layerTop.get_numChildren) {
                const n = GLOBAL._layerTop.get_numChildren();
                for (let i=0;i<n;i++) {
                    const c = GLOBAL._layerTop.getChildAt(i);
                    const cls = c && c.__class__ && c.__class__.__name__ ? c.__class__.__name__ : null;
                    let txt = null;
                    try {
                        if (c && c.body && c.body._label && c.body._label.get_text) txt = c.body._label.get_text();
                    } catch (_) {}
                    out.popups.push({cls, txt});
                }
            }
            const G = hx['GAME'] || window.GAME;
            const g = G ? (G._instance || G.instance) : null;
            out.game = g ? {
                hasWorldMap: !!g.worldMap,
                mapId: g.map_id ?? null,
                activeState: !!g._activeState,
            } : null;
            return out;
        }''')
        print('POST_CLICK', json.dumps(data, ensure_ascii=True))
        await page.screenshot(path='probe_attacklog_click.png')
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_attacklog_probe_server_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_attacklog_probe_server_err.log'),'w',encoding='utf-8')
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
