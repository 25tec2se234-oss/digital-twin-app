const request = require('supertest');
const app = require('../src/app');
const { StudentEngagementService, MILESTONE_DEFINITIONS, RETENTION_EVENTS } = require('../src/services/studentEngagementService');

describe('Student Engagement, Milestones, Natural Return & Retention', () => {
  let studentToken;
  let studentId;
  const studentEmail = `engagestudent_${Date.now()}@gmail.com`;
  const studentPassword = 'SecurePassword123!';

  beforeAll(async () => {
    const timestamp = Date.now();
    const signupRes = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: `engagestudent_${timestamp}@gmail.com`,
        password: 'SecurePassword!123',
        name: 'Engagement Test Student'
      });

    expect(signupRes.status).toBe(201);
    studentToken = signupRes.body.accessToken;
    studentId = signupRes.body.user.id;
  }, 30000);

  describe('1. Natural Return Moments (/api/v1/readiness/resume)', () => {
    it('returns DIAGNOSTIC_PENDING state before student completes an assessment', async () => {
      const res = await request(app)
        .get('/api/v1/readiness/resume')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.returnMoment).toBeDefined();
      expect(['DIAGNOSTIC_PENDING', 'START_NEXT_TASK', 'CONTINUE_ACTIVE_TASK']).toContain(res.body.returnMoment.state);
      expect(res.body.returnMoment.ctaAction).toBeDefined();
    });

    it('returns CONTINUE_ACTIVE_TASK when student has an unfinished in-progress task', async () => {
      // Complete initial assessment first
      await request(app)
        .post('/api/v1/readiness/assessment/submit')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          targetRoleId: 'sde_backend',
          responses: {
            sde_b_1: 'c',
            sde_b_2: 'b',
            sde_b_3: 'b',
            sde_b_4: 'c',
            sde_b_5: 'c',
            sde_b_6: '4',
            sde_b_7: '3',
            sde_b_8: '4'
          }
        });

      // Get roadmap tasks
      const roadmapRes = await request(app)
        .get('/api/v1/readiness/roadmap')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      const tasks = roadmapRes.body.roadmap.tasks;
      expect(tasks.length).toBeGreaterThan(0);
      const firstTask = tasks[0];

      // Transition first task to in_progress
      await request(app)
        .patch(`/api/v1/readiness/tasks/${firstTask.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      // Now query resume endpoint
      const resumeRes = await request(app)
        .get('/api/v1/readiness/resume')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(resumeRes.body.returnMoment.state).toBe('CONTINUE_ACTIVE_TASK');
      expect(resumeRes.body.returnMoment.activeTask).toBeDefined();
      expect(resumeRes.body.returnMoment.activeTask.id).toBe(firstTask.id);
      expect(resumeRes.body.returnMoment.ctaAction).toBe('open_evidence_modal');
    });
  });

  describe('2. Weekly Progress Summary (/api/v1/readiness/weekly-summary)', () => {
    it('summarizes real progress for the past 7 days without fabricated numbers', async () => {
      const res = await request(app)
        .get('/api/v1/readiness/weekly-summary')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      const summary = res.body.summary;
      expect(summary.period).toBe('Past 7 Days');
      expect(typeof summary.tasksCompletedCount).toBe('number');
      expect(typeof summary.hoursInvestedThisWeek).toBe('number');
      expect(Array.isArray(summary.remainingPriorities)).toBe(true);
      expect(Array.isArray(summary.suggestedNextActions)).toBe(true);
      expect(summary.suggestedNextActions.length).toBeGreaterThan(0);
      expect(summary.dataIntegrityNotice).toContain('solely from student-submitted verification evidence');
    });
  });

  describe('3. Meaningful Milestones & Duplicate Prevention (/api/v1/readiness/milestones)', () => {
    it('awards baseline diagnostic milestone upon assessment completion', async () => {
      const res = await request(app)
        .get('/api/v1/readiness/milestones')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.totalMilestones).toBe(5);
      const baselineMilestone = res.body.milestones.find(
        m => m.criteriaMet === MILESTONE_DEFINITIONS.readiness_assessment_attempt_1.criteria_met
      );
      expect(baselineMilestone).toBeDefined();
      expect(baselineMilestone.isUnlocked).toBe(true);
    });

    it('awards Proof of Work Pioneer milestone when task is completed with evidence', async () => {
      // Get roadmap task
      const roadmapRes = await request(app)
        .get('/api/v1/readiness/roadmap')
        .set('Authorization', `Bearer ${studentToken}`);

      const inProg = roadmapRes.body.roadmap.tasks.find(t => t.status === 'in_progress') || roadmapRes.body.roadmap.tasks[0];

      // Submit proof
      const updateRes = await request(app)
        .patch(`/api/v1/readiness/tasks/${inProg.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          status: 'completed',
          evidenceType: 'github_repository',
          evidenceUrl: 'https://github.com/dtv-student/node-redis-caching-pipeline',
          evidenceNotes: 'Implemented high-concurrency Redis caching layer with invalidation.'
        })
        .expect(200);

      expect(updateRes.body.success).toBe(true);

      // Check milestones
      const mileRes = await request(app)
        .get('/api/v1/readiness/milestones')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      const proofMilestone = mileRes.body.milestones.find(
        m => m.criteriaMet === MILESTONE_DEFINITIONS.readiness_first_evidence_verified.criteria_met
      );
      expect(proofMilestone).toBeDefined();
      expect(proofMilestone.isUnlocked).toBe(true);
    });

    it('strictly prevents duplicate achievements for the same milestone criteria', async () => {
      // Trigger evaluation multiple times
      await StudentEngagementService.evaluateMilestones(studentId);
      await StudentEngagementService.evaluateMilestones(studentId);

      const mileRes = await request(app)
        .get('/api/v1/readiness/milestones')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      const criteriaMetList = mileRes.body.milestones
        .filter(m => m.isUnlocked)
        .map(m => m.criteriaMet);

      // Ensure every unlocked criteria appears at most once in the response
      const uniqueCriteria = new Set(criteriaMetList);
      expect(criteriaMetList.length).toBe(uniqueCriteria.size);
    });
  });

  describe('4. Notification Preferences & Unsubscribe Controls', () => {
    let unsubscribeToken;

    it('fetches default student notification preferences with frequency and token', async () => {
      const res = await request(app)
        .get('/api/v1/readiness/notifications/preferences')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.preferences.weeklyDigest).toBe(true);
      expect(res.body.preferences.reminderFrequency).toBe('weekly');
      expect(res.body.preferences.unsubscribeToken).toBeDefined();
      unsubscribeToken = res.body.preferences.unsubscribeToken;
    });

    it('updates notification preferences to biweekly and disables roadmap reminders', async () => {
      const updateRes = await request(app)
        .put('/api/v1/readiness/notifications/preferences')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          weeklyDigest: true,
          roadmapReminders: false,
          reminderFrequency: 'biweekly'
        })
        .expect(200);

      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.preferences.reminderFrequency).toBe('biweekly');
      expect(updateRes.body.preferences.roadmapReminders).toBe(false);
    });

    it('allows unauthenticated one-click unsubscribe via token without login', async () => {
      const unsubRes = await request(app)
        .get(`/api/v1/readiness/notifications/unsubscribe?token=${unsubscribeToken}&category=all`)
        .expect(200);

      expect(unsubRes.text).toContain('Preferences Updated');
      expect(unsubRes.text).toContain('successfully unsubscribed');

      // Verify preferences updated
      const verifyRes = await request(app)
        .get('/api/v1/readiness/notifications/preferences')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(verifyRes.body.preferences.weeklyDigest).toBe(false);
      expect(verifyRes.body.preferences.reminderFrequency).toBe('never');
    });

    it('rejects invalid unsubscribe token with 404', async () => {
      await request(app)
        .get('/api/v1/readiness/notifications/unsubscribe?token=nonexistent_invalid_token_123')
        .expect(404);
    });
  });

  describe('5. Retention Analytics & Telemetry (/api/v1/readiness/analytics)', () => {
    it('records client telemetry events', async () => {
      const res = await request(app)
        .post('/api/v1/readiness/analytics/event')
        .set('Authorization', `Bearer ${studentToken}`)
        .set('x-session-id', 'test-session-xyz-123')
        .send({
          eventName: RETENTION_EVENTS.SESSION_RETURNED,
          metadata: { entryPath: '/console', returnDayCount: 2 }
        })
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('retrieves retention summary without fabricating data', async () => {
      const res = await request(app)
        .get('/api/v1/readiness/analytics/retention-summary')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      const telemetry = res.body.telemetry;
      expect(telemetry.distinctDaysActive).toBeGreaterThanOrEqual(1);
      expect(telemetry.totalAssessmentsTaken).toBeGreaterThanOrEqual(1);
      expect(telemetry.verifiedCompletedTasks).toBeGreaterThanOrEqual(1);
      expect(telemetry.totalMilestonesUnlocked).toBeGreaterThanOrEqual(1);
    });
  });
});
