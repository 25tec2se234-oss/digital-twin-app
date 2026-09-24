const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createAssessment,
  getAssessments,
  getAssessment,
  updateAssessment,
  publishAssessment,
  assignQuestion,
  removeQuestion
} = require('../controllers/orgAssessmentController');

// All standard assessment management routes require read access
router.use(requirePermission('assessment.read'));

router.route('/')
  .get(getAssessments)
  .post(requirePermission('assessment.create'), createAssessment);

router.route('/:id')
  .get(getAssessment)
  .put(requirePermission('assessment.update'), updateAssessment);

router.route('/:id/publish')
  .put(requirePermission('assessment.update'), publishAssessment);

router.route('/:id/questions')
  .post(requirePermission('assessment.update'), assignQuestion);

router.route('/:id/questions/:questionId')
  .delete(requirePermission('assessment.update'), removeQuestion);

// Attempts
const orgAssessmentAttemptRoutes = require('./orgAssessmentAttemptRoutes');
router.use('/:assessmentId/attempts', orgAssessmentAttemptRoutes);

const {
  mapAssessmentSkill,
  removeAssessmentSkill
} = require('../controllers/orgMappingController');

router.route('/:assessmentId/skills')
  .post(requirePermission('assessment.manage'), mapAssessmentSkill);

router.route('/:assessmentId/skills/:skillId')
  .delete(requirePermission('assessment.manage'), removeAssessmentSkill);

module.exports = router;
