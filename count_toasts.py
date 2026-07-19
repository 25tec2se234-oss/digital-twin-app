import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Q marks:", content.count("showToast('?'"))
print("Full 1:", content.count("showToast('?', 'Signed in successfully.')"))
print("Full 2:", content.count("showToast('?', err.message)"))
