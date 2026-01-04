
import os

def patch_js(filename):
    print(f"Patching {filename}...")
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    old_text = 'Na.addDescription = function (a, b) { ca.assert(!Na._descriptionLookup.h.hasOwnProperty(a), "HaltErrorCodes.addDescription: Error code collision. Error code: " + a + " Old description: " + Na._descriptionLookup.h[a] + " New description: " + b); Na._descriptionLookup.h[a] = b };'
    
    # Check if we can find it
    if old_text in content:
        print("Found exact match in engine.js structure")
        new_text = 'Na.addDescription = function (a, b) { if (Na._descriptionLookup.h.hasOwnProperty(a)) { console.warn("HaltErrorCodes.addDescription: Error code collision. Error code: " + a + " Old description: " + Na._descriptionLookup.h[a] + " New description: " + b); } Na._descriptionLookup.h[a] = b };'
        new_content = content.replace(old_text, new_text)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Patch applied.")
    else:
        # Try a more flexible match for the patched version which might have different formatting
        print("Exact match not found, trying flexible match...")
        pattern = r'Na\.addDescription\s*=\s*function\s*\(a,\s*b\)\s*\{[^}]+\};'
        match = re.search(pattern, content)
        if match:
             print(f"Found flexible match: {match.group(0)}")
             # We want to keep the assignment but replace the body
             # Actually, let's just use the known structure for Na.addDescription in warcommander.patched.js
             pass
        else:
            print("No match found.")

if __name__ == "__main__":
    import re
    patch_js('js/engine.js')
    
    # Also check warcommander.patched.js
    with open('js/warcommander.patched.js', 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # In warcommander.patched.js it was: Na.addDescription = function (a, b) { Na._descriptionLookup.h[a] = b };
    # Let's add logging there too
    old_patched = 'Na.addDescription = function (a, b) { Na._descriptionLookup.h[a] = b };'
    if old_patched in content:
        print("Found match in warcommander.patched.js")
        new_patched = 'Na.addDescription = function (a, b) { if (Na._descriptionLookup.h.hasOwnProperty(a)) { console.warn("HaltErrorCodes.addDescription collision: " + a); } Na._descriptionLookup.h[a] = b };'
        new_content = content.replace(old_patched, new_patched)
        with open('js/warcommander.patched.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Patch applied to warcommander.patched.js")
