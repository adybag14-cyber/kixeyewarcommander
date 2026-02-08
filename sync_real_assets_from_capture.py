import argparse
import json
import re
import urllib.parse
import urllib.request
import zlib
from pathlib import Path


FALLBACK_RE = re.compile(
    r"FALLBACK (?:IMAGE|ZIP|XML|MANIFEST): Serving (?:placeholder for |empty zip for |minimal XML for |stub for )(.+)$"
)

CORE_MANIFEST_KEYS = [
    "assetManifest",
    "abilitydata",
    "Buildings",
    "GameData",
    "Towers",
    "Units",
    "TechEffects",
    "UnitPromotions",
    "UnitSpriteSheetData",
    "PlatoonPropertiesData",
    "replicator_sku_data",
    "BaseData",
    "objectives",
    "WorldmapTilesData",
    "StreamPostData",
    "SpecialForcesData",
    "PromoData",
    "ParticleAnimData",
    "FactionBonusData",
    "WCBoostsData",
    "en_US",
]


def find_latest_capture_urls(repo_root: Path) -> Path:
    capture_dir = repo_root / "kixeye_capture"
    candidates = sorted(capture_dir.glob("kixeye_all_urls_timeout_*.txt"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not candidates:
        raise FileNotFoundError("No capture URL file found in kixeye_capture/")
    return candidates[0]


def load_urls(url_file: Path):
    urls = []
    for line in url_file.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = line.strip()
        if line:
            urls.append(line)
    return urls


def recent_fallback_paths(server_log: Path, lookback_lines: int):
    lines = server_log.read_text(encoding="utf-8", errors="ignore").splitlines()
    lines = lines[-lookback_lines:]
    out = []
    for line in lines:
        m = FALLBACK_RE.search(line)
        if m:
            p = m.group(1).strip()
            if p not in out:
                out.append(p)
    return out


def decoded_rel_path(url: str):
    try:
        parsed = urllib.parse.urlparse(url)
        p = urllib.parse.unquote(parsed.path or "")
        if "/game/" in p:
            p = p.split("/game/", 1)[1]
        return p.lstrip("/")
    except Exception:
        return ""


def find_asset_url(urls, expected_rel_path: str):
    exp = expected_rel_path.lstrip("/")
    exp_dir = str(Path(exp).parent).replace("\\", "/")
    exp_name = Path(exp).name
    exp_stem = Path(exp_name).stem
    exp_ext = Path(exp_name).suffix

    exact = None
    hashed = None
    for url in urls:
        rel = decoded_rel_path(url)
        if not rel or rel.startswith("manifest/"):
            continue
        rel_dir = str(Path(rel).parent).replace("\\", "/")
        rel_name = Path(rel).name
        if rel_dir != exp_dir:
            continue
        if rel_name == exp_name:
            exact = url
            break
        if exp_ext and rel_name.endswith(exp_ext) and rel_name.startswith(exp_stem + "."):
            hashed = url
    return exact or hashed


def find_manifest_data_url(urls, manifest_json_path: str):
    name = Path(manifest_json_path).name.replace(".1.json", "").replace(".json", "")
    token = f"/manifest/data/{name}."
    for url in urls:
        rel = decoded_rel_path(url)
        if token in ("/" + rel) and (rel.endswith(".data") or rel.endswith(".xdata")):
            return url
    return None


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read()


def decode_manifest_payload(raw: bytes) -> bytes:
    # Kixeye manifest data blobs are typically zlib-compressed.
    try:
        return zlib.decompress(raw)
    except Exception:
        return raw


def normalize_manifest_json_bytes(raw: bytes) -> bytes:
    payload = decode_manifest_payload(raw)
    text = payload.decode("utf-8", errors="ignore").strip()
    if not text:
        return payload

    try:
        obj = json.loads(text)
    except Exception:
        return payload

    # Some payloads are valid JSON strings containing another JSON document.
    for _ in range(3):
        if not isinstance(obj, str):
            break
        inner = obj.strip()
        if not inner:
            break
        try:
            obj = json.loads(inner)
        except Exception:
            break

    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def ensure_parent(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)


def sync_manifest_key(repo: Path, urls, key: str):
    target = repo / "manifest" / f"{key}.1.json"
    src = find_manifest_data_url(urls, str(target))
    if not src:
        return None, "missing_url"

    try:
        raw = fetch_bytes(src)
        payload = normalize_manifest_json_bytes(raw)
        ensure_parent(target)
        target.write_bytes(payload)

        alias = repo / "manifest" / f"{key}.json"
        ensure_parent(alias)
        alias.write_bytes(payload)
        return src, None
    except Exception as exc:
        return src, str(exc)


def main():
    parser = argparse.ArgumentParser(description="Sync missing local fallback assets from captured production URLs.")
    parser.add_argument("--repo", default=".", help="Repo root")
    parser.add_argument("--lookback-lines", type=int, default=3000, help="How many tail lines from server_debug.log to scan")
    parser.add_argument("--sync-core-manifests", action="store_true", help="Also force-sync core manifest datasets from capture URLs")
    parser.add_argument(
        "--core-manifests",
        default=",".join(CORE_MANIFEST_KEYS),
        help="Comma-separated manifest keys to sync when --sync-core-manifests is enabled",
    )
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    server_log = repo / "server_debug.log"
    if not server_log.exists():
        raise FileNotFoundError(f"Missing log file: {server_log}")

    url_file = find_latest_capture_urls(repo)
    urls = load_urls(url_file)
    fallback_paths = recent_fallback_paths(server_log, args.lookback_lines)

    downloaded = []
    unresolved = []
    failed = []
    core_synced = []
    core_missing = []
    core_failed = []

    for rel in fallback_paths:
        rel_posix = rel.replace("\\", "/")
        target = repo / rel_posix

        try:
            if rel_posix.startswith("manifest/") and rel_posix.endswith(".json"):
                src = find_manifest_data_url(urls, rel_posix)
                if not src:
                    unresolved.append(rel_posix)
                    continue
                raw = fetch_bytes(src)
                payload = normalize_manifest_json_bytes(raw)
                ensure_parent(target)
                target.write_bytes(payload)
                # Keep a non-.1 alias in sync for loaders that probe both.
                if rel_posix.endswith(".1.json"):
                    alias = repo / rel_posix.replace(".1.json", ".json")
                    ensure_parent(alias)
                    alias.write_bytes(payload)
                downloaded.append((rel_posix, src))
            elif rel_posix.startswith("assets/"):
                src = find_asset_url(urls, rel_posix)
                if not src:
                    unresolved.append(rel_posix)
                    continue
                raw = fetch_bytes(src)
                ensure_parent(target)
                target.write_bytes(raw)
                downloaded.append((rel_posix, src))
            else:
                unresolved.append(rel_posix)
        except Exception as exc:
            failed.append((rel_posix, str(exc)))

    if args.sync_core_manifests:
        requested_keys = [k.strip() for k in args.core_manifests.split(",") if k.strip()]
        for key in requested_keys:
            src, err = sync_manifest_key(repo, urls, key)
            if err is None:
                core_synced.append((key, src))
            elif err == "missing_url":
                core_missing.append(key)
            else:
                core_failed.append((key, err))

    print(f"Capture URL file: {url_file.name}")
    print(f"Fallback paths scanned: {len(fallback_paths)}")
    print(f"Downloaded: {len(downloaded)}")
    print(f"Unresolved: {len(unresolved)}")
    print(f"Failed: {len(failed)}")
    if args.sync_core_manifests:
        print(f"Core manifest synced: {len(core_synced)}")
        print(f"Core manifest missing: {len(core_missing)}")
        print(f"Core manifest failed: {len(core_failed)}")

    if unresolved:
        print("\nUnresolved paths:")
        for rel in unresolved:
            print(f"- {rel}")

    if failed:
        print("\nFailed downloads:")
        for rel, err in failed:
            print(f"- {rel}: {err}")

    if core_missing:
        print("\nMissing core manifest URLs:")
        for key in core_missing:
            print(f"- {key}")

    if core_failed:
        print("\nFailed core manifest sync:")
        for key, err in core_failed:
            print(f"- {key}: {err}")


if __name__ == "__main__":
    main()
