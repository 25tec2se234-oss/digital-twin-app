import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('" Back to Home"]')
    print(idx)
    if idx != -1:
        start_idx = max(0, idx - 500)
        end_idx = min(len(content), idx + 100)
        print(content[start_idx:end_idx])
