
import re

def find_duplicates(filename):
    print(f"Checking {filename}...")
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    start = content.find('Na.buildDescriptions = function')
    if start == -1:
        print("Not found")
        return
    
    # Large chunk to cover entire function
    end = content.find('};', start + 1000)
    # Actually look for the next class or function to be sure
    end = start + 20000 
    
    func_text = content[start:end]
    
    matches = re.findall(r'addDescription\(([^,]+),', func_text)
    
    counts = {}
    for m in matches:
        m = m.strip().replace(' ', '')
        # Resolve 1E3 etc
        try:
            if 'E' in m:
                val = str(int(float(m)))
            else:
                val = str(int(m))
        except:
            val = m
            
        counts[val] = counts.get(val, 0) + 1
    
    dupes = {k: v for k, v in counts.items() if v > 1}
    print(f"Total registrations: {len(matches)}")
    if dupes:
        print(f"Duplicates: {dupes}")
    else:
        print("No duplicates found in this range.")

if __name__ == "__main__":
    find_duplicates('js/warcommander.patched.js')
    find_duplicates('js/engine.js')
