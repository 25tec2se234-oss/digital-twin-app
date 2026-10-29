const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const careerReadinessModel = require('../models/careerReadinessModel');
const { StudentEngagementService, RETENTION_EVENTS } = require('../services/studentEngagementService');

/**
 * GET /api/v1/readiness/profile
 */
const getProfile = asyncHandler(async function(req, res) {
  const profile = await careerReadinessModel.getCareerProfile(req.user.id);
  res.json({
    success: true,
    profile
  });
});

/**
 * PUT /api/v1/readiness/profile
 */
const updateProfile = asyncHandler(async function(req, res) {
  const { targetRoleId, currentEducationLevel, targetTimelineWeeks, weeklyHoursAvailable } = req.body;
  if (!targetRoleId) {
    throw new ApiError(400, 'targetRoleId is required');
  }

  const updated = await careerReadinessModel.updateCareerProfile(req.user.id, {
    targetRoleId,
    currentEducationLevel,
    targetTimelineWeeks,
    weeklyHoursAvailable
  });

  // Track retention event
  await StudentEngagementService.trackRetentionEvent(req.user.id, RETENTION_EVENTS.CAREER_GOAL_SELECTED, {
    targetRoleId,
    timelineWeeks: targetTimelineWeeks
  });

  res.json({
    success: true,
    message: 'Career profile updated successfully',
    profile: updated
  });
});

/**
 * GET /api/v1/readiness/questions
 */
const getQuestions = asyncHandler(async function(req, res) {
  const targetRoleId = req.query.role || (req.user ? (await careerReadinessModel.getCareerProfile(req.user.id)).targetRoleId : 'sde_backend');
  const questions = careerReadinessModel.getQuestionsForRole(targetRoleId);
  res.json({
    success: true,
    targetRoleId,
    totalQuestions: questions.length,
    questions
  });
});

/**
 * POST /api/v1/readiness/assessment/submit
 */
const submitAssessment = asyncHandler(async function(req, res) {
  const { targetRoleId, responses } = req.body;

  if (!targetRoleId) {
    throw new ApiError(400, 'targetRoleId is required');
  }
  if (!responses || typeof responses !== 'object' || Object.keys(responses).length === 0) {
    throw new ApiError(400, 'responses object containing answered question keys is required');
  }

  const result = await careerReadinessModel.evaluateAndSaveAssessment(req.user.id, targetRoleId, responses);

  // Track retention event
  const isReassessment = result.attemptNumber > 1;
  await StudentEngagementService.trackRetentionEvent(
    req.user.id,
    isReassessment ? RETENTION_EVENTS.REASSESSMENT_COMPLETED : RETENTION_EVENTS.ASSESSMENT_COMPLETED,
    {
      targetRoleId,
      attemptNumber: result.attemptNumber,
      overallScore: result.scores.overallScore
    }
  );

  // Evaluate & award any eligible milestones (e.g. baseline or 75%+ benchmark)
  const newlyAwardedMilestones = await StudentEngagementService.evaluateMilestones(req.user.id);

  res.status(201).json({
    success: true,
    message: 'Assessment completed and evaluated successfully',
    result,
    newlyAwardedMilestones
  });
});

/**
 * GET /api/v1/readiness/assessment/history
 */
const getAssessmentHistory = asyncHandler(async function(req, res) {
  const targetRoleId = req.query.role || null;
  const history = await careerReadinessModel.getAssessmentHistory(req.user.id, targetRoleId);
  res.json({
    success: true,
    totalAttempts: history.length,
    history
  });
});

/**
 * GET /api/v1/readiness/roadmap
 */
const getRoadmap = asyncHandler(async function(req, res) {
  const roadmap = await careerReadinessModel.getActiveRoadmap(req.user.id);
  if (!roadmap) {
    return res.json({
      success: true,
      hasRoadmap: false,
      message: 'No active roadmap found. Complete a career assessment to generate a tailored milestone roadmap.',
      roadmap: null
    });
  }

  res.json({
    success: true,
    hasRoadmap: true,
    roadmap
  });
});

/**
 * PATCH /api/v1/readiness/tasks/:taskId
 */
const updateTask = asyncHandler(async function(req, res) {
  const taskId = req.params.taskId;
  const { status, evidenceType, evidenceUrl, evidenceNotes } = req.body;

  if (!status) {
    throw new ApiError(400, 'status is required (not_started, in_progress, completed)');
  }

  try {
    const updatedTask = await careerReadinessModel.updateTaskProgress(req.user.id, taskId, {
      status,
      evidenceType,
      evidenceUrl,
      evidenceNotes
    });

    if (!updatedTask) {
      throw new ApiError(404, 'Task not found or does not belong to the authenticated student.');
    }

    let newlyAwardedMilestones = [];

    // Track retention events & milestone progression
    if (status === 'in_progress') {
      await StudentEngagementService.trackRetentionEvent(req.user.id, RETENTION_EVENTS.TASK_STARTED, {
        taskId,
        weekNumber: updatedTask.weekNumber
      });
    } else if (status === 'completed') {
      await StudentEngagementService.trackRetentionEvent(req.user.id, RETENTION_EVENTS.TASK_EVIDENCE_SUBMITTED, {
        taskId,
        weekNumber: updatedTask.weekNumber,
        evidenceType: updatedTask.evidenceType
      });

      // Check if this unlocks first evidence or Week 1 sprint completion
      newlyAwardedMilestones = await StudentEngagementService.evaluateMilestones(req.user.id);
    }

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      task: updatedTask,
      newlyAwardedMilestones
    });
  } catch (err) {
    if (err.message && err.message.startsWith('Completion requirement:')) {
      throw new ApiError(422, err.message);
    }
    throw err;
  }
});

