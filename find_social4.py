import os
import re

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where the block starts by looking for "Or continue with" and working backward slightly
    match = re.search(r'\w\.jsxs?\("div",\{className:"mt-6 relative".*?Or continue with.*?Apple.*?\}\)\}\)', content)
    
    if match:
        print("Found block of length:", len(match.group(0)))
        print("Starts with:", match.group(0)[:50])
        print("Ends with:", match.group(0)[-50:])
    else:
        print("Not found with regex")
