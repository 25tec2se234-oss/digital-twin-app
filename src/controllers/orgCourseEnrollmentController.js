const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCourseModel = require('../models/orgCourseModel');
const orgCourseEnrollmentModel = require('../models/orgCourseEnrollmentModel');
const auditLogModel = require('../models/auditLogModel');
const organizationModel = require('../models/organizationModel');

// @desc    Enroll a trainee in a course
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/enrollments
// @access  Private (Admin or Trainer)
exports.enrollTrainee = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  const { trainee_id } = req.body;

  if (!trainee_id) {
    return next(new ApiError(400, 'Trainee ID is required.'));
  }

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  if (course.status !== 'PUBLISHED') {
    return next(new ApiError(400, 'Cannot enroll trainees in an unpublished course.'));
  }

  // Verify trainee is a member of the organization
  const isMember = await organizationModel.checkMembership(organizationId, trainee_id);
  if (!isMember) {
    return next(new ApiError(403, 'User is not a member of this organization.'));
  }

  // Check if already enrolled
  const existingEnrollment = await orgCourseEnrollmentModel.findByCourseAndTrainee(courseId, trainee_id);
  if (existingEnrollment) {
    return next(new ApiError(400, 'Trainee is already enrolled in this course.'));
  }

  const enrollment = await orgCourseEnrollmentModel.create(organizationId, courseId, trainee_id);

  auditLogModel.createLog(req.user.id, 'TRAINEE_ENROLLED', 'org_course_enrollments', enrollment.id, { trainee_id, courseId }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get all enrollments for a course
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/enrollments
// @access  Private (Admin or Trainer)
exports.getCourseEnrollments = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const enrollments = await orgCourseEnrollmentModel.findAllByCourse(courseId);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

// @desc    Get my enrollments in the organization
// @route   GET /api/v1/organizations/:organizationId/my-enrollments
// @access  Private
exports.getMyEnrollments = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const enrollments = await orgCourseEnrollmentModel.findAllByTrainee(req.user.id, organizationId);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});
