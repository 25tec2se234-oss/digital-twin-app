import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('handleReactLogin')
print(f"handleReactLogin found in index-DBKbgKa1.js: {idx != -1}")

idx2 = content.find('handleReactSignup')
print(f"handleReactSignup found in index-DBKbgKa1.js: {idx2 != -1}")

