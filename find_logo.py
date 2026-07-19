import os
files = os.listdir(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets') + os.listdir(r'c:\Users\Kumar Kartikey\.vscode DTwin\public')
logos = [f for f in files if 'logo' in f.lower()]
print("Logos:", logos)
