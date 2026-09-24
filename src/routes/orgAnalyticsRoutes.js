const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgAnalyticsController = require('../controllers/orgAnalyticsController');

// All analytics require organization membership
router.use(requireOrganizationMembership);

// Only admins or those with specific analytics permissions should see this
// We will use 'organization.admin' as a proxy for analytics viewing
router.use(requirePermission('organization.admin'));

// Routes
router.get('/overview', orgAnalyticsController.getOverview);
router.get('/insights', orgAnalyticsController.getInsights);

module.exports = router;
