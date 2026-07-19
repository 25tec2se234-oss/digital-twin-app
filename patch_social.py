import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Remove Social Buttons block
    is_m = 'm.jsxs' in content
    r_jsxs = 'm.jsxs' if is_m else 'd.jsxs'
    r_jsx = 'm.jsx' if is_m else 'd.jsx'
    
    start_str_social = r_jsxs + '("div",{className:"mt-6 relative",children:[' + r_jsx + '("div",{className:"absolute inset-0 flex items-center"'
    end_str_social = '2.98-1.41z"})})})]}),'
    
    idx_social = content.find(start_str_social)
    if idx_social != -1:
        idx_end_social = content.find(end_str_social, idx_social)
        if idx_end_social != -1:
            full_social_block = content[idx_social : idx_end_social + len(end_str_social)]
            content = content.replace(full_social_block, '')
            print(f"Removed social block from {os.path.basename(fp)}")
            
    # 2. Remove Demo Button block
    # It might look like: m.jsx("div",{className:"mt-4 text-center",children:m.jsx("button",{id:"demo-login-btn",type:"button",onClick:pl,className:"text-[11px] font-semibold text-[#dbb8ff]/60 hover:text-[#dbb8ff] hover:underline transition-all cursor-pointer"})}),
    # But let's just do a regex replacement to catch it safely.
    import re
    demo_pattern = r'\w\.jsx\("div",\{className:"mt-4 text-center",children:\w\.jsx\("button",\{id:"demo-login-btn".*?\}\)\}\),'
    
    demo_match = re.search(demo_pattern, content)
    if demo_match:
        content = content.replace(demo_match.group(0), '')
        print(f"Removed demo block from {os.path.basename(fp)}")

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
