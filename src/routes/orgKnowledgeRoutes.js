const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireOrganizationMembership, requirePermission } = require('../middlewares/rbac');
const orgKnowledgeController = require('../controllers/orgKnowledgeController');

router.use(requireOrganizationMembership);

// List/Search published resources
router.get('/', orgKnowledgeController.listResources);
router.get('/recommend/competency/:competencyId', orgKnowledgeController.recommendResources);

// Admin / Content Creators only
router.use(requirePermission('organization.courses.manage')); 
router.post('/', orgKnowledgeController.createResource);
router.put('/:resourceId/publish', orgKnowledgeController.publishResource);

module.exports = router;
