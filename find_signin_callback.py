import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Restore Access')
s = max(0, idx - 500)
e = min(len(content), idx + 100)
print(content[s:e])
