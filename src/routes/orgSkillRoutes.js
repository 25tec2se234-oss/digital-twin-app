const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  archiveSkill
} = require('../controllers/orgSkillController');

// All skill routes require read permission
router.use(requirePermission('competency.read'));

router.route('/')
  .get(getSkills)
  .post(requirePermission('competency.manage'), createSkill);

router.route('/:id')
  .get(getSkill)
  .put(requirePermission('competency.manage'), updateSkill)
  .delete(requirePermission('competency.manage'), archiveSkill);

module.exports = router;
