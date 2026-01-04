
filename = 'js/warcommander.patched.js'
search_term = '.Login ='
context_lines = 5

try:
    with open(filename, 'r', encoding='utf-8') as f:
        # Read line by line
        for i, line in enumerate(f):
            if search_term in line:
                print(f"Line {i+1}: {line.strip()[:200]}")
                # We want to find the one that looks like a function definition
                if "function" in line:
                     print(f"  POTENTIAL MATCH")
                     
except Exception as e:
    print(f"Error: {e}")
