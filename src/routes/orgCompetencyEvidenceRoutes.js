const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  getTraineeEvidence,
  addEvidence
} = require('../controllers/orgCompetencyEvidenceController');

router.route('/')
  .get(requirePermission('competency.read'), getTraineeEvidence)
  .post(requirePermission('competency.evaluate'), addEvidence);

module.exports = router;
