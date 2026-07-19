import os
import glob

# 1. Fix app.js
app_js_path = r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

app_js = app_js.replace("showToast('?', 'Signed in successfully.')", "showToast('?', 'Signed in successfully.')")
app_js = app_js.replace("showToast('?', err.message)", "showToast('?', err.message)")
app_js = app_js.replace("showToast('?', 'Account created and signed in successfully.')", "showToast('?', 'Account created and signed in successfully.')")
app_js = app_js.replace("showToast('?', 'Reset instructions sent to ' + email)", "showToast('?', 'Reset instructions sent to ' + email)")

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Patched app.js")

# 2. Fix JS chunks
files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    content = content.replace('children:"?"})," Back to Home"', 'children:""})," Back to Home"')
    
    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {os.path.basename(fp)}")

