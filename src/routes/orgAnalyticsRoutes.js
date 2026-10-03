const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgAnalyticsController = require('../controllers/orgAnalyticsController');
const orgReportingController = require('../controllers/orgReportingController');

// All analytics require organization membership
router.use(requireOrganizationMembership);

// Only admins or those with specific analytics permissions should see this
// We will use 'organization.admin' as a proxy for analytics viewing
router.use(requirePermission('organization.admin'));

// Original Routes (kept for backwards compatibility if needed)
router.get('/overview', orgAnalyticsController.getOverview);
router.get('/insights', orgAnalyticsController.getInsights);

// Phase 11: Capacity Analytics & Reporting Routes
router.get('/dashboard', orgReportingController.getDashboard);
router.get('/departments', orgReportingController.getDepartmentsAnalytics);
router.get('/export', orgReportingController.exportReport);

module.exports = router;
