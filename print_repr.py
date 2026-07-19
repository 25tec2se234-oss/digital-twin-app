import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("showToast('?'")
s = max(0, idx)
e = min(len(content), idx + 50)
print(repr(content[s:e]))
