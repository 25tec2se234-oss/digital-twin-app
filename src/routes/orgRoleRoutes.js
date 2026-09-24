const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  archiveRole
} = require('../controllers/orgRoleController');

// Roles are public to read within org (or require standard org.read)
router.use(requirePermission('organization.read'));

router.route('/')
  .get(getRoles)
  .post(requirePermission('organization.manage'), createRole);

router.route('/:id')
  .get(getRole)
  .put(requirePermission('organization.manage'), updateRole)
  .delete(requirePermission('organization.manage'), archiveRole);

module.exports = router;
