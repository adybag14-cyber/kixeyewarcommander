filename = "c:/Users/adyba/clone of game/index.html"
found = False
with open(filename, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if "INLINE" in line or "V68-LOGIN-INLINE" in line:
            print(f"Found INLINE at line {i+1}: {line.strip()}")
            found = True

if not found:
    print("INLINE not found in file.")
