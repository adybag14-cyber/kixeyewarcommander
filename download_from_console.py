#!/usr/bin/env python3
"""
Parse console log 404 errors and download missing assets from CDN.
Uses 32 threads for maximum performance.
"""

import re
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import unquote, urlparse

BASE_DIR = Path(r"c:\Users\adyba\clone of game")
CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601"
OUTPUT_DIR = BASE_DIR / "assets"
CONSOLE_LOG = BASE_DIR / "console_log.md"

def parse_404_urls():
    """Parse console log to find 404 GET request URLs."""
    content = CONSOLE_LOG.read_text(encoding='utf-8', errors='ignore')
    
    # Pattern 1: Full GET requests like "GET http://localhost:8000/assets/... 404"
    pattern1 = re.compile(r'GET http://localhost:8000/assets/([^\s?]+)')
    
    # Pattern 2: Simple filename:1 Failed to load resource patterns
    # We can try to guess paths or skip these
    pattern2 = re.compile(r'^([a-zA-Z0-9_\-\.]+\.(?:png|jpg|json|xml|zip)):1\s+Failed', re.MULTILINE)
    
    paths = set()
    
    # Extract full paths from GET requests
    for match in pattern1.findall(content):
        # URL decode
        decoded = unquote(match)
        paths.add(decoded)
    
    return sorted(paths)

def download_asset(asset_path):
    """Download a single asset from the CDN."""
    # The CDN path should match the local assets path
    url = f"{CDN_BASE}/{asset_path}"
    output_path = OUTPUT_DIR / asset_path
    
    # Create directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Skip if already exists and has reasonable size (not an error page)
    if output_path.exists() and output_path.stat().st_size > 100:
        return f"SKIP: {asset_path}"
    
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", str(output_path), "-w", "%{http_code}", url],
            capture_output=True,
            text=True,
            timeout=60
        )
        http_code = result.stdout.strip()
        
        if http_code == "200":
            # Check if file has content
            if output_path.exists() and output_path.stat().st_size > 100:
                return f"OK: {asset_path}"
            else:
                return f"FAIL (empty): {asset_path}"
        else:
            # Delete failed file
            if output_path.exists():
                output_path.unlink()
            return f"FAIL ({http_code}): {asset_path}"
    except Exception as e:
        return f"ERROR: {asset_path} - {e}"

def main():
    print("Parsing 404 GET requests from console log...")
    paths = parse_404_urls()
    print(f"Found {len(paths)} unique asset paths from 404 errors")
    
    if not paths:
        print("No paths found. Check console log format.")
        return
    
    # Show some examples
    print("\nSample paths:")
    for p in paths[:10]:
        print(f"  - {p}")
    if len(paths) > 10:
        print(f"  ... and {len(paths) - 10} more")
    
    print(f"\nDownloading assets with 32 threads...")
    results = {"ok": 0, "skip": 0, "fail": 0, "error": 0}
    
    with ThreadPoolExecutor(max_workers=32) as executor:
        futures = {executor.submit(download_asset, path): path for path in paths}
        
        for future in as_completed(futures):
            result = future.result()
            print(result)
            
            if result.startswith("OK"):
                results["ok"] += 1
            elif result.startswith("SKIP"):
                results["skip"] += 1
            elif result.startswith("FAIL"):
                results["fail"] += 1
            else:
                results["error"] += 1
    
    print(f"\n=== Summary ===")
    print(f"Downloaded: {results['ok']}")
    print(f"Skipped (already exist): {results['skip']}")
    print(f"Failed (not on CDN): {results['fail']}")
    print(f"Errors: {results['error']}")

if __name__ == "__main__":
    main()
