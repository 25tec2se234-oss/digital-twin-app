import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = 0
while True:
    idx = content.find("showToast('?'", idx)
    if idx == -1: break
    s = max(0, idx - 100)
    e = min(len(content), idx + 100)
    print(f"Match at {idx}:")
    print(content[s:e])
    print('-'*20)
    idx += 1
