import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('handleReactLogin')
s = max(0, idx + 800)
e = min(len(content), idx + 1500)
print(content[s:e])
