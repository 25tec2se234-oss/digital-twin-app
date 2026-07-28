                    }
                });
            }
        });

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
            showToast('✅', 'Signed in successfully.');
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
        showToast('❌', err.message);
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
            body: JSON.stringify({ email: email, pa