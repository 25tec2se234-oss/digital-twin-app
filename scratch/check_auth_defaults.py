import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'ensureAuthDefaults' in l:
        print(f"Line {i+1}: {l.rstrip()}")
        for j in range(i, min(i + 30, len(lines))):
            print(f"{j+1}: {lines[j].rstrip()}")
        print("\n")
