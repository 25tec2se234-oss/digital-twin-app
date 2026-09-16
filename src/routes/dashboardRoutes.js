const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

const teamAdminController = require('../controllers/teamAdminController');

const router = express.Router();

// Protected dashboard - admin only
router.get('/', authenticate, authorize('admin'), dashboardController.index);
router.get('/team', authenticate, authorize('admin'), teamAdminController.index);

module.exports = router;
