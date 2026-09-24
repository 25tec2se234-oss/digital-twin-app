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
            <button onclick="switchView('${a.view}')" class="w-full text-left flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-orange-50 hover:text-primary rounded-lg text-sm transition">
                <i class="bi ${a.icon} text-primary"></i> ${a.label}
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
        list.innerHTML = `<p class="text-slate-400 text-sm">Loading...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/training-needs`);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = `<div class="text-center py-10 text-slate-400"><i class="bi bi-bullseye text-4xl block mb-2"></i>No training needs recorded.</div>`;
                return;
            }
            list.innerHTML = items.map(t => `
                <div class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-sm">${t.title || t.skill_name || 'Training Need'}</h3>
                            <p class="text-xs text-slate-400 mt-0.5">${t.description || '—'}</p>
                        </div>
                        ${statusBadge(t.status || 'PENDING')}
                    </div>
                </div>
            `).join('');
        } catch (e) { list.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

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
    async function loadAnalytics() {
        const grid = el('analytics-grid');
        grid.innerHTML = `<p class="text-slate-400 text-sm">Loading analytics...</p>`;
        try {
            const json = await api(`/organizations/${orgId}/analytics/overview`);
            const data = json.data || {};

            const metrics = [
                { label: 'Total Members', val: data.totalMembers || data.total_members || '—', icon: 'bi-people', color: 'text-blue-600' },
                { label: 'Active Courses', val: data.publishedCourses || data.published_courses || '—', icon: 'bi-journal-bookmark', color: 'text-primary' },
                { label: 'Total Enrollments', val: data.totalEnrollments || data.total_enrollments || '—', icon: 'bi-person-check', color: 'text-green-600' },
                { label: 'Completed Courses', val: data.completedEnrollments || data.completed_enrollments || '—', icon: 'bi-trophy', color: 'text-yellow-600' },
                { label: 'Skill Gaps', val: data.criticalGaps || data.critical_gaps || '—', icon: 'bi-exclamation-triangle', color: 'text-red-500' },
                { label: 'Certificates Issued', val: data.certificatesIssued || data.certificates_issued || '—', icon: 'bi-patch-check', color: 'text-purple-600' },
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
        } catch (e) { grid.innerHTML = `<p class="text-red-400 text-sm">${e.message}</p>`; }
    }

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
        el('twin-confidence-label').className = `text-sm font-bold confidence-${snap.confidence?.toLowerCase()}`;
        el('twin-confidence-label').textContent = snap.confidence;
        el('twin-evidence').textContent = snap.evidence_coverage != null ? `${parseFloat(snap.evidence_coverage).toFixed(0)}%` : '—';
        el('twin-competency').textContent = snap.competency_coverage != null ? `${parseFloat(snap.competency_coverage).toFixed(0)}%` : '—';
        el('twin-updated').textContent = snap.created_at ? new Date(snap.created_at).toLocaleDateString() : '—';

        const states = [
            { title: 'Workforce', icon: 'bi-people', data: snap.workforce_state },
            { title: 'Competency', icon: 'bi-diagram-3', data: snap.competency_state },
            { title: 'Training', icon: 'bi-bullseye', data: snap.training_state },
            { title: 'Learning', icon: 'bi-journal-bookmark', data: snap.learning_state },
            { title: 'Certification', icon: 'bi-patch-check', data: snap.certification_state },
        ];

        el('twin-state-grid').innerHTML = states.map(s => {
            const d = s.data || {};
            const entries = Object.entries(d).slice(0, 4);
            return `
            <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
                    <i class="bi ${s.icon} text-primary"></i> ${s.title} State
                </h3>
                ${entries.length ? entries.map(([k, v]) => `
                    <div class="flex justify-between text-xs py-1 border-b border-slate-50">
                        <span class="text-slate-500 capitalize">${k.replace(/_/g, ' ')}</span>
                        <span class="font-medium">${v ?? '—'}</span>
                    </div>
                `).join('') : '<p class="text-xs text-slate-400">Insufficient evidence for this state.</p>'}
            </div>`;
        }).join('');
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
        el('sidebar').classList.toggle('hidden');
        el('sidebar').classList.toggle('block');
    });

})();
