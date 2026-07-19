import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        
        # Replace variations
        content = content.replace('Eco-Novators', 'DTV Family')
        content = content.replace('eco-novators', 'DTV Family')
        content = content.replace('Eco-novators', 'DTV Family')
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Replaced in {filepath}")
    except Exception as e:
        pass

# Traverse directories
for root, dirs, files in os.walk(r'c:\Users\Kumar Kartikey\.vscode DTwin'):
    # Exclude certain dirs
    dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules', '.gemini', 'my-app', 'digital-twin-project', 'digital-twin-v2', 'parent-portal', 'parent-ui')]
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.json', '.txt', '.md')):
            replace_in_file(os.path.join(root, file))

