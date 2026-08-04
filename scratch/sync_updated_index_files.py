import shutil
import os

files = [
    ("public/index.html", "deploy-digital-twin/public/index.html"),
    ("public/blog/index.html", "deploy-digital-twin/public/blog/index.html"),
]

for src, dest in files:
    src_path = os.path.join(r"c:\Users\Kumar Kartikey\.vscode DTwin", src)
    dest_path = os.path.join(r"c:\Users\Kumar Kartikey\.vscode DTwin", dest)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    shutil.copyfile(src_path, dest_path)
    print(f"Synced {src} -> {dest}")
