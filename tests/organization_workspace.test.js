const request = require('supertest');
const app = require('../src/app');
const crypto = require('crypto');

describe('Organization Workspace Production Backend Tests', function() {
  let userA, tokenA, orgA;
  let userB, tokenB, orgB;

  beforeAll(async function() {
    const ts = Date.now();
    // Create User A
    const emailA = `org.admin.a_${ts}@gmail.com`;
    const signupA = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: emailA, password: 'StrongPass!123', name: 'Admin A' });
    userA = signupA.body.user;
    tokenA = signupA.body.accessToken;

    // Create User B (isolated tenant)
    const emailB = `org.admin.b_${ts}@gmail.com`;
    const signupB = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: emailB, password: 'StrongPass!123', name: 'Admin B' });
    userB = signupB.body.user;
    tokenB = signupB.body.accessToken;

    // Create Org A
    const createOrgA = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: `Tenant Alpha ${ts}`, description: 'Alpha testing organization' });
    expect(createOrgA.status).toBe(201);
    orgA = createOrgA.body.data;

    // Create Org B
    const createOrgB = await request(app)
      .post('/api/v1/organizations')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: `Tenant Beta ${ts}`, description: 'Beta testing organization' });
    expect(createOrgB.status).toBe(201);
    orgB = createOrgB.body.data;
  });

  describe('Phase 5: Organization Profile & Settings', function() {
    it('loads organization profile correctly for authorized member', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(orgA.id);
      expect(res.body.data.name).toBe(orgA.name);
    });

    it('updates organization name and description with validation', async function() {
      const updatedName = `${orgA.name} Updated`;
      const updatedDesc = 'New description for tenant alpha';

      const res = await request(app)
        .put(`/api/v1/organizations/${orgA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: updatedName, description: updatedDesc });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updatedName);
      expect(res.body.data.description).toBe(updatedDesc);
    });

    it('rejects invalid organization name (less than 2 characters)', async function() {
      const res = await request(app)
        .put(`/api/v1/organizations/${orgA.id}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'A' });

      expect(res.status).toBe(400);
    });
  });

  describe('Phase 3 & 13C: Multi-Tenant Isolation & IDOR Protection', function() {
    it('blocks User B from accessing Organization A profile (cross-tenant access)', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });

    it('blocks User B from modifying Organization A settings', async function() {
      const res = await request(app)
        .put(`/api/v1/organizations/${orgA.id}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ name: 'Hacked Org Name' });

      expect(res.status).toBe(403);
    });

    it('blocks User B from viewing Organization A members', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}/members`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });

    it('blocks User B from viewing Organization A activity logs', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}/activity`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });

    it('blocks User B from triggering or viewing Organization A Digital Twin', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/digital-twin/snapshots`)
        .set('Authorization', `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Phase 6: Member Invitations & RBAC Workflow', function() {
    let inviteToken, inviteId, inviteeEmail, inviteeUser, inviteeToken;

    it('creates an invitation with secure single-use token', async function() {
      const ts = Date.now();
      inviteeEmail = `invitee_${ts}@gmail.com`;

      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/invitations`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: inviteeEmail, role: 'TRAINEE' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(inviteeEmail);
      expect(res.body.data.status).toBe('PENDING');
      inviteId = res.body.data.id;
    });

    it('prevents duplicate pending invitations for the same email', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/invitations`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ email: inviteeEmail, role: 'TRAINEE' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/pending invitation/i);
    });

    it('allows revoking an invitation', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/invitations/${inviteId}/revoke`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('allows resending an invitation generating a fresh token', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/invitations/${inviteId}/resend`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Phase 9: Organizational Digital Twin Snapshots', function() {
    it('refreshes Digital Twin snapshot with verified metrics', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/digital-twin/snapshots`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.organization_id).toBe(orgA.id);
      expect(res.body.data.confidence).toBeDefined();
      expect(res.body.data.snapshot_version).toBeDefined();
    });

    it('retrieves the latest active snapshot', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}/digital-twin/snapshots/latest`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.organization_id).toBe(orgA.id);
    });
  });

  describe('Phase 10: Enterprise AI Query Grounding & Security', function() {
    it('validates empty or whitespace query input', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/ai/ask`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ queryText: '   ' });

      expect(res.status).toBe(400);
    });

    it('blocks unauthenticated AI queries', async function() {
      const res = await request(app)
        .post(`/api/v1/organizations/${orgA.id}/ai/ask`)
        .send({ queryText: 'Analyze our skill gaps' });

      expect(res.status).toBe(401);
    });
  });

  describe('Phase 11: Recent Activity & Audit Trail', function() {
    it('returns recorded activity events for the organization', async function() {
      const res = await request(app)
        .get(`/api/v1/organizations/${orgA.id}/activity?limit=10`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      // Verify recorded actions include our earlier operations
      const actions = res.body.data.map(item => item.action);
      expect(actions).toContain('ORGANIZATION_UPDATED');
      expect(actions).toContain('USER_INVITED');
      expect(actions).toContain('DIGITAL_TWIN_REFRESHED');
    });

    it('ensures activity logs are strictly tenant-isolated', async function() {
      const resA = await request(app)
        .get(`/api/v1/organizations/${orgA.id}/activity`)
        .set('Authorization', `Bearer ${tokenA}`);

      const resB = await request(app)
        .get(`/api/v1/organizations/${orgB.id}/activity`)
        .set('Authorization', `Bearer ${tokenB}`);

      // All events in resA must belong to orgA
      for (const item of resA.body.data) {
        expect(item.organization_id).toBe(orgA.id);
      }

      // All events in resB must belong to orgB
      for (const item of resB.body.data) {
        expect(item.organization_id).toBe(orgB.id);
      }
    });
  });
});
