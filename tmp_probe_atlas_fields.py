import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request
from playwright.async_api import async_playwright

ROOT=os.path.abspath(os.path.dirname(__file__))
TARGETS=[
'com.kixeye.net.proto.atlas.Coord',
'com.kixeye.net.proto.atlas.Attribute',
'com.kixeye.net.proto.atlas.PlatoonInfo',
'com.kixeye.net.proto.atlas.BlockedRfBasesResponse',
'com.kixeye.net.proto.atlas.State',
'com.kixeye.net.proto.atlas.BattleList',
'com.kixeye.net.proto.atlas.Path',
'com.kixeye.net.proto.atlas.PathNode',
]

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
        browser=await p.chromium.launch(headless=True)
        page=await browser.new_page()
        await page.goto('http://127.0.0.1:8089/index.html',wait_until='domcontentloaded',timeout=120000)
        await page.wait_for_timeout(20000)
        data=await page.evaluate("""(targets)=>{
            const hx=window._hx_classes||{};
            const out={};
            for(const n of targets){
                const c=hx[n];
                out[n]=c?{
                    proto:Object.getOwnPropertyNames(c.prototype).slice(0,120),
                    sample:(()=>{try{const x=new c();return {keys:Object.keys(x),className:x.__class__&&x.__class__.__name__};}catch(e){return {error:String(e)}}})()
                }:{exists:false};
            }
            return out;
        }""",TARGETS)
        print(json.dumps(data,indent=2,ensure_ascii=True))
        await browser.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_atlas_fields_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_atlas_fields_err.log'),'w',encoding='utf-8')
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
