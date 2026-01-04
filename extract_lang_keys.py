import re
import json

js_file = "js/warcommander.patched.js"
output_file = "extracted_lang.json"

# Pattern for keys like "common__ok", "error_code__..."
# They are usually quoted in the source or passed as strings.
pattern = re.compile(r'["\']([a-z0-9]+__[a-z0-9_]+)["\']')

found_keys = set()

print(f"Scanning {js_file}...")
try:
    with open(js_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        matches = pattern.findall(content)
        for m in matches:
            found_keys.add(m)

    print(f"Found {len(found_keys)} unique keys.")

    # Create a JSON map
    lang_map = {}
    for key in sorted(found_keys):
        # Humanize the key for the value
        value = key.replace("__", ": ").replace("_", " ").title()
        lang_map[key] = value

    with open(output_file, "w") as out:
        json.dump(lang_map, out, indent=4)
        print(f"Saved to {output_file}")

except Exception as e:
    print(f"Error: {e}")
