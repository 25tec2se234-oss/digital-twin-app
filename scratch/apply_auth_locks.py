import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Applying Auth Locks to public/app.js...")

with open('public/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update openCareer
old_open_career = '''function openCareer(id) {
            var c = CAREERS.find(function(x) {
                return x.id === id;
            });'''
new_open_career = '''function openCareer(id) {
            if (!isLoggedIn()) {
                showToast('🔒', 'Please sign in to access Career Explorer & details.');
                openLoginPage();
                return;
            }
            var c = CAREERS.find(function(x) {
                return x.id === id;
            });'''

if old_open_career in code:
    code = code.replace(old_open_career, new_open_career)
    print("[OK] Secured openCareer")
else:
    print("[FAIL] Could not find openCareer signature")

# 2. Update openCareerSimulator
old_open_sim = '''function openCareerSimulator(id) {
    var c = CAREERS.find(function(x) { return x.id === id; });'''
new_open_sim = '''function openCareerSimulator(id) {
    if (!isLoggedIn()) {
        showToast('🔒', 'Please sign in to access Career Simulator.');
        openLoginPage();
        return;
    }
    var c = CAREERS.find(function(x) { return x.id === id; });'''

if old_open_sim in code:
    code = code.replace(old_open_sim, new_open_sim)
    print("[OK] Secured openCareerSimulator")
else:
    print("[FAIL] Could not find openCareerSimulator signature")

# 3. Update toggleDashboard & openDashboardShortcut
old_dash = '''function toggleDashboard(forceOpen) {
            var panel = document.getElementById('dashboard-panel');'''
new_dash = '''function toggleDashboard(forceOpen) {
            if (!isLoggedIn()) {
                showToast('🔒', 'Please sign in to access your Personalised Dashboard.');
                openLoginPage();
                return;
            }
            var panel = document.getElementById('dashboard-panel');'''

if old_dash in code:
    code = code.replace(old_dash, new_dash)
    print("[OK] Secured toggleDashboard")
else:
    print("[FAIL] Could not find toggleDashboard signature")

old_dash_sc = '''function openDashboardShortcut() {
            setDashboardOpen(true, true);
        }'''
new_dash_sc = '''function openDashboardShortcut() {
            if (!isLoggedIn()) {
                showToast('🔒', 'Please sign in to access your Personalised Dashboard.');
                openLoginPage();
                return;
            }
            setDashboardOpen(true, true);
        }'''

if old_dash_sc in code:
    code = code.replace(old_dash_sc, new_dash_sc)
    print("[OK] Secured openDashboardShortcut")
else:
    print("[FAIL] Could not find openDashboardShortcut signature")

# 4. Update togChat
old_tog_chat = '''function togChat() {
            chatOpen = !chatOpen;'''
new_tog_chat = '''function togChat() {
            if (!isLoggedIn()) {
                showToast('🔒', 'Please sign in to access AI Mentor & Advisor.');
                openLoginPage();
                return;
            }
            chatOpen = !chatOpen;'''

if old_tog_chat in code:
    code = code.replace(old_tog_chat, new_tog_chat)
    print("[OK] Secured togChat")
else:
    print("[FAIL] Could not find togChat signature")

# 5. Update downloadStudentPlan
old_dl_plan = '''async function downloadStudentPlan() {
            ensureStudentDefaults();'''
new_dl_plan = '''async function downloadStudentPlan() {
            if (!isLoggedIn()) {
                showToast('🔒', 'Please sign in to download your custom study plan.');
                openLoginPage();
                return;
            }
            ensureStudentDefaults();'''

if old_dl_plan in code:
    code = code.replace(old_dl_plan, new_dl_plan)
    print("[OK] Secured downloadStudentPlan")
else:
    print("[FAIL] Could not find downloadStudentPlan signature")

# 6. Update downloadReportCard
old_dl_card = '''async function downloadReportCard() {
    var loggedIn = window.APP_DATA && window.APP_DATA.userData && window.APP_DATA.userData.token;
    if (!loggedIn) {
        if (typeof showToast === 'function') showToast('⚠️', 'Please log in to generate report card.');
        return;
    }'''
new_dl_card = '''async function downloadReportCard() {
    if (!isLoggedIn()) {
        if (typeof showToast === 'function') showToast('🔒', 'Please sign in to generate and download your report card.');
        openLoginPage();
        return;
    }'''

if old_dl_card in code:
    code = code.replace(old_dl_card, new_dl_card)
    print("[OK] Secured downloadReportCard")
else:
    print("[FAIL] Could not find downloadReportCard signature")

# 7. Add Hash Router Guard & Hash Interceptor
hash_guard = '''
        function checkProtectedHashRoutes() {
            var hash = window.location.hash;
            var protectedPrefixes = ['#student-dashboard', '#ai-section', '#analyzer-promo', '#dashboard'];
            var isProtected = protectedPrefixes.some(function(p) { return hash === p || hash.startswith(p + '/'); });
            if (isProtected && !isLoggedIn()) {
                window.location.hash = '';
                showToast('🔒', 'Please sign in to access premium feature sections.');
                openLoginPage();
                return false;
            }
            return true;
        }

        window.addEventListener('hashchange', checkProtectedHashRoutes);
'''

if 'checkProtectedHashRoutes' not in code:
    code = code + "\n" + hash_guard
    print("[OK] Added checkProtectedHashRoutes")

with open('public/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved public/app.js")

# Sync to dist
with open('public/dist/app.71f51bc7.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Synced to public/dist/app.71f51bc7.js")
