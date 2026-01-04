
import os
import subprocess

html_path = "c:/Users/adyba/clone of game/index.html"
js_path = "c:/Users/adyba/clone of game/v68_debug_no_end.js"

with open(html_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Extract lines 6-1148
script_lines = lines[6:1149]
mock = ["var window = {}; var document = {}; var console = { warn: function(){}, log: function(){}, error: function(){} };\n"]

# Remove last line
script_lines.pop()

full_js = "".join(mock + script_lines)

with open(js_path, "w", encoding="utf-8") as f:
    f.write(full_js)

print("Running node check on file WITHOUT end closure...")
try:
    result = subprocess.run("node -c \"v68_debug_no_end.js\" 2> error_no_end.txt", shell=True)
    with open("error_no_end.txt", "r") as f:
        print(f.read())
except Exception as e:
    print("Execution Failed:", e)
