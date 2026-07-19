import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js',
    r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-hiuy2iTq.js',
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-DBKbgKa1.js',
    r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-DBKbgKa1.js'
]

for fp in files:
    if not os.path.exists(fp):
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    is_m = 'm.jsxs' in content
    r_jsxs = 'm.jsxs' if is_m else 'd.jsxs'
    r_jsx = 'm.jsx' if is_m else 'd.jsx'
    
    # 1. Remove Top Button (First occurrence only, which is in SignIn)
    btn_str = r_jsxs + '("button",{onClick:()=>window.parent.location.href="/index.html",className:"absolute top-2 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]}),'
    
    if btn_str in content:
        content = content.replace(btn_str, '', 1)
    
    # 2. Add Button next to Remember Me
    start_marker = r_jsxs + '("div",{className:"flex items-center gap-3 pt-2",children:['
    end_marker = r_jsxs + '("button",{id:"signin-submit-btn"'

    start_idx = content.find(start_marker)
    if start_idx != -1:
        end_idx = content.find(end_marker, start_idx)
        
        between = content[start_idx + len(start_marker):end_idx]
        if between.endswith(']}),'):
            inner_content = between[:-4]
            
            new_btn = r_jsxs + '("button",{type:"button",onClick:()=>window.parent.location.href="/index.html",className:"flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]})'
            
            wrapper = r_jsxs + '("div",{className:"flex justify-between items-center pt-2 w-full",children:[' + r_jsxs + '("div",{className:"flex items-center gap-3",children:[' + inner_content + ']}),' + new_btn + ']})'
            
            content = content[:start_idx] + wrapper + ',' + content[end_idx:]
        else:
            print("Failed to match between for " + fp)

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched " + fp)
