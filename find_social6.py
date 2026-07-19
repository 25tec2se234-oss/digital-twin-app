import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('Or continue with')
    s = max(0, idx - 150)
    e = min(len(content), idx + 2100)
    # let's look closer to the end
    s2 = idx + 1800
    e2 = min(len(content), idx + 2600)
    print(content[s2:e2])
