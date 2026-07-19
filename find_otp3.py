import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('function openOTPModal')
s = max(0, idx - 100)
e = min(len(content), idx + 1500)
print(content[s:e])
