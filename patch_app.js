const fs = require('fs');
let content = fs.readFileSync('public/organization/app.js', 'utf8');

// 1. Phase 8: AI Training Needs
const oldTraining = `    async function loadTraining() {
        const list = el('training-list');
        list.innerHTML = \`<p class="text-slate-400 text-sm">Loading...</p>\`;
        try {
            const json = await api(\`/organizations/\${orgId}/training-needs\`);
            const items = json.data || [];
            if (!items.length) {
                list.innerHTML = \`<div class="text-center py-10 text-slate-400"><i class="bi bi-bullseye text-4xl block mb-2"></i>No training needs recorded.</div>\`;
                return;
            }
            list.innerHTML = items.map(t => \`
                <div class="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="font-medium text-sm">\${t.title || t.skill_name || 'Training Need'}</h3>
                            <p class="text-xs text-slate-400 mt-0.5">\${t.description || '—'}</p>
                        </div>
                        \${statusBadge(t.status || 'PENDING')}
                    </div>
                </div>
            \`).join('');
        } catch (e) { list.innerHTML = \`<p class="text-red-400 text-sm">\${e.message}</p>\`; }
    }`;

const newTraining = `    async function loadTraining() {
        const list = el('training-list');
        list.innerHTML = '<p class="text-slate-400 text-sm">Analyzing training needs...</p>';
        try {
            // Populate filters if empty
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
    });`;

if (content.includes(oldTraining)) {
    content = content.replace(oldTraining, newTraining);
    console.log("Phase 8 applied");
} else {
    console.log("oldTraining not found");
}


// 2. Phase 9: Digital Twin Render
const oldRenderTwin = `    function renderTwin(snap) {
        if (!snap) return;
        const confidenceBar = el('twin-confidence-bar');
        confidenceBar.classList.remove('hidden');
        el('twin-confidence-label').className = \`text-sm font-bold confidence-\${snap.confidence?.toLowerCase()}\`;
        el('twin-confidence-label').textContent = snap.confidence;
        el('twin-evidence').textContent = snap.evidence_coverage != null ? 
\`\${parseFloat(snap.evidence_coverage).toFixed(0)}%\` : '—';
        el('twin-competency').textContent = snap.competency_coverage != null ? 
\`\${parseFloat(snap.competency_coverage).toFixed(0)}%\` : '—';
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
            return \`
            <div class="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
                <h3 class="font-semibold text-sm mb-3 flex items-center gap-2">
                    <i class="bi \${s.icon} text-primary"></i> \${s.title} State
                </h3>
                \${entries.length ? entries.map(([k, v]) => \`
                    <div class="flex justify-between text-xs py-1 border-b border-slate-50">
                        <span class="text-slate-500 capitalize">\${k.replace(/_/g, ' ')}</span>
                        <span class="font-medium">\${v ?? '—'}</span>
                    </div>
                \`).join('') : '<p class="text-xs text-slate-400">Insufficient evidence for this state.</p>'}
            </div>\`;
        }).join('');
    }`;


const newRenderTwin = `    function renderTwin(snap) {
        if (!snap) return;
        const confidenceBar = el('twin-confidence-bar');
        confidenceBar.classList.remove('hidden');
        el('twin-confidence-label').className = \`text-sm font-bold confidence-\${snap.confidence?.toLowerCase()}\`;
        el('twin-confidence-label').textContent = snap.confidence;
        el('twin-evidence').textContent = snap.evidence_coverage != null ? 
            \`\${parseFloat(snap.evidence_coverage).toFixed(0)}%\` : '—';
        el('twin-competency').textContent = snap.competency_coverage != null ? 
            \`\${parseFloat(snap.competency_coverage).toFixed(0)}%\` : '—';
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
    }`;

if (content.includes(oldRenderTwin)) {
    content = content.replace(oldRenderTwin, newRenderTwin);
    console.log("Phase 9 applied");
} else {
    console.log("oldRenderTwin not found");
}

fs.writeFileSync('public/organization/app.js', content, 'utf8');
