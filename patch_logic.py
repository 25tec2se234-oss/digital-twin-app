import os
import glob

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. SignIn
    old_signin = 'K(""),rl(!0),setTimeout(()=>{rl(!1),Rl(!0),setTimeout(()=>{B(o)},900)},400)}'
    new_signin = 'K(""),window.parent.handleReactLogin(o,Y,b)}'
    content = content.replace(old_signin, new_signin)
    
    # 2. SignUp
    old_signup = 'Al(""),cl(!0),setTimeout(()=>{cl(!1),tl(!0),setTimeout(()=>{j({fullName:B,email:H,mobileNumber:J,role:E,city:Q})},900)},400)}'
    new_signup = 'Al(""),window.parent.handleReactSignup(B,H,K,E,J,Q)}'
    content = content.replace(old_signup, new_signup)
    
    # 3. Forgot Password
    old_forgot = 'J(""),H(!0)}'
    new_forgot = 'J(""),window.parent.handleReactForgotPassword(j).then(r=>{if(r&&r.success)H(!0)})}'
    content = content.replace(old_forgot, new_forgot)

    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully patched {os.path.basename(fp)}")
