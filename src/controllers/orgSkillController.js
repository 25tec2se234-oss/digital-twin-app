const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgSkillModel = require('../models/orgSkillModel');
const orgCompetencyModel = require('../models/orgCompetencyModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a skill
// @route   POST /api/v1/organizations/:organizationId/skills
// @access  Private (Admin)
exports.createSkill = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const skill = await orgSkillModel.create(organizationId, req.user.id, req.body);

  auditLogModel.createLog(req.user.id, 'SKILL_CREATED', 'org_skills', skill.id, { name: skill.name }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: skill
  });
});

// @desc    Get all skills
// @route   GET /api/v1/organizations/:organizationId/skills
// @access  Private
exports.getSkills = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { status, category } = req.query;

  const skills = await orgSkillModel.findAll(organizationId, { status, category });

  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills
  });
});

// @desc    Get single skill
// @route   GET /api/v1/organizations/:organizationId/skills/:id
// @access  Private
exports.getSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const skill = await orgSkillModel.findById(id, organizationId);
  if (!skill) {
    return next(new ApiError(404, 'Skill not found.'));
  }

  res.status(200).json({
    success: true,
    data: skill
  });
});

// @desc    Update skill
// @route   PUT /api/v1/organizations/:organizationId/skills/:id
// @access  Private (Admin)
exports.updateSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const updatedSkill = await orgSkillModel.update(id, organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'SKILL_UPDATED', 'org_skills', id, { fields: Object.keys(req.body) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedSkill
  });
});

// @desc    Archive skill
// @route   DELETE /api/v1/organizations/:organizationId/skills/:id
// @access  Private (Admin)
exports.archiveSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  await orgSkillModel.archive(id, organizationId);

  auditLogModel.createLog(req.user.id, 'SKILL_ARCHIVED', 'org_skills', id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Assign skill to competency
// @route   POST /api/v1/organizations/:organizationId/competencies/:competencyId/skills
// @access  Private (Admin)
exports.assignSkillToCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId, competencyId } = req.params;
  const { skill_id, weight } = req.body;

  if (!skill_id) return next(new ApiError(400, 'skill_id is required.'));

  const competency = await orgCompetencyModel.findById(competencyId, organizationId);
  if (!competency) return next(new ApiError(404, 'Competency not found.'));
  if (competency.organization_id === null && organizationId !== null) {
     return next(new ApiError(403, 'Cannot modify mappings for a global competency.'));
  }

  const skill = await orgSkillModel.findById(skill_id, organizationId);
  if (!skill) return next(new ApiError(404, 'Skill not found.'));

  const mapping = await orgSkillModel.assignToCompetency(competencyId, skill_id, weight);

  auditLogModel.createLog(req.user.id, 'COMPETENCY_MAPPING_CREATED', 'org_competency_skills', competencyId, { skill_id, weight }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: mapping
  });
});

// @desc    Remove skill from competency
// @route   DELETE /api/v1/organizations/:organizationId/competencies/:competencyId/skills/:skillId
// @access  Private (Admin)
exports.removeSkillFromCompetency = asyncHandler(async (req, res, next) => {
  const { organizationId, competencyId, skillId } = req.params;

  const competency = await orgCompetencyModel.findById(competencyId, organizationId);
  if (!competency) return next(new ApiError(404, 'Competency not found.'));
  if (competency.organization_id === null && organizationId !== null) {
     return next(new ApiError(403, 'Cannot modify mappings for a global competency.'));
  }

  await orgSkillModel.removeFromCompetency(competencyId, skillId);

  res.status(200).json({
    success: true,
    data: {}
  });
});
