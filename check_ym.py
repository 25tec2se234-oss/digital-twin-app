import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('Y=C=>{const b=')
    s = max(0, idx - 50)
    e = min(len(content), idx + 400)
    print(content[s:e])
