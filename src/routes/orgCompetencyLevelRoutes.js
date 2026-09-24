const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const {
  getFrameworkLevels,
  setLevel
} = require('../controllers/orgCompetencyLevelController');

// All level routes require read permission
router.use(requirePermission('competency.read'));

router.route('/')
  .put(requirePermission('competency.manage'), setLevel);

router.route('/:frameworkCode')
  .get(getFrameworkLevels);

module.exports = router;
