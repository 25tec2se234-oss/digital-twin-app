import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("showToast('?'")
print(f"showToast('?' found: {idx != -1}")
