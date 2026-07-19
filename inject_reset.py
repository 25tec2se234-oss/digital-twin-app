import os

js_code = """
window.handleReactResetPassword = async function(email, otpCode, newPassword) {
    try {
        var res = await fetch('/api/v1/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otpCode, newPassword })
        });
        if (res.ok) {
            showToast('?', 'Password reset successfully. You can now login.');
            return { success: true };
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Failed to reset password.');
        }
    } catch (err) {
        showToast('?', err.message);
        return { success: false, error: err.message };
    }
};
"""

app_js_path = r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js'
with open(app_js_path, 'a', encoding='utf-8') as f:
    f.write(js_code)

print("Appended handleReactResetPassword to app.js")
