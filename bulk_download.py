import json
import os
import requests
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor

# Load asset list
with open('asset_list.json', 'r') as f:
    urls = json.load(f)

# Base directory for assets
BASE_DIR = 'assets'

def download_file(url):
    try:
        # Remove query parameters for local path determination
        clean_url = url.split('?')[0]
        parsed = urlparse(clean_url)
        path = parsed.path
        
        if '/game-v7.v71601/' in path:
            local_path = path.split('/game-v7.v71601/')[1]
        elif '/game/' in path:
            local_path = path.split('/game/')[1]
        elif '/images/' in path:
            local_path = 'images/' + path.split('/images/')[1]
        else:
            local_path = os.path.basename(path)

        dest = os.path.join(BASE_DIR, local_path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        
        # Redownload if missing or suspiciously small (e.g. 404 page)
        should_download = not os.path.exists(dest) or os.path.getsize(dest) < 500
        
        if should_download:
            r = requests.get(url, stream=True, timeout=15)
            if r.status_code == 200:
                with open(dest, 'wb') as f:
                    for chunk in r.iter_content(4096):
                        f.write(chunk)
                print(f"[OK] {local_path} ({os.path.getsize(dest)} bytes)")
            else:
                # If original versioned URL fails, try stripping the version if it was middle-path
                if '/game-v7.v71601/' in url:
                    fallback_url = url.replace('/game-v7.v71601/', '/game/')
                    r = requests.get(fallback_url, stream=True, timeout=15)
                    if r.status_code == 200:
                        with open(dest, 'wb') as f:
                            for chunk in r.iter_content(4096):
                                f.write(chunk)
                        print(f"[OK-FALLBACK] {local_path}")
                        return
                    
                print(f"[FAIL {r.status_code}] {url}")
        else:
            # print(f"[SKIP] {local_path}")
            pass
            
    except Exception as e:
        print(f"[ERROR] {url}: {e}")

print(f"Starting download of {len(urls)} assets with 16 threads...")

with ThreadPoolExecutor(max_workers=16) as executor:
    executor.map(download_file, urls)

print("Download complete.")
