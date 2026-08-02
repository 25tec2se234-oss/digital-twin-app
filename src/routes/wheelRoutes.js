const express = require('express');
const { authenticateOptional } = require('../middlewares/auth');
const wheelController = require('../controllers/wheelController');

const router = express.Router();

router.get('/state', authenticateOptional, wheelController.getWheelState);
router.post('/spin', authenticateOptional, wheelController.spinWheel);

module.exports = router;
