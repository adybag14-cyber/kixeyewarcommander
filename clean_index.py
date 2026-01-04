
import os

path = "c:/Users/adyba/clone of game/index.html"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
keep = True
found_script_end = False
deleted_count = 0

for i, line in enumerate(lines):
    # Detect end of HEAD script (around line 1149)
    if "</script>" in line and not found_script_end:
        # Check context
        if i < 1200: # Ensure it's the top one
            found_script_end = True
            new_lines.append(line)
            keep = False
            print(f"Found Script End at line {i+1}. Deleting until BODY.")
            continue
    
    # Detect Start of BODY (around line 2850+)
    if "<body>" in line:
        keep = True
        print(f"Found BODY at line {i+1}. Resuming.")
    
    if keep:
        new_lines.append(line)
    else:
        deleted_count += 1

print(f"Deleted {deleted_count} lines.")

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
