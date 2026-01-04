
filename = 'js/warcommander.patched.js'
search_term = 'window._hx_classes'
context_lines = 5

try:
    with open(filename, 'r', encoding='utf-8') as f:
        # Read line by line to avoid memory issues if any, but file is 15MB which is fine in memory
        lines = f.readlines()
    
    print(f"Read {len(lines)} lines.")
    
    found = False
    for i, line in enumerate(lines):
        if search_term in line:
            print(f"Found '{search_term}' at line {i+1}")
            start = max(0, i - context_lines)
            end = min(len(lines), i + context_lines + 1)
            for j in range(start, end):
                 print(f"{j+1}: {lines[j].strip()[:200]}")
            found = True
            break
    
    if not found:
        print("Not found.")

except Exception as e:
    print(f"Error: {e}")
