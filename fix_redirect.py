import os
import glob
import re

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Find onSignInClick variable
    match = re.search(r'function [a-zA-Z_]\w*\(\{onSignInClick:([a-zA-Z_]\w*)\}\)', content)
    if match:
        signInVar = match.group(1)
        
        # Replace the old document.getElementById code with signInVar()
        old_code = 'if(document.getElementById("btn-back-to-login")) document.getElementById("btn-back-to-login").click();'
        new_code = f'{signInVar}();'
        
        content = content.replace(old_code, new_code)
        
    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {os.path.basename(fp)} with {signInVar}()")

