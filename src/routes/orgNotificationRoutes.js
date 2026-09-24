const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgNotificationController = require('../controllers/orgNotificationController');

// Ensure user is in org
router.use(requireOrganizationMembership);

// Endpoints for self
router.get('/', orgNotificationController.getMyNotifications);
router.put('/:notificationId/read', orgNotificationController.markNotificationRead);
router.get('/preferences', orgNotificationController.getPreferences);
router.put('/preferences', orgNotificationController.updatePreferences);

module.exports = router;
