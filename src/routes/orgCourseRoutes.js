const express = require('express');
// mergeParams ensures we get the :organizationId from the parent router
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  publishCourse,
  archiveCourse
} = require('../controllers/orgCourseController');

// All routes here assume `authenticate` and `requireOrganizationMembership` 
// have already been applied by the parent router (organizationRoutes.js)

router.post('/', requirePermission('course.create'), createCourse);
router.get('/', requirePermission('course.read'), getCourses);
router.get('/:courseId', requirePermission('course.read'), getCourse);
router.put('/:courseId', requirePermission('course.update'), updateCourse);
router.put('/:courseId/publish', requirePermission('course.publish'), publishCourse);
router.put('/:courseId/archive', requirePermission('course.delete'), archiveCourse);

// Modules
const orgCourseModuleRoutes = require('./orgCourseModuleRoutes');
router.use('/:courseId/modules', orgCourseModuleRoutes);

// Enrollments
const orgCourseEnrollmentRoutes = require('./orgCourseEnrollmentRoutes');
router.use('/:courseId/enrollments', orgCourseEnrollmentRoutes);

// Progress
const orgResourceProgressRoutes = require('./orgResourceProgressRoutes');
router.use('/:courseId', orgResourceProgressRoutes);

// Assessments
const orgAssessmentRoutes = require('./orgAssessmentRoutes');
router.use('/:courseId/assessments', orgAssessmentRoutes);

const {
  mapCourseSkill,
  removeCourseSkill
} = require('../controllers/orgMappingController');

router.route('/:courseId/skills')
  .post(requirePermission('course.manage'), mapCourseSkill);

router.route('/:courseId/skills/:skillId')
  .delete(requirePermission('course.manage'), removeCourseSkill);

module.exports = router;
