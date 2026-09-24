const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  getTraineeEvidence
} = require('../controllers/orgCompetencyEvidenceController');

router.route('/')
  .get(requirePermission('competency.read'), getTraineeEvidence);

module.exports = router;
