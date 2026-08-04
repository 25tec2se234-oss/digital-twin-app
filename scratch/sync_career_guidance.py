import shutil
import os

src = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\career-guidance-after-12th.html"
targets = [
    r"c:\Users\Kumar Kartikey\.vscode DTwin\public\career-guidance-after-12th\index.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\career-guidance-after-12th.html",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\career-guidance-after-12th\index.html"
]

for t in targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    shutil.copyfile(src, t)
    print(f"Synced -> {t}")
