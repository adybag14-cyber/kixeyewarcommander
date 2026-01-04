import os

# Define paths
input_path = "js/engine.js"
output_path = "js/warcommander.patched.js"

# Read the file
print(f"Reading {input_path}...")
with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Define patches
patches = [
    # 0. Export Internal Class Map (Critical for access)
    ('X.lime = X.lime || {}; var l = {}', 'X.lime = X.lime || {}; console.log("PATCH: Setting _hx_classes"); var l = window._hx_classes = {}'),

    # 1. Enable LOCAL mode
    ('p.get_LOCAL=function(){return!1}', 'p.get_LOCAL=function(){return!0}'),
    # 2. Disable NOTLOCAL mode
    ('p.get_NOTLOCAL=function(){return!0}', 'p.get_NOTLOCAL=function(){return!1}'),
    # 3. Enable DEBUG mode
    ('p.get_DEBUG=function(){return!1}', 'p.get_DEBUG=function(){return!0}'),
    # 4. Disable RELEASE mode
    ('p.get_RELEASE=function(){return!0}', 'p.get_RELEASE=function(){return!1}'),
    
    # 5. Neutralize integrity assertions (ca.assert)
    ('ca.assert(', 'console.warn("ASSERT FAILURE:", '),
    
    # 6. Neutralize Halt
    ('p.Halt=function(a,b,c){', 'p.Halt=function(a,b,c){console.error("HALT:",a,b);return;'),
    
    # 7. Neutralize showErrorMessage
    ('p.showErrorMessage=function(a,b,c,d,e){', 'p.showErrorMessage=function(a,b,c,d,e){console.error("ENGINE ERROR:",a,b);return;'),

    # 8. Neutralize ExitFullscreen
    ('p.ExitFullscreen=function(){', 'p.ExitFullscreen=function(){console.log("ExitFullscreen stub");return;'),
]

# Apply patches
print("Applying patches...")
for search, replace in patches:
    count = content.count(search)
    if count > 0:
        content = content.replace(search, replace)
        print(f"  [OK] Replaced {count} occurrences of '{search}'")
    else:
        print(f"  [WARN] Could not find '{search}'")

# Write output
print(f"Writing to {output_path}...")
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching complete.")
