
import os

file_path = "c:/Users/adyba/clone of game/js/warcommander.patched.js"
target = "com.cc.worldmap.HexMap"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if target in line:
                print(f"Found on line {i+1}")
                idx = line.find(target)
                start = max(0, idx - 200)
                end = min(len(line), idx + 800)
                print(f"Context: ...{line[start:end]}...")
except Exception as e:
    print(f"Error: {e}")
