import os

code_to_append = """

// --- REACT LOGIN BRIDGE ---

window.handleReactLogin = async function(email, pass, rememberMe) {
    try {
        var res = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Login failed');
        
        APP_DATA.userData.id = data.user.id;
        APP_DATA.userData.token = data.accessToken;
        APP_DATA.userData.name = data.user.name;
        APP_DATA.userData.email = data.user.email;
        APP_DATA.userData.role = data.user.role;
        APP_DATA.userData.emailVerified = data.user.emailVerified;
        APP_DATA.userData.linkCode = data.user.linkCode || null;
        APP_DATA.userData.trialExpiresAt = data.user.trialExpiresAt || null;
        APP_DATA.userData.subscriptionExpiresAt = data.user.subscriptionExpiresAt || null;
        APP_DATA.userData.rememberMe = rememberMe;
        setLoggedIn(true);
        loginGateActive = false;
        
        if (!data.user.emailVerified) {
            openOTPModal();
        } else {
            closeMod();
            unlockSite();
            window.trackAnalyticsEvent('Login Success', { email: email });
            showToast('?', 'Signed in successfully.');
            if (typeof window.pendingAuthAction === 'function') {
                window.pendingAuthAction();
                window.pendingAuthAction = null;
            }
            var pendingPlan = sessionStorage.getItem('pending_payment_plan');
            if (pendingPlan) {
                sessionStorage.removeItem('pending_payment_plan');
                setTimeout(function() { initiatePayment(pendingPlan); }, 800);
            }
        }
        return { success: true };
    } catch (err) {
        window.trackAnalyticsEvent('Login Failure', { error: err.message, email: email });
        showToast('?', err.message);
        return { success: false, error: err.message };
    }
};

window.handleReactSignup = async function(name, email, pass, role, phone, city) {
    APP_DATA.userData.phone = phone || '';
    APP_DATA.userData.role = role || 'Student';
    APP_DATA.userData.city = city || '';
    syncData();
    
    try {
        var res = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass, name: name })
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');
        
        // Formspree submission silently fallback
        fetch('https://formspree.io/f/' + CFG.formspreeId, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: 'New Sign Up - ' + name,
                Name: name, Email: email, Phone: APP_DATA.userData.phone,
                Role: APP_DATA.userData.role, City: APP_DATA.userData.city
            })
        }).catch(function(){});

        APP_DATA.userData.id = data.user.id;
        APP_DATA.userData.token = data.accessToken;
        APP_DATA.userData.name = data.user.name;
        APP_DATA.userData.email = data.user.email;
        APP_DATA.userData.role = data.user.role;
        APP_DATA.userData.emailVerified = data.user.emailVerified;
        APP_DATA.userData.trialExpiresAt = data.user.trialExpiresAt || null;
        APP_DATA.userData.subscriptionExpiresAt = data.user.subscriptionExpiresAt || null;
        APP_DATA.userData.rememberMe = false;
        setLoggedIn(true);
        loginGateActive = false;
        
        if (!data.user.emailVerified) {
            openOTPModal();
        } else {
            closeMod();
            unlockSite();
            window.trackAnalyticsEvent('Signup Conversion', { role: APP_DATA.userData.role });
            showToast('?', 'Account created and signed in successfully.');
            if (typeof window.pendingAuthAction === 'function') {
                window.pendingAuthAction();
                window.pendingAuthAction = null;
            }
            var pendingPlan = sessionStorage.getItem('pending_payment_plan');
            if (pendingPlan) {
                sessionStorage.removeItem('pending_payment_plan');
                setTimeout(function() { initiatePayment(pendingPlan); }, 800);
            }
        }
        return { success: true };
    } catch (err) {
        showToast('?', err.message);
        return { success: false, error: err.message };
    }
};

window.handleReactForgotPassword = async function(email) {
    try {
        const res = await fetch('/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (res.ok) {
            showToast('?', 'Reset instructions sent to ' + email);
            return { success: true };
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Failed to send reset link.');
        }
    } catch (err) {
        showToast('?', err.message);
        return { success: false, error: err.message };
    }
};
"""

files = [
    r'c:\Users\Kumar Kartikey\.vscode DTwin\public\app.js',
    r'c:\Users\Kumar Kartikey\.vscode DTwin\deploy-digital-twin\public\app.js'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'window.handleReactLogin' not in content:
        with open(file, 'a', encoding='utf-8') as f:
            f.write(code_to_append)
            print(f"Appended to {file}")
    else:
        print(f"Already appended to {file}")
