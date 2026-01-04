import re
import os
import requests
import concurrent.futures

JS_FILE = r"c:\Users\adyba\clone of game\js\WarCommander_prod.js"
CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/"
OUTPUT_DIR = r"c:\Users\adyba\clone of game"

# Regex for common game asset extensions
# Captures things like "images/gui/loading.png" or just "loading.png"
# We need to be careful with short matches.
ASSET_PATTERN = re.compile(r'["\']([\w\-\/]+\.(png|jpg|jpeg|gif|mp3|ogg|xml|json|swf))["\']')

def download_asset(path):
    # path is like "images/foo.png"
    # normalize path separator
    local_path = os.path.join(OUTPUT_DIR, path.replace("/", os.sep))
    url = CDN_BASE + path
    
    if os.path.exists(local_path):
        # Optional: skip existing
        # return f"Skipped {path}"
        pass

    try:
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(r.content)
            return f"Downloaded {path}"
        else:
            return f"Failed {path} ({r.status_code})"
    except Exception as e:
        return f"Error {path}: {e}"

def main():
    with open(JS_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    matches = ASSET_PATTERN.findall(content)
    # matches is a list of tuples like ('images/foo.png', 'png')
    unique_paths = sorted(list(set([m[0] for m in matches])))
    
    print(f"Found {len(unique_paths)} potential assets.")
    
    # Filter out likely false positives (too short, or generic words)
    # paths should probably contain a slash or be known types
    # But some assets are at root.
    
    valid_assets = [p for p in unique_paths if len(p) > 4]
    
    print(f"Attempting to download {len(valid_assets)} assets...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(download_asset, valid_assets))
        
    for res in results:
        if "Downloaded" in res:
            print(res)
        elif "Failed" in res and "404" not in res: # Show non-404 errors
            print(res)

if __name__ == "__main__":
    main()
