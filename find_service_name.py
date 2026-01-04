import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

term = 'Service::onQueryFailure must be overriden by child class'
idx = content.find(term)

if idx != -1:
    # Read BEFORE the match to find the class assignment
    # The previous snippet started at matching property definitions
    # We need to see "var X = ... " or "X.prototype ="
    
    start = max(0, idx - 1500)
    end = min(len(content), idx) 
    snippet = content[start:end]
    print(f"--- Preceding context for Class ID ---")
    print(snippet)
else:
    print("Term not found.")
