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
            const hx=window._hx_classes||{};
            const MS=hx['com.kixeye.service.MapService'];
            function src(name){
              try{
                const fn=MS&&MS.prototype&&MS.prototype[name];
                if(typeof fn!=='function') return null;
                const s=String(fn); return s.length>3000?s.slice(0,3000)+' ...<truncated>...':s;
              }catch(e){return String(e)}
            }
            const names=[
              'requestAttackEntriesWithUsers','handleAttackEntriesResponse',
              'requestHasAttackEntriesSince','handleHasAttackEntriesSinceResponse',
              'requestHasAttackEntriesWithEnemy','handleHasAttackEntriesWithEnemyResponse',
              'requestGetAttackUserData','handleGetAttackUserDataResponse',
              'requestGetRecentEnemiesUserData','handleGetRecentEnemiesUserDataResponse',
              'requestGetAttackEntriesWithEnemy','handleGetAttackEntriesWithEnemyResponse',
              'getAllAbilities','handleGetAllAbilitiesResponse',
              'getSectorState','handleState',
              'getUnconfirmedTransactions','handleUnconfirmedTransactionsList',
              'getBalances','handleGetBalancesResponse'
            ];
            const out={};
            for(const n of names) out[n]=src(n);
            return out;
        }''')
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_mapservice_methods2_server_out.log'),'w',encoding='utf-8'); err_f=open(os.path.join(ROOT,'tmp_mapservice_methods2_server_err.log'),'w',encoding='utf-8')
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
