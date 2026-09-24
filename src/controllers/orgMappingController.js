const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgMappingModel = require('../models/orgMappingModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Map assessment to skill
// @route   POST /api/v1/organizations/:organizationId/assessments/:assessmentId/skills
// @access  Private (Trainer/Admin)
exports.mapAssessmentSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, assessmentId } = req.params;
  const { question_id, skill_id, weight } = req.body;

  if (!skill_id) return next(new ApiError(400, 'skill_id is required'));

  const mapping = await orgMappingModel.mapAssessmentToSkill(organizationId, assessmentId, question_id, skill_id, weight);

  auditLogModel.createLog(req.user.id, 'ASSESSMENT_SKILL_MAPPED', 'org_assessment_skills', assessmentId, { skill_id, question_id, weight }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: mapping
  });
});

// @desc    Remove assessment to skill mapping
// @route   DELETE /api/v1/organizations/:organizationId/assessments/:assessmentId/skills/:skillId
// @access  Private (Trainer/Admin)
exports.removeAssessmentSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, assessmentId, skillId } = req.params;
  const { question_id } = req.query;

  await orgMappingModel.removeAssessmentSkillMapping(organizationId, assessmentId, question_id, skillId);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Map course to skill
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/skills
// @access  Private (Trainer/Admin)
exports.mapCourseSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  const { skill_id } = req.body;

  if (!skill_id) return next(new ApiError(400, 'skill_id is required'));

  const mapping = await orgMappingModel.mapCourseToSkill(organizationId, courseId, skill_id);

  auditLogModel.createLog(req.user.id, 'COURSE_SKILL_MAPPED', 'org_course_skills', courseId, { skill_id }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: mapping
  });
});

// @desc    Remove course to skill mapping
// @route   DELETE /api/v1/organizations/:organizationId/courses/:courseId/skills/:skillId
// @access  Private (Trainer/Admin)
exports.removeCourseSkill = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, skillId } = req.params;

  await orgMappingModel.removeCourseSkillMapping(organizationId, courseId, skillId);

  res.status(200).json({
    success: true,
    data: {}
  });
});
