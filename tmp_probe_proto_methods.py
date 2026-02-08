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


TARGETS = [
    'com.kixeye.net.proto.atlas.VisibleSectorUpdate',
    'com.kixeye.net.proto.atlas.Sector',
    'com.kixeye.net.proto.atlas.Region',
    'com.kixeye.net.proto.atlas.RegionTemplate',
    'com.kixeye.net.proto.atlas.VisibleEntityUpdate',
    'com.kixeye.net.proto.atlas.MapEntity',
    'com.kixeye.net.proto.atlas.GetVisibleSector',
    'com.kixeye.net.proto.atlas.GetRegionTemplate',
    'com.kixeye.net.proto.atlas.GetVisibleEntityInfo',
    'com.kixeye.net.proto.atlas.GetPlayerHome',
    'com.kixeye.net.proto.atlas.PlayerHomeResponse',
    'com.kixeye.net.proto.ConfigList',
    'com.kixeye.net.proto.Config',
    'com.kixeye.net.proto.ConfigNames',
]


async def run_probe() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('http://127.0.0.1:8089/index.html', wait_until='domcontentloaded', timeout=120000)
        await page.wait_for_timeout(25000)
        data = await page.evaluate(
            """(targets) => {
                const hx = window._hx_classes || {};
                const out = {};
                for (const n of targets) {
                    const c = hx[n];
                    let proto = null;
                    let sample = null;
                    if (c && c.prototype) proto = Object.getOwnPropertyNames(c.prototype).slice(0, 220);
                    if (c) {
                        try {
                            const x = new c();
                            sample = {
                                keys: Object.keys(x).slice(0, 80),
                                className: x.__class__ && x.__class__.__name__
                            };
                        } catch (e) {
                            sample = { error: String(e) };
                        }
                    }
                    out[n] = {
                        exists: !!c,
                        proto,
                        sample
                    };
                }
                return out;
            }""",
            TARGETS
        )
        print(json.dumps(data, indent=2, ensure_ascii=True))
        await browser.close()


def main() -> int:
    out_f = open(os.path.join(ROOT, 'tmp_proto_methods_server_out.log'), 'w', encoding='utf-8')
    err_f = open(os.path.join(ROOT, 'tmp_proto_methods_server_err.log'), 'w', encoding='utf-8')
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
