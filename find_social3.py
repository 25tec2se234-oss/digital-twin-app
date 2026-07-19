import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    start_str = 'm.jsxs("div",{className:"mt-6 relative",children:[m.jsx("div",{className:"absolute inset-0 flex items-center"'
    idx = content.find(start_str)
    print("Found start:", idx)
    
    if idx != -1:
        # We need to find the end of this block. It ends after the three buttons.
        # Let's search for the end of the apple button SVG path.
        apple_path_end = 'fill:"currentColor"})]})})]})'
        idx_end = content.find(apple_path_end, idx)
        
        if idx_end != -1:
            full_block = content[idx:idx_end + len(apple_path_end)]
            # Is there a comma after it?
            if content[idx_end + len(apple_path_end)] == ',':
                full_block += ','
                print("Found comma")
            
            print("Block length:", len(full_block))
            print("Starts with:", full_block[:50])
            print("Ends with:", full_block[-50:])
