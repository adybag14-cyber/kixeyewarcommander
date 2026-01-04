import os
import requests
import urllib.parse

CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/"
LOG_FILE = "console_log.md"
MIN_VALID_SIZE = 1000 # 1KB

def main():
    if not os.path.exists(LOG_FILE):
        print(f"Log file {LOG_FILE} not found.")
        return

    with open(LOG_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    unique_paths = set()
    for line in lines:
        # Extract path before '?'
        if "Failed to load" in line:
            path = line.split('?')[0].strip()
            unique_paths.add(path)

    print(f"Found {len(unique_paths)} unique missing paths in log.")

    for rel_path in sorted(list(unique_paths)):
        local_path = os.path.join(os.getcwd(), rel_path)
        
        # Check if file is "broken" (too small)
        is_broken = False
        if os.path.exists(local_path):
            size = os.path.getsize(local_path)
            if size < MIN_VALID_SIZE:
                print(f"File {rel_path} is too small ({size} bytes), likely a 404 page. Redownloading...")
                is_broken = True
            else:
                # print(f"Skipping valid file: {rel_path}")
                continue
        else:
            print(f"File {rel_path} missing. Downloading...")
            is_broken = True

        if is_broken:
            url = f"{CDN_BASE}{rel_path}"
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
            try:
                r = requests.get(url, timeout=10)
                if r.status_code == 200:
                    with open(local_path, 'wb') as out:
                        out.write(r.content)
                    print(f"  -> Successfully downloaded {rel_path} ({len(r.content)} bytes)")
                else:
                    print(f"  -> FAILED to download {rel_path} (Status: {r.status_code})")
            except Exception as e:
                print(f"  -> ERROR downloading {rel_path}: {e}")

if __name__ == "__main__":
    main()
