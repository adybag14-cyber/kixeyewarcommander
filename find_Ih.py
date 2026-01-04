
filename = 'js/warcommander.patched.js'
search_term = 'var Ih ='

try:
    with open(filename, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if search_term in line:
                print(f"Line {i+1}: {line.strip()[:200]}")
except Exception as e:
    print(f"Error: {e}")
