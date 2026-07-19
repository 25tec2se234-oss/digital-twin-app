import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    count = content.count('Or continue with')
    print(f"{os.path.basename(fp)} has {count} instances of 'Or continue with'")
