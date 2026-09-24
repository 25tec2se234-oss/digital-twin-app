const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCompetencyModel = require('../models/orgCompetencyModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a competency
// @route   POST /api/v1/organizations/:organizationId/competencies
// @access  Private (Admin)
exports.createCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const competency = await orgCompetencyModel.create(organizationId, req.user.id, req.body);

  auditLogModel.createLog(req.user.id, 'COMPETENCY_CREATED', 'org_competencies', competency.id, { name: competency.name }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: competency
  });
});

// @desc    Get all competencies
// @route   GET /api/v1/organizations/:organizationId/competencies
// @access  Private
exports.getCompetencies = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { status, category } = req.query;

  const competencies = await orgCompetencyModel.findAll(organizationId, { status, category });

  res.status(200).json({
    success: true,
    count: competencies.length,
    data: competencies
  });
});

// @desc    Get single competency
// @route   GET /api/v1/organizations/:organizationId/competencies/:id
// @access  Private
exports.getCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const competency = await orgCompetencyModel.findById(id, organizationId);
  if (!competency) {
    return next(new ApiError(404, 'Competency not found.'));
  }

  res.status(200).json({
    success: true,
    data: competency
  });
});

// @desc    Update competency
// @route   PUT /api/v1/organizations/:organizationId/competencies/:id
// @access  Private (Admin)
exports.updateCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const updatedCompetency = await orgCompetencyModel.update(id, organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'COMPETENCY_UPDATED', 'org_competencies', id, { fields: Object.keys(req.body) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedCompetency
  });
});

// @desc    Archive competency
// @route   DELETE /api/v1/organizations/:organizationId/competencies/:id
// @access  Private (Admin)
exports.archiveCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  await orgCompetencyModel.archive(id, organizationId);

  auditLogModel.createLog(req.user.id, 'COMPETENCY_ARCHIVED', 'org_competencies', id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: {}
  });
});
