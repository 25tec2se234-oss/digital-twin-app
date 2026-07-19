import os
import glob
import re

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Let's match from m.jsxs("div",{className:"mt-6 relative" up to the Apple svg end
    # We will use re.DOTALL just in case, though there shouldn't be newlines in minified JS
    pattern = r'\w\.jsxs\("div",\{className:"mt-6 relative".*?Or continue with.*?2\.98-1\.41z"\})\})\})\}\]\}\),'
    
    match = re.search(pattern, content)
    if match:
        content = content.replace(match.group(0), '')
        print(f"Removed social from {os.path.basename(fp)}")
    else:
        # maybe no comma?
        pattern2 = r'\w\.jsxs\("div",\{className:"mt-6 relative".*?Or continue with.*?2\.98-1\.41z"\})\})\})\}\]\}\)'
        match2 = re.search(pattern2, content)
        if match2:
            content = content.replace(match2.group(0), '')
            print(f"Removed social from {os.path.basename(fp)} (no comma)")

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
