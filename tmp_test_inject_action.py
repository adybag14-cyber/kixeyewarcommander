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
        logs=[]
        page.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(35000)
        data=await page.evaluate("""() => {
            const hx=window._hx_classes||{};
            const W=hx['com.cc.worldmap.Worldmap'];
            const c=W&&W._controller?W._controller:null;
            const gc=c&&c._mapService?c._mapService.connection:null;
            if(!gc) return {ok:false, reason:'no gateway connection'};
            const Action=hx['com.kixeye.net.proto.Action'];
            const AuthResp=hx['com.kixeye.net.proto.AuthenticationResponse'];
            const BytesOutput=hx['haxe.io.BytesOutput'];
            if(!Action||!AuthResp||!BytesOutput) return {ok:false, reason:'missing classes', Action:!!Action, AuthResp:!!AuthResp, BytesOutput:!!BytesOutput};

            const beforeAuth = !!gc._authenticated;
            const resp = new AuthResp();
            resp.set_authenticated(true);
            resp.set_response('local-test');
            const bo = new BytesOutput();
            resp.writeTo(bo);
            const payload = bo.getBytes();

            const msg = new Action();
            msg.set_handler(1);
            msg.set_actionId(2);
            msg.set_payload(payload);
            msg.set_timestamp(0);
            msg.set_compressed(false);

            let err = null;
            try { gc.handleAction(msg); } catch(e){ err=String(e); }
            return {
                ok: !err,
                err,
                beforeAuth,
                afterAuth: !!gc._authenticated,
                payloadLen: payload && payload.length != null ? payload.length : null,
                msgFields: {
                    h: msg.get_handler(),
                    a: msg.get_actionId(),
                    c: msg.get_compressed()
                }
            };
        }""")
        print(json.dumps(data, indent=2, ensure_ascii=True))
        print('\n--- LOG TAIL ---')
        for line in logs[-60:]:
            if any(k in line.lower() for k in ['error','warn','patch','gateway','worldmap']):
                print(line)
        await b.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_testinject_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_testinject_err.log'),'w',encoding='utf-8')
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
