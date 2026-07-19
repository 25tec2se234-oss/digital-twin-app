import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Before:", content.count("showToast('?'"))

content = content.replace("showToast('?', 'Signed in successfully.')", "showToast('?', 'Signed in successfully.')")
content = content.replace("showToast('?', err.message)", "showToast('?', err.message)")
content = content.replace("showToast('?', 'Account created and signed in successfully.')", "showToast('?', 'Account created and signed in successfully.')")
content = content.replace("showToast('?', 'Reset instructions sent to ' + email)", "showToast('?', 'Reset instructions sent to ' + email)")

print("After:", content.count("showToast('?'"))

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'w', encoding='utf-8') as f:
    f.write(content)
