/**
 * Digital Twin Verse - Workspace Controller
 * Manages visibility between Public Website and Authenticated User Workspace.
 * NO loader overlay - pure CSS class toggling only.
 */

(function() {
    var style = document.createElement('style');
    style.textContent = 'body.workspace-public [data-workspace="auth"]{display:none!important}body.workspace-auth [data-workspace="public"]{display:none!important}';
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
        hideLoader: function() {}, // no-op - loader removed
        showLoader: function() {}  // no-op - loader removed
    };

    // Best-effort init from localStorage using the correct key 'dt_user'
    try {
        var dtUser = localStorage.getItem('dt_user');
        var parsed = dtUser ? JSON.parse(dtUser) : null;
        document.body.classList.add(parsed && parsed.loggedIn ? 'workspace-auth' : 'workspace-public');
    } catch (e) {
        document.body.classList.add('workspace-public');
    }
})();
