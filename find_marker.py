
try:
    with open('js/warcommander.patched.js', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if 'var Tj =' in line or 'var Tj=' in line or 'Tj =' in line or 'Tj=' in line:
                # heuristic to avoid too many hits, look for assignment to function or class
                if 'function' in line or '{' in line:
                    print(f"Line {i+1} (Tj): {line.strip()[:200]}")
            if 'login__please_reload' in line:
                 print(f"Line {i+1} (Error): {line.strip()[:200]}")
            if 'processServerResponse' in line:
                 print(f"Line {i+1} (Proc): {line.strip()[:200]}")
except Exception as e:
    print(f"Error: {e}")
