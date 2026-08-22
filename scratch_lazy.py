import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    def repl(m):
        tag = m.group(0)
        # Don't add lazy loading to high priority images (heroes, logos)
        if 'fetchpriority="high"' in tag or 'fetchpriority=\'high\'' in tag:
            return tag
            
        if 'loading="lazy"' not in tag and "loading='lazy'" not in tag:
            tag = tag.replace('<img ', '<img loading="lazy" decoding="async" ')
        return tag

    new_content = re.sub(r'<img\s+[^>]*>', repl, content, flags=re.IGNORECASE)

    if original != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def walk_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    walk_dir('public')
