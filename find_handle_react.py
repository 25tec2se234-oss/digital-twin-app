import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('handleReactLogin')
if idx != -1:
    s = max(0, idx - 150)
    e = min(len(content), idx + 800)
    print(content[s:e])
