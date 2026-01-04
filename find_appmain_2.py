
filename = 'js/warcommander.patched.js'
search_term = 'ApplicationMain'

try:
    with open(filename, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if search_term in line:
                print(f"Line {i+1}: {line.strip()[:200]}")
                # Print context if it looks like definition
                if "l.ApplicationMain =" in line or 'l["ApplicationMain"] =' in line:
                    print(f"  DEFINITION?")
except Exception as e:
    print(f"Error: {e}")
