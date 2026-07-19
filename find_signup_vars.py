import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx2 = content.find('Please fill in all fields to register.')
s2 = max(0, idx2 - 50)
e2 = min(len(content), idx2 + 250)
print(content[s2:e2])
