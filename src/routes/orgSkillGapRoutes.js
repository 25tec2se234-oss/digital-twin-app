const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  getTraineeGaps,
  getTraineeTrainingNeeds,
  recalculateGaps,
  getOrganizationTrainingNeeds
} = require('../controllers/orgSkillGapController');

// All gap reading needs basic permission
router.use(requirePermission('competency.read'));

// Trainee individual routes
// Mapped as: /api/v1/organizations/:organizationId/trainees/:traineeId
router.route('/skill-gaps')
  .get(getTraineeGaps);

router.route('/training-needs')
  .get(getTraineeTrainingNeeds);

router.route('/recalculate-gaps')
  .post(requirePermission('organization.manage'), recalculateGaps);

// Note: /api/v1/organizations/:organizationId/training-needs 
// will be mapped directly in organizationRoutes.js

module.exports = router;
