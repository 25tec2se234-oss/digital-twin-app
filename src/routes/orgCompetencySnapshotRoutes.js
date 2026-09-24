const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  getTraineeProfile,
  getTraineeHistory
} = require('../controllers/orgCompetencySnapshotController');

// All snapshot routes require read permission
router.use(requirePermission('competency.read'));

router.route('/competency-profile')
  .get(getTraineeProfile);

router.route('/competency-history')
  .get(getTraineeHistory);

module.exports = router;
