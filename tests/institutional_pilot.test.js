const request = require('supertest');
const app = require('../src/app');
const institutionalService = require('../src/services/institutionalService');

describe('Institutional Pilot Validation, Inquiries, Cohort Management & Anti-IDOR RBAC', () => {
  let userA, tokenA, orgA;
  let userB, tokenB, orgB;
  let studentUser, studentToken;
  let cohortA;

  beforeAll(async () => {
    const ts = Date.now();

    // 1. Setup User A (Org Admin for Org A)
    const emailA = `inst.admin.a_${ts}@gmail.com`;
    const signupA = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: emailA, password: 'StrongPass!123', name: 'Dean Sharma (Org A)' });
    expect(signupA.status).toBe(201);
    userA = signupA.body.user;
    tokenA = signupA.body.accessToken;

    // 2. Setup User B (Org Admin for Org B - Isolated Tenant)
    const emailB = `inst.admin.b_${ts}@gmail.com`;
    const signupB = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: emailB, password: 'StrongPass!123', name: 'Director Verma (Org B)' });
    expect(signupB.status).toBe(201);
    userB = signupB.body.user;
    tokenB = signupB.body.accessToken;

    // 3. Setup a separate Student user
    const studentEmail = `pilot.student_${ts}@gmail.com`;
    const signupStudent = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: studentEmail, password: 'StrongPass!123', name: 'Test Student Rahul' });
    expect(signupStudent.status).toBe(201);
    studentUser = signupStudent.body.user;
    studentToken = signupStudent.body.accessToken;

    // 4. Create Organization A
    const createOrgA = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: `Apex College of Engineering ${ts}`, description: 'Pilot evaluation institution A' });
    expect(createOrgA.status).toBe(201);
    orgA = createOrgA.body.data;

    // 5. Create Organization B
    const createOrgB = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: `Metro Institute of Tech ${ts}`, description: 'Pilot evaluation institution B' });
    expect(createOrgB.status).toBe(201);
    orgB = createOrgB.body.data;
  }, 35000);

  describe('PHASE B: Inquiry Submission, Validation & Anti-Spam Workflow', () => {
    it('rejects inquiry with missing contact name or invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/institutions/inquiry')
        .send({
          contact_name: '',
          contact_email: 'not-an-email',
          institution_name: 'Test Engineering College',
          role_title: 'TPO',
          cohort_size: '50-100',
          target_role: 'Full-Stack Web Development',
          pilot_timeline: 'Immediate (Next 30 Days)'
        })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it('rejects inquiry with missing required institutional parameters', async () => {
      const res = await request(app)
        .post('/api/v1/institutions/inquiry')
        .send({
          contact_name: 'Dr. Anand Rao',
          contact_email: 'arao@college.edu',
          institution_name: '',
          role_title: '',
          cohort_size: '',
          target_role: '',
          pilot_timeline: ''
        })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it('detects and silently rejects spam honeypot challenge', async () => {
      const res = await request(app)
        .post('/api/v1/institutions/inquiry')
        .send({
          contact_name: 'Spam Bot',
          contact_email: 'bot@spamnetwork.com',
          institution_name: 'Fake College',
          role_title: 'Spammer',
          cohort_size: '50-100',
          target_role: 'Full-Stack Web Development',
          pilot_timeline: 'Immediate (Next 30 Days)',
          hp_challenge: 'I am a malicious bot filling hidden fields'
        })
        .expect(400);

      expect(res.body.error).toMatch(/invalid request submission/i);
    });

    it('successfully processes valid pilot inquiry and generates reference ID', async () => {
      const ts = Date.now();
      const validEmail = `tpo_lead_${ts}@pioneerinstitute.edu`;

      const res = await request(app)
        .post('/api/v1/institutions/inquiry')
        .send({
          contact_name: 'Prof. Sangeeta Kulkarni',
          contact_email: validEmail,
          institution_name: 'Pioneer Institute of Technology',
          role_title: 'Training & Placement Officer (TPO)',
          phone: '+91 98765 12345',
          cohort_size: '50-100',
          target_role: 'Full-Stack Web Development',
          pilot_timeline: 'Immediate (Next 30 Days)',
          notes: 'Preparing 2026 B.Tech CSE batch for campus tech drives.'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.reference_id).toMatch(/^DTV-PILOT-[A-F0-9]+$/);
      expect(res.body.message).toContain('reference ID has been recorded');
      expect(res.body.is_duplicate).toBe(false);

      // Verify duplicate suppression within 24 hours
      const dupRes = await request(app)
        .post('/api/v1/institutions/inquiry')
        .send({
          contact_name: 'Prof. Sangeeta Kulkarni',
          contact_email: validEmail,
          institution_name: 'Pioneer Institute of Technology',
          role_title: 'Training & Placement Officer (TPO)',
          cohort_size: '50-100',
          target_role: 'Full-Stack Web Development',
          pilot_timeline: 'Immediate (Next 30 Days)'
        })
        .expect(201);

      expect(dupRes.body.success).toBe(true);
      expect(dupRes.body.is_duplicate).toBe(true);
      expect(dupRes.body.reference_id).toBe(res.body.reference_id);
    });
  });

  describe('PHASE D: Strict Multi-Tenant Access Control & Anti-IDOR Security', () => {
    it('blocks unauthenticated requests to institutional tenant endpoints with 401', async () => {
      await request(app)
        .get(`/api/v1/institutions/${orgA.id}/cohorts`)
        .set('Accept', 'application/json')
        .expect(401);
    });

    it('prevents cross-tenant IDOR: User B cannot access Org A cohorts (returns 403)', async () => {
      const res = await request(app)
        .get(`/api/v1/institutions/${orgA.id}/cohorts`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(403);

      expect(res.body.error).toMatch(/do not have access to this organization/i);
    });

    it('prevents unauthorized student from accessing or creating cohorts in an organization', async () => {
      const res = await request(app)
        .post(`/api/v1/institutions/${orgA.id}/cohorts`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Unauthorized Student Cohort',
          department: 'Computer Science',
          target_graduation_year: 2026
        })
        .expect(403);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('PHASE C & E: Cohort Management, Enrollment & Aggregate Readiness Heatmap', () => {
    it('allows authorized Org Admin A to create a 30-day placement cohort', async () => {
      const res = await request(app)
        .post(`/api/v1/institutions/${orgA.id}/cohorts`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          name: '2026 B.Tech CSE Placement Pilot Batch',
          department: 'Computer Science & Engineering',
          target_role: 'sde_backend',
          target_graduation_year: 2026,
          pilot_start_date: '2026-11-01',
          pilot_end_date: '2026-11-30'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.cohort).toBeDefined();
      expect(res.body.cohort.organization_id).toBe(orgA.id);
      expect(res.body.cohort.name).toBe('2026 B.Tech CSE Placement Pilot Batch');
      cohortA = res.body.cohort;
    });

    it('lists cohorts strictly isolated to Org A', async () => {
      const res = await request(app)
        .get(`/api/v1/institutions/${orgA.id}/cohorts`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.cohorts)).toBe(true);
      const found = res.body.cohorts.find(c => c.id === cohortA.id);
      expect(found).toBeDefined();
    });

    it('enforces anti-IDOR entity scoping: User B cannot query Cohort A under Org B URL (returns 404/403)', async () => {
      const res = await request(app)
        .get(`/api/v1/institutions/${orgB.id}/cohorts/${cohortA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      // The cohort exists in Org A, but does NOT belong to Org B
      expect([403, 404]).toContain(res.status);
    });

    it('allows enrolling student into cohort with institutional reporting consent', async () => {
      const res = await request(app)
        .post(`/api/v1/institutions/${orgA.id}/cohorts/${cohortA.id}/students`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({
          userId: studentUser.id,
          rollNumber: '2026CSE042'
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.enrollment.cohort_id).toBe(cohortA.id);
      expect(res.body.enrollment.user_id).toBe(studentUser.id);
      expect(res.body.enrollment.consent_institutional_reporting).toBe(true);
    });

    it('computes aggregate cohort placement readiness heatmap without exposing raw student answers', async () => {
      const res = await request(app)
        .get(`/api/v1/institutions/${orgA.id}/cohorts/${cohortA.id}/readiness`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.report).toBeDefined();
      expect(res.body.report.cohort.id).toBe(cohortA.id);
      expect(res.body.report.metrics.total_enrolled_students).toBeGreaterThanOrEqual(1);
      expect(res.body.report.metrics.placement_readiness_distribution).toBeDefined();
      expect(res.body.report.metrics.placement_readiness_distribution).toHaveProperty('critical_attention');
      expect(res.body.report.metrics.placement_readiness_distribution).toHaveProperty('developing');
      expect(res.body.report.metrics.placement_readiness_distribution).toHaveProperty('placement_ready');
      expect(res.body.report.privacy_notice).toMatch(/student data sovereignty/i);
    });
  });
});
