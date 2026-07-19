import os

def search_files(directory, search_str):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if file.endswith('.js') or file.endswith('.html'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        if search_str in f.read():
                            print(f"Found in {path}")
                except Exception:
                    pass

search_files(r'c:\Users\Kumar Kartikey\.vscode DTwin', 'handleReactLogin')
