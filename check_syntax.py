from bs4 import BeautifulSoup
import subprocess
import os

with open("index.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

scripts = soup.find_all("script")
print(f"Found {len(scripts)} scripts.")

for i, script in enumerate(scripts):
    if script.string:
        with open(f"temp_script_{i}.js", "w", encoding="utf-8") as f:
            f.write(script.string)
        
        # Count braces
        with open(f"temp_script_{i}.js", "r", encoding="utf-8") as f:
            content = f.read()
            opens = content.count("{")
            closes = content.count("}")
            open_p = content.count("(")
            close_p = content.count(")")
            open_b = content.count("[")
            close_b = content.count("]")
            print(f"SCRIPT {i}: Curlys {opens}/{closes} ({opens-closes}), Parens {open_p}/{close_p} ({open_p-close_p}), Brackets {open_b}/{close_b} ({open_b-close_b})")

        try:
            result = subprocess.run(["node", "--check", f"temp_script_{i}.js"], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"SCRIPT {i} ERROR:\n{result.stderr}")
            else:
                print(f"SCRIPT {i} OK")
        except Exception as e:
            print(e)
        
        try:
            os.remove(f"temp_script_{i}.js")
        except: pass
