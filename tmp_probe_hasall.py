import asyncio, json, os, subprocess, sys, time, urllib.request
from playwright.async_api import async_playwright
ROOT=os.path.abspath(os.path.dirname(__file__))

def wait_for_server(url,timeout=30):
    end=time.time()+timeout
    while time.time()<end:
        try:
            with urllib.request.urlopen(url,timeout=2) as r:
                if r.status==200:return True
        except Exception:pass
        time.sleep(0.5)
    return False

async def run_probe():
    async with async_playwright() as p:
        b=await p.chromium.launch(headless=True)
        page=await b.new_page()
        await page.goto('http://127.0.0.1:8089/index.html',wait_until='domcontentloaded',timeout=120000)
        await page.wait_for_timeout(30000)
        data=await page.evaluate("""() => {
            const hx=window._hx_classes||{};
            const W=hx['com.cc.worldmap.Worldmap'];
            const c=W&&W._controller?W._controller:null;
            if(!c||!c.__class__||!c.__class__.prototype) return {exists:false};
            const p=c.__class__.prototype;
            const names=['get_hasReceivedAllInfo','get_hasMapHeader','get_hasHomeBaseData','get_hasSharedConfigs','get_hasBaseInfo','get_hasVisibleEntityInfo','get_hasDepositInfo','get_hasTuningData'];
            const out={flags:{
                hasHomeBaseData:c._hasHomeBaseData,
                hasMapHeader:c._hasMapHeader,
                hasSharedConfigs:c._hasSharedConfigs,
                hasBaseInfo:c._hasBaseInfo,
                hasVisibleEntityInfo:c._hasVisibleEntityInfo,
                hasDepositInfo:c._hasDepositInfo,
                hasTuningData:c._hasTuningData,
            }};
            for(const n of names){ out[n]= typeof p[n]==='function'?String(p[n]):null; }
            return out;
        }""")
        print(json.dumps(data,indent=2,ensure_ascii=True))
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_hasall_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_hasall_err.log'),'w',encoding='utf-8')
    proc=subprocess.Popen([sys.executable,'server.py'],cwd=ROOT,stdout=out_f,stderr=err_f,text=True)
    try:
        if not wait_for_server('http://127.0.0.1:8089/index.html',45):
            print('server not ready',file=sys.stderr);return 2
        asyncio.run(run_probe());return 0
    finally:
        try:proc.terminate();proc.wait(timeout=10)
        except Exception:
            try:proc.kill()
            except Exception:pass
        out_f.close();err_f.close()

if __name__=='__main__':
    raise SystemExit(main())
