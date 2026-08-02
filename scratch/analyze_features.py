import os
import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("--- ONCLICK HANDLERS IN index.html ---")
matches = re.findall(r'onclick=["\']([^"\']+)["\']', html)
for m in sorted(set(matches)):
    print(" -", m)

print("\n--- NAV & FEATURE HREF LINKS ---")
hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)
for h in sorted(set(hrefs)):
    if h.startswith('#') or 'html' in h or 'javascript' in h:
        print(" -", h)
