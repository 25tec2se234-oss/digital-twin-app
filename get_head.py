import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

head_end = content.find('</head>')
if head_end != -1:
    print(content[:head_end+7])

