import re

target_file = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"
term = "popup_body__system_maintenance"

print(f"Scanning {target_file} for '{term}'...")

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    match = re.search(re.escape(term), content)
    if match:
        start_pos = match.start()
        print(f"Found match at index {start_pos}")
        
        # Extract generous context BEFORE the match to find the function signature
        start = max(0, start_pos - 2000)
        end = min(len(content), start_pos + 100)
        
        snippet = content[start:end]
        print("\n--- CONTEXT START ---")
        print(snippet)
        print("--- CONTEXT END ---")
    else:
        print("Term not found.")

except Exception as e:
    print(f"Error: {e}")
