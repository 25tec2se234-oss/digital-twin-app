const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const futureverseController = require('../controllers/futureverseController');

// Public routes (no auth)
router.get('/leaderboard', futureverseController.getLeaderboard);

// All futureverse progress endpoints require authentication
router.use(authenticate);

router.get('/progress', futureverseController.getProgress);
router.post('/progress', futureverseController.saveProgress);

module.exports = router;
