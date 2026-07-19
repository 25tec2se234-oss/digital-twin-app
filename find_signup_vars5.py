import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function Bm(')
if idx != -1:
    s = max(0, idx)
    e = min(len(content), idx + 450)
    print(content[s:e])
