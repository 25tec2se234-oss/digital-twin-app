const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const careerReadinessModel = require('../models/careerReadinessModel');

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

  res.status(201).json({
    success: true,
    message: 'Assessment completed and evaluated successfully',
    result
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

    res.json({
      success: true,
      message: `Task status updated to ${status}`,
      task: updatedTask
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

module.exports = {
  getProfile,
  updateProfile,
  getQuestions,
  submitAssessment,
  getAssessmentHistory,
  getRoadmap,
  updateTask,
  getProgress
};
