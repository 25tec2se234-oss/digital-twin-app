import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The function usually looks like: if(!emailVar){setError("Please enter a valid email address.");return}
idx = content.find('Please enter a valid email address')
s = max(0, idx - 100)
e = min(len(content), idx + 200)
print(content[s:e])

# Signup
idx2 = content.find('Please fill in all fields to register.')
s2 = max(0, idx2 - 100)
e2 = min(len(content), idx2 + 200)
print('\n--- SIGNUP ---')
print(content[s2:e2])

# Forgot Password
idx3 = content.find('Please enter your registered email address.')
s3 = max(0, idx3 - 100)
e3 = min(len(content), idx3 + 200)
print('\n--- FORGOT ---')
print(content[s3:e3])

