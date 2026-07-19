import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('Quantum Signal Sent')
    if idx != -1:
        s = max(0, idx - 100)
        e = min(len(content), idx + 800)
        print(f"Found in {os.path.basename(fp)}:")
        print(content[s:e])
        print('-'*50)
