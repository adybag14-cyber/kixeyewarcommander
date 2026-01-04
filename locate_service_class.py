import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Search for the string associated with the failure to find the class
term = 'Service::onQueryFailure must be overriden by child class'
idx = content.find(term)

if idx != -1:
    # Context to find class assignment
    # Look backwards for "prototype.onQueryFailure" or similar
    start = max(0, idx - 1000)
    end = min(len(content), idx + 200)
    snippet = content[start:end]
    print(f"--- Context around '{term}' ---")
    print(snippet)
else:
    print(f"Terms '{term}' not found.")
