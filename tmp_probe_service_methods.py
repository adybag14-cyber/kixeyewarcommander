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


CLASSES = [
    'com.kixeye.service.WcGatewaySharedConfigsService',
    'com.kixeye.service.DataStorageService',
    'com.kixeye.service.WcDataStorageService',
    'com.kixeye.service.NotificationService',
    'com.kixeye.service.FactionsService',
    'com.cc.worldmap.WorldmapPinger',
    'com.kixeye.service.MissionToolService',
    'com.kixeye.service.MissionToolServiceWrapper',
]


async def run_probe() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(35000)
        data = await page.evaluate(
            """(classes) => {
                const hx = window._hx_classes || {};
                function fnSrc(fn) {
                    try {
                        const s = String(fn);
                        return s.length > 5000 ? s.slice(0, 5000) + ' ...<truncated>...' : s;
                    } catch (e) {
                        return String(e);
                    }
                }

                const out = {};
                for (const cls of classes) {
                    const c = hx[cls];
                    if (!c || !c.prototype) {
                        out[cls] = { exists: false };
                        continue;
                    }
                    const methods = Object.getOwnPropertyNames(c.prototype).filter(m => typeof c.prototype[m] === 'function');
                    const senders = {};
                    const handlers = {};
                    for (const m of methods) {
                        const s = fnSrc(c.prototype[m]);
                        if (s.includes('sendMessage(')) senders[m] = s;
                        if (m.toLowerCase().includes('handle') || s.includes('get_actionId')) handlers[m] = s;
                    }
                    out[cls] = {
                        exists: true,
                        methods,
                        senders,
                        handlers,
                    };
                }
                return out;
            }""",
            CLASSES
        )
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await browser.close()


def main() -> int:
    out_f = open(os.path.join(ROOT, 'tmp_service_methods_server_out.log'), 'w', encoding='utf-8')
    err_f = open(os.path.join(ROOT, 'tmp_service_methods_server_err.log'), 'w', encoding='utf-8')
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
