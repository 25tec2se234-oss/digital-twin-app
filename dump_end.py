import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("window.handleReactLogin = async function")
s = max(0, idx - 100)
e = min(len(content), idx + 2500)
with open('app_end.js', 'w', encoding='utf-8') as f:
    f.write(content[s:e])
