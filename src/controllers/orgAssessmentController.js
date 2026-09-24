const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgAssessmentModel = require('../models/orgAssessmentModel');
const orgCourseModel = require('../models/orgCourseModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create an assessment
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/assessments
// @access  Private (Admin or Trainer)
exports.createAssessment = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const assessment = await orgAssessmentModel.create(organizationId, courseId, req.user.id, req.body);

  auditLogModel.createLog(req.user.id, 'ASSESSMENT_CREATED', 'org_assessments', assessment.id, { title: assessment.title }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: assessment
  });
});

// @desc    Get assessments for a course
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/assessments
// @access  Private (Admin or Trainer)
exports.getAssessments = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  const { status } = req.query;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const assessments = await orgAssessmentModel.findAllByCourse(courseId, organizationId, status);

  res.status(200).json({
    success: true,
    count: assessments.length,
    data: assessments
  });
});

// @desc    Get a single assessment
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/assessments/:id
// @access  Private (Admin or Trainer)
exports.getAssessment = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, id } = req.params;

  const assessment = await orgAssessmentModel.findByIdAndOrganization(id, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
});

// @desc    Update assessment
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/assessments/:id
// @access  Private (Admin or Trainer)
exports.updateAssessment = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, id } = req.params;

  const assessment = await orgAssessmentModel.findByIdAndOrganization(id, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }

  // Ensure they don't publish via regular update unless validation runs
  if (req.body.status === 'PUBLISHED' && assessment.status !== 'PUBLISHED') {
    return next(new ApiError(400, 'Use the publish endpoint to publish an assessment.'));
  }

  const updatedAssessment = await orgAssessmentModel.update(id, organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'ASSESSMENT_UPDATED', 'org_assessments', id, { fields: Object.keys(req.body) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedAssessment
  });
});

// @desc    Publish assessment
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/assessments/:id/publish
// @access  Private (Admin or Trainer)
exports.publishAssessment = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, id } = req.params;

  const assessment = await orgAssessmentModel.findByIdAndOrganization(id, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }

  // Validate
  await orgAssessmentModel.validateForPublishing(id, organizationId);

  const published = await orgAssessmentModel.update(id, organizationId, { status: 'PUBLISHED' });

  auditLogModel.createLog(req.user.id, 'ASSESSMENT_PUBLISHED', 'org_assessments', id, { title: published.title }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: published
  });
});

// @desc    Assign a question to an assessment
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/assessments/:id/questions
// @access  Private (Admin or Trainer)
exports.assignQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, id } = req.params;
  const { question_id, order_index } = req.body;

  if (!question_id) return next(new ApiError(400, 'question_id is required.'));

  const assessment = await orgAssessmentModel.findByIdAndOrganization(id, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }

  const result = await orgAssessmentModel.assignQuestion(id, question_id, order_index || 0);

  res.status(200).json({
    success: true,
    data: result
  });
});

// @desc    Remove a question from an assessment
// @route   DELETE /api/v1/organizations/:organizationId/courses/:courseId/assessments/:id/questions/:questionId
// @access  Private (Admin or Trainer)
exports.removeQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, id, questionId } = req.params;

  const assessment = await orgAssessmentModel.findByIdAndOrganization(id, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }

  // Check if assessment has submitted attempts - if so, removing structural components is forbidden
  const hasAttemptsQuery = "SELECT EXISTS (SELECT 1 FROM org_assessment_attempts WHERE assessment_id = $1 AND status IN ('SUBMITTED')) as has_attempts";
  const { pool } = require('../db');
  const attemptResult = await pool.query(hasAttemptsQuery, [id]);
  
  if (attemptResult.rows[0].has_attempts) {
    return next(new ApiError(400, 'Cannot remove questions from an assessment that has submitted attempts.'));
  }

  await orgAssessmentModel.removeQuestion(id, questionId);

  res.status(200).json({
    success: true,
    data: {}
  });
});
