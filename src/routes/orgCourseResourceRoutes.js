const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createResource,
  getResources,
  updateResource,
  reorderResources,
  deleteResource,
  getResourceAccess
} = require('../controllers/orgCourseResourceController');

router.post('/', requirePermission('course.update'), createResource);
router.get('/', requirePermission('course.read'), getResources);
router.put('/reorder', requirePermission('course.update'), reorderResources);
router.get('/:resourceId/access', getResourceAccess); // custom permission checks in controller
router.put('/:resourceId', requirePermission('course.update'), updateResource);
router.delete('/:resourceId', requirePermission('course.update'), deleteResource);

module.exports = router;
