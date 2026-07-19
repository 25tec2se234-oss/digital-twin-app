import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    print("handleReactLogin found:", 'handleReactLogin' in content)
    print("handleReactSignup found:", 'handleReactSignup' in content)
    print("handleReactForgotPassword found:", 'handleReactForgotPassword' in content)
