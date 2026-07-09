const express = require('express');
const dataController = require('../controllers/dataController');
const { authenticate, authorizeParentOfStudent } = require('../middlewares/auth');
const { requirePremium } = require('../middlewares/subscription');

const router = express.Router();

// Student (or any user) getting and saving their own data
router.get('/me', authenticate, requirePremium, dataController.getMyData);
router.put('/me', authenticate, requirePremium, dataController.saveMyData);

// Real-time Event Tracking
router.post('/track', authenticate, requirePremium, dataController.trackAction);

// Parent viewing their student's data
router.get('/students/:studentId', authenticate, requirePremium, authorizeParentOfStudent, dataController.getStudentData);

module.exports = router;
