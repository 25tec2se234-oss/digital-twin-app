import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('showToast')
if idx != -1:
    s = max(0, idx - 100)
    e = min(len(content), idx + 250)
    print("Found in app.js:")
    print(content[s:e])
