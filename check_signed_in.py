import os
import glob
import re

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'.{0,100}Signed In.{0,100}', content, re.IGNORECASE)
    if match:
        print(f"Found in {os.path.basename(fp)}:")
        print(match.group(0))
        print('-'*50)
