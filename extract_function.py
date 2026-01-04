import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# We look for the match found earlier
term = "Global::setServerTimestampSeconds verification failure"
idx = content.find(term)

if idx != -1:
    # Walk backwards to find "function" or "p.setServerTimestampSeconds"
    # We'll just grab a chunk around it.
    start = max(0, idx - 500)
    end = min(len(content), idx + 200)
    snippet = content[start:end]
    print(f"--- Context around {term} ---")
    print(snippet)
else:
    print("Term not found.")

term2 = "Global::setLocalTimestampSeconds verification failure"
idx2 = content.find(term2)
if idx2 != -1:
    start = max(0, idx2 - 500)
    end = min(len(content), idx2 + 200)
    snippet = content[start:end]
    print(f"\n--- Context around {term2} ---")
    print(snippet)
