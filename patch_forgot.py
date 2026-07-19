import os
import glob
import re

files = glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-*.js') + \
        glob.glob(r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\assets\index-*.js')

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Replace logo
    logo_pattern = r'(id:"dtv-logo-forgot".*?src:")https://lh3[^"]+(")'
    content = re.sub(logo_pattern, r'\1https://digitaltwinvrs.com/img/dtv-logo.jpg\2', content)

    # 2. Replace OTP UI
    idx = content.find('Quantum Signal Sent!')
    if idx != -1:
        s = content.rfind('?', 0, idx)
        # Find the end which is }):m.jsxs("form"
        # We need to find the specific m.jsxs("form" after idx
        e_match = re.search(r'\}\):([a-zA-Z_]\w*)\.jsxs\("form"', content[idx:])
        if e_match:
            e = idx + e_match.start() + 3  # up to }):
            
            old_str = content[s:e]
            # print("Found old str:", old_str[:100], "...", old_str[-50:])
            
            # Extract variables
            # It starts with ?m.jsxs("div"
            m_var = re.search(r'\?([a-zA-Z_]\w*)\.jsxs', old_str).group(1)
            # Find email var from children:O
            email_var = re.search(r'children:([a-zA-Z_]\w*)\}\)', old_str).group(1)
            # Find setSuccess var from onClick:()=>H(!1)
            setSuccess_var = re.search(r'onClick:\(\)=>([a-zA-Z_]\w*)\(!1\)', old_str).group(1)
            
            new_form = f'''?{m_var}.jsxs("form", {{
        onSubmit: (e) => {{
            e.preventDefault();
            const otp = document.getElementById("reset-otp").value;
            const pwd = document.getElementById("reset-pwd").value;
            if(!otp || !pwd) return;
            window.parent.handleReactResetPassword({email_var}, otp, pwd).then(r => {{
                if(r && r.success) {{
                    {setSuccess_var}(!1);
                    if(document.getElementById("btn-back-to-login")) document.getElementById("btn-back-to-login").click();
                }}
            }});
        }},
        className: "space-y-4 py-4 relative z-10 flex flex-col",
        children: [
            {m_var}.jsx("h3", {{className: "text-lg font-bold text-white text-center", children: "Enter OTP & New Password"}}),
            {m_var}.jsxs("p", {{className: "text-xs text-[#cbc3d7] text-center mb-4", children: ["We sent an OTP to ", {m_var}.jsx("strong", {{className: "text-white", children: {email_var}}})]}}),
            {m_var}.jsx("input", {{id: "reset-otp", required: !0, type: "text", placeholder: "Enter 6-digit OTP", className: "glass-input w-full rounded-lg py-3 px-4 text-white bg-black/60 border border-[#d4af37]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all mb-4"}}),
            {m_var}.jsx("input", {{id: "reset-pwd", required: !0, minLength: 6, type: "password", placeholder: "Enter new password", className: "glass-input w-full rounded-lg py-3 px-4 text-white bg-black/60 border border-[#d4af37]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all mb-4"}}),
            {m_var}.jsx("button", {{type: "submit", className: "w-full py-3 px-4 bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a030] hover:to-[#e4d59b] text-black font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)] mb-4", children: "Verify & Reset Password"}}),
            {m_var}.jsx("button", {{type: "button", onClick: () => {setSuccess_var}(!1), className: "text-xs text-[#d4af37] hover:underline w-full text-center mt-2", children: "Try a different email address"}})
        ]
    }}):'''
            new_form = new_form.replace('\n', '').replace('    ', '')
            
            content = content.replace(old_str, new_form)
            
    if content != original:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Successfully patched {os.path.basename(fp)}")

