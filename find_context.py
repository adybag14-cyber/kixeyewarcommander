
import sys

def find_context(filename, search_string, context=100):
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    start = 0
    while True:
        idx = content.find(search_string, start)
        if idx == -1:
            break
        
        snippet = content[max(0, idx - context) : min(len(content), idx + len(search_string) + context)]
        print(f"--- Match at {idx} ---")
        print(snippet)
        print("--------------------")
        
        start = idx + 1

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python find_context.py <file> <string>")
    else:
        find_context(sys.argv[1], sys.argv[2])
