import re

target_file = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"
term = "popup_body__system_maintenance"
output_file = r"c:\Users\adyba\clone of game\debug_popup_code.txt"

print(f"Scanning {target_file} for '{term}'...")

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    match = re.search(re.escape(term), content)
    if match:
        start_pos = match.start()
        print(f"Found match at index {start_pos}")
        
        # Extract generous context
        start = max(0, start_pos - 2500)
        end = min(len(content), start_pos + 2500)
        
        snippet = content[start:end]
        
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write(snippet)
            
        print(f"Dumped context to {output_file}")
    else:
        print("Term not found.")

except Exception as e:
    print(f"Error: {e}")
