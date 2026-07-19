import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('M15.97 4.17c.66')
    s = max(0, idx - 50)
    e = min(len(content), idx + 200)
    print(content[s:e])
