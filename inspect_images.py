from PIL import Image

def inspect(path):
    try:
        with Image.open(path) as img:
            print(f"File: {path}")
            print(f"Format: {img.format}")
            print(f"Mode: {img.mode}")
            print(f"Size: {img.size}")
            
            # Sample center pixel
            cx, cy = img.size[0] // 2, img.size[1] // 2
            px = img.getpixel((cx, cy))
            print(f"Center Pixel: {px}")
            
            # Sample a few others
            print(f"Pixel (10,10): {img.getpixel((10,10))}")
            
            # Check if grayscale
            if img.mode == 'RGB':
                # extensive check?
                pass
    except Exception as e:
        print(f"Error inspecting {path}: {e}")

inspect('assets/ripped/terrain/terrain10.png')
inspect('assets/ui/backgrounds/Bkgd-forest-2_6k_low.jpg')
