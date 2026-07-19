import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find("showToast(")
idx2 = content.find("'", idx)
idx3 = content.find("'", idx2 + 1)
char = content[idx2+1:idx3]
print(f"Char: {char}, Code: {ord(char)}")
