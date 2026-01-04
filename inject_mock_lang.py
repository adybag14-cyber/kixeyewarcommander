import json
import re

lang_file = "mock_lang.json"
html_file = "index.html"

print(f"Reading {lang_file}...")
with open(lang_file, "r") as f:
    lang_data = json.load(f)

json_str = json.dumps(lang_data, indent=4)
# Javascript variable assignment
replacement = f"const mockLang = {json_str};"

print(f"Reading {html_file}...")
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# Regex to find the existing mockLang object
# It starts with "const mockLang = {" and ends with "};"
# We match lazily with [\s\S]*?
pattern = re.compile(r'const mockLang = \{[\s\S]*?\};')

if pattern.search(html_content):
    print("Found mockLang block. replacing...")
    new_html = pattern.sub(replacement, html_content)
    
    # Also we might have TWO occurrences (one in fetch, one in XHR).
    # The XHR one is at line 178: "const resp = {" ...
    # Wait, the code in index.html (step 1847) has TWO places with mock response.
    # Line 17: const mockLang = { ... }
    # Line 178: const resp = { ... }
    
    # My regex only matches "const mockLang = ...".
    # I should also replace the XHR one.
    # The XHR one defines "const resp = { ... }" inside `else if (this._url.includes('lang/') ...)`
    
    # It loops over matches? pattern.sub replaces ALL occurrences?
    # No, "const mockLang" is unique.
    # The XHR one is "const resp = { ... }".
    
    # Let's handle the XHR one separately.
    # In XHR (line 178), it has specific content keys like "global_body__reload_to_continue_error".
    # I can search for a unique key inside that block to identify it.
    
    # Better approach:
    # 1. Provide a global window variable `window.MOCK_LANG` at the top.
    # 2. Use `window.MOCK_LANG` in both Fetch and XHR mocks.
    
    # Let's inject `window.MOCK_LANG` at the top of script.
    # And replace the inline objects with `window.MOCK_LANG`.
    
    # Step 1: Inject window.MOCK_LANG definition after "window.__LOGS__ = [];"
    inject_point = "window.__LOGS__ = [];"
    if inject_point in new_html and "window.MOCK_LANG =" not in new_html:
        new_html = new_html.replace(inject_point, f"{inject_point}\n        window.MOCK_LANG = {json_str};\n")
        print("Injected window.MOCK_LANG.")
    
    # Step 2: Replace Fetch mock body
    # "const mockLang = { ... };" -> "const mockLang = window.MOCK_LANG;"
    new_html = pattern.sub("const mockLang = window.MOCK_LANG;", new_html)
    
    # Step 3: Replace XHR mock body
    # Regex for XHR block:
    # "else if (this._url.includes('lang/') ... {\n ... const resp = \{[\s\S]*?\};"
    # This is tricky regex.
    # Let's just find the object that contains "global_body__reload_to_continue_error" and replace it?
    # But there are two.
    # The first one was "const mockLang = ...".
    # The second one is "const resp = ...".
    
    # Let's try to find "const resp = {" followed by contents, inside the LANG block.
    # Maybe simply: allow the XHR to use `window.MOCK_LANG` too.
    # I'll manually locate the XHR block in regex.
    
    xhr_pattern = re.compile(r'else if \(this._url.includes\(\'lang/\'\).*?\{\s*console.log\("\[MOCK XHR\].*?"\);\s*const resp = \{[\s\S]*?\};', re.DOTALL)
    
    # Replace with: ... const resp = window.MOCK_LANG;
    def type_two_replacer(match):
        m = match.group(0)
        # Find the "const resp = { ... };" part inside match
        sub_pat = re.compile(r'const resp = \{[\s\S]*?\};')
        return sub_pat.sub('const resp = window.MOCK_LANG;', m)
    
    new_html = xhr_pattern.sub(type_two_replacer, new_html)
    print("Replaced XHR mock usage.")
    
    with open(html_file, "w", encoding="utf-8") as out:
        out.write(new_html)
    print(f"Updated {html_file}")
    
else:
    print("Could not find mockLang block.")

