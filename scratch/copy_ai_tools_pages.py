import shutil
import os

src = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\ai-tools-for-students\index.html"
targets = [
    r"c:\Users\Kumar Kartikey\.vscode DTwin\public\ai-tools-for-students.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\ai-tools-for-students\index.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\ai-tools-for-students.html"
]

for target in targets:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copyfile(src, target)
    print(f"Copied to: {target}")
