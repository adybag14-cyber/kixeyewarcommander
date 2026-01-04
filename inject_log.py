
import os

file_path = 'js/warcommander.patched.js'
search_str = 'p.showErrorMessage = function (a, b, c, d, e) {'
insert_str = ' try { window.__AG_LAST_ERROR__ = {code: a, msg: b, stack: (new Bb).getStackTrace()}; console.log("AG_ERROR_CAPTURED"); } catch(e) {} console.log("Antigravity ERROR CAPTURE - showErrorMessage: code=", a, "msg=", b, "stack=", (new Bb).getStackTrace());'

if not os.path.exists(file_path):
    print(f"Error: {file_path} not found.")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Reset file first to avoid double injection cleanly if needed, or just handle check
# Simplest is to read, if old injection exists, replace it, or if raw string exists replace it.
# Taking a simpler approach: Revert to original signature then apply new one.
# But I don't have original easily. 
# I will search for the PREVIOUS inserted string and replace it with the NEW one.

old_insert_str = ' console.log("Antigravity ERROR CAPTURE - showErrorMessage: code=", a, "msg=", b, "stack=", (new Bb).getStackTrace());'

if (search_str + old_insert_str) in content:
    print("Found old injection, updating...")
    new_content = content.replace(search_str + old_insert_str, search_str + insert_str)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated log injection.")
elif search_str in content and insert_str not in content:
     # Clean inject (if I reverted manually or something, currently not the case but good for robustness)
    new_content = content.replace(search_str, search_str + insert_str)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully injected log.")
else:
    print("Log already injected or search string not found.")
