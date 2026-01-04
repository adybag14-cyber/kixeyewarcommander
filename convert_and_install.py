from PIL import Image
import os
import shutil

SOURCE = r"C:/Users/adyba/.gemini/antigravity/brain/54fca5b3-e26a-4088-8fc2-09197a8fc7dc/ripped_map_1766607699314.png"
DEST_BASE = "assets/ui/backgrounds/Bkgd-forest-2_6k"

def install():
    if not os.path.exists(SOURCE):
        print(f"Source not found: {SOURCE}")
        return

    try:
        with Image.open(SOURCE) as img:
            print(f"Loaded source: {img.size} {img.mode}")
            
            # Convert to RGB (droppping alpha if any)
            rgb_img = img.convert('RGB')
            
            # Save as low.jpg
            target = f"{DEST_BASE}_low.jpg"
            rgb_img.save(target, quality=90)
            print(f"Saved {target}")
            
            # Save others
            rgb_img.save(f"{DEST_BASE}_med_low.jpg", quality=90)
            rgb_img.save(f"{DEST_BASE}_med_high.jpg", quality=90)
            rgb_img.save(f"{DEST_BASE}.jpg", quality=90)
            rgb_img.save(f"{DEST_BASE}_high.jpg", quality=90)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    install()
