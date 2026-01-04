import requests
import os
import concurrent.futures

BASE_URL = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/embedded/"
DEST_DIR = "assets/ripped/"

ASSETS = [
    "terrain/default.png",
    "ui/selection/move_confirm.png",
    "cursors/attack_cursor.png",
    "worldmap/entities/v2/cc_04.png",
    "worldmap/entities/v2/resource_oil_3.png",
    "effects/DARKSTORM_CLOUD_01.png"
]

# Add terrain tiles 0-200
for i in range(200):
    ASSETS.append(f"terrain/terrain{i}.png")

def download_file(path):
    url = BASE_URL + path + "?169512"
    local_path = os.path.join(DEST_DIR, path.replace("/", os.sep))
    
    # Ensure dir exists
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            with open(local_path, 'wb') as f:
                f.write(r.content)
            return path, True
    except Exception as e:
        pass
    return path, False

def main():
    print(f"Downloading {len(ASSETS)} assets to {DEST_DIR}...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(download_file, asset): asset for asset in ASSETS}
        success_count = 0
        for future in concurrent.futures.as_completed(futures):
            asset, success = future.result()
            if success:
                success_count += 1
                if success_count % 10 == 0:
                    print(f"Downloaded {success_count} files...")
            else:
                # print(f"Failed: {asset}") # Optional: ignore 404s for range guesses
                pass
                
    print(f"Finished. Downloaded {success_count} / {len(ASSETS)} files.")

if __name__ == "__main__":
    main()
