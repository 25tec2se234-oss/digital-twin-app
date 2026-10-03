const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  archiveRole,
  assignMember
} = require('../controllers/orgRoleController');

// Roles are public to read within org (or require standard org.view)
router.use(requirePermission('organization.view'));

router.route('/')
  .get(getRoles)
  .post(requirePermission('roles.manage'), createRole);

router.route('/:id')
  .get(getRole)
  .put(requirePermission('roles.manage'), updateRole)
  .delete(requirePermission('roles.manage'), archiveRole);

router.post('/:id/assign', requirePermission('roles.manage'), assignMember);

module.exports = router;
