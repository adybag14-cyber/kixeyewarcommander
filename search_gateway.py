
import re

print("Searching for gateway logic...")
search_terms = ["gateway/poll", "poll?", "gateway_url", "onGatewayError"]

with open("js/warcommander.patched.js", "r", encoding="utf-8") as f:
    content = f.read()

for term in search_terms:
    print(f"\n--- Searching for: {term} ---")
    matches = [m.start() for m in re.finditer(re.escape(term), content)]
    print(f"Found {len(matches)} occurrences.")
    for idx in matches[:10]: # Show more matches
        start = max(0, idx - 500)
        end = min(len(content), idx + 500)
        print(f"Context (at {idx}): {content[start:end]}")
        print("-" * 80)
