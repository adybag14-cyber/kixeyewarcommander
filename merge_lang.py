import json
import os

extracted_file = "extracted_lang.json"
real_file = "assets/lang/en.json"
output_file = "mock_lang.json"

merged = {}

# Load extracted keys (generated values)
if os.path.exists(extracted_file):
    with open(extracted_file, "r") as f:
        merged = json.load(f)

# Load real keys (overwrite generated ones)
if os.path.exists(real_file):
    with open(real_file, "r") as f:
        real_data = json.load(f)
        for k, v in real_data.items():
            merged[k] = v

print(f"Merged {len(merged)} keys.")

with open(output_file, "w") as out:
    json.dump(merged, out, indent=4)
    print(f"Saved to {output_file}")
