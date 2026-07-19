import os
import re

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Restore Access')
s = content.rfind('function ', 0, idx)
e = min(len(content), idx + 100)
print(content[s:e])
