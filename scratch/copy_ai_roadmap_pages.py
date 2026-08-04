import shutil
import os

src = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\ai-career-roadmap\index.html"
targets = [
    r"c:\Users\Kumar Kartikey\.vscode DTwin\public\ai-career-roadmap.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\ai-career-roadmap\index.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\ai-career-roadmap.html"
]

for target in targets:
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copyfile(src, target)
    print(f"Copied to: {target}")
