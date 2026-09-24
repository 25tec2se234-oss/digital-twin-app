const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createModule,
  getModules,
  updateModule,
  reorderModules,
  deleteModule
} = require('../controllers/orgCourseModuleController');

router.post('/', requirePermission('course.update'), createModule);
router.get('/', requirePermission('course.read'), getModules);
router.put('/reorder', requirePermission('course.update'), reorderModules);
router.put('/:moduleId', requirePermission('course.update'), updateModule);
router.delete('/:moduleId', requirePermission('course.update'), deleteModule);

// Resources
const orgCourseResourceRoutes = require('./orgCourseResourceRoutes');
router.use('/:moduleId/resources', orgCourseResourceRoutes);

module.exports = router;
