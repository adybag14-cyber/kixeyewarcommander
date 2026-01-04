import re

file_path = "c:/Users/adyba/clone of game/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print("Original size:", len(content))

# Pattern for the BROKEN sniffer block which has the newline in string literal
# It looks like: ...join(" \n ");
# We will match the specific broken line sequence to identify the block.

pattern_broken = r'window\.MISSING_ASSETS\.join\("\n'

if re.search(pattern_broken, content):
    print("Found broken syntax marker.")
    
    # We want to remove the specific IIFE that contains this broken syntax.
    # The IIFE starts with `// IMMEDIATE SNIFFER SETUP` usually, or just `(function() {`
    # We will match from `// IMMEDIATE SNIFFER SETUP` down to `})();` that contains the broken part.
    # But regex is tricky for nested matching.
    
    # Simpler approach: Replace the known broken lines with empty string or comment.
    # The broken lines are:
    # " + window.MISSING_ASSETS.join("
    # ");
    
    # We can perform a robust replacement of the whole known bad script snippet.
    # I'll try to identify the whole block if possible to be clean.
    
    # Let's match the surrounding context: `(function() { ... setupSniffer(); ... })();`
    # And check if it contains the broken join.
    
    pattern_block = r'(// IMMEDIATE SNIFFER SETUP\s*\([\s\S]*?\}\)\(\);)'
    
    def replace_if_broken(match):
        block = match.group(1)
        if 'window.MISSING_ASSETS.join("\n' in block:
            print("Removing broken block...")
            return "" # Delete it
        return block # Keep valid ones
        
    new_content, count = re.subn(pattern_block, replace_if_broken, content)
    print(f"Removed broken blocks: {count}")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("File saved.")

else:
    print("No broken syntax marker found (already clean?).")
