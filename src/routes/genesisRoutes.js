const express = require('express');
const router = express.Router();
const genesisController = require('../controllers/genesisController');
const { authenticateOptional } = require('../middlewares/auth');

router.get('/init', authenticateOptional, genesisController.initDigitalTwin);
router.post('/init', authenticateOptional, genesisController.initDigitalTwin);
router.get('/twin', authenticateOptional, genesisController.initDigitalTwin);
router.post('/calibrate', authenticateOptional, genesisController.calibrateDigitalTwin);

module.exports = router;
