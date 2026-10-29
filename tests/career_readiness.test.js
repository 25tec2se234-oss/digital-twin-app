const request = require('supertest');
const app = require('../src/app');

describe('Career Readiness Workflow & Engine', function() {
  let studentAToken;
  let studentBToken;
  let studentAId;
  let taskIdUserA;

  beforeAll(async function() {
    const timestamp = Date.now();
    // Student A
    const signupA = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: `student.a_${timestamp}@gmail.com`,
        password: 'SecurePassword!123',
        name: 'Student A'
      });
    expect(signupA.status).toBe(201);
    studentAToken = signupA.body.accessToken;
    studentAId = signupA.body.user.id;

    // Student B (for authorization checks)
    const signupB = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: `student.b_${timestamp}@gmail.com`,
        password: 'SecurePassword!123',
        name: 'Student B'
      });
    expect(signupB.status).toBe(201);
    studentBToken = signupB.body.accessToken;
  }, 30000);

  describe('1. Authentication & Authorization Gates', function() {
    it('rejects unauthenticated requests to protected endpoints with 401', async function() {
      const endpoints = [
        { method: 'get', url: '/api/v1/readiness/profile' },
        { method: 'put', url: '/api/v1/readiness/profile' },
        { method: 'post', url: '/api/v1/readiness/assessment/submit' },
        { method: 'get', url: '/api/v1/readiness/assessment/history' },
        { method: 'get', url: '/api/v1/readiness/roadmap' },
        { method: 'get', url: '/api/v1/readiness/progress' }
      ];

      for (const ep of endpoints) {
        const res = await request(app)[ep.method](ep.url)
          .set('Accept', 'application/json')
          .send({});
        expect(res.status).toBe(401);
      }
    });

    it('allows unauthenticated access to questions preview', async function() {
      const res = await request(app).get('/api/v1/readiness/questions?role=sde_backend');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBeGreaterThan(0);
      // Ensure answer keys are NOT exposed
      res.body.questions.forEach(q => {
        expect(q.correctOptionIndex).toBeUndefined();
      });
    });
  });

  describe('2. Student Profile Management', function() {
    it('returns default career profile for authenticated student', async function() {
      const res = await request(app)
        .get('/api/v1/readiness/profile')
        .set('Authorization', 'Bearer ' + studentAToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.targetRoleId).toBeDefined();
    });

    it('updates career profile preferences', async function() {
      const res = await request(app)
        .put('/api/v1/readiness/profile')
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({
          targetRoleId: 'sde_backend',
          currentEducationLevel: 'undergraduate_final_year',
          targetTimelineWeeks: 4,
          weeklyHoursAvailable: 20
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.targetRoleId).toBe('sde_backend');
      expect(res.body.profile.weeklyHoursAvailable).toBe(20);
    });

    it('validates required targetRoleId on profile update', async function() {
      const res = await request(app)
        .put('/api/v1/readiness/profile')
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({ targetRoleId: '' });

      expect(res.status).toBe(400);
    });
  });

  describe('3. Assessment Submission, Scoring & Results', function() {
    it('evaluates assessment with correct answers and computes deterministic score', async function() {
      const responses = {
        backend_q1: 1, // Correct
        backend_q2: 1, // Correct
        backend_q3: 1, // Correct
        backend_q4: 2, // Correct
        backend_q5: 1, // Correct
        backend_sr1: 4,
        backend_sr2: 4,
        backend_sr3: 4
      };

      const res = await request(app)
        .post('/api/v1/readiness/assessment/submit')
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({
          targetRoleId: 'sde_backend',
          responses: responses
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      const result = res.body.result;

      expect(result.attemptNumber).toBe(1);
      expect(result.scores.objectiveScore).toBe(100);
      expect(result.scores.objectiveCorrect).toBe(5);
      expect(result.scores.selfReportedScore).toBe(80);
      // 0.70 * 100 + 0.30 * 80 = 94
      expect(result.scores.compositeScore).toBe(94);
      expect(result.limitations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.roadmap).toBeDefined();
      expect(result.roadmap.tasks.length).toBe(4);

      taskIdUserA = result.roadmap.tasks[0].id;
    });

    it('identifies priority skill gaps when incorrect answers are submitted', async function() {
      const responses = {
        backend_q1: 0, // Incorrect -> database_indexing gap
        backend_q2: 0, // Incorrect -> async_error_handling gap
        backend_q3: 1, // Correct
        backend_q4: 1, // Incorrect -> security_authentication gap
        backend_q5: 1, // Correct
        backend_sr1: 2,
        backend_sr2: 2,
        backend_sr3: 2
      };

      // Create a temporary student to evaluate gaps
      const tempUser = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: `student.gaps_${Date.now()}@gmail.com`,
          password: 'SecurePassword!123',
          name: 'Gaps Test User'
        });

      const res = await request(app)
        .post('/api/v1/readiness/assessment/submit')
        .set('Authorization', 'Bearer ' + tempUser.body.accessToken)
        .send({
          targetRoleId: 'sde_backend',
          responses: responses
        });

      expect(res.status).toBe(201);
      const result = res.body.result;
      expect(result.scores.objectiveCorrect).toBe(2);
      expect(result.scores.objectiveScore).toBe(40);
      expect(result.skillGaps.length).toBeGreaterThan(0);

      // Verify that skill gaps have severity and reasoning
      result.skillGaps.forEach(gap => {
        expect(['high', 'medium', 'low']).toContain(gap.severity);
        expect(gap.rationale).toBeDefined();
      });
    });

    it('rejects invalid or empty assessment submissions with 400', async function() {
      const res = await request(app)
        .post('/api/v1/readiness/assessment/submit')
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({ targetRoleId: 'sde_backend', responses: {} });

      expect(res.status).toBe(400);
    });
  });

  describe('4. Personalized Roadmap & Task Completion Rules', function() {
    it('retrieves the active personalized roadmap for the student', async function() {
      const res = await request(app)
        .get('/api/v1/readiness/roadmap')
        .set('Authorization', 'Bearer ' + studentAToken);

      expect(res.status).toBe(200);
      expect(res.body.hasRoadmap).toBe(true);
      expect(res.body.roadmap.tasks.length).toBe(4);

      const task1 = res.body.roadmap.tasks[0];
      expect(task1.weekNumber).toBe(1);
      expect(task1.status).toBe('not_started');
      expect(task1.completionCriteria).toBeDefined();
    });

    it('transitions task status to in_progress', async function() {
      const res = await request(app)
        .patch(`/api/v1/readiness/tasks/${taskIdUserA}`)
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({ status: 'in_progress' });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('in_progress');
      expect(res.body.task.startedAt).toBeDefined();
    });

    it('rejects completing a task without verification evidence (prevents clicking-through)', async function() {
      const res = await request(app)
        .patch(`/api/v1/readiness/tasks/${taskIdUserA}`)
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({ status: 'completed' });

      expect(res.status).toBe(422);
      expect(res.body.message).toContain('Completion requirement');
    });

    it('marks a task completed when valid verification evidence is provided', async function() {
      const res = await request(app)
        .patch(`/api/v1/readiness/tasks/${taskIdUserA}`)
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({
          status: 'completed',
          evidenceType: 'github_repo',
          evidenceUrl: 'https://github.com/student/btree-indexing-proof',
          evidenceNotes: 'Implemented composite index and reduced EXPLAIN query latency from 85ms to 4ms.'
        });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('completed');
      expect(res.body.task.completedAt).toBeDefined();
      expect(res.body.task.evidenceUrl).toBe('https://github.com/student/btree-indexing-proof');
    });

    it('enforces authorization: Student B cannot update Student A tasks', async function() {
      const res = await request(app)
        .patch(`/api/v1/readiness/tasks/${taskIdUserA}`)
        .set('Authorization', 'Bearer ' + studentBToken)
        .send({ status: 'in_progress' });

      expect(res.status).toBe(404);
    });
  });

  describe('5. Progress Analytics & Summary', function() {
    it('retrieves comprehensive progress analytics', async function() {
      const res = await request(app)
        .get('/api/v1/readiness/progress')
        .set('Authorization', 'Bearer ' + studentAToken);

      expect(res.status).toBe(200);
      const summary = res.body.summary;
      expect(summary.careerProfile).toBeDefined();
      expect(summary.latestAssessment).toBeDefined();
      expect(summary.roadmapMetrics.totalTasks).toBe(4);
      expect(summary.roadmapMetrics.completedTasks).toBe(1);
      expect(summary.roadmapMetrics.completionPercentage).toBe(25);
      expect(summary.currentReadinessScore).toBeGreaterThan(0);
    });
  });

  describe('6. Reassessment & Comparative Analysis', function() {
    it('increments attempt number and explains score changes on reassessment', async function() {
      // Submit Attempt 2 with lower self-reported score to test comparative delta calculation
      const responsesAttempt2 = {
        backend_q1: 1,
        backend_q2: 1,
        backend_q3: 1,
        backend_q4: 2,
        backend_q5: 1,
        backend_sr1: 2,
        backend_sr2: 2,
        backend_sr3: 2
      };

      const res = await request(app)
        .post('/api/v1/readiness/assessment/submit')
        .set('Authorization', 'Bearer ' + studentAToken)
        .send({
          targetRoleId: 'sde_backend',
          responses: responsesAttempt2
        });

      expect(res.status).toBe(201);
      const result = res.body.result;
      expect(result.attemptNumber).toBe(2);
      expect(result.comparison).toBeDefined();
      expect(result.comparison.previousAttemptNumber).toBe(1);
      expect(result.comparison.comparisonNarrative).toBeDefined();
    });

    it('retrieves complete chronological assessment history with comparative deltas', async function() {
      const res = await request(app)
        .get('/api/v1/readiness/assessment/history?role=sde_backend')
        .set('Authorization', 'Bearer ' + studentAToken);

      expect(res.status).toBe(200);
      expect(res.body.totalAttempts).toBe(2);
      expect(res.body.history[0].attemptNumber).toBe(2);
      expect(res.body.history[1].attemptNumber).toBe(1);
    });
  });
});
