
import re

with open("js/warcommander.patched.js", "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to find assignments to _version
# e.g. p._version = "1.2.3"; or this._version = 123;
matches = re.finditer(r'([a-zA-Z0-9_\$]+)\._version\s*=\s*([^;]+);', content)

print("--- Matches for ._version = ---")
for m in matches:
    print(f"Match: {m.group(0)}")
    start = max(0, m.start() - 100)
    end = min(len(content), m.end() + 100)
    print(f"Context: {content[start:end]}")
    print("-" * 20)

# Pattern for version: ... in object literals
matches2 = re.finditer(r'version:\s*([^,}]+)', content)
print("--- Matches for version: ... ---")
count = 0
for m in matches2:
    if count > 20: break # limit output
    print(f"Match: {m.group(0)}")
    count += 1
