
filename = 'js/warcommander.patched.js'
search_term = 'WarCommander'
context_lines = 5

try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"Read {len(lines)} lines.")
    
    for i, line in enumerate(lines):
        if search_term in line:
            print(f"Found '{search_term}' at line {i+1}")
            start = max(0, i - context_lines)
            end = min(len(lines), i + context_lines + 1)
            for j in range(start, end):
                 print(f"{j+1}: {lines[j].strip()[:200]}...") # Truncate long lines
            
            # If we find it, assume it's one of the few assignments
            if "lime.$scripts" in line or "WarCommander =" in line:
                break

except Exception as e:
    print(f"Error: {e}")
