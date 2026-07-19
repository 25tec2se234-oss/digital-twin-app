import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('Back to Home')
    if idx != -1:
        s = max(0, idx - 50)
        e = min(len(content), idx + 50)
        print(f"In {os.path.basename(fp)}:")
        print(content[s:e])
        print('-'*20)
