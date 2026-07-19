import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('handleReactLogin')
    s = max(0, idx - 100)
    e = min(len(content), idx + 200)
    print(content[s:e])
