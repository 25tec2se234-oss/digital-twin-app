// organization/app.js — Complete DTV Capacity Connect Dashboard
// Handles Steps 1-10: Auth, People, LMS, Assessments, Competencies, Skill Gaps,
// Training, Knowledge, Certificates, Analytics, Digital Twin, Enterprise AI

(() => {
    'use strict';

    // ── State ──────────────────────────────────────────────────────────
    let token, orgId, headers, currentUser, organizationData, currentRole;

    // ── Helpers ───────────────────────────────────────────────────────
    const api = async (path, opts = {}) => {
        const res = await fetch(`/api/v1${path}`, { headers, ...opts });
        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('dt_user');
            sessionStorage.removeItem('dt_appdata_v3');
            window.location.href = '/login.html';
            throw new Error('Unauthorized');
        }
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `API error ${res.status}`);
        return json;
    };

    const toast = (msg, type = 'success') => {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.className = `fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white font-medium max-w-xs ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('hidden'), 3500);
    };

    const badge = (text, cls) => `<span class="px-2 py-0.5 text-xs font-semibold rounded-full ${cls}">${text}</span>`;

    const statusBadge = (status) => {
        const map = {
            PUBLISHED: 'badge-active', ACTIVE: 'badge-active', COMPLETED: 'badge-active',
            DRAFT: 'badge-draft', PENDING: 'badge-draft', IN_PROGRESS: 'badge-draft',
            ARCHIVED: 'badge-archived', REVOKED: 'badge-archived', EXPIRED: 'badge-archived',
        };
        return badge(status, map[status] || 'badge-archived');
    };

    const confidenceBadge = (c) => {
        if (!c) return '';
        const cls = c === 'HIGH' ? 'badge-active' : c === 'MEDIUM' ? 'badge-draft' : 'badge-low';
        return badge(c, cls);
    };

    const el = id => document.getElementById(id);
    const qs = (sel, root = document) => root.querySelector(sel);

    // ── Boot ──────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', async () => {
        token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';
        let userStr = localStorage.getItem('dt_user') || sessionStorage.getItem('dt_appdata_v3');
        if (!token && userStr) {
            try {
                let data = JSON.parse(userStr);
                if (data.token) token = data.token;
                else if (data.userData && data.userData.token) token = data.userData.token;
                else if (data.accessToken) token = data.accessToken;
            } catch(e) {}
        }
        
        orgId = localStorage.getItem('activeOrganizationId');

        if (!token) { window.location.href = '/login.html'; return; }

        // Auto-detect orgId from user profile if not stored
        if (!orgId) {
            try {
                const orgListRes = await fetch('/api/v1/organizations', {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                
                if (orgListRes.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('dt_user');
                    sessionStorage.removeItem('dt_appdata_v3');
                    window.location.href = '/login.html';
                    return;
                }

                const orgListJson = await orgListRes.json();
                const orgs = orgListJson.data || orgListJson.organizations || [];
                if (orgs && orgs.length > 0) {
                    orgId = orgs[0].id || orgs[0].organization_id;
                    localStorage.setItem('activeOrganizationId', orgId);
                } else {
                    document.body.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;flex-direction:column;gap:16px;color:#475569;">
                        <div style="font-size:48px">🏢</div>
                        <h1 style="font-size:20px;font-weight:700;color:#0f172a">No Organization Found</h1>
                        <p style="text-align:center;max-width:360px;">Your account is not part of any organization. Ask your admin to invite you, or <a href="/login.html" style="color:#F97316">sign in with a different account</a>.</p>
                        <button onclick="createTestOrg()" style="margin-top: 10px; background: #F97316; color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; border: none;">Create Demo Organization</button>
                    </div>`;
                    window.createTestOrg = async () => {
                        try {
                            const res = await fetch('/api/v1/organizations', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: 'Demo Organization', description: 'A test organization for capacity connect.' })
                            });
                            if (res.ok) { window.location.reload(); } else { alert('Failed to create organization'); }
                        } catch(e) { console.error(e); alert('Error creating organization'); }
                    };
                    return;
                }
            } catch(e) { 
                console.error(e);
                document.body.innerHTML = '<div style="padding:2rem;color:red;font-family:sans-serif;text-align:center;">Failed to connect to server. Please refresh the page.</div>';
                return; 
            }
        }

        headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Organization-Id': orgId
        };

        try {
            const [orgRes, userRes] = await Promise.all([
                api(`/organizations/${orgId}`),
                api(`/auth/me`)
            ]);

            organizationData = orgRes.data;
            // /auth/me returns { user: {} }, not { data: {} }
            currentUser = userRes.user || userRes.data || userRes;

            // Role: try to get from membership endpoint or /organizations list
            try {
                const myOrgsRes = await api(`/organizations`);
                const myOrgs = myOrgsRes.data || myOrgsRes.organizations || [];
                const myOrg = myOrgs.find(o => (o.id || o.organization_id) === orgId);
                currentRole = myOrg?.membership_role || myOrg?.role || myOrg?.user_role || 'TRAINEE';
            } catch(_) {
                currentRole = 'TRAINEE';
            }

            const displayName = currentUser.first_name
                ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim()
                : currentUser.name || currentUser.email || 'User';

            el('nav-user-name').textContent = displayName;
            el('nav-org-name').textContent = organizationData?.name || 'Organization';
            el('sidebar-role').textContent = currentRole.replace(/_/g, ' ');
            el('welcome-name').textContent = currentUser.first_name || currentUser.name || displayName;

            buildNavigation();
            switchView('dashboard');
            loadNotifications();
        } catch (e) {
            console.error('Boot error:', e);
            // If the org fetch failed (e.g. 403 or 404 due to stale ID), clear it and reload
            if (localStorage.getItem('activeOrganizationId')) {
                localStorage.removeItem('activeOrganizationId');
                window.location.reload();
            } else {
                window.location.href = '/login.html';
            }
        }

        bindGlobalEvents();
    });

    // ── Sidebar Navigation ─────────────────────────────────────────────
    const NAV_ITEMS = [
        { id: 'dashboard', icon: 'bi-grid-1x2', text: 'Dashboard', roles: ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'] },
        { id: 'people', icon: 'bi-people', text: 'People', roles: ['ORGANIZATION_ADMIN'] },
        { id: 'courses', icon: 'bi-journal-bookmark', text: 'Courses', roles: ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'] },
        { id: 'assessments', icon: 'bi-clipboard-check', text: 'Assessments', roles: ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'] },
        { id: 'competencies', icon: 'bi-diagram-3', text: 'Competencies', roles: ['ORGANIZATION_ADMIN', 'TRAINER'] },
        { id: 'skillgaps', icon: 'bi-exclamation-triangle', text: 'Skill Gaps', roles: ['ORGANIZATION_ADMIN'] },
        { id: 'training', icon: 'bi-bullseye', text: 'Training Needs', roles: ['ORGANIZATION_ADMIN', 'TRAINER'] },
        { id: 'knowledge', icon: 'bi-book', text: 'Knowledge Library', roles: ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'] },
        { id: 'certificates', icon: 'bi-patch-check', text: 'Certificates', roles: ['ORGANIZATION_ADMIN', 'TRAINER', 'TRAINEE'] },
        { id: 'analytics', icon: 'bi-bar-chart-line', text: 'Analytics', roles: ['ORGANIZATION_ADMIN'] },
        { id: 'digital-twin', icon: 'bi-cpu', text: 'Digital Twin', roles: ['ORGANIZATION_ADMIN'] },
        { id: 'enterprise-ai', icon: 'bi-robot', text: 'Enterprise AI', roles: ['ORGANIZATION_ADMIN'] },
        { id: 'settings', icon: 'bi-gear', text: 'Settings', roles: ['ORGANIZATION_ADMIN'] },
    ];

    function buildNavigation() {
        const nav = el('sidebar-nav');
        nav.innerHTML = '';
        NAV_ITEMS.filter(n => n.roles.includes(currentRole)).forEach(item => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'nav-link flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg';
            a.dataset.view = item.id;
            a.innerHTML = `<i class="bi ${item.icon} text-base w-5 text-center"></i><span>${item.text}</span>`;
            a.addEventListener('click', e => {
                e.preventDefault();
                document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
                a.classList.add('active');
                switchView(item.id);
                if(window.innerWidth < 768) {
                    document.getElementById('sidebar')?.classList.add('-translate-x-full');
                    document.getElementById('sidebar-overlay')?.classList.add('hidden');
                }
            });
            nav.appendChild(a);
        });

        // Activate dashboard link
        const first = qs('[data-view="dashboard"]', nav);
        if (first) first.classList.add('active');

        // Show create buttons for admins
        if (currentRole === 'ORGANIZATION_ADMIN') {
            el('btn-create-course')?.classList.remove('hidden');
            el('btn-add-resource')?.classList.remove('hidden', 'items-center');
            el('btn-add-resource')?.classList.add('flex');
        }

        // Quick actions on dashboard
        buildQuickActions();
    }

    function buildQuickActions() {
        const qa = el('quick-actions');
        if (!qa) return;
        const actions = currentRole === 'ORGANIZATION_ADMIN' ? [
            { label: 'Invite Member', view: 'people', icon: 'bi-person-plus' },
            { label: 'View Skill Gaps', view: 'skillgaps', icon: 'bi-exclamation-triangle' },
            { label: 'Digital Twin', view: 'digital-twin', icon: 'bi-cpu' },
            { label: 'Enterprise AI', view: 'enterprise-ai', icon: 'bi-robot' },
        ] : [
            { label: 'My Courses', view: 'courses', icon: 'bi-journal-bookmark' },
            { label: 'Assessments', view: 'assessments', icon: 'bi-clipboard-check' },
            { label: 'Knowledge Library', view: 'knowledge', icon: 'bi-book' },
            { label: 'My Certificates', view: 'certificates', icon: 'bi-patch-check' },
        ];

        qa.innerHTML = actions.map(a => `
            <button onclick="switchView('${a.view}')" class="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-orange-50 hover:text-primary rounded-xl text-sm transition border border-transparent hover:border-orange-100 gap-2 h-full w-full">
                <i class="bi ${a.icon} text-primary text-2xl mb-1"></i> 
                <span class="font-medium text-slate-700 text-center">${a.label}</span>
            </button>
        `).join('');
    }

    // ── View Router ────────────────────────────────────────────────────
    const loaders = {
        dashboard: loadDashboard,
        people: loadPeople,
        courses: loadCourses,
        assessments: loadAssessments,
        competencies: loadCompetencies,
        skillgaps: loadSkillGaps,
        training: loadTraining,
        knowledge: loadKnowledge,
        certificates: loadCertificates,
        analytics: loadAnalytics,
        'digital-twin': loadDigitalTwin,
        settings: loadSettings,
    };

    window.switchView = function(viewId) {
        document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
        const view = el(`view-${viewId}`);
        if (view) {
            view.classList.remove('hidden');
            if (loaders[viewId]) loaders[viewId]();
        }
        // Sync nav
        document.querySelectorAll('.nav-link').forEach(n => {
            n.classList.toggle('active', n.dataset.view === viewId);
        });
    };

    // ── DASHBOARD ─────────────────────────────────────────────────────
    async function loadDashboard() {
        const dateEl = el('current-date');
        if(dateEl) {
            dateEl.textContent = "Here's what's happening on " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ".";
        }
        if (currentRole !== 'ORGANIZATION_ADMIN') {
            el('admin-stats').innerHTML = `<div class="col-span-full bg-white rounded-xl p-5 border text-sm text-slate-500">Welcome! Use the sidebar to navigate your learning portal.</div>`;
            return;
        }
        try {
            const membersJson = await api(`/organizations/${orgId}/members`);
            const members = membersJson.data || [];
            const trainers = members.filter(m => m.role === 'TRAINER').length;
            const trainees = members.filter(m => m.role === 'TRAINEE').length;
            const admins = members.filter(m => m.role === 'ORGANIZATION_ADMIN').length;

            el('admin-stats').innerHTML = [
                { label: 'Total Members', val: members.length, color: 'border-primary', icon: 'bi-people' },
                { label: 'Trainers', val: trainers, color: 'border-blue-500', icon: 'bi-person-workspace' },
                { label: 'Trainees', val: trainees, color: 'border-green-500', icon: 'bi-person-check' },
                { label: 'Admins', val: admins, color: 'border-purple-500', icon: 'bi-shield-check' },
            ].map(s => `
                <div class="stat-card bg-white rounded-xl p-5 shadow-sm border-t-4 ${s.color} border border-slate-100">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs text-slate-500 font-medium uppercase tracking-wide">${s.label}</p>
                            <p class="text-3xl font-bold mt-1">${s.val}</p>
                        </div>
                        <i class="bi ${s.icon} text-2xl text-slate-300"></i>
                    </div>
                </div>
            `).join('');
        } catch (e) { console.error(e); }
    }

    // ── PEOPLE ────────────────────────────────────────────────────────
    async function loadPeople() {
        try {
            const json = await api(`/organizations/${orgId}/members`);
            const tbody = el('people-table-body');
            const members = json.data || [];
            if (!members.length) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-slate-400 text-sm">No members found.</td></tr>`;
                return;
            }
            tbody.innerHTML = members.map(m => `
                <tr class="border-b hover:bg-slate-50 transition">
                    <td class="p-4">
                        <div class="font-medium text-slate-900">${m.first_name ? `${m.first_name} ${m.last_name || ''}` : m.name || '—'}</div>
                        <div class="text-xs text-slate-400">${m.email || ''}</div>
                    </td>
                    <td class="p-4 text-sm text-slate-600">${m.role?.replace(/_/g, ' ') || '—'}</td>
                    <td class="p-4">${statusBadge(m.status || 'ACTIVE')}</td>
                    <td class="p-4 text-right">
                        <button onclick="removeMember('${m.user_id}')" class="text-red-400 hover:text-red-600 text-sm"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (e) { toast(e.message, 'error'); }
    }

    window.removeMember = async (userId) => {
        if (!confirm('Remove this member from the organization?')) return;
        try {
            await api(`/organizations/${orgId}/members/${userId}`, { method: 'DELETE' });
            toast('Member removed.');
            loadPeople();
        } catch (e) { toast(e.message, 'error'); }
    };

    // ── COURSES (LMS) ─────────────────────────────────────────────────
    async function loadCourses() {
        const grid = el('courses-grid');
        grid.innerHTML = `<p class="text-slate-400 text-sm col-span-full">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/courses`);
            const courses = json.data || [];
            if (!courses.length) {
                grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400"><i class="bi bi-journal-x text-4xl block mb-2"></i>No courses available yet.</div>`;
                return;
            }
            grid.innerHTML = courses.map(c => `
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                    <div class="bg-gradient-to-r from-orange-500 to-orange-400 h-2"></div>
                    <div class="p-5">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-semibold text-slate-900 text-sm leading-snug">${c.title}</h3>
                            ${statusBadge(c.status)}
                        </div>
                        <p class="text-xs text-slate-500 mb-3 line-clamp-2">${c.short_description || c.description || 'No description.'}</p>
                        <div class="flex items-center justify-between text-xs text-slate-400">
                            <span><i class="bi bi-tag mr-1"></i>${c.category || 'General'}</span>
                            <span><i class="bi bi-clock mr-1"></i>${c.estimated_duration ? c.estimated_duration + ' min' : '—'}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (e) { grid.innerHTML = `<p class="text-red-400 text-sm col-span-full">${e.message}</p>`; }
    }

    // ── ASSESSMENTS ───────────────────────────────────────────────────
    async function loadAssessments() {
        const list = el('assessments-list');
        list.innerHTML = `<p class="text-slate-400 text-sm">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/assessments`);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = `<div class="text-center py-10 text-slate-400"><i class="bi bi-clipboard-x text-4xl block mb-2"></i>No assessments yet.</div>`;
                return;
            }
            list.innerHTML = items.map(a => `
                <div class="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-center shadow-sm">
                    <div>
                        <h3 class="font-medium text-sm">${a.title}</h3>
                        <p class="text-xs text-slate-400 mt-0.5">${a.description || '—'} &nbsp;•&nbsp; Passing: ${a.passing_score || 0}%</p>
                    </div>
                    <div class="flex items-center gap-3">
                        ${statusBadge(a.status)}
                        ${currentRole === 'TRAINEE' ? `<button class="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 transition">Start</button>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (e) { list.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

    // ── COMPETENCIES ─────────────────────────────────────────────────
    async function loadCompetencies() {
        const list = el('competencies-list');
        list.innerHTML = `<p class="text-slate-400 text-sm">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/competencies`);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = `<div class="col-span-full text-center py-10 text-slate-400"><i class="bi bi-diagram-3 text-4xl block mb-2"></i>No competencies defined yet.</div>`;
                return;
            }
            list.innerHTML = items.map(c => `
                <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-semibold text-sm">${c.name}</h3>
                        ${statusBadge(c.status || 'ACTIVE')}
                    </div>
                    <p class="text-xs text-slate-500 mb-3">${c.description || '—'}</p>
                    <div class="flex flex-wrap gap-1">
                        ${(c.skills || []).map(s => `<span class="text-[11px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">${s.name}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        } catch (e) { list.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

    // ── SKILL GAPS ────────────────────────────────────────────────────
    async function loadSkillGaps() {
        const list = el('skillgaps-list');
        list.innerHTML = `<p class="text-slate-400 text-sm">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/skill-gaps`);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = `<div class="text-center py-10 text-slate-400"><i class="bi bi-check-circle text-4xl block mb-2 text-green-400"></i>No critical skill gaps detected.</div>`;
                return;
            }
            list.innerHTML = items.map(g => `
                <div class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex justify-between items-center">
                    <div>
                        <h3 class="font-medium text-sm">${g.skill_name || g.competency_name || 'Unknown Skill'}</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Severity: ${g.severity || '—'} &nbsp;•&nbsp; Affected: ${g.affected_people_count || 0} people</p>
                    </div>
                    <div>${confidenceBadge(g.confidence)}</div>
                </div>
            `).join('');
        } catch (e) { list.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

    // ── TRAINING NEEDS ────────────────────────────────────────────────
    async function loadTraining() {
        const list = el('training-list');
        list.innerHTML = '<p class="text-slate-400 text-sm">Analyzing training needs...</p>';
        try {
            const deptSelect = el('filter-dept-tn');
            if (deptSelect && deptSelect.children.length <= 1) {
                api(\`/organizations/\${orgId}/departments\`).then(res => {
                    deptSelect.innerHTML = '<option value="">All Departments</option>' + (res.data || []).map(d => \`<option value="\${d.id}">\${d.name}</option>\`).join('');
                }).catch(console.error);
            }
            const roleSelect = el('filter-role-tn');
            if (roleSelect && roleSelect.children.length <= 1) {
                api(\`/organizations/\${orgId}/roles\`).then(res => {
                    roleSelect.innerHTML = '<option value="">All Roles</option>' + (res.data || []).map(r => \`<option value="\${r.id}">\${r.name}</option>\`).join('');
                }).catch(console.error);
            }

            const deptId = el('filter-dept-tn')?.value;
            const roleId = el('filter-role-tn')?.value;
            let url = \`/organizations/\${orgId}/ai-training-needs?\`;
            if (deptId) url += \`departmentId=\${deptId}&\`;
            if (roleId) url += \`roleId=\${roleId}&\`;
            
            const json = await api(url);
            if (!json.success || !json.data || json.data.length === 0) {
                list.innerHTML = '<p class="text-slate-500 text-sm">No training needs identified for the selected criteria.</p>';
                return;
            }
            
            list.innerHTML = json.data.map(n => \`
                <div class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <div class="flex justify-between mb-3">
                        <h4 class="font-bold text-slate-800 text-lg">\${n.training_need}</h4>
                        <span class="px-3 py-1 bg-\${n.priority === 'CRITICAL' ? 'red' : (n.priority === 'HIGH' ? 'orange' : 'blue')}-100 text-\${n.priority === 'CRITICAL' ? 'red' : (n.priority === 'HIGH' ? 'orange' : 'blue')}-700 text-xs font-bold rounded-full">
                            \${n.priority} PRIORITY
                        </span>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-slate-600">
                        <div>
                            <span class="block text-xs font-semibold text-slate-400 mb-1">AFFECTED MEMBERS</span>
                            \${n.affected_members}
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-slate-400 mb-1">DEPARTMENTS</span>
                            \${n.affected_department}
                        </div>
                        <div class="col-span-2">
                            <span class="block text-xs font-semibold text-slate-400 mb-1">RECOMMENDED TRAINING</span>
                            \${n.recommended_training}
                        </div>
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-lg flex gap-3 border border-indigo-100">
                        <i class="bi bi-robot text-indigo-500 text-lg"></i>
                        <div>
                            <span class="block text-xs font-bold text-indigo-700 mb-1">AI INSIGHT (Reasoning)</span>
                            <p class="text-sm text-slate-700">\${n.reason || 'Automatically identified training need.'}</p>
                        </div>
                    </div>
                </div>
            \`).join('');
        } catch (err) {
            list.innerHTML = \`<p class="text-red-500 text-sm">Error loading training needs: \${err.message}</p>\`;
        }
    }

    window.exportTrainingNeeds = (format) => {
        const deptId = el('filter-dept-tn')?.value;
        const roleId = el('filter-role-tn')?.value;
        let url = \`/api/v1/organizations/\${orgId}/ai-training-needs/export?format=\${format}\`;
        if (deptId) url += \`&departmentId=\${deptId}\`;
        if (roleId) url += \`&roleId=\${roleId}\`;
        window.open(url, '_blank');
    };

    window.loadTrainingNeeds = loadTraining;

    el('btn-analyze-training')?.addEventListener('click', () => {
        toast('Regenerating AI Analysis...');
        loadTraining();
    });

    // ── KNOWLEDGE LIBRARY ─────────────────────────────────────────────
    async function loadKnowledge() {
        const grid = el('knowledge-grid');
        grid.innerHTML = `<p class="text-slate-400 text-sm col-span-full">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/knowledge`);
            const items = json.data || [];
            if (!items.length) {
                grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400"><i class="bi bi-book text-4xl block mb-2"></i>No knowledge resources published yet.</div>`;
                return;
            }
            const typeIcon = { PDF: 'bi-file-pdf', VIDEO: 'bi-play-circle', LINK: 'bi-link-45deg', ARTICLE: 'bi-newspaper' };
            grid.innerHTML = items.map(r => `
                <a href="${r.resource_url}" target="_blank" rel="noopener" class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition block">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="bi ${typeIcon[r.content_type] || 'bi-file-earmark'} text-primary text-lg"></i>
                        <span class="text-[11px] text-slate-400 uppercase tracking-wide">${r.content_type}</span>
                    </div>
                    <h3 class="font-semibold text-sm mb-1">${r.title}</h3>
                    <p class="text-xs text-slate-500 line-clamp-2">${r.description || '—'}</p>
                </a>
            `).join('');
        } catch (e) { grid.innerHTML = `<p class="text-red-400 text-sm col-span-full">${e.message}</p>`; }
    }

    // ── CERTIFICATES ──────────────────────────────────────────────────
    async function loadCertificates() {
        const list = el('certificates-list');
        list.innerHTML = `<p class="text-slate-400 text-sm">Loading...</p>`;
        try {
    // Admins see templates, members see their own earned certificates
        const endpoint = currentRole === 'ORGANIZATION_ADMIN'
            ? `/organizations/${orgId}/certificates/templates`
            : `/organizations/${orgId}/certificates/mine`;
        const json = await api(endpoint);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = `<div class="text-center py-12 text-slate-400"><i class="bi bi-patch-check text-4xl block mb-2"></i>No certificate templates created yet.</div>`;
                return;
            }
            list.innerHTML = items.map(cert => `
                <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                            <i class="bi bi-patch-check text-primary text-xl"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold text-sm">${cert.name}</h3>
                            <p class="text-xs text-slate-400">${cert.validity_days ? `Valid for ${cert.validity_days} days` : 'No expiry'}</p>
                        </div>
                    </div>
                    ${statusBadge(cert.status || 'ACTIVE')}
                </div>
            `).join('');
        } catch (e) { list.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

    // ── ANALYTICS ─────────────────────────────────────────────────────
    let currentAnalyticsPage = 1;

    async function loadAnalytics() {
        const grid = el('analytics-grid');
        const deptTbody = el('analytics-departments-tbody');
        grid.innerHTML = `<p class="text-slate-400 text-sm col-span-full">Loading analytics...</p>`;
        deptTbody.innerHTML = `<tr><td colspan="5" class="px-5 py-4 text-center text-slate-400">Loading department data...</td></tr>`;
        
        try {
            // Load Dashboard Metrics
            const dashJson = await api(`/organizations/${orgId}/analytics/dashboard`);
            const data = dashJson.data || {};

            if (data.isEmpty) {
                grid.innerHTML = `<p class="text-slate-400 text-sm col-span-full text-center py-10"><i class="bi bi-inbox text-3xl block mb-2"></i>No data available for your organization yet.</p>`;
                deptTbody.innerHTML = `<tr><td colspan="5" class="px-5 py-4 text-center text-slate-400">Empty organization.</td></tr>`;
                return;
            }

            const metrics = [
                { label: 'Total Members', val: data.totalMembers || 0, icon: 'bi-people', color: 'text-blue-600' },
                { label: 'Departments', val: data.totalDepartments || 0, icon: 'bi-diagram-3', color: 'text-indigo-500' },
                { label: 'Competency Coverage', val: `${data.competencyCoverage || 0}%`, icon: 'bi-bullseye', color: 'text-primary' },
                { label: 'Evidence Coverage', val: `${data.evidenceCoverage || 0}%`, icon: 'bi-file-earmark-check', color: 'text-green-600' },
                { label: 'Active Training', val: data.activeTraining || 0, icon: 'bi-journal-play', color: 'text-blue-500' },
                { label: 'Completed Training', val: data.completedTraining || 0, icon: 'bi-trophy', color: 'text-yellow-600' },
                { label: 'Overdue Training', val: data.overdueTraining || 0, icon: 'bi-clock-history', color: 'text-orange-500' },
                { label: 'Critical Gaps', val: data.criticalGaps || 0, icon: 'bi-exclamation-octagon', color: 'text-red-600' },
                { label: 'Training Needs', val: data.trainingNeeds || 0, icon: 'bi-lightbulb', color: 'text-yellow-500' },
                { label: 'Twin Confidence', val: data.digitalTwinConfidence || 'N/A', icon: 'bi-cpu', color: 'text-teal-500' },
            ];

            grid.innerHTML = metrics.map(m => `
                <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm stat-card">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-xs text-slate-500 uppercase tracking-wide font-medium">${m.label}</p>
                            <p class="text-3xl font-bold mt-1 ${m.color}">${m.val}</p>
                        </div>
                        <i class="bi ${m.icon} text-2xl text-slate-200"></i>
                    </div>
                </div>
            `).join('');

            // Load Department Analytics
            await loadDepartmentAnalyticsPage(1);

        } catch (e) { 
            grid.innerHTML = `<p class="text-red-400 text-sm col-span-full">${e.message}</p>`; 
            deptTbody.innerHTML = `<tr><td colspan="5" class="px-5 py-4 text-center text-red-400">Failed to load department analytics.</td></tr>`;
        }
    }

    async function loadDepartmentAnalyticsPage(page) {
        currentAnalyticsPage = page;
        const deptTbody = el('analytics-departments-tbody');
        const pag = el('analytics-pagination');
        
        try {
            const res = await api(`/organizations/${orgId}/analytics/departments?page=${page}&limit=10`);
            const depts = res.data || [];
            
            if (depts.length === 0) {
                deptTbody.innerHTML = `<tr><td colspan="5" class="px-5 py-4 text-center text-slate-400">No department data found.</td></tr>`;
                pag.classList.add('hidden');
                return;
            }

            deptTbody.innerHTML = depts.map(d => `
                <tr class="hover:bg-slate-50">
                    <td class="px-5 py-4 font-medium text-slate-700">${d.name}</td>
                    <td class="px-5 py-4 text-slate-500">${d.member_count}</td>
                    <td class="px-5 py-4 text-slate-500">${d.training_completed}</td>
                    <td class="px-5 py-4 text-red-500 font-medium">${d.major_gaps}</td>
                    <td class="px-5 py-4 text-green-600 font-medium">${d.evidence_coverage}</td>
                </tr>
            `).join('');

            const p = res.pagination;
            if (p && p.totalPages > 1) {
                pag.classList.remove('hidden');
                el('analytics-page-info').textContent = `page ${p.page} of ${p.totalPages}`;
                
                const btnPrev = el('btn-analytics-prev');
                const btnNext = el('btn-analytics-next');
                
                btnPrev.disabled = p.page <= 1;
                btnNext.disabled = p.page >= p.totalPages;
                
                btnPrev.onclick = () => loadDepartmentAnalyticsPage(p.page - 1);
                btnNext.onclick = () => loadDepartmentAnalyticsPage(p.page + 1);
            } else {
                pag.classList.add('hidden');
            }
        } catch (e) {
            console.error(e);
            deptTbody.innerHTML = `<tr><td colspan="5" class="px-5 py-4 text-center text-red-400">Failed to load pagination.</td></tr>`;
        }
    }

    window.exportReport = function(type, format) {
        // Download via hidden iframe or window location
        const url = `/api/v1/organizations/${orgId}/analytics/export?type=${type}&format=${format}`;
        window.open(url, '_blank');
    };

    // ── DIGITAL TWIN ──────────────────────────────────────────────────
    async function loadDigitalTwin() {
        try {
            const json = await api(`/organizations/${orgId}/digital-twin/snapshots/latest`);
            renderTwin(json.data);
        } catch (e) {
            el('twin-state-grid').innerHTML = `<div class="col-span-full text-center py-10 text-slate-400"><i class="bi bi-cpu text-4xl block mb-2"></i>No Digital Twin snapshot exists yet.<br><button onclick="refreshTwin()" class="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm">Generate First Snapshot</button></div>`;
        }
    }

    function renderTwin(snap) {
        if (!snap) return;
        const confidenceBar = el('twin-confidence-bar');
        confidenceBar.classList.remove('hidden');
        el('twin-confidence-label').className = \`text-sm font-bold confidence-\${snap.confidence?.toLowerCase()}\`;
        el('twin-confidence-label').textContent = snap.confidence;
        el('twin-evidence').textContent = snap.evidence_coverage != null ? \`\${parseFloat(snap.evidence_coverage).toFixed(0)}%\` : '—';
        el('twin-competency').textContent = snap.competency_coverage != null ? \`\${parseFloat(snap.competency_coverage).toFixed(0)}%\` : '—';
        el('twin-updated').textContent = snap.created_at ? new Date(snap.created_at).toLocaleDateString() : '—';

        // Add version indicator
        if (!el('twin-version-indicator')) {
            const vBadge = document.createElement('span');
            vBadge.id = 'twin-version-indicator';
            vBadge.className = 'ml-3 text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700';
            el('twin-confidence-label').parentNode.appendChild(vBadge);
        }
        el('twin-version-indicator').textContent = \`v\${snap.snapshot_version || '1.0'}\`;

        let html = '';
        
        // AI Explanations & Trends rendering
        if (snap.ai_explanations && typeof snap.ai_explanations === 'object') {
            const ai = snap.ai_explanations;
            const trends = ai.trends || {};
            
            html += \`
            <div class="col-span-full bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5 shadow-sm mb-4">
                <h3 class="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
                    <i class="bi bi-robot text-indigo-600"></i> Enterprise AI Insights
                </h3>
                <div class="space-y-2 text-sm text-indigo-800">
                    \${ai.executiveSummary ? \`<p><strong class="text-indigo-900">Summary:</strong> \${ai.executiveSummary}</p>\` : ''}
                    \${ai.departmentInsights ? \`<p><strong class="text-indigo-900">Departments:</strong> \${ai.departmentInsights}</p>\` : ''}
                    \${ai.trainingAction ? \`<p><strong class="text-indigo-900">Action:</strong> \${ai.trainingAction}</p>\` : ''}
                    \${ai.dataWarning ? \`<p class="text-orange-700 bg-orange-50 p-2 rounded text-xs mt-2 border border-orange-100"><i class="bi bi-exclamation-triangle"></i> \${ai.dataWarning}</p>\` : ''}
                    \${ai.message ? \`<p class="text-slate-500">\${ai.message}</p>\` : ''}
                </div>
            </div>\`;

            // Trend indicator
            if (Object.keys(trends).length > 0) {
                html += \`<div class="col-span-full grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-center shadow-sm">
                        <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Competency Trend</span>
                        \${trends.competencyTrend > 0 ? \`<span class="text-green-500 text-sm font-bold"><i class="bi bi-arrow-up"></i> +\${trends.competencyTrend.toFixed(1)}%</span>\` : 
                          (trends.competencyTrend < 0 ? \`<span class="text-red-500 text-sm font-bold"><i class="bi bi-arrow-down"></i> \${trends.competencyTrend.toFixed(1)}%</span>\` : \`<span class="text-slate-400 text-sm font-bold">No Change</span>\`)}
                    </div>
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex justify-between items-center shadow-sm">
                        <span class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Evidence Trend</span>
                        \${trends.evidenceTrend > 0 ? \`<span class="text-green-500 text-sm font-bold"><i class="bi bi-arrow-up"></i> +\${trends.evidenceTrend.toFixed(1)}%</span>\` : 
                          (trends.evidenceTrend < 0 ? \`<span class="text-red-500 text-sm font-bold"><i class="bi bi-arrow-down"></i> \${trends.evidenceTrend.toFixed(1)}%</span>\` : \`<span class="text-slate-400 text-sm font-bold">No Change</span>\`)}
                    </div>
                </div>\`;
            }
        }

        const states = [
            { title: 'Workforce', icon: 'bi-people', data: snap.workforce_state },
            { title: 'Competency', icon: 'bi-diagram-3', data: snap.competency_state },
            { title: 'Training', icon: 'bi-bullseye', data: snap.training_state },
            { title: 'Learning', icon: 'bi-journal-bookmark', data: snap.learning_state },
            { title: 'Certification', icon: 'bi-patch-check', data: snap.certification_state },
        ];

        html += states.map(s => {
            const d = s.data || {};
            const entries = Object.entries(d).slice(0, 4);
            return \`
            <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
                    <i class="bi \${s.icon} text-primary"></i> \${s.title} State
                </h3>
                \${entries.length ? entries.map(([k, v]) => \`
                    <div class="flex justify-between text-xs py-1 border-b border-slate-50">
                        <span class="text-slate-500 capitalize">\${k.replace(/_/g, ' ')}</span>
                        <span class="font-medium">\${(v !== null && typeof v === 'object') ? JSON.stringify(v) : (v ?? '—')}</span>
                    </div>
                \`).join('') : '<p class="text-xs text-slate-400">Insufficient evidence for this state.</p>'}
            </div>\`;
        }).join('');
        
        el('twin-state-grid').innerHTML = html;
    }

    window.refreshTwin = async function() {
        const btn = el('btn-refresh-twin');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="bi bi-arrow-clockwise animate-spin"></i> Generating...`;
        btn.disabled = true;
        try {
            const json = await api(`/organizations/${orgId}/digital-twin/snapshots`, { method: 'POST' });
            renderTwin(json.data);
            toast('Digital Twin snapshot updated!');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    };
    el('btn-refresh-twin')?.addEventListener('click', refreshTwin);

    // ── ENTERPRISE AI ─────────────────────────────────────────────────
    const aiChatMessages = () => el('ai-chat-messages');

    function appendMessage(role, text, type) {
        const div = document.createElement('div');
        div.className = 'flex gap-3' + (role === 'user' ? ' flex-row-reverse' : '');
        const avatar = role === 'user'
            ? `<div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><i class="bi bi-person text-slate-600 text-sm"></i></div>`
            : `<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><i class="bi bi-robot text-white text-sm"></i></div>`;
        const bubble = `<div class="max-w-xl text-sm rounded-xl p-3 ${role === 'user' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-800'}">${text.replace(/\n/g, '<br>')}</div>`;
        div.innerHTML = avatar + bubble;
        aiChatMessages().appendChild(div);
        aiChatMessages().scrollTop = aiChatMessages().scrollHeight;
        return div;
    }

    el('ai-send')?.addEventListener('click', sendAiQuery);
    el('ai-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendAiQuery(); });

    async function sendAiQuery() {
        const input = el('ai-input');
        const q = input.value.trim();
        if (!q) return;
        input.value = '';

        appendMessage('user', q);
        const thinking = appendMessage('ai', '<span class="ai-typing">Analyzing your organization data</span>');

        try {
            const json = await api(`/organizations/${orgId}/ai/ask`, {
                method: 'POST',
                body: JSON.stringify({ queryText: q })
            });
            const d = json.data;
            let reply = d.answer || 'No response generated.';
            if (d.sources?.length) {
                reply += `\n\n<span class="text-xs text-slate-400">Sources: ${d.sources.join(', ')}</span>`;
            }
            if (d.twin_data_quality) {
                reply += ` &nbsp; ${confidenceBadge(d.twin_data_quality)}`;
            }
            thinking.querySelector('.ai-typing').replaceWith(Object.assign(document.createElement('span'), { innerHTML: reply }));
        } catch (e) {
            thinking.querySelector('.ai-typing').replaceWith(Object.assign(document.createElement('span'), {
                innerHTML: `<span class="text-red-500">${e.message}</span>`
            }));
        }
        aiChatMessages().scrollTop = aiChatMessages().scrollHeight;
    }

    // ── NOTIFICATIONS ─────────────────────────────────────────────────
    async function loadNotifications() {
        try {
            const json = await api(`/organizations/${orgId}/notifications`);
            const items = json.data || [];
            const unread = items.filter(n => !n.is_read);

            const badge = el('notif-badge');
            if (unread.length) {
                badge.textContent = unread.length;
                badge.classList.remove('hidden');
            }

            const list = el('notif-list');
            if (!items.length) {
                list.innerHTML = `<p class="p-4 text-sm text-slate-400">You're all caught up.</p>`;
                return;
            }
            list.innerHTML = items.slice(0, 20).map(n => `
                <div class="p-4 hover:bg-slate-50 cursor-pointer ${n.is_read ? '' : 'bg-orange-50'}" onclick="markNotifRead('${n.id}', this)">
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-sm font-medium">${n.title}</span>
                        <span class="text-[10px] text-slate-400 ml-2 flex-shrink-0">${new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p class="text-xs text-slate-500">${n.message}</p>
                </div>
            `).join('');
        } catch (e) { /* Notifications not critical */ }
    }

    window.markNotifRead = async (id, rowEl) => {
        try {
            await api(`/organizations/${orgId}/notifications/${id}/read`, { method: 'PUT' });
            rowEl.classList.remove('bg-orange-50');
        } catch(e) {}
    };

    el('notif-bell')?.addEventListener('click', () => {
        const drawer = el('notif-drawer');
        drawer.classList.toggle('hidden');
    });
    el('close-notif')?.addEventListener('click', () => el('notif-drawer').classList.add('hidden'));

    // ── SETTINGS ──────────────────────────────────────────────────────
    function loadSettings() {
        el('org-name-input').value = organizationData?.name || '';
        el('org-desc-input').value = organizationData?.description || '';
    }

    el('org-settings-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const json = await api(`/organizations/${orgId}`, {
                method: 'PUT',
                body: JSON.stringify({ description: el('org-desc-input').value })
            });
            organizationData = json.data;
            toast('Settings saved!');
        } catch (ex) { toast(ex.message, 'error'); }
    });

    // ── PEOPLE — Invite Modal ─────────────────────────────────────────
    el('btn-invite')?.addEventListener('click', () => el('invite-modal').classList.remove('hidden'));
    ['btn-cancel-invite', 'btn-cancel-invite2'].forEach(id => {
        el(id)?.addEventListener('click', () => el('invite-modal').classList.add('hidden'));
    });

    el('invite-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            await api(`/organizations/${orgId}/invitations`, {
                method: 'POST',
                body: JSON.stringify({
                    email: el('invite-email').value,
                    role: el('invite-role').value
                })
            });
            toast('Invitation sent!');
            el('invite-modal').classList.add('hidden');
            e.target.reset();
        } catch (ex) { toast(ex.message, 'error'); }
    });

    // ── LOGOUT ────────────────────────────────────────────────────────
    el('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('activeOrganizationId');
        window.location.href = '/login.html';
    });

    // ── Mobile Sidebar ────────────────────────────────────────────────
    el('sidebar-toggle')?.addEventListener('click', () => {
        el('sidebar').classList.toggle('-translate-x-full');
        el('sidebar-overlay')?.classList.toggle('hidden');
    });

    el('sidebar-overlay')?.addEventListener('click', () => {
        el('sidebar').classList.add('-translate-x-full');
        el('sidebar-overlay').classList.add('hidden');
    });

    el('close-sidebar')?.addEventListener('click', () => {
        el('sidebar').classList.add('-translate-x-full');
        el('sidebar-overlay').classList.add('hidden');
    });

})();
