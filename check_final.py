import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

s1 = "showToast('?', 'Signed in successfully.');"
print("s1 with check found:", s1 in content)
