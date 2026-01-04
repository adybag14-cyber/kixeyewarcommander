#!/usr/bin/env python3
"""
Script to extract and download ALL embedded assets from the game engine code.
Uses 32 threads for maximum performance.
"""

import os
import re
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = Path(r"c:\Users\adyba\clone of game")
JS_DIR = BASE_DIR / "js"
CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601"
OUTPUT_DIR = BASE_DIR / "assets"

def find_all_embedded_paths():
    """Extract ALL embedded paths from JavaScript files."""
    # Match any embedded/ path
    pattern = re.compile(r'["\']embedded/([^"\']+\.(?:png|jpg|jpeg|gif|svg|mp3|wav|ogg|json|xml))["\']', re.IGNORECASE)
    paths = set()
    
    for js_file in JS_DIR.glob("*.js"):
        try:
            content = js_file.read_text(encoding='utf-8', errors='ignore')
            matches = pattern.findall(content)
            for match in matches:
                # Normalize path
                normalized = match.replace('\\', '/')
                paths.add(f"embedded/{normalized}")
        except Exception as e:
            print(f"Error reading {js_file}: {e}")
    
    return sorted(paths)

def download_asset(asset_path):
    """Download a single asset from the CDN."""
    url = f"{CDN_BASE}/{asset_path}"
    output_path = OUTPUT_DIR / asset_path
    
    # Create directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Skip if already exists and has content
    if output_path.exists() and output_path.stat().st_size > 100:
        return f"SKIP: {asset_path}"
    
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", str(output_path), "-w", "%{http_code}", url],
            capture_output=True,
            text=True,
            timeout=30
        )
        http_code = result.stdout.strip()
        
        if http_code == "200":
            return f"OK: {asset_path}"
        else:
            return f"FAIL ({http_code}): {asset_path}"
    except Exception as e:
        return f"ERROR: {asset_path} - {e}"

def main():
    print("Finding ALL embedded asset paths in JavaScript files...")
    paths = find_all_embedded_paths()
    print(f"Found {len(paths)} unique embedded asset paths")
    
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
    print(f"Failed: {results['fail']}")
    print(f"Errors: {results['error']}")

if __name__ == "__main__":
    main()
