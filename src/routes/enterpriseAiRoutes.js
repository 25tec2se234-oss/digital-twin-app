const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const enterpriseAiController = require('../controllers/enterpriseAiController');

router.use(requireOrganizationMembership);
// Allow admins/executives to query Enterprise AI
router.use(requirePermission('organization.admin'));

router.post('/ask', enterpriseAiController.askAi);

module.exports = router;
