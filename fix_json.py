import json
import os

files = [
    r"c:\Users\Kumar Kartikey\.vscode DTwin\extensions\ms-python.python-2026.4.0-win32-x64\out\client\package.json",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\extensions\ms-python.python-2026.4.0-win32-x64\package.json",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\extensions\ms-python.vscode-pylance-2026.2.1\package.json",
    r"c:\Users\Kumar Kartikey\.vscode DTwin\extensions\ms-vscode.cpptools-1.32.2-win32-x64\package.json"
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        if 'enabledApiProposals' in data:
            del data['enabledApiProposals']
            # Write back as minified json to match out/client/package.json, though indent=2 is also fine
            with open(f, 'w', encoding='utf-8') as file:
                json.dump(data, file)
            print(f"Fixed: {f}")
        else:
            print(f"No enabledApiProposals found in: {f}")
    else:
        print(f"File not found: {f}")
