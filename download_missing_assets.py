import os
import re
import requests
import urllib.parse
from pathlib import Path

# CDN Base URL
CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/"

# File paths
LOG_FILE = "console_log.md"
TARGET_DIR = os.getcwd()

# Regex to find 404 paths
# Typical line: "embedded/ui/worldmap/dp%20bubbles/385.png?169512:1  Failed to load resource: the server responded with a status of 404 (Not Found)"
# Also handle lines that might start with "9: " if the file was saved that way, or just raw paths.
# We look for a string ending in png/jpg/psd followed by ? and then "Failed to load"
PATTERN = re.compile(r'(?:^|\s)([^:\s]+?\.(?:png|jpg|jpeg|psd|zip))(?:\?\d+(?::\d+)?)?\s+Failed to load resource', re.IGNORECASE)

def main():
    if not os.path.exists(LOG_FILE):
        print(f"Log file {LOG_FILE} not found.")
        return

    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = PATTERN.findall(content)
    unique_paths = sorted(list(set(matches)))

    print(f"Found {len(unique_paths)} missing files.")

    success_count = 0
    fail_count = 0

    for rel_path in unique_paths:
        # Decode URL path (e.g. %20 -> space)
        # But wait, curl worked with spaces. Let's try raw first, or standard decode.
        decoded_path = urllib.parse.unquote(rel_path)
        
        # The log path might be relative to root, e.g. "assets/..." or "embedded/..."
        # CDN request URL
        url = f"{CDN_BASE}{decoded_path}"
        
        # Local file path
        local_path = os.path.join(TARGET_DIR, decoded_path)
        
        # Create directories
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        if os.path.exists(local_path):
            print(f"Skipping existing: {decoded_path}")
            continue

        print(f"Downloading: {url}")
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                with open(local_path, 'wb') as out:
                    out.write(r.content)
                print(f"  -> Saved to {local_path}")
                success_count += 1
            else:
                print(f"  -> FAILED ({r.status_code})")
                fail_count += 1
        except Exception as e:
            print(f"  -> ERROR: {e}")
            fail_count += 1

    print(f"\nDone. Success: {success_count}, Failed: {fail_count}")

if __name__ == "__main__":
    main()
