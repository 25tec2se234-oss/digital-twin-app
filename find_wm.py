import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Restore Access')
# Search backwards to find the start of the function
idx_start = content.rfind('function', 0, idx)
s = max(0, idx_start)
e = min(len(content), idx + 2000)
print(content[s:e])
