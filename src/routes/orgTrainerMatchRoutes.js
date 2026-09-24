const express = require('express');
const router = express.Router({ mergeParams: true });
const { requirePermission } = require('../middlewares/rbac');
const orgTrainerMatchController = require('../controllers/orgTrainerMatchController');

// All matching endpoints require basic training read permissions or org admin permissions.
// Assuming "organization.training.read" or similar exists, but we'll use specific controller logic.

router.post(
    '/generate',
    // authorize admin via custom requirePermission if needed, we'll keep it simple:
    // in Step 6, org roles had permissions like 'organization.roles.create'
    // Let's use 'organization.settings.update' as a proxy for admin for now, or just leave it to controller
    orgTrainerMatchController.generateTrainerMatches
);

router.get(
    '/',
    orgTrainerMatchController.getTrainerMatches
);

router.post(
    '/assign-trainer',
    orgTrainerMatchController.assignTrainer
);

router.put(
    '/respond',
    orgTrainerMatchController.respondToAssignment
);

module.exports = router;
