const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCourseModel = require('../models/orgCourseModel');
const orgCourseEnrollmentModel = require('../models/orgCourseEnrollmentModel');
const orgResourceProgressModel = require('../models/orgResourceProgressModel');
const orgCourseResourceModel = require('../models/orgCourseResourceModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Update progress for a resource
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/resources/:resourceId/progress
// @access  Private (Enrolled Trainee)
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, resourceId } = req.params;
  const { progress_percentage } = req.body;

  if (progress_percentage === undefined || progress_percentage < 0 || progress_percentage > 100) {
    return next(new ApiError(400, 'Valid progress_percentage (0-100) is required.'));
  }

  // Check enrollment
  const enrollment = await orgCourseEnrollmentModel.findByCourseAndTrainee(courseId, req.user.id);
  if (!enrollment) {
    return next(new ApiError(403, 'You are not enrolled in this course.'));
  }

  // Update resource progress
  const progress = await orgResourceProgressModel.updateProgress(enrollment.id, resourceId, progress_percentage);

  // Update enrollment last accessed
  await orgCourseEnrollmentModel.updateLastAccessed(enrollment.id);

  // Check if course should be marked as IN_PROGRESS or COMPLETED
  // (Simplified for now - just set IN_PROGRESS if currently ENROLLED)
  if (enrollment.status === 'ENROLLED') {
    await orgCourseEnrollmentModel.updateStatus(enrollment.id, 'IN_PROGRESS');
  }

  // Future logic: calculate overall course progress and mark COMPLETED if all required resources are completed.

  res.status(200).json({
    success: true,
    data: progress
  });
});

// @desc    Get all my progress for a course
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/my-progress
// @access  Private (Enrolled Trainee)
exports.getMyCourseProgress = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  const enrollment = await orgCourseEnrollmentModel.findByCourseAndTrainee(courseId, req.user.id);
  if (!enrollment) {
    return next(new ApiError(403, 'You are not enrolled in this course.'));
  }

  const progress = await orgResourceProgressModel.findAllByEnrollment(enrollment.id);

  res.status(200).json({
    success: true,
    data: {
      enrollment,
      resourceProgress: progress
    }
  });
});
