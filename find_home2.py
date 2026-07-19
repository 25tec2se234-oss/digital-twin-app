import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = 0
    while True:
        idx = content.find('" Back to Home"]', start_idx)
        if idx == -1:
            break
        print(f"Found at: {idx}")
        start_idx = idx + 1
        
        s = max(0, idx - 300)
        e = min(len(content), idx + 20)
        print(content[s:e])
