import os
import re

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'id:"dtv-logo".*?src:"([^"]+)"', content)
if m:
    print("Normal logo:", m.group(1))

m2 = re.search(r'id:"dtv-logo-forgot".*?src:"([^"]+)"', content)
if m2:
    print("Forgot logo:", m2.group(1))
