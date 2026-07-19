import os
import shutil

app_js_path = r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js'
deploy_app_js_path = r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\app.js'

if os.path.exists(deploy_app_js_path):
    shutil.copy2(app_js_path, deploy_app_js_path)
    print("Copied app.js to deploy-digital-twin")
else:
    print("deploy-digital-twin app.js does not exist")
