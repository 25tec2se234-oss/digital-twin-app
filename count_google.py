import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = 0
    while True:
        idx = content.find('Google', idx)
        if idx == -1: break
        s = max(0, idx - 100)
        e = min(len(content), idx + 100)
        print(f"Match in {os.path.basename(fp)} at {idx}:")
        print(content[s:e])
        print('-'*50)
        idx += 1
