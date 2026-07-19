import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Restore Access')
s = max(0, idx - 800)
e = min(len(content), idx + 200)
print(content[s:e])
