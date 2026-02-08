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
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        logs = []
        page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))

        await page.goto("http://127.0.0.1:8089/index.html", wait_until="domcontentloaded", timeout=120000)

        await page.evaluate(
            """() => {
                window.__SCAN__ = { sent: [], recv: [], hooked: false, hookErrors: [] };
                function safeClassName(v) {
                    try {
                        if (!v) return null;
                        if (v.__class__ && v.__class__.__name__) return v.__class__.__name__;
                        if (v.constructor && v.constructor.name) return v.constructor.name;
                        return typeof v;
                    } catch (_) { return null; }
                }

                function summarize(v) {
                    return {
                        className: safeClassName(v),
                        keys: (v && typeof v === 'object') ? Object.keys(v).slice(0, 40) : [],
                        handler: v && v.handler,
                        action: v && v.action,
                        hasData: !!(v && Object.prototype.hasOwnProperty.call(v, 'data'))
                    };
                }

                function hookNow() {
                    const hx = window._hx_classes || {};
                    const GC = hx["com.kixeye.net.GatewayConnection"];
                    if (!GC || !GC.prototype) return false;
                    if (GC.prototype.__scanHooked) return true;
                    try {
                        const p = GC.prototype;
                        const origSend = p.sendMessage;
                        if (typeof origSend === 'function') {
                            p.sendMessage = function () {
                                try {
                                    window.__SCAN__.sent.push(summarize(arguments[0]));
                                } catch (e) {
                                    window.__SCAN__.hookErrors.push('send:' + String(e));
                                }
                                return origSend.apply(this, arguments);
                            };
                        }
                        const origHandle = p.handleAction;
                        if (typeof origHandle === 'function') {
                            p.handleAction = function () {
                                try {
                                    window.__SCAN__.recv.push(summarize(arguments[0]));
                                } catch (e) {
                                    window.__SCAN__.hookErrors.push('recv:' + String(e));
                                }
                                return origHandle.apply(this, arguments);
                            };
                        }
                        p.__scanHooked = true;
                        window.__SCAN__.hooked = true;
                        return true;
                    } catch (e) {
                        window.__SCAN__.hookErrors.push(String(e));
                        return false;
                    }
                }

                hookNow();
                window.__scanHookInterval = setInterval(hookNow, 1000);
            }"""
        )

        # let the game boot and traffic happen
        for i in range(1, 19):
            await page.wait_for_timeout(5000)
            st = await page.evaluate(
                """() => {
                    const hx = window._hx_classes || {};
                    const WMC = hx["com.cc.worldmap.WorldmapController"];
                    const wmc = WMC ? (WMC._instance || WMC.instance || null) : null;
                    const gameCls = hx["GAME"] || window.GAME;
                    const gameInst = gameCls ? (gameCls._instance || gameCls.instance || null) : null;
                    return {
                        t: Date.now(),
                        wmc: !!wmc,
                        game: !!gameInst,
                        worldMap: !!(gameInst && gameInst.worldMap),
                        mapId: gameInst ? gameInst.map_id : null,
                        sent: window.__SCAN__ && window.__SCAN__.sent ? window.__SCAN__.sent.length : -1,
                        recv: window.__SCAN__ && window.__SCAN__.recv ? window.__SCAN__.recv.length : -1,
                        hooked: !!(window.__SCAN__ && window.__SCAN__.hooked)
                    };
                }"""
            )
            print(f"T+{i*5:03d}s {json.dumps(st, ensure_ascii=True)}")
            if i == 12:
                try:
                    await page.mouse.click(1210, 568)
                    print("Clicked worldmap button approx")
                except Exception as e:
                    print(f"Click failed: {e}")

        data = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const classNames = Object.keys(hx);
                const rx = /(kixeye\.net|gateway|action|worldmap|sector|regiontemplate|visibleentity|mapservice)/i;
                const matches = classNames.filter(n => rx.test(n)).sort();

                const WMC = hx["com.cc.worldmap.WorldmapController"];
                const wmc = WMC ? (WMC._instance || WMC.instance || null) : null;
                let wmcObjects = [];
                if (wmc) {
                    for (const k of Object.keys(wmc)) {
                        const v = wmc[k];
                        if (!v || typeof v !== 'object') continue;
                        const cn = (v.__class__ && v.__class__.__name__) || (v.constructor && v.constructor.name) || typeof v;
                        if (/service|gateway|map|sector|faction|storage|notification/i.test(String(k) + ' ' + String(cn))) {
                            wmcObjects.push({ key: k, className: cn, keys: Object.keys(v).slice(0, 30) });
                        }
                    }
                }

                return {
                    scan: window.__SCAN__ || null,
                    matchCount: matches.length,
                    matches: matches.slice(0, 300),
                    wmcExists: !!wmc,
                    wmcKeys: wmc ? Object.keys(wmc).slice(0, 200) : [],
                    wmcObjects: wmcObjects.slice(0, 120)
                };
            }"""
        )

        print("\n=== FINAL DATA ===")
        print(json.dumps(data, indent=2, ensure_ascii=True))
        print("\n=== CONSOLE TAIL ===")
        for line in logs[-200:]:
            lower = line.lower()
            if any(k in lower for k in ["patch", "gateway", "worldmap", "error", "warn", "dbg", "disconnect"]):
                print(line)

        await browser.close()


def main() -> int:
    server_out = open(os.path.join(ROOT, "scan_server_stdout.log"), "w", encoding="utf-8")
    server_err = open(os.path.join(ROOT, "scan_server_stderr.log"), "w", encoding="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=ROOT,
        stdout=server_out,
        stderr=server_err,
        text=True,
    )
    try:
        if not wait_for_server("http://127.0.0.1:8089/index.html", timeout=45):
            print("Server did not become ready", file=sys.stderr)
            return 2
        asyncio.run(run_probe())
        return 0
    finally:
        try:
            proc.terminate()
            proc.wait(timeout=10)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass
        server_out.close()
        server_err.close()


if __name__ == "__main__":
    raise SystemExit(main())
