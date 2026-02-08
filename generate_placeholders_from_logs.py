import re
import os
import urllib.parse

LOG_FILE = "verification_extended_output.txt"
BASE_DIR = os.getcwd()

def create_placeholder(path):
    # Remove query params
    clean_path = path.split('?')[0]
    
    # Remove http://localhost:8089/ prefix
    if "http://localhost:8089/" in clean_path:
        local_rel_path = clean_path.split("http://localhost:8089/")[1]
    elif clean_path.startswith("/"):
        local_rel_path = clean_path[1:]
    else:
        local_rel_path = clean_path
        
    full_local_path = os.path.join(BASE_DIR, local_rel_path.replace("/", os.sep))
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(full_local_path), exist_ok=True)
    
    # Check if file already exists
    if os.path.exists(full_local_path):
        print(f"Skipping (exists): {local_rel_path}")
        return

    print(f"Creating placeholder: {local_rel_path}")
    
    # Create a simple 1x1 transparent PNG or similar
    # 1x1 pixel PNG signature
    png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    
    try:
        with open(full_local_path, "wb") as f:
            f.write(png_data)
    except Exception as e:
        print(f"Failed to write {full_local_path}: {e}")

def main():
    print(f"Scanning {LOG_FILE} for 404s...")
    
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Look for "Failed to load resource ... 404" and look back for the URL
    for i, line in enumerate(lines):
        if "status of 404" in line:
            # Look backwards for "URLLoader Loading:" or "Loader Loading:"
            found_url = None
            for j in range(i-1, i-10, -1):
                if j < 0: break
                prev_line = lines[j]
                if "URLLoader Loading:" in prev_line or "Loader Loading:" in prev_line:
                    # Extract URL
                    # Format: [log] [PATCH V32] URLLoader Loading: URL
                    parts = prev_line.split("Loading: ")
                    if len(parts) > 1:
                        found_url = parts[1].strip()
                        break
            
            if found_url:
                create_placeholder(found_url)

if __name__ == "__main__":
    main()
