const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCourseModel = require('../models/orgCourseModel');
const auditLogModel = require('../models/auditLogModel');

// Simple slugify fallback if package not installed
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// @desc    Create a new course
// @route   POST /api/v1/organizations/:organizationId/courses
// @access  Private (Org Admin, Trainer with course.create)
exports.createCourse = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  
  // Extract only permitted fields
  const {
    title, short_description, description, category, level, language, estimated_duration, trainer_id
  } = req.body;

  if (!title) {
    return next(new ApiError(400, 'Course title is required.'));
  }

  // Generate safe slug
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let slugExists = await orgCourseModel.findBySlugAndOrganization(slug, organizationId);
  let counter = 1;
  while (slugExists) {
    slug = `${baseSlug}-${counter}`;
    slugExists = await orgCourseModel.findBySlugAndOrganization(slug, organizationId);
    counter++;
  }

  const courseData = {
    organization_id: organizationId,
    title,
    slug,
    short_description,
    description,
    category,
    level,
    language,
    estimated_duration,
    trainer_id: trainer_id || null, // Allow optional assignment later
    created_by: req.user.id
  };

  const course = await orgCourseModel.create(courseData);

  auditLogModel.createLog(req.user.id, 'COURSE_CREATED', 'org_courses', course.id, { title: course.title }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Get all courses for an organization
// @route   GET /api/v1/organizations/:organizationId/courses
// @access  Private (Org members)
exports.getCourses = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { status, trainer_id } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (trainer_id) filters.trainer_id = trainer_id;

  const courses = await orgCourseModel.findAllByOrganization(organizationId, filters);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId
// @access  Private
exports.getCourse = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);

  if (!course) {
    return next(new ApiError(404, 'Course not found.'));
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId
// @access  Private (Admin or Trainer)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;
  
  // Guard against mass assignment of status etc (except allowed via specific endpoints)
  const allowedUpdates = {
    title: req.body.title,
    short_description: req.body.short_description,
    description: req.body.description,
    category: req.body.category,
    level: req.body.level,
    language: req.body.language,
    estimated_duration: req.body.estimated_duration,
    trainer_id: req.body.trainer_id,
    thumbnail: req.body.thumbnail
  };

  // Remove undefined fields
  Object.keys(allowedUpdates).forEach(key => allowedUpdates[key] === undefined && delete allowedUpdates[key]);

  const course = await orgCourseModel.update(courseId, organizationId, allowedUpdates);

  if (!course) {
    return next(new ApiError(404, 'Course not found.'));
  }

  auditLogModel.createLog(req.user.id, 'COURSE_UPDATED', 'org_courses', course.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Publish course
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/publish
// @access  Private
exports.publishCourse = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  const course = await orgCourseModel.findByIdAndOrganization(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  // Validation: Check if course is ready to be published
  if (!course.title || !course.description) {
    return next(new ApiError(400, 'Course must have a title and description before publishing.'));
  }

  // TODO: Add module existence check here later

  const updatedCourse = await orgCourseModel.publish(courseId, organizationId);

  auditLogModel.createLog(req.user.id, 'COURSE_PUBLISHED', 'org_courses', updatedCourse.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedCourse
  });
});

// @desc    Archive course
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/archive
// @access  Private
exports.archiveCourse = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId } = req.params;

  const course = await orgCourseModel.archive(courseId, organizationId);
  if (!course) return next(new ApiError(404, 'Course not found.'));

  auditLogModel.createLog(req.user.id, 'COURSE_ARCHIVED', 'org_courses', course.id, {}, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: course
  });
});
