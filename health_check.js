// Comprehensive health check for all DTV Capacity Connect modules
require('dotenv').config();
const { pool } = require('./src/db');

const BASE = 'http://localhost:3000/api/v1';
let token = null;
let orgId = null;
const results = [];

async function req(method, path, body, customToken) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(customToken || token ? { Authorization: `Bearer ${customToken || token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    };
    const res = await fetch(`${BASE}${path}`, opts);
    const json = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, json };
}

async function check(label, fn) {
    try {
        const result = await fn();
        results.push({ label, ok: true, detail: result });
        console.log(`  ✅ ${label}`);
    } catch(e) {
        results.push({ label, ok: false, detail: e.message });
        console.log(`  ❌ ${label}: ${e.message}`);
    }
}

async function run() {
    console.log('\n🔍 DTV Capacity Connect — Full System Health Check\n');
    console.log('═══════════════════════════════════════════════\n');

    // ── Database Tables ───────────────────────────────────────────────
    console.log('📦 DATABASE TABLES:');
    const expectedTables = [
        'users','organizations','org_memberships',
        'org_courses','org_course_modules','org_course_resources','org_course_enrollments',
        'org_assessments','org_questions','org_assessment_attempts',
        'org_competencies','org_skills','org_competency_snapshots',
        'org_skill_gaps','org_training_needs',
        'org_trainer_matches',
        'org_capacity_insights',
        'org_knowledge_resources','org_certificate_templates','org_certificates',
        'org_notifications','org_notification_preferences',
        'org_digital_twin_snapshots','org_ai_conversations',
    ];

    const tabRes = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    const existingTables = tabRes.rows.map(r => r.table_name);

    for (const t of expectedTables) {
        const exists = existingTables.includes(t);
        results.push({ label: `Table: ${t}`, ok: exists, detail: exists ? 'EXISTS' : 'MISSING' });
        console.log(`  ${exists ? '✅' : '❌'} ${t}`);
    }

    // ── API Server ────────────────────────────────────────────────────
    console.log('\n🌐 API SERVER:');
    await check('Health endpoint', async () => {
        const r = await req('GET', '/health');
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return 'OK';
    });

    // ── Authentication ────────────────────────────────────────────────
    console.log('\n🔐 AUTHENTICATION:');
    await check('Login endpoint reachable', async () => {
        const r = await req('POST', '/auth/login', { email: 'test@test.com', password: 'wrong' });
        if (r.status === 404) throw new Error('Route not found');
        return `HTTP ${r.status} (expected 401/400)`;
    });

    // ── Route Availability (no auth) ──────────────────────────────────
    console.log('\n🛣️  ROUTE AVAILABILITY (unauthenticated):');
    const publicRoutes = [
        ['/organizations', 'Organizations list'],
        ['/organizations/test-id/courses', 'Courses route'],
        ['/organizations/test-id/assessments', 'Assessments route'],
        ['/organizations/test-id/competencies', 'Competencies route'],
        ['/organizations/test-id/skill-gaps', 'Skill Gaps route'],
        ['/organizations/test-id/training-needs', 'Training Needs route'],
        ['/organizations/test-id/knowledge', 'Knowledge route'],
        ['/organizations/test-id/certificates', 'Certificates route'],
        ['/organizations/test-id/analytics/overview', 'Analytics route'],
        ['/organizations/test-id/digital-twin/snapshots/latest', 'Digital Twin route'],
        ['/organizations/test-id/ai/ask', 'Enterprise AI route (POST)'],
        ['/organizations/test-id/notifications', 'Notifications route'],
    ];

    for (const [path, label] of publicRoutes) {
        await check(label, async () => {
            const method = path.includes('ask') ? 'POST' : 'GET';
            const r = await req(method, path, method === 'POST' ? { queryText: 'test' } : undefined);
            if (r.status === 404 && r.json.error?.includes('Cannot')) throw new Error('Route NOT FOUND (404)');
            // 401/403 = route exists but auth fails (expected)
            return `HTTP ${r.status}`;
        });
    }

    // ── Frontend Files ────────────────────────────────────────────────
    console.log('\n🖥️  FRONTEND FILES:');
    const frontendFiles = [
        ['/organization/', 'Organization Dashboard HTML'],
        ['/organization/app.js', 'Organization Dashboard JS'],
        ['/login.html', 'Login Page'],
    ];

    for (const [path, label] of frontendFiles) {
        await check(label, async () => {
            const r = await req('GET', path.replace('/api/v1', '').replace('/api/v1', ''));
            const realRes = await fetch(`http://localhost:3000${path}`);
            if (!realRes.ok) throw new Error(`HTTP ${realRes.status}`);
            const len = (await realRes.text()).length;
            return `${len} bytes`;
        });
    }

    // ── Module Service Imports ────────────────────────────────────────
    console.log('\n📋 SERVICE MODULE INTEGRITY:');
    const services = [
        'orgAnalyticsService', 'orgCertificationService', 'orgKnowledgeService',
        'orgNotificationService', 'orgDigitalTwinService', 'enterpriseAiService',
        'trainerMatchingService', 'skillGapService', 'competencyEngineService',
    ];
    for (const s of services) {
        await check(`Service: ${s}`, async () => {
            require(`./src/services/${s}`);
            return 'OK';
        });
    }

    // ── Final Summary ─────────────────────────────────────────────────
    const failed = results.filter(r => !r.ok);
    const passed = results.filter(r => r.ok);

    console.log('\n═══════════════════════════════════════════════');
    console.log(`\n📊 SUMMARY: ${passed.length} passed, ${failed.length} failed\n`);
    
    if (failed.length) {
        console.log('❌ FAILURES:');
        failed.forEach(f => console.log(`   • ${f.label}: ${f.detail}`));
    } else {
        console.log('✅ All checks passed!');
    }

    console.log('\n🔗 LOCAL ACCESS: http://localhost:3000/organization/\n');
    await pool.end();
    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
