const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const { inquiryLimiter } = require('../middlewares/rateLimiter');
const {
  submitInquiry,
  listInquiries,
  createCohort,
  listCohorts,
  getCohort,
  enrollStudent,
  getCohortReadinessReport
} = require('../controllers/institutionalController');

// Public route: Submit institutional pilot / demo inquiry
router.post('/inquiry', inquiryLimiter, submitInquiry);

// Platform administrative listing of inquiries
router.get('/inquiries', authenticate, listInquiries);

// Multi-tenant organization routes with strict boundary verification (Anti-IDOR)
router.use('/:organizationId', authenticate, requireOrganizationMembership);

// Cohort management within organization
router.post('/:organizationId/cohorts', requirePermission('cohorts.create'), createCohort);
router.get('/:organizationId/cohorts', requirePermission('cohorts.view'), listCohorts);
router.get('/:organizationId/cohorts/:cohortId', requirePermission('cohorts.view'), getCohort);
router.post('/:organizationId/cohorts/:cohortId/students', requirePermission('cohorts.manage'), enrollStudent);

// Aggregate placement readiness heatmap report (Anti-IDOR protected)
router.get('/:organizationId/cohorts/:cohortId/readiness', requirePermission('reports.readiness.view'), getCohortReadinessReport);

module.exports = router;
