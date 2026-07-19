import os

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js',
]

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    is_m = 'm.jsxs' in content
    r_jsxs = 'm.jsxs' if is_m else 'd.jsxs'
    r_jsx = 'm.jsx' if is_m else 'd.jsx'
    
    btn_str = r_jsxs + '("button",{onClick:()=>window.parent.location.href="/index.html",className:"absolute top-2 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]}),'
    
    print("Found Top Buttons:", content.count(btn_str))
