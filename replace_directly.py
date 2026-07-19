import os

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

s1 = "showToast('?', 'Signed in successfully.');"
print("s1 found:", s1 in content)

if s1 in content:
    content = content.replace(s1, "showToast('?', 'Signed in successfully.');")
    
s2 = "showToast('?', err.message);"
print("s2 found:", s2 in content)
if s2 in content:
    content = content.replace(s2, "showToast('?', err.message);")

s3 = "showToast('?', 'Account created and signed in successfully.');"
print("s3 found:", s3 in content)
if s3 in content:
    content = content.replace(s3, "showToast('?', 'Account created and signed in successfully.');")
    
s4 = "showToast('?', 'Reset instructions sent to ' + email);"
print("s4 found:", s4 in content)
if s4 in content:
    content = content.replace(s4, "showToast('?', 'Reset instructions sent to ' + email);")

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'w', encoding='utf-8') as f:
    f.write(content)
