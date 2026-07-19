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
    
    # 1. Remove Top Button
    btn_str = r_jsxs + '("button",{onClick:()=>window.parent.location.href="/index.html",className:"absolute top-2 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]}),'
    content = content.replace(btn_str, '')

    # 2. Add Button next to Remember Me
    # We find the start of the remember me div, and the end of it before signin-submit-btn
    import re
    # The div starts with r_jsxs('div',{className:"flex items-center gap-3 pt-2"
    pattern = r_jsxs + r'\("div",\{className:"flex items-center gap-3 pt-2",children:\[(.*?children:"Remember Me"\}\)\]\}\),' + r_jsxs + r'\("button",\{id:"signin-submit-btn"'
    
    def replacer(match):
        inner_content = match.group(1)
        new_btn = r_jsxs + '("button",{type:"button",onClick:()=>window.parent.location.href="/index.html",className:"flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]})'
        
        wrapper = r_jsxs + '("div",{className:"flex justify-between items-center pt-2 w-full",children:[' + r_jsxs + '("div",{className:"flex items-center gap-3",children:[' + inner_content + ']}),' + new_btn + ']})'
        
        return wrapper + ',' + r_jsxs + '("button",{id:"signin-submit-btn"'

    content = re.sub(pattern, replacer, content)

    # 3. For the Signup Page "Back to Home" button (if they navigate to signup view)
    # The signup page also has the same top button.
    # The signin page one was already replaced by the first .replace (or we can replace all occurrences).
    # Since we used .replace without limit, it removes ALL occurrences of the absolute top button! (Which is correct, both login and signup had it).
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched " + fp)
