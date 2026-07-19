import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('handleReactLogin')
if idx == -1:
    idx2 = content.find('Please enter your password')
    if idx2 != -1:
        s = max(0, idx2 - 350)
        e = min(len(content), idx2 + 50)
        print(content[s:e])
