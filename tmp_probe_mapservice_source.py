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
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(30000)
        data = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const MS = hx['com.kixeye.service.MapService'];
                if (!MS || !MS.prototype) return { exists: false };
                const proto = Object.getOwnPropertyNames(MS.prototype);
                function src(name) {
                    try {
                        const fn = MS.prototype[name];
                        if (typeof fn !== 'function') return null;
                        const s = String(fn);
                        return s.length > 2500 ? s.slice(0, 2500) + ' ...<truncated>...' : s;
                    } catch (e) {
                        return String(e);
                    }
                }
                const methodsToDump = [
                    'handleAction',
                    'getVisibleSectors',
                    'getRegionTemplate',
                    'getVisibleEntityInfo',
                    'getPlayerHome',
                    'getNearBy',
                    'getState',
                    'getBaseInfo',
                    'getTuningData',
                    'setActiveSector',
                    'sendData',
                    'send',
                    'setResponseListeners'
                ];
                const dumped = {};
                for (const m of methodsToDump) dumped[m] = src(m);
                return {
                    exists: true,
                    proto,
                    dumped
                };
            }"""
        )
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await browser.close()


def main() -> int:
    out_f = open(os.path.join(ROOT, 'tmp_mapservice_source_server_out.log'), 'w', encoding='utf-8')
    err_f = open(os.path.join(ROOT, 'tmp_mapservice_source_server_err.log'), 'w', encoding='utf-8')
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
