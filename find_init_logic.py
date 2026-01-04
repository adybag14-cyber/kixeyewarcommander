
import re

print("Searching for initialization logic...")
search_terms = ["SetFlags", "setServerTimestampSeconds", "syncLocalToServerTimestamp"]

with open("js/warcommander.patched.js", "r", encoding="utf-8") as f:
    content = f.read()

for term in search_terms:
    print(f"\n--- Searching for: {term} ---")
    matches = [m.start() for m in re.finditer(re.escape(term), content)]
    print(f"Found {len(matches)} occurrences.")
    for idx in matches[:5]:
        start = max(0, idx - 1000)
        end = min(len(content), idx + 2000)
        print(f"Context (at {idx}):\n{content[start:end]}")
        print("-" * 80)
