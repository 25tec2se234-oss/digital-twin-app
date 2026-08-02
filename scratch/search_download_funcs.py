import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'function' in l and ('download' in l or 'Plan' in l or 'Report' in l or 'Tool' in l):
        print(f"Line {i+1}: {l.rstrip()[:100]}")
