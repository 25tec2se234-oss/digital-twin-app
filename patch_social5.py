import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    idx_or = content.find('Or continue with')
    
    if idx_or != -1:
        # Search backwards for the start of this block
        # We know it starts with m.jsxs("div",{className:"mt-6 relative"
        idx_start = content.rfind('m.jsxs("div",{className:"mt-6 relative"', 0, idx_or)
        if idx_start == -1:
            idx_start = content.rfind('d.jsxs("div",{className:"mt-6 relative"', 0, idx_or)
            
        if idx_start != -1:
            # Now find the end of the Apple button SVG
            idx_end = content.find('2.98-1.41z"', idx_or)
            if idx_end != -1:
                # Need to find the end of the block...
                # 2.98-1.41z"})})})]}),
                end_str = '2.98-1.41z"})})})]}),'
                if content.startswith(end_str, idx_end):
                    full_block = content[idx_start:idx_end + len(end_str)]
                    content = content.replace(full_block, '')
                    print(f"Removed social block from {os.path.basename(fp)}")
                else:
                    # Maybe no comma
                    end_str2 = '2.98-1.41z"})})})]})'
                    if content.startswith(end_str2, idx_end):
                        full_block = content[idx_start:idx_end + len(end_str2)]
                        content = content.replace(full_block, '')
                        print(f"Removed social block from {os.path.basename(fp)} (no comma)")
                    else:
                        print(f"Could not find exact end string in {os.path.basename(fp)}")
        else:
            print(f"Could not find start in {os.path.basename(fp)}")

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
