import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('onClick:()=>bl("Apple")')
    s = max(0, idx - 50)
    e = min(len(content), idx + 800)
    print(content[s:e])
