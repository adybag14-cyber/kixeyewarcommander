import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    exit(1)

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

search_terms = [
    "syncLocalToServerTimestamp",
    "ASSERT FAILURE",
    "seconds verification failure",
    "milliseconds verification failure"
]

print(f"Scanning {file_path} ({len(content)} bytes)...")

for term in search_terms:
    print(f"\n--- Searching for: '{term}' ---")
    start_pos = 0
    count = 0
    while True:
        idx = content.find(term, start_pos)
        if idx == -1:
            break
        
        # Get context (50 chars before and 150 after)
        context_start = max(0, idx - 50)
        context_end = min(len(content), idx + 200)
        snippet = content[context_start:context_end].replace("\n", "\\n")
        
        print(f"Match {count+1} at index {idx}: ...{snippet}...")
        
        start_pos = idx + len(term)
        count += 1
        if count >= 3: # Limit to 3 matches per term to avoid spam
            print("... (more matches suppressed)")
            break

if count == 0:
    print(f"'{term}' not found.")
