const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  startAttempt,
  saveAnswer,
  submitAttempt,
  getAssessmentAttempts
} = require('../controllers/orgAssessmentAttemptController');

router.get('/', requirePermission('assessment.read'), getAssessmentAttempts);

// All attempt routes below here require attempt permission (for trainees)
router.post('/', requirePermission('assessment.attempt'), startAttempt);
router.put('/:id/answers', requirePermission('assessment.attempt'), saveAnswer);
router.post('/:id/submit', requirePermission('assessment.attempt'), submitAttempt);

module.exports = router;
