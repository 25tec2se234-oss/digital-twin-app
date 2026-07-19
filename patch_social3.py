import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Social block
    start_social = 'm.jsxs("div",{className:"mt-6 relative",children:[m.jsx("div",{className:"absolute inset-0 flex items-center"'
    end_social = '2.98-1.41z"})})})]}),'
    
    idx1 = content.find(start_social)
    if idx1 != -1:
        idx2 = content.find(end_social, idx1)
        if idx2 != -1:
            block = content[idx1:idx2+len(end_social)]
            content = content.replace(block, '')
            print(f"Removed social from {os.path.basename(fp)}")

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
