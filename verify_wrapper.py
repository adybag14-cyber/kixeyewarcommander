
import subprocess

with open("v68_debug.js", 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Locate main wrapper
start = -1
end = -1
for i, line in enumerate(lines):
    if "(function () {" in line:
        start = i
        break

for i in range(len(lines)-1, -1, -1):
    if "})();" in lines[i]:
        end = i
        break

if start != -1 and end != -1:
    print(f"Found wrapper at {start+1} and {end+1}")
    # Create minimal file
    new_lines = lines[:start+1] + ["    console.log('Minimal Wrapper Test');\n"] + lines[end:]
    
    with open("v68_debug_minimal.js", 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    try:
        subprocess.run(["node", "v68_debug_minimal.js"], check=True)
        print("SUCCESS: Wrapper is valid.")
    except subprocess.CalledProcessError:
        print("FAILURE: Wrapper itself is broken.")
else:
    print("Could not find wrapper boundaries.")
