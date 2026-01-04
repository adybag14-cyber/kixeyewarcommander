
import subprocess

filename = "v68_debug.js"
with open(filename, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# wrapper
start = -1
end = -1
for i, line in enumerate(lines):
    if "(function () {" in line:
        start = i; break
for i in range(len(lines)-1, -1, -1):
    if "})();" in lines[i]: end = i; break

# Hardcode ranges based on known keywords
def find_line(keyword, start_idx=0):
    for i in range(start_idx, len(lines)):
        if keyword in lines[i]:
            return i
    return -1

idx_start = start + 1
idx_finishInit = find_line("function finishInit", idx_start)
idx_patchGameData = find_line("function patchGameData", idx_finishInit)
idx_patchWS = find_line("window.V68_patchWS =", idx_patchGameData)
idx_patchNetwork = find_line("var patchNetwork =", idx_patchWS)
idx_findStage = find_line("var findStage =", idx_patchNetwork)
idx_end = len(lines) - 2 # before })();

checkpoints = [
    ("Preamble", idx_start, idx_finishInit),
    ("finishInit", idx_finishInit, idx_patchGameData),
    ("patchGameData", idx_patchGameData, idx_patchWS),
    ("patchWS", idx_patchWS, idx_patchNetwork),
    ("patchNetwork", idx_patchNetwork, idx_findStage),
    ("Rest", idx_findStage, idx_end)
]

current_lines = lines[:idx_start]
current_lines.append(lines[start]) # The opener

print(f"Wrapper start: {start}")

for name, s, e in checkpoints:
    if s == -1 or e == -1:
        print(f"Skipping {name} (not found)")
        continue
        
    print(f"Testing chunk: {name} (lines {s} to {e})")
    chunk = lines[s:e]
    # Append chunk + closure
    test_content = current_lines + chunk + ["\n})();"]
    
    with open("v68_test.js", 'w', encoding='utf-8') as f:
        f.writelines(test_content)
        
    try:
        subprocess.run(["node", "v68_test.js"], check=True, stderr=subprocess.PIPE)
        print(f"PASS: {name}")
        current_lines += chunk # Commit valid chunk
    except subprocess.CalledProcessError:
        print(f"FAIL: {name} contains the syntax error!")
        break
