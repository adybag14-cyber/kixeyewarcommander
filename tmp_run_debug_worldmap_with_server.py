import subprocess
import sys
import time
import urllib.request
import os

ROOT = os.path.abspath(os.path.dirname(__file__))


def wait_up(url, timeout=45):
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


def main():
    out_path = os.path.join(ROOT, "run_after_patch_server_stdout.log")
    err_path = os.path.join(ROOT, "run_after_patch_server_stderr.log")
    out_f = open(out_path, "w", encoding="utf-8")
    err_f = open(err_path, "w", encoding="utf-8")
    proc = subprocess.Popen([sys.executable, "server.py"], cwd=ROOT, stdout=out_f, stderr=err_f, text=True)
    try:
        if not wait_up("http://127.0.0.1:8089/index.html", timeout=60):
            print("Server did not start")
            return 2
        result = subprocess.run([sys.executable, "debug_worldmap_transition.py"], cwd=ROOT)
        return result.returncode
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
