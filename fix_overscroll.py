import os

target = "overscroll-behavior-y: none;"
replacement = "overscroll-behavior-y: auto;"
updated = 0

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.css'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if target in content:
                    content = content.replace(target, replacement)
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {path}")
                    updated += 1
            except Exception as e:
                print(f"Error {path}: {e}")

print(f"Total CSS files updated: {updated}")
