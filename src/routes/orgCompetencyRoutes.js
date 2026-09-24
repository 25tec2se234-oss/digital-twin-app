const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createCompetency,
  getCompetencies,
  getCompetency,
  updateCompetency,
  archiveCompetency
} = require('../controllers/orgCompetencyController');

// All competency routes require read permission
router.use(requirePermission('competency.read'));

router.route('/')
  .get(getCompetencies)
  .post(requirePermission('competency.manage'), createCompetency);

router.route('/:id')
  .get(getCompetency)
  .put(requirePermission('competency.manage'), updateCompetency)
  .delete(requirePermission('competency.manage'), archiveCompetency);

const {
  assignSkillToCompetency,
  removeSkillFromCompetency
} = require('../controllers/orgSkillController');

router.route('/:competencyId/skills')
  .post(requirePermission('competency.manage'), assignSkillToCompetency);

router.route('/:competencyId/skills/:skillId')
  .delete(requirePermission('competency.manage'), removeSkillFromCompetency);

module.exports = router;
