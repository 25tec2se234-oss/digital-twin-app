import os
import re

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace specifically
content = re.sub(r"showToast\('\?', 'Signed in successfully.'\)", r"showToast('?', 'Signed in successfully.')", content)
content = re.sub(r"showToast\('\?', err\.message\)", r"showToast('?', err.message)", content)
content = re.sub(r"showToast\('\?', 'Account created", r"showToast('?', 'Account created", content)
content = re.sub(r"showToast\('\?', 'Reset instructions sent", r"showToast('?', 'Reset instructions sent", content)

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replaced")
