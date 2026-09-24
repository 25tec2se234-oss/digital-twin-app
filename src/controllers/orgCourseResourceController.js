const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCourseModel = require('../models/orgCourseModel');
const orgCourseModuleModel = require('../models/orgCourseModuleModel');
const orgCourseResourceModel = require('../models/orgCourseResourceModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a new resource
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources
// @access  Private (Admin or Trainer)
exports.createResource = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId } = req.params;
  const { title, description, resource_type, storage_url, duration, file_size, mime_type, is_required } = req.body;

  if (!title || !resource_type) {
    return next(new ApiError(400, 'Title and resource_type are required.'));
  }

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  const newResource = await orgCourseResourceModel.create(moduleId, {
    title, description, resource_type, storage_url, duration, file_size, mime_type, is_required
  });

  auditLogModel.createLog(req.user.id, 'RESOURCE_CREATED', 'org_course_resources', newResource.id, { title }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: newResource
  });
});

// @desc    Get all resources for a module
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources
// @access  Private
exports.getResources = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  const resources = await orgCourseResourceModel.findAllByModule(moduleId);

  res.status(200).json({
    success: true,
    count: resources.length,
    data: resources
  });
});

// @desc    Update a resource
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources/:resourceId
// @access  Private
exports.updateResource = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId, resourceId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  const allowedUpdates = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    is_required: req.body.is_required
  };
  Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

  const updatedResource = await orgCourseResourceModel.update(resourceId, moduleId, allowedUpdates);
  if (!updatedResource) return next(new ApiError(404, 'Resource not found.'));

  auditLogModel.createLog(req.user.id, 'RESOURCE_UPDATED', 'org_course_resources', updatedResource.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedResource
  });
});

// @desc    Reorder resources
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources/reorder
// @access  Private
exports.reorderResources = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId } = req.params;
  const { orderedResourceIds } = req.body;

  if (!orderedResourceIds || !Array.isArray(orderedResourceIds)) {
    return next(new ApiError(400, 'orderedResourceIds array is required.'));
  }

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  await orgCourseResourceModel.reorder(moduleId, orderedResourceIds);

  res.status(200).json({
    success: true,
    message: 'Resources reordered successfully.'
  });
});

// @desc    Delete a resource
// @route   DELETE /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources/:resourceId
// @access  Private
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId, resourceId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  const deletedResource = await orgCourseResourceModel.delete(resourceId, moduleId);
  if (!deletedResource) return next(new ApiError(404, 'Resource not found.'));

  auditLogModel.createLog(req.user.id, 'RESOURCE_DELETED', 'org_course_resources', resourceId, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    message: 'Resource deleted successfully.'
  });
});

// @desc    Get secure access to a resource
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId/resources/:resourceId/access
// @access  Private (Enrolled Trainee, Admin, Trainer)
exports.getResourceAccess = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId, resourceId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // TODO: Check enrollment if user is not admin/trainer
  // For now, if they are authenticated and in the org, we grant access if they have course.read or are enrolled
  // (Enrollment check will be fully implemented in Phase H)

  // Verify module belongs to course
  const moduleInfo = await orgCourseModuleModel.findByIdAndCourse(moduleId, courseId);
  if (!moduleInfo) return next(new ApiError(404, 'Module not found.'));

  const resource = await orgCourseResourceModel.findByIdAndModule(resourceId, moduleId);
  if (!resource) return next(new ApiError(404, 'Resource not found.'));

  // Log resource access
  auditLogModel.createLog(req.user.id, 'RESOURCE_ACCESSED', 'org_course_resources', resource.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: {
      url: resource.storage_url
    }
  });
});
