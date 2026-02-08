import asyncio
import json
import os
import signal
import subprocess
import sys
import time
import urllib.request
from playwright.async_api import async_playwright

ROOT = os.path.abspath(os.path.dirname(__file__))
SERVER_OUT = os.path.join(ROOT, "introspect_server_stdout.log")
SERVER_ERR = os.path.join(ROOT, "introspect_server_stderr.log")


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


async def inspect_runtime() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 720})
        logs = []
        page.on("console", lambda m: logs.append(f"[{m.type}] {m.text}"))
        await page.goto("http://127.0.0.1:8089/index.html", wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(30000)
        data = await page.evaluate(
            """() => {
                const hx = window._hx_classes || {};
                const names = [
                    "com.kixeye.net.GatewayConnection",
                    "com.kixeye.net.GatewayHttpConnection",
                    "com.kixeye.net.ActionMsg",
                    "com.kixeye.net.messages.ActionMsg",
                    "com.cc.worldmap.WorldmapController",
                    "com.cc.worldmap.MapService",
                    "com.cc.worldmap.Worldmap"
                ];

                const classes = {};
                for (const n of names) {
                    const c = hx[n];
                    classes[n] = {
                        exists: !!c,
                        type: typeof c,
                        ctorLen: c && c.length,
                        staticKeys: c ? Object.keys(c).slice(0, 80) : [],
                        protoKeys: c && c.prototype ? Object.getOwnPropertyNames(c.prototype).slice(0, 120) : []
                    };
                }

                const WMC = hx["com.cc.worldmap.WorldmapController"];
                const wmc = WMC ? (WMC._instance || WMC.instance || null) : null;

                function getCandidateGateway(obj) {
                    if (!obj || typeof obj !== "object") return null;
                    const keys = Object.keys(obj);
                    for (const k of keys) {
                        const v = obj[k];
                        if (!v || typeof v !== "object") continue;
                        const cls = (v.__class__ && (v.__class__.__name__ || v.__class__.name)) || "";
                        if (String(cls).toLowerCase().includes("gateway")) {
                            return {
                                key: k,
                                cls,
                                keys: Object.keys(v).slice(0, 120),
                                proto: (v.__class__ && v.__class__.prototype)
                                    ? Object.getOwnPropertyNames(v.__class__.prototype).slice(0, 120)
                                    : []
                            };
                        }
                    }
                    return null;
                }

                const wmcKeys = wmc ? Object.keys(wmc) : [];
                const wmcProto = (wmc && wmc.__class__ && wmc.__class__.prototype)
                    ? Object.getOwnPropertyNames(wmc.__class__.prototype)
                    : [];
                const wmcGateway = getCandidateGateway(wmc);

                let actionMsgCtorTest = null;
                const ActionMsg = hx["com.kixeye.net.ActionMsg"] || hx["com.kixeye.net.messages.ActionMsg"];
                if (ActionMsg) {
                    try {
                        const msg = new ActionMsg(2, 1100, null);
                        actionMsgCtorTest = {
                            ok: true,
                            viaArgs: true,
                            keys: Object.keys(msg),
                            h: msg.handler,
                            a: msg.action,
                            hasData: Object.prototype.hasOwnProperty.call(msg, "data")
                        };
                    } catch (e1) {
                        try {
                            const msg = new ActionMsg();
                            msg.handler = 2;
                            msg.action = 1100;
                            msg.data = null;
                            actionMsgCtorTest = {
                                ok: true,
                                viaNoArg: true,
                                keys: Object.keys(msg),
                                h: msg.handler,
                                a: msg.action,
                                hasData: Object.prototype.hasOwnProperty.call(msg, "data")
                            };
                        } catch (e2) {
                            actionMsgCtorTest = { ok: false, e1: String(e1), e2: String(e2) };
                        }
                    }
                }

                const gameCls = hx["GAME"] || window.GAME;
                const gameInst = gameCls ? (gameCls._instance || gameCls.instance || null) : null;

                return {
                    classes,
                    wmcExists: !!wmc,
                    wmcClass: wmc && wmc.__class__ ? wmc.__class__.__name__ : null,
                    wmcKeys: wmcKeys.slice(0, 200),
                    wmcProto: wmcProto.slice(0, 200),
                    wmcGateway,
                    gameExists: !!gameInst,
                    gameKeys: gameInst ? Object.keys(gameInst).slice(0, 120) : [],
                    gameWorldMap: gameInst ? !!gameInst.worldMap : null,
                    actionMsgCtorTest
                };
            }"""
        )
        print(json.dumps(data, indent=2, ensure_ascii=True))
        print("\n--- CONSOLE TAIL ---")
        for line in logs[-120:]:
            lower = line.lower()
            if any(k in lower for k in ["patch", "gateway", "worldmap", "error", "warn", "dbg"]):
                print(line)
        await browser.close()


def main() -> int:
    out_f = open(SERVER_OUT, "w", encoding="utf-8")
    err_f = open(SERVER_ERR, "w", encoding="utf-8")
    proc = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=ROOT,
        stdout=out_f,
        stderr=err_f,
        text=True,
    )
    try:
        if not wait_for_server("http://127.0.0.1:8089/index.html", timeout=45):
            print("Server did not become ready", file=sys.stderr)
            return 2
        asyncio.run(inspect_runtime())
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
        out_f.close()
        err_f.close()


if __name__ == "__main__":
    raise SystemExit(main())
