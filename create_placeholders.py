import os
import base64

# Base64 for 1x1 Red Pixel PNG
RED_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

# Base64 for 1x1 Green Pixel PNG
GREEN_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

# Base64 for 1x1 Transparent Pixel PNG
TRANSPARENT_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

assets_dir = r"c:\Users\adyba\clone of game\assets"
images_dir = os.path.join(assets_dir, "images")
embedded_ui_dir = os.path.join(assets_dir, "embedded", "ui")
selection_dir = os.path.join(embedded_ui_dir, "selection")

# Ensure directories exist
os.makedirs(images_dir, exist_ok=True)
os.makedirs(selection_dir, exist_ok=True)

def write_png(path, b64_data):
    try:
        data = base64.b64decode(b64_data)
        with open(path, "wb") as f:
            f.write(data)
        print(f"Created {path}")
    except Exception as e:
        print(f"Failed to create {path}: {e}")

# Create assets
write_png(os.path.join(images_dir, "terrain.png"), GREEN_PNG_B64)
write_png(os.path.join(embedded_ui_dir, "map_fog.png"), TRANSPARENT_PNG_B64)
write_png(os.path.join(selection_dir, "move_confirm.png"), GREEN_PNG_B64)
write_png(os.path.join(selection_dir, "attackmove_confirm.png"), RED_PNG_B64)

print("Placeholder assets created successfully.")
