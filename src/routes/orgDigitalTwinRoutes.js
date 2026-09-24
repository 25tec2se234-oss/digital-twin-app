const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgDigitalTwinController = require('../controllers/orgDigitalTwinController');

router.use(requireOrganizationMembership);

// The digital twin requires administrative access
router.use(requirePermission('organization.admin'));

router.post('/snapshots', orgDigitalTwinController.generateSnapshot);
router.get('/snapshots/latest', orgDigitalTwinController.getLatestSnapshot);

module.exports = router;
