import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.dirname(__file__))

def wait_for_server(url, timeout=30):
    end = time.time()+timeout
    while time.time()<end:
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status==200: return True
        except Exception:
            pass
        time.sleep(0.5)
    return False

async def run_probe():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(20000)
        data = await page.evaluate("""() => {
            const hx = window._hx_classes || {};
            const names = Object.keys(hx).filter(n => n.startsWith('com.kixeye.net.proto.atlas.')).sort();
            const terms = ['Coord','coord','EntityAttribute','Attribute','Platoon','Path','Nearby','State','Blocked','Tuning','SectorStats','Battle','GetMyMap'];
            const out = {};
            for (const t of terms) out[t] = names.filter(n => n.toLowerCase().includes(t.toLowerCase()));
            return {count:names.length, out};
        }""")
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await browser.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_atlas_names_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_atlas_names_err.log'),'w',encoding='utf-8')
    proc=subprocess.Popen([sys.executable,'server.py'],cwd=ROOT,stdout=out_f,stderr=err_f,text=True)
    try:
        if not wait_for_server('http://127.0.0.1:8089/index.html',45):
            print('server not ready',file=sys.stderr);return 2
        asyncio.run(run_probe());return 0
    finally:
        try: proc.terminate(); proc.wait(timeout=10)
        except Exception:
            try: proc.kill()
            except Exception: pass
        out_f.close(); err_f.close()

if __name__=='__main__':
    raise SystemExit(main())
