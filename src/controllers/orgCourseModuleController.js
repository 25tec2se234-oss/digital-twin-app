const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCourseModel = require('../models/orgCourseModel');
const orgCourseModuleModel = require('../models/orgCourseModuleModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a new module
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/modules
// @access  Private (Admin or Trainer)
exports.createModule = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return next(new ApiError(400, 'Module title is required.'));
  }

  // Verify course belongs to organization
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const newModule = await orgCourseModuleModel.create(courseId, { title, description });

  auditLogModel.createLog(req.user.id, 'MODULE_CREATED', 'org_course_modules', newModule.id, { title }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: newModule
  });
});

// @desc    Get all modules for a course
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/modules
// @access  Private
exports.getModules = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const modules = await orgCourseModuleModel.findAllByCourse(courseId);

  res.status(200).json({
    success: true,
    count: modules.length,
    data: modules
  });
});

// @desc    Update a module
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId
// @access  Private
exports.updateModule = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const allowedUpdates = {
    title: req.body.title,
    description: req.body.description
  };
  Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

  const updatedModule = await orgCourseModuleModel.update(moduleId, courseId, allowedUpdates);
  if (!updatedModule) return next(new ApiError(404, 'Module not found.'));

  auditLogModel.createLog(req.user.id, 'MODULE_UPDATED', 'org_course_modules', updatedModule.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedModule
  });
});

// @desc    Reorder modules
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/modules/reorder
// @access  Private
exports.reorderModules = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  const { orderedModuleIds } = req.body;

  if (!orderedModuleIds || !Array.isArray(orderedModuleIds)) {
    return next(new ApiError(400, 'orderedModuleIds array is required.'));
  }

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  await orgCourseModuleModel.reorder(courseId, orderedModuleIds);

  res.status(200).json({
    success: true,
    message: 'Modules reordered successfully.'
  });
});

// @desc    Delete a module
// @route   DELETE /api/v1/organizations/:organizationId/courses/:courseId/modules/:moduleId
// @access  Private
exports.deleteModule = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, moduleId } = req.params;

  // Verify course ownership
  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  const deletedModule = await orgCourseModuleModel.delete(moduleId, courseId);
  if (!deletedModule) return next(new ApiError(404, 'Module not found.'));

  auditLogModel.createLog(req.user.id, 'MODULE_DELETED', 'org_course_modules', moduleId, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    message: 'Module deleted successfully.'
  });
});
