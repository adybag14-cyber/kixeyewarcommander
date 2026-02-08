import asyncio
import json
import os
import subprocess
import sys
import time
import urllib.request
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.dirname(__file__))


def wait_for_server(url: str, timeout: float = 30.0) -> bool:
    end = time.time() + timeout
    while time.time() < end:
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status == 200:
                    return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


async def run_probe() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("http://127.0.0.1:8089/index.html", wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(25000)
        data = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const all = Object.keys(hx).sort();
                const terms = [
                    'VisibleSector', 'RegionTemplate', 'VisibleEntity', 'SharedConfigs',
                    'PlayerHome', 'Tuning', 'Deposit', 'MapHeader', 'Sector', 'Map',
                    'AuthenticationResponse', 'ErrorResponse', 'GenericResponse',
                    'WcGatewaySharedConfigsActions', 'ConfigNames'
                ];
                const out = {};
                for (const t of terms) {
                    out[t] = all.filter(n => n.toLowerCase().includes(t.toLowerCase())).slice(0, 200);
                }

                const protoMap = all.filter(n => n.startsWith('com.kixeye.net.proto.map.'));
                const protoUnit = all.filter(n => n.startsWith('com.kixeye.net.proto.unit.'));
                const protoWs = all.filter(n => n.startsWith('com.kixeye.net.proto.'));

                function protoMethods(name) {
                    const c = hx[name];
                    if (!c || !c.prototype) return null;
                    return Object.getOwnPropertyNames(c.prototype).slice(0, 120);
                }

                const keyProtoClasses = [
                    'com.kixeye.net.proto.Action',
                    'com.kixeye.net.proto.AuthenticationResponse',
                    'com.kixeye.net.proto.ErrorResponse',
                    'com.kixeye.net.proto.GenericResponse'
                ];

                const keyMethods = {};
                for (const n of keyProtoClasses) keyMethods[n] = protoMethods(n);

                return {
                    out,
                    protoMap: protoMap.slice(0, 400),
                    protoUnit: protoUnit.slice(0, 200),
                    protoCount: protoWs.length,
                    keyMethods,
                };
            }"""
        )
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await browser.close()


def main() -> int:
    out_f = open(os.path.join(ROOT, 'tmp_nameprobe_server_out.log'), 'w', encoding='utf-8')
    err_f = open(os.path.join(ROOT, 'tmp_nameprobe_server_err.log'), 'w', encoding='utf-8')
    proc = subprocess.Popen([sys.executable, 'server.py'], cwd=ROOT, stdout=out_f, stderr=err_f, text=True)
    try:
        if not wait_for_server('http://127.0.0.1:8089/index.html', timeout=45):
            print('server not ready', file=sys.stderr)
            return 2
        asyncio.run(run_probe())
        return 0
    finally:
        try:
            proc.terminate(); proc.wait(timeout=10)
        except Exception:
            try: proc.kill()
            except Exception: pass
        out_f.close(); err_f.close()


if __name__ == '__main__':
    raise SystemExit(main())
