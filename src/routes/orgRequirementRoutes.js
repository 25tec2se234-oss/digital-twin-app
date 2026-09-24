const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  addRequirement,
  getTargetRequirements,
  removeRequirement
} = require('../controllers/orgRequirementController');

router.use(requirePermission('organization.read'));

router.route('/')
  .post(requirePermission('organization.manage'), addRequirement);

router.route('/:id')
  .delete(requirePermission('organization.manage'), removeRequirement);

// Route for getting target requirements is mounted differently:
// /api/v1/organizations/:organizationId/targets/:targetType/:targetId/requirements
// We'll export the getTargetRequirements controller to be used directly in organizationRoutes.js

module.exports = router;
