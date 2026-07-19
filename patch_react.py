import os
import glob

# Search for the compiled js files
files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Remove Top "Back to Home" Buttons
    # It appears exactly as this:
    is_m = 'm.jsxs' in content
    r_jsxs = 'm.jsxs' if is_m else 'd.jsxs'
    r_jsx = 'm.jsx' if is_m else 'd.jsx'
    
    # We replace it with nothing.
    btn_str1 = r_jsxs + '("button",{onClick:()=>window.parent.location.href="/index.html",className:"absolute top-2 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[' + r_jsx + '("span",{className:"group-hover:-translate-x-1 transition-transform",children:"\u2190"})," Back to Home"]}),'
    
    # Sometimes it doesn't have a trailing comma if it's the only thing (unlikely since it's an array)
    content = content.replace(btn_str1, '')

    # 2. Patch SignIn
    # Original: F(""),B(o)
    # Target: F(""),window.parent.handleReactLogin(o,Y,C)
    # Wait! What is remember me?
    # In Hm: const[C,E]=hl.useState(!1) -> C is remember me!
    if 'F(""),B(o)}' in content:
        content = content.replace('F(""),B(o)}', 'F(""),window.parent.handleReactLogin(o,Y,C)}')
    elif 'F(""),B(o)' in content: # Just in case it's formatted slightly differently
        content = content.replace('F(""),B(o)', 'F(""),window.parent.handleReactLogin(o,Y,C)')

    # 3. Patch SignUp
    # Original: xl(""),O({fullName:B,email:H,mobileNumber:V,role:E,city:Q})}
    # Target: xl(""),window.parent.handleReactSignup(B,H,F,E,V,Q)}
    if 'xl(""),O({fullName:B,email:H,mobileNumber:V,role:E,city:Q})}' in content:
        content = content.replace('xl(""),O({fullName:B,email:H,mobileNumber:V,role:E,city:Q})}', 'xl(""),window.parent.handleReactSignup(B,H,F,E,V,Q)}')
    
    # 4. Patch ForgotPassword
    # Original: V(""),H(!0)}
    # Target: V(""),window.parent.handleReactForgotPassword(O).then(r=>{if(r&&r.success)H(!0)})}
    if 'V(""),H(!0)}' in content:
        content = content.replace('V(""),H(!0)}', 'V(""),window.parent.handleReactForgotPassword(O).then(r=>{if(r&&r.success)H(!0)})} ')

    if content != original_content:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {os.path.basename(fp)}")
    else:
        print(f"No changes for {os.path.basename(fp)}")

