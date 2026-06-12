"""Prefetch platform upgrade UI assets from assetManifest via CDN."""
import argparse
import json
import os
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


PLATFORM_TYPE_IDS = {
    10, 64, 86, 87, 88, 111, 114, 130, 187, 270, 275, 276, 277,
    353, 361, 362, 387, 488, 489,
}


def should_prefetch(key: str) -> bool:
    if key.startswith("buildingbuttons/"):
        parts = key.split("/")
        if len(parts) < 2:
            return False
        stem = parts[1].split(".")[0]
        type_id = stem.split("-", 1)[0]
        return type_id.isdigit() and int(type_id) in PLATFORM_TYPE_IDS

    m = re.match(r"buildings/(\d+)(?:\.v2)?/", key)
    if m and int(m.group(1)) in PLATFORM_TYPE_IDS:
        return "top." in key or "shadow." in key or "anim." in key

    if key.startswith("ui/towerbuttons-v2/"):
        return True

    return False


def fetch_one(manifest_key: str, hash_value: str, dest: Path):
    if dest.exists() and dest.stat().st_size > 200:
        return "skip", str(dest)

    base, ext = os.path.splitext(manifest_key)
    hashed_rel = f"{base}.{hash_value}{ext}"
    quoted = urllib.parse.quote(hashed_rel, safe="/")
    url = f"https://wc-origin.cdn-kixeye.com/game/assets/{quoted}?t=LOCAL&mode=html5"

    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = resp.read()
    if len(data) < 50:
        return "tiny", url
    dest.write_bytes(data)
    return "ok", str(dest)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", default=".")
    parser.add_argument("--workers", type=int, default=16)
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    manifest_path = repo / "manifest" / "assetManifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    jobs = []
    for key, hash_value in manifest.items():
        if not should_prefetch(key):
            continue
        dest = repo / "assets" / key
        jobs.append((key, hash_value, dest))
        if args.limit and len(jobs) >= args.limit:
            break

    ok = skip = fail = 0
    failures = []

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(fetch_one, key, hash_value, dest): (key, hash_value)
            for key, hash_value, dest in jobs
        }
        for fut in as_completed(futures):
            key, _ = futures[fut]
            try:
                status, info = fut.result()
                if status == "ok":
                    ok += 1
                elif status == "skip":
                    skip += 1
                else:
                    fail += 1
                    failures.append({"key": key, "reason": status, "info": info})
            except Exception as exc:
                fail += 1
                failures.append({"key": key, "reason": str(exc)})

    report = {
        "queued": len(jobs),
        "downloaded": ok,
        "skipped": skip,
        "failed": fail,
        "failures": failures[:50],
    }
    report_path = repo / "kixeye_capture" / "platform_upgrade_prefetch_report.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Queued: {len(jobs)} | Downloaded: {ok} | Skipped: {skip} | Failed: {fail}")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()