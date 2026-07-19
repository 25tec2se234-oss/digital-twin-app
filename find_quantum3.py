import os
import re

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('Quantum Signal Sent')
s = content.rfind('?', 0, idx)
e = content.find('}):m.jsxs("form"', idx) + 16

print(content[s:e])
