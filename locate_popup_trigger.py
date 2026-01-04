import re

target_file = r"c:\Users\adyba\clone of game\js\warcommander.patched.js"
search_terms = [
    "LOST_SATELLITE_CONNECTION", 
    "system_maintenance", 
    "POPUP_TITLE_", 
    "showErrorMessage", 
    "handleRelocate"
]

print(f"Scanning {target_file}...")

try:
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    for term in search_terms:
        matches = [m.start() for m in re.finditer(re.escape(term), content)]
        print(f"\nTerm '{term}' found {len(matches)} times.")
        
        for idx, start_pos in enumerate(matches[:5]): # Show first 5 matches
            start = max(0, start_pos - 100)
            end = min(len(content), start_pos + 400) # Get generous context forward
            snippet = content[start:end].replace('\n', ' ')
            print(f"  Match {idx+1}: ...{snippet}...")

except Exception as e:
    print(f"Error: {e}")
