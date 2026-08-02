import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("=== SECTIONS IN INDEX.HTML ===")
sections = re.findall(r'<section[^>]*id=["\']([^"\']+)["\'][^>]*>', html)
for s in sections:
    print(" - Section ID:", s)

print("\n=== MODALS / PAGES IN INDEX.HTML ===")
modals = re.findall(r'<div[^>]*id=["\'](page-[^"\']+|mod-[^"\']+|.*modal.*)["\'][^>]*>', html)
for m in modals:
    print(" - Modal/Page ID:", m)
