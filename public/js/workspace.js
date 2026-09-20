/**
 * Digital Twin Verse - Workspace Controller
 * Handles the separation between the Public Marketing Website and the Authenticated User Workspace.
 */

(function() {
    // Inject required CSS rules for workspace state toggling
    var style = document.createElement('style');
    style.innerHTML = '\
        body.workspace-public [data-workspace="auth"] { display: none !important; }\
        body.workspace-auth [data-workspace="public"] { display: none !important; }\
        #workspace-loader {\
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;\
            background-color: var(--bg, #0B0E14); z-index: 999999;\
            display: flex; align-items: center; justify-content: center;\
            flex-direction: column; transition: opacity 0.3s ease;\
        }\
        #workspace-loader.hidden { opacity: 0; pointer-events: none; }\
        .loader-spinner {\
            width: 40px; height: 40px;\
            border: 3px solid rgba(255,107,0,0.2); border-top-color: #FF6B00;\
            border-radius: 50%; animation: ws-spin 1s linear infinite;\
        }\
        @keyframes ws-spin { 100% { transform: rotate(360deg); } }\
    ';
    document.head.appendChild(style);

    window.WorkspaceController = {
        setState: function(isAuthenticated) {
            if (isAuthenticated) {
                document.body.classList.remove('workspace-public');
                document.body.classList.add('workspace-auth');
            } else {
                document.body.classList.remove('workspace-auth');
                document.body.classList.add('workspace-public');
            }
        },
        hideLoader: function() {
            var loader = document.getElementById('workspace-loader');
            if (!loader) return;
            loader.classList.add('hidden');
            setTimeout(function() { loader.style.display = 'none'; }, 350);
        },
        showLoader: function() {
            var loader = document.getElementById('workspace-loader');
            if (!loader) return;
            loader.style.display = 'flex';
            void loader.offsetWidth; // force reflow
            loader.classList.remove('hidden');
        }
    };

    // Best-effort init from localStorage using the correct key 'dt_user'
    try {
        var dtUser = localStorage.getItem('dt_user');
        if (dtUser) {
            var parsed = JSON.parse(dtUser);
            document.body.classList.add(parsed && parsed.loggedIn ? 'workspace-auth' : 'workspace-public');
        } else {
            document.body.classList.add('workspace-public');
        }
    } catch (e) {
        document.body.classList.add('workspace-public');
    }

    // SAFETY NET: auto-hide loader after 2s in case app.js encounters any issue
    setTimeout(function() {
        window.WorkspaceController.hideLoader();
    }, 2000);
})();
