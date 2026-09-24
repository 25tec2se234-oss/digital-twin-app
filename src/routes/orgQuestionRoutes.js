const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption
} = require('../controllers/orgQuestionController');

// All question routes require assessment management permissions
router.use(requirePermission('assessment.read'));

router.route('/')
  .get(getQuestions)
  .post(requirePermission('assessment.create'), createQuestion);

router.route('/:id')
  .get(getQuestion)
  .put(requirePermission('assessment.update'), updateQuestion)
  .delete(requirePermission('assessment.delete'), deleteQuestion);

router.route('/:id/options')
  .post(requirePermission('assessment.update'), addOption);

router.route('/:id/options/:optionId')
  .put(requirePermission('assessment.update'), updateOption)
  .delete(requirePermission('assessment.update'), deleteOption);

module.exports = router;