/**
 * GET /api/v1/readiness/progress
 */
const getProgress = asyncHandler(async function(req, res) {
  const summary = await careerReadinessModel.getProgressSummary(req.user.id);
  res.json({
    success: true,
    summary
  });
});

/**
 * TASK 1: GET /api/v1/readiness/resume
 * Returns natural return moment context for returning student.
 */
const getReturnMoment = asyncHandler(async function(req, res) {
  const returnMoment = await StudentEngagementService.getReturnMoment(req.user.id);
  res.json({
    success: true,
    returnMoment
  });
});

/**
 * TASK 2: GET /api/v1/readiness/weekly-summary
 * Computes verifiable weekly progress summary without fabricating data.
 */
const getWeeklySummary = asyncHandler(async function(req, res) {
  const summary = await StudentEngagementService.getWeeklyProgressSummary(req.user.id);
  await StudentEngagementService.trackRetentionEvent(req.user.id, RETENTION_EVENTS.WEEKLY_SUMMARY_VIEWED, {
    tasksCompletedThisWeek: summary.tasksCompletedCount
  });

  res.json({
    success: true,
    summary
  });
});

/**
 * TASK 3: GET /api/v1/readiness/milestones
 * Retrieves unlocked and available career readiness milestones.
 */
const getMilestones = asyncHandler(async function(req, res) {
  const milestones = await StudentEngagementService.getStudentMilestones(req.user.id);
  res.json({
    success: true,
    totalMilestones: milestones.length,
    unlockedCount: milestones.filter(m => m.isUnlocked).length,
    milestones
  });
});

/**
 * TASK 4: GET /api/v1/readiness/notifications/preferences
 */
const getNotificationPreferences = asyncHandler(async function(req, res) {
  const preferences = await StudentEngagementService.getNotificationPreferences(req.user.id);
  res.json({
    success: true,
    preferences
  });
});

/**
 * TASK 4: PUT /api/v1/readiness/notifications/preferences
 */
const updateNotificationPreferences = asyncHandler(async function(req, res) {
  const preferences = await StudentEngagementService.updateNotificationPreferences(req.user.id, req.body);
  res.json({
    success: true,
    message: 'Notification preferences updated successfully',
    preferences
  });
});

/**
 * TASK 4: GET /api/v1/readiness/notifications/unsubscribe
 * Public one-click unsubscribe via secure token.
 */
const unsubscribeNotifications = asyncHandler(async function(req, res) {
  const token = req.query.token;
  const category = req.query.category || 'all';

  if (!token) {
    throw new ApiError(400, 'Unsubscribe token is required.');
  }

  const result = await StudentEngagementService.unsubscribeByToken(token, category);
  if (!result.success) {
    throw new ApiError(404, result.message);
  }

  // Render clean, reassuring response
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Unsubscribed - Digital Twin Verse</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; max-width: 440px; text-align: center; }
        h1 { color: #38bdf8; font-size: 20px; margin-bottom: 12px; }
        p { color: #cbd5e1; font-size: 14px; line-height: 1.6; }
        a { color: #38bdf8; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Preferences Updated</h1>
        <p>${result.message}</p>
        <p>You will not receive non-critical email digests. You can re-enable reminders at any time in your student settings.</p>
        <p><a href="/">Return to Digital Twin Verse</a></p>
      </div>
    </body>
    </html>
  `);
});

/**
 * TASK 5: POST /api/v1/readiness/analytics/event
 * Allows client to report telemetry actions (e.g. session return).
 */
const trackClientEvent = asyncHandler(async function(req, res) {
  const { eventName, metadata } = req.body;
  if (!eventName) {
    throw new ApiError(400, 'eventName is required');
  }

  const sessionId = req.headers['x-session-id'] || null;
  await StudentEngagementService.trackRetentionEvent(req.user.id, eventName, metadata, sessionId);

  res.json({
    success: true,
    message: 'Event recorded'
  });
});

/**
 * TASK 5: GET /api/v1/readiness/analytics/retention-summary
 */
const getRetentionSummary = asyncHandler(async function(req, res) {
  const telemetry = await StudentEngagementService.getRetentionSummary(req.user.id);
  res.json({
    success: true,
    telemetry
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getQuestions,
  submitAssessment,
  getAssessmentHistory,
  getRoadmap,
  updateTask,
  getProgress,
  getReturnMoment,
  getWeeklySummary,
  getMilestones,
  getNotificationPreferences,
  updateNotificationPreferences,
  unsubscribeNotifications,
  trackClientEvent,
  getRetentionSummary
};
