
with open(r"c:\Users\adyba\clone of game\js\warcommander.patched.js", "r", encoding="utf-8") as f:
    content = f.read()

target = '["lime.utils.Assets"]'
import re

indices = [m.start() for m in re.finditer(re.escape(target), content)]

for idx in indices:
    start = max(0, idx - 100)
    end = min(len(content), idx + 100)
    print(f"Match at {idx}:")
    print(content[start:end])
    print("-" * 50)
