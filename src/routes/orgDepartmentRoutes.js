const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createDepartment,
  getDepartments,
  updateDepartment,
  archiveDepartment,
  assignMember
} = require('../controllers/orgDepartmentController');

router.route('/')
  .post(requirePermission('departments.manage'), createDepartment)
  .get(requirePermission('organization.view'), getDepartments);

router.route('/:departmentId')
  .put(requirePermission('departments.manage'), updateDepartment)
  .delete(requirePermission('departments.manage'), archiveDepartment);

router.post('/:departmentId/assign', requirePermission('departments.manage'), assignMember);

module.exports = router;
