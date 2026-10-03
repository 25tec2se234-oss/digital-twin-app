const express = require('express');
const router = express.Router({ mergeParams: true });
const orgEnterpriseAiController = require('../controllers/orgEnterpriseAiController');
const { aiLimiter } = require('../middlewares/rateLimiter');
const { authenticateToken } = require('../middlewares/auth');
const orgAuthMiddleware = require('../middlewares/orgAuthMiddleware');

// Apply auth and org-level authorization to all AI routes
router.use(authenticateToken);
router.use(orgAuthMiddleware.requireOrgMember); // Assuming this middleware exists from Phase 1

router.post('/query', aiLimiter, orgEnterpriseAiController.queryEnterpriseAi);

module.exports = router;
