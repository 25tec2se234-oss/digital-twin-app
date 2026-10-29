const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const { pool } = require('../src/db');
const DtvAnalytics = require('../public/js/analytics');

describe('Product Analytics, Privacy, Funnel Telemetry & Technical SEO Suite', () => {
  let adminToken;
  let adminUser;
  let studentToken;
  let studentUser;

  beforeAll(async () => {
    const ts = Date.now();

    // 1. Create a regular student user
    const studentSignup = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: `student.seo_${ts}@gmail.com`,
        password: 'SecurePassword!123',
        name: 'SEO Test Student'
      });
    expect(studentSignup.status).toBe(201);
    studentToken = studentSignup.body.accessToken;
    studentUser = studentSignup.body.user;

    // 2. Create an admin user
    const adminSignup = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: `admin.analytics_${ts}@gmail.com`,
        password: 'AdminPassword!123',
        name: 'Analytics Admin Lead'
      });
    expect(adminSignup.status).toBe(201);
    adminToken = adminSignup.body.accessToken;
    adminUser = adminSignup.body.user;

    // Elevate role to 'admin' in database
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', adminUser.id]);
  }, 30000);

  describe('TASK 1 & TASK 3: Privacy & Recursive PII Scrubbing', () => {
    it('redacts sensitive credentials, passwords, tokens, and secrets from analytics payloads', () => {
      const sensitiveInput = {
        event: 'form_submitted',
        password: 'PlainSecretPassword!@#',
        auth_token: 'jwt.bearer.secret.token',
        user_secret: 'api_key_12345',
        role_selected: 'sde_backend',
        step_number: 2
      };

      const scrubbed = DtvAnalytics._scrubPayload(sensitiveInput);

      expect(scrubbed.password).toBe('[REDACTED_PII]');
      expect(scrubbed.auth_token).toBe('[REDACTED_PII]');
      expect(scrubbed.user_secret).toBe('[REDACTED_PII]');
      expect(scrubbed.role_selected).toBe('sde_backend');
      expect(scrubbed.step_number).toBe(2);
    });

    it('redacts student personal contact details, resumes, and payment card numbers', () => {
      const personalData = {
        email: 'student.private@example.edu',
        mobile_number: '+91 9876543210',
        resume_content: 'Confidential GPA 3.9, Full Address...',
        card_number: '4111222233334444',
        cvv: '123',
        proof_file: 'receipt_upload_path.pdf',
        target_role: 'data_analyst'
      };

      const scrubbed = DtvAnalytics._scrubPayload(personalData);

      expect(scrubbed.email).toBe('[REDACTED_PII]');
      expect(scrubbed.mobile_number).toBe('[REDACTED_PII]');
      expect(scrubbed.resume_content).toBe('[REDACTED_PII]');
      expect(scrubbed.card_number).toBe('[REDACTED_PII]');
      expect(scrubbed.cvv).toBe('[REDACTED_PII]');
      expect(scrubbed.proof_file).toBe('[REDACTED_PII]');
      expect(scrubbed.target_role).toBe('data_analyst');
    });

    it('handles nested objects and arrays recursively without throwing or dropping safe keys', () => {
      const nestedInput = {
        metadata: {
          client_version: '2.4.0',
          credentials: {
            user_password: 'deeplyNestedPassword',
            access_token: 'secret_jwt'
          }
        },
        items: [
          { skill_id: 'sql_indexing', confidence: 0.8 },
          { applicant_email: 'applicant@gmail.com', skill_id: 'git_flow' }
        ]
      };

      const scrubbed = DtvAnalytics._scrubPayload(nestedInput);

      expect(scrubbed.metadata.client_version).toBe('2.4.0');
      expect(scrubbed.metadata.credentials.user_password).toBe('[REDACTED_PII]');
      expect(scrubbed.metadata.credentials.access_token).toBe('[REDACTED_PII]');
      expect(scrubbed.items[0].skill_id).toBe('sql_indexing');
      expect(scrubbed.items[0].confidence).toBe(0.8);
      expect(scrubbed.items[1].applicant_email).toBe('[REDACTED_PII]');
      expect(scrubbed.items[1].skill_id).toBe('git_flow');
    });

    it('respects user opt-out and Do Not Track flags without dispatching', () => {
      DtvAnalytics.setOptOut(true);
      expect(DtvAnalytics.isOptedOut()).toBe(true);

      // Reset opt-out for other tests
      DtvAnalytics.setOptOut(false);
      expect(DtvAnalytics.isOptedOut()).toBe(false);
    });
  });

  describe('TASK 2 & TASK 4: Funnel Definitions & Real Analytics Dashboard Endpoint', () => {
    it('rejects unauthorized unauthenticated requests to /api/v1/dashboard/metrics with 401', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/metrics')
        .set('Accept', 'application/json')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('rejects non-admin student requests to /api/v1/dashboard/metrics with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/metrics')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(403);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/insufficient permissions/i);
    });

    it('returns authentic database-backed funnel telemetry and retention metrics for admin', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/metrics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.metrics).toBeDefined();

      const { funnel, retention, financial, institutional_pipeline, data_transparency } = res.body.metrics;

      // 1. Funnel Verification
      expect(funnel).toBeDefined();
      expect(typeof funnel.registrations).toBe('number');
      expect(typeof funnel.goalsSelected).toBe('number');
      expect(typeof funnel.assessmentsCompleted).toBe('number');
      expect(typeof funnel.roadmapsGenerated).toBe('number');
      expect(typeof funnel.tasksCompleted).toBe('number');
      expect(typeof funnel.paidConversions).toBe('number');

      // 2. Retention Verification
      expect(retention).toBeDefined();
      expect(typeof retention.activeUsers7d).toBe('number');
      expect(typeof retention.activeUsers30d).toBe('number');
      expect(typeof retention.returningRate7d).toBe('number');

      // 3. Financial Telemetry Verification
      expect(financial).toBeDefined();
      expect(typeof financial.verifiedPaidCount).toBe('number');
      expect(typeof financial.totalGrossInr).toBe('number');
      expect(typeof financial.avgOrderValueInr).toBe('number');

      // 4. Institutional Pipeline Verification
      expect(institutional_pipeline).toBeDefined();
      expect(typeof institutional_pipeline.totalInquiries).toBe('number');
      expect(typeof institutional_pipeline.scheduledDemos).toBe('number');
      expect(typeof institutional_pipeline.pilotAgreed).toBe('number');

      // 5. Data Transparency & Zero Fabrication Guarantee
      expect(data_transparency).toBeDefined();
      expect(data_transparency.verifiedTelemetry).toBe(true);
      expect(data_transparency.sources).toBeInstanceOf(Array);
      expect(data_transparency.sources.length).toBeGreaterThanOrEqual(3);
      expect(data_transparency.zeroFabricationNotice).toMatch(/no synthetic/i);
    });
  });

  describe('TASK 5: Technical SEO Audit & Infrastructure Files', () => {
    it('verifies public/sitemap.xml exists, is valid XML, and includes all critical landing pages', () => {
      const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);

      const content = fs.readFileSync(sitemapPath, 'utf8');
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');

      // Check critical routes
      expect(content).toContain('<loc>https://digitaltwinvrs.com/</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/institutions</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/parent</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/problem/missed-earnings</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/problem/mounting-stress</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/problem/no-personalisation</loc>');
      expect(content).toContain('<loc>https://digitaltwinvrs.com/problem/years-wasted</loc>');
    });

    it('verifies public/robots.txt contains correct crawl directives and sitemap declaration', () => {
      const robotsPath = path.join(__dirname, '../public/robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);

      const content = fs.readFileSync(robotsPath, 'utf8');
      expect(content).toContain('User-agent: *');
      expect(content).toContain('Disallow: /admin');
      expect(content).toContain('Disallow: /api/');
      expect(content).toContain('Disallow: /login');
      expect(content).toContain('Disallow: /uploads/');
      expect(content).toContain('Sitemap: https://digitaltwinvrs.com/sitemap.xml');

      // Ensure /parent and /institutions are NOT disallowed
      expect(content).not.toMatch(/Disallow:\s*\/parent\s*$/m);
      expect(content).not.toMatch(/Disallow:\s*\/institutions\s*$/m);
    });

    it('verifies JSON-LD structured data and canonical links in public/institutional.html', () => {
      const institutionalPath = path.join(__dirname, '../public/institutional.html');
      expect(fs.existsSync(institutionalPath)).toBe(true);

      const html = fs.readFileSync(institutionalPath, 'utf8');
      expect(html).toContain('<link rel="canonical" href="https://digitaltwinvrs.com/institutions">');
      expect(html).toContain('application/ld+json');
      expect(html).toContain('"@type": "EducationalOrganization"');
      expect(html).toContain('"@type": "Service"');
      expect(html).toContain('G-G79C8YZYXF');
      expect(html).toMatch(/(?:js\/analytics|dist\/analytics[.\w-]*)\.js/);
    });

    it('verifies analytics script inclusion and CTA tracking in public/index.html', () => {
      const indexPath = path.join(__dirname, '../public/index.html');
      const html = fs.readFileSync(indexPath, 'utf8');

      expect(html).toMatch(/src="(?:\/js\/analytics|\/dist\/analytics[.\w-]*)\.js/);
      expect(html).toContain('DtvAnalytics.trackEntryPoint');
    });
  });
});
