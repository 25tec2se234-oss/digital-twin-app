# -*- coding: utf-8 -*-
import os
import re

# The pattern to match the copyright string, allowing for newlines and spaces
pattern = re.compile(
    r'(\u00A9\s*2026\s+)DTV Family(\.\s*All rights reserved\.\s*Digital Twin Verse for Students\u2122\s*is a product of\s*)DTV Family\.',
    re.IGNORECASE | re.DOTALL
)

# Also match the string if they don't have the dot at the end
pattern2 = re.compile(
    r'(\u00A9\s*2026\s+)DTV Family(\.\s*All rights reserved\.\s*Digital Twin Verse for Students\u2122\s*is a product of\s*)DTV Family(?!\.)',
    re.IGNORECASE | re.DOTALL
)

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        
        # Replace
        content = pattern.sub(r'\1DTV\2DTV Team.', content)
        content = pattern2.sub(r'\1DTV\2DTV Team', content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Replaced in {filepath}")
    except Exception as e:
        pass

for root, dirs, files in os.walk(r'c:\Users\Kumar Kartikey\.vscode DTwin'):
    dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules', '.gemini', 'my-app', 'digital-twin-project', 'digital-twin-v2', 'parent-portal', 'parent-ui')]
    for file in files:
        if file.endswith(('.html', '.js')):
            replace_in_file(os.path.join(root, file))

