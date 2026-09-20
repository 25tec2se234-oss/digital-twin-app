const express = require('express');
const { authenticate } = require('../middlewares/auth');
const wheelController = require('../controllers/wheelController');

const router = express.Router();

router.get('/state', authenticate, wheelController.getWheelState);
router.post('/spin', authenticate, wheelController.spinWheel);

module.exports = router;
