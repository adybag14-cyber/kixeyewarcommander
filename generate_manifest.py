import os
import json
import hashlib

BASE_DIR = 'assets'
OUTPUT_FILE = 'shared_configs.json'

def generate_manifest():
    manifest_data = {}
    
    print(f"Scanning {BASE_DIR}...")
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            # key should be relatve to assets? or just filename?
            # Db.processManifestData uses `v.fields`. 
            # Db.formatCDNAssetNameIntoCacheingStrategyNamespace uses split('.').
            # If I look at `Db.loadCDNAssets`, line 11866:
            # Db._currentLoadingAsset = Db.removeCachingStrategyFromKeyNameString(...)
            # It seems keys are filenames or paths.
            # `Db.removePathAndExtension` is used for validation.
            
            # Use relative path from 'assets' as key. 
            # e.g. "images/logo.png"
            
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, BASE_DIR).replace('\\', '/')
            
            # Using a simple version/hash. 
            # In real game, this is a hash.
            # We can just use "1" or a dummy hash.
            manifest_data[rel_path] = "1"

    # Wrap in shared_configs structure
    shared_configs = [
        {
            "name": "manifest_config",
            "values": json.dumps(manifest_data)  # values must be a JSON string
        }
    ]

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(shared_configs, f, indent=None) # Minified JSON usually preferred but indent for debug is fine? 
                                                  # hb.decode is JSON.parse, so indent is fine.
    
    print(f"Generated {OUTPUT_FILE} with {len(manifest_data)} assets.")

if __name__ == '__main__':
    generate_manifest()
