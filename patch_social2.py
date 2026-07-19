import os
import re
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Let's find the exact social block using a robust regex
    pattern = r'\w\.jsxs\("div",\{className:"mt-6 relative".*?id:"apple-signin-btn".*?\}\)\}\)\}\]\}\),'
    
    match = re.search(pattern, content)
    if match:
        content = content.replace(match.group(0), '')
        print(f"Removed social block from {os.path.basename(fp)}")
    else:
        # maybe it doesn't end with that exact string, let's try a softer match
        pattern2 = r'\w\.jsxs\("div",\{className:"mt-6 relative".*?id:"apple-signin-btn".*?\}\)\}\)\}\]\}\)'
        match2 = re.search(pattern2, content)
        if match2:
            content = content.replace(match2.group(0), '')
            print(f"Removed social block (no comma) from {os.path.basename(fp)}")
            # If there's a stray comma left over, we might have a syntax error.
            # We will run syntax check.

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
