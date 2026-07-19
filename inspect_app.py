import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('handleReactLogin')
s = max(0, idx - 100)
e = min(len(content), idx + 800)
print(content[s:e])
