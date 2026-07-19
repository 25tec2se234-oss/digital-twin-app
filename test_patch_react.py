import os
import re

with open(r'c:\Users\Kumar Kartikey\.vscode DTwin\public\assets\index-hiuy2iTq.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the logo
logo_pattern = r'(id:"dtv-logo-forgot".*?src:")https://lh3[^"]+(")'
content = re.sub(logo_pattern, r'\1https://digitaltwinvrs.com/img/dtv-logo.jpg\2', content)

# Pattern to find the success div: o?m.jsxs("div",{...}):m.jsxs("form",{onSubmit:C
# We need to capture the React factory variable (m, d, etc), the state variable for email (O), the state setter for isSuccess (H)
# and the function for onSignInClick (_)
success_pattern = r'\?\s*([a-zA-Z_]\w*)\.jsxs\("div",\{className:"text-center space-y-4 py-4 relative z-10",children:\[.*?"Quantum Signal Sent!".*?strong",\{className:"text-white",children:([a-zA-Z_]\w*)\}\).*?onClick:\(\)=>([a-zA-Z_]\w*)\(!1\).*?\}\]\}\):'

match = re.search(success_pattern, content)
if match:
    m_var = match.group(1)
    email_var = match.group(2)
    setSuccess_var = match.group(3)
    
    print(f"Match found! Factory: {m_var}, Email: {email_var}, setSuccess: {setSuccess_var}")
    
    # Replacement string
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
    
    # We will need to remove all newlines from new_form for safety in minified code
    new_form = new_form.replace('\n', '').replace('    ', '')
    
    # Replace the exact matched substring
    new_content = content[:match.start()] + new_form + content[match.end():]
    
    # We need to make sure tn-back-to-login is clickable. Let's see what the Back to Sign In button's ID is.
    print(f"Replaced successfully in memory. Length before: {len(content)}, Length after: {len(new_content)}")
else:
    print("No match found for success pattern!")
