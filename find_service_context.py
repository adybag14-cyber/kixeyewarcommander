import os

file_path = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"
output_path = r"c:\Users\adyba\clone of game\debug_service_context.txt"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

term = 'Service::onQueryFailure must be overriden by child class'
idx = content.find(term)

if idx != -1:
    # Get a large chunk before to finding the class definition
    start = max(0, idx - 2000)
    end = min(len(content), idx + 200)
    snippet = content[start:end]
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(f"Match at index {idx}:\n")
        out.write(snippet)
    print("Context written to debug_service_context.txt")
else:
    print("Term not found.")
