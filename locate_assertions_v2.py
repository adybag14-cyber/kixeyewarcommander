import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"
output_path = r"c:\Users\adyba\clone of game\debug_search.txt"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

search_terms = [
    "seconds verification failure",
    "milliseconds verification failure",
    "ASSERT FAILURE"
]

results = []
results.append(f"Scanning {len(content)} bytes of {file_path}")

for term in search_terms:
    results.append(f"\n--- Searching for: '{term}' ---")
    start_pos = 0
    match_count = 0
    while True:
        idx = content.find(term, start_pos)
        if idx == -1:
            break
        
        # Get context
        start = max(0, idx - 100)
        end = min(len(content), idx + 100)
        snippet = content[start:end]
        results.append(f"Match at index {idx}:")
        results.append(f"Snippet: ==={snippet}===")
        
        start_pos = idx + len(term)
        match_count += 1
        if match_count >= 5: 
            break
    
    if match_count == 0:
        results.append("Not found.")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print("Done writing to debug_search.txt")
