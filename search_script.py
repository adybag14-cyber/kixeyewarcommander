
filename = "c:/Users/adyba/clone of game/js/warcommander.patched.js"

try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    print(f"File loaded. {len(lines)} lines.")
    
    for i, line in enumerate(lines):
        if "WRAPPER_INIT_FAIL" in line:
            print(f"Found WRAPPER_INIT_FAIL at line {i+1}: {line.strip()[:100]}")
            
        if "ja =" in line or "var ja =" in line or "ja=" in line:
             # loose check for assignment
             if len(line) < 200:
                print(f"Possible ja def at line {i+1}: {line.strip()}")
                
        if "signalFinishedLoggingIn" in line:
            print(f"Found signalFinishedLoggingIn at line {i+1}: {line.strip()[:100]}")

except Exception as e:
    print(f"Error: {e}")
