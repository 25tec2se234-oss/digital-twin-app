import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    idx = content.find('window.handleReactLogin')
    print(content[idx:idx+1500])

