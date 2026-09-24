const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const orgSkillGapModel = require('../models/orgSkillGapModel');
const SkillGapService = require('../services/skillGapService');

// @desc    Get trainee's skill gaps
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/skill-gaps
// @access  Private
exports.getTraineeGaps = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { history } = req.query;

  // Authorization check (Trainee viewing own gaps or Trainer/Admin viewing them)
  if (req.user.role === 'TRAINEE' && req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to view other trainees skill gaps'));
  }

  const gaps = await orgSkillGapModel.getTraineeGaps(organizationId, traineeId, history === 'true');

  res.status(200).json({
    success: true,
    count: gaps.length,
    data: gaps
  });
});

// @desc    Get trainee's training needs and recommendations
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/training-needs
// @access  Private
exports.getTraineeTrainingNeeds = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;

  if (req.user.role === 'TRAINEE' && req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to view other trainees training needs'));
  }

  const needs = await orgSkillGapModel.getTraineeTrainingNeeds(organizationId, traineeId);

  res.status(200).json({
    success: true,
    count: needs.length,
    data: needs
  });
});

// @desc    Get organization training needs aggregation
// @route   GET /api/v1/organizations/:organizationId/training-needs
// @access  Private (Admin)
exports.getOrganizationTrainingNeeds = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const aggregatedNeeds = await orgSkillGapModel.getOrganizationTrainingNeeds(organizationId);

  res.status(200).json({
    success: true,
    count: aggregatedNeeds.length,
    data: aggregatedNeeds
  });
});

// @desc    Manually trigger recalculation for a trainee role
// @route   POST /api/v1/organizations/:organizationId/trainees/:traineeId/recalculate-gaps
// @access  Private (Admin)
exports.recalculateGaps = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { targetType, targetId } = req.body;

  if (!targetType || !targetId) {
    return next(new ApiError(400, 'targetType and targetId are required'));
  }

  await SkillGapService.calculateTraineeGapsForTarget(organizationId, traineeId, targetType, targetId);

  res.status(200).json({
    success: true,
    message: 'Skill gaps recalculated successfully.'
  });
});
