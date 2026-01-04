
import sys

filename = 'js/warcommander.patched.js'
symbols = [
    '_hx_classes =',
    'window._hx_classes =',
    '["_hx_classes"] =',
    '[\'_hx_classes\'] ='
]

try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"Read {len(lines)} lines.")
    
    for i, line in enumerate(lines):
        for sym in symbols:
            if sym in line:
                print(f"Found {sym} at line {i+1}")
                # Print context (truncated)
                snippet = line.strip()
                if len(snippet) > 200:
                    start = max(0, snippet.find(sym) - 50)
                    end = min(len(snippet), snippet.find(sym) + 150)
                    snippet = "..." + snippet[start:end] + "..."
                print(f"  Context: {snippet}")

except Exception as e:
    print(f"Error: {e}")
