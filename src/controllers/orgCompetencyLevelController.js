const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCompetencyLevelModel = require('../models/orgCompetencyLevelModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Get levels for a framework
// @route   GET /api/v1/organizations/:organizationId/competency-levels/:frameworkCode
// @access  Private
exports.getFrameworkLevels = asyncHandler(async (req, res, next) => {
  const { organizationId, frameworkCode } = req.params;

  const levels = await orgCompetencyLevelModel.getFrameworkLevels(organizationId, frameworkCode);

  res.status(200).json({
    success: true,
    count: levels.length,
    data: levels
  });
});

// @desc    Set level definition for framework
// @route   PUT /api/v1/organizations/:organizationId/competency-levels
// @access  Private (Admin)
exports.setLevel = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { framework_code, level_name, level_order, min_score, max_score, description } = req.body;

  if (level_order === undefined || min_score === undefined || max_score === undefined) {
    return next(new ApiError(400, 'level_order, min_score, and max_score are required.'));
  }

  const level = await orgCompetencyLevelModel.createOrUpdateLevel(organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'COMPETENCY_LEVEL_UPDATED', 'org_competency_levels', level.id, { framework_code, level_order }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: level
  });
});
