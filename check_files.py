import os

public_dir = r'c:\Users\Kumar Kartikey\.vscode DTwin\public'
files = ['robots.txt', 'sitemap.xml']

for file in files:
    fp = os.path.join(public_dir, file)
    print(f"{file} exists: {os.path.exists(fp)}")
