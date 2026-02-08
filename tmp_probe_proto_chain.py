import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request
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
        browser=await p.chromium.launch(headless=True)
        page=await browser.new_page()
        await page.goto('http://127.0.0.1:8089/index.html',wait_until='domcontentloaded',timeout=120000)
        await page.wait_for_timeout(20000)
        data=await page.evaluate("""() => {
            const hx=window._hx_classes||{};
            const C = hx['com.kixeye.net.proto.AuthenticationResponse'];
            if(!C) return {exists:false};
            const x = new C();
            if (x.set_authenticated) x.set_authenticated(true);
            if (x.set_response) x.set_response('ok');

            function chainMethods(obj){
                const seen={}; const arr=[];
                let p=obj;
                while(p){
                    const names=Object.getOwnPropertyNames(p);
                    for(const n of names){ if(!seen[n]){seen[n]=1; arr.push(n);} }
                    p=Object.getPrototypeOf(p);
                }
                return arr;
            }

            const methods = chainMethods(x).filter(n => typeof x[n] === 'function').sort();

            const checks = {};
            const candidates = ['writeTo','toByteArray','toBytes','writeDelimitedTo','mergeFrom','serializeBinary','toArrayBuffer'];
            for(const name of candidates){
                checks[name] = typeof x[name] === 'function';
            }

            let writeDelimitedSample = null;
            try {
                const BA = hx['openfl.utils.ByteArray'] || hx['haxe.io.BytesOutput'];
                // Try using openfl ByteArray, if present.
                if (BA) {
                    let buf = new BA();
                    if (x.writeDelimitedTo) {
                        x.writeDelimitedTo(buf);
                        writeDelimitedSample = {
                            ok:true,
                            className: buf.__class__ && buf.__class__.__name__,
                            len: typeof buf.length !== 'undefined' ? buf.length : (buf.get_length ? buf.get_length() : null),
                            keys: Object.keys(buf).slice(0,40)
                        };
                    }
                }
            } catch (e) {
                writeDelimitedSample = {ok:false,error:String(e)};
            }

            return {
                exists:true,
                className:x.__class__ && x.__class__.__name__,
                methodCount:methods.length,
                methods:methods,
                checks,
                writeDelimitedSample,
            };
        }""")
        print(json.dumps(data,indent=2,ensure_ascii=True))
        await browser.close()

def main():
    out_f=open(os.path.join(ROOT,'tmp_proto_chain_out.log'),'w',encoding='utf-8')
    err_f=open(os.path.join(ROOT,'tmp_proto_chain_err.log'),'w',encoding='utf-8')
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
