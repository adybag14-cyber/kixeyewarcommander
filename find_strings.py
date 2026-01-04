import os

search_terms = [
    "seconds verification failure",
    "syncLocalToServerTimestamp"
]

file_path = "js/warcommander.patched.js"
output_file = "found_offsets.txt"

with open(output_file, "w") as out:
    with open(file_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            for term in search_terms:
                if term in line:
                    snippet = line.strip()[:200]
                    res = f"Found '{term}' at line {line_num}: {snippet}"
                    out.write(res + "\n")
                    print(res)
