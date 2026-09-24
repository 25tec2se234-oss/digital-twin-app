const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const orgRequirementModel = require('../models/orgRequirementModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Add a requirement for a target
// @route   POST /api/v1/organizations/:organizationId/requirements
// @access  Private (Admin)
exports.addRequirement = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { target_type, target_id } = req.body;

  if (!target_type || !target_id) {
    return next(new ApiError(400, 'target_type and target_id are required.'));
  }

  const requirement = await orgRequirementModel.addRequirement(organizationId, req.user.id, req.body);

  auditLogModel.createLog(req.user.id, 'REQUIREMENT_ADDED', 'org_competency_requirements', requirement.id, { target_type, target_id }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: requirement
  });
});

// @desc    Get requirements for a target
// @route   GET /api/v1/organizations/:organizationId/targets/:targetType/:targetId/requirements
// @access  Private
exports.getTargetRequirements = asyncHandler(async (req, res, next) => {
  const { organizationId, targetType, targetId } = req.params;

  const requirements = await orgRequirementModel.getTargetRequirements(organizationId, targetType.toUpperCase(), targetId);

  res.status(200).json({
    success: true,
    count: requirements.length,
    data: requirements
  });
});

// @desc    Remove a requirement
// @route   DELETE /api/v1/organizations/:organizationId/requirements/:id
// @access  Private (Admin)
exports.removeRequirement = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  await orgRequirementModel.removeRequirement(organizationId, id);

  auditLogModel.createLog(req.user.id, 'REQUIREMENT_REMOVED', 'org_competency_requirements', id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: {}
  });
});
