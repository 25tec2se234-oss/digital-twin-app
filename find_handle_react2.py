import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\*.html') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\*.html')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('handleReactLogin')
    if idx != -1:
        s = max(0, idx - 150)
        e = min(len(content), idx + 400)
        print(f"Found in {os.path.basename(fp)}:")
        print(content[s:e])
        print('-'*20)
