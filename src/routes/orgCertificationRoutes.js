const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgCertificationController = require('../controllers/orgCertificationController');

// Public verification endpoint
router.get('/verify/:certificateNumber', orgCertificationController.verifyCertificate);

// Protected routes
router.use(requireOrganizationMembership);

// List templates (admin view) or all certificates (admin)
router.get('/templates', requirePermission('organization.admin'), orgCertificationController.getTemplates);

// My own certificates (any member)
router.get('/mine', orgCertificationController.getMyCertificates);

// Issuing requires admin permission
router.post('/templates/:templateId/issue', requirePermission('organization.admin'), orgCertificationController.issueCertificate);

// Revoking requires admin permission
router.put('/:certificateId/revoke', requirePermission('organization.admin'), orgCertificationController.revokeCertificate);

module.exports = router;
