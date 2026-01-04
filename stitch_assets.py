from PIL import Image
import os
import math

TILE_DIR = "assets/ripped/terrain"
OUTPUT_FILE = "assets/ui/backgrounds/Bkgd-forest-2_6k_low.jpg"
TILE_WIDTH = 500
TILE_HEIGHT = 250
MAP_WIDTH = 6000
MAP_HEIGHT = 3000

def stitch():
    # Load all tiles
    files = sorted([f for f in os.listdir(TILE_DIR) if f.startswith("terrain") and f.endswith(".png")], 
                   key=lambda x: int(x.replace("terrain", "").replace(".png", "")))
    
    if not files:
        print("No tiles found")
        return
    
    # Calculate Grid
    cols = math.ceil(MAP_WIDTH / TILE_WIDTH)
    rows = math.ceil(MAP_HEIGHT / TILE_HEIGHT)
    
    print(f"Stitching {len(files)} tiles into {cols}x{rows} grid (Expected {cols*rows} tiles)...")
    print(f"Tile Size: {TILE_WIDTH}x{TILE_HEIGHT}")
    
    # Create Canvas
    full_map = Image.new('RGB', (MAP_WIDTH, MAP_HEIGHT))
    
    for filename in files:
        idx = int(filename.replace("terrain", "").replace(".png", ""))
        
        # Calculate pos
        # Assuming row-major: idx = y * cols + x
        col = idx % cols
        row = idx // cols
        
        x = col * TILE_WIDTH
        y = row * TILE_HEIGHT
        
        if x >= MAP_WIDTH or y >= MAP_HEIGHT:
            continue

        try:
            with Image.open(os.path.join(TILE_DIR, filename)) as tile:
                full_map.paste(tile, (x, y))
        except Exception as e:
            print(f"Error pasting {filename}: {e}")

    # Ensure output dir
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    
    # Save as different qualities
    full_map.save(OUTPUT_FILE)
    full_map.save(OUTPUT_FILE.replace("_low.jpg", ".jpg"))
    full_map.save(OUTPUT_FILE.replace("_low.jpg", "_med_low.jpg"))
    full_map.save(OUTPUT_FILE.replace("_low.jpg", "_med_high.jpg"))
    full_map.save(OUTPUT_FILE.replace("_low.jpg", "_high.jpg"))
    
    print(f"Saved stitched map to {OUTPUT_FILE}")

if __name__ == "__main__":
    stitch()
