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
        page=await b.new_page()
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(30000)
        data=await page.evaluate('''() => {
            const hx = window._hx_classes || {};
            const names = [
              'com.kixeye.net.proto.atlas.WcDataStorageActions',
              'com.kixeye.net.proto.datastorage.DataStorageActions',
              'com.kixeye.net.proto.atlas.State',
              'com.kixeye.net.proto.accumulator.GetAllAbilitiesResponse',
              'com.kixeye.net.proto.alliances.AllianceActions',
              'com.kixeye.net.proto.notifications.NotificationActions',
              'com.kixeye.net.proto.factions.FactionsActions'
            ];
            function dumpConsts(cls){
              if(!cls) return null;
              const keys=Object.getOwnPropertyNames(cls).filter(k=>/^[A-Z0-9_]+$/.test(k));
              const out={};
              for(const k of keys){const v=cls[k]; if(typeof v==='number' || typeof v==='string') out[k]=v;}
              return out;
            }
            const out={};
            for(const n of names){ out[n]=dumpConsts(hx[n]); }
            return out;
        }''')
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_enum_server_out.log'),'w',encoding='utf-8'); err_f=open(os.path.join(ROOT,'tmp_enum_server_err.log'),'w',encoding='utf-8')
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
