const genesisModel = require('../models/genesisModel');
const logger = require('../config/logger');

/**
 * GET /api/genesis/twin
 * POST /api/genesis/init
 * Fetch or Initialize student's persistent Digital Twin ID & Capability State
 */
async function initDigitalTwin(req, res) {
    try {
        const sessionId = req.headers['x-genesis-session-id'] || req.query.session_id || req.body?.session_id || 'default_session';
        const userId = req.user ? req.user.id : null;

        const twinData = await genesisModel.getOrCreateTwin(sessionId, userId);

        return res.status(200).json({
            success: true,
            twin: twinData
        });
    } catch (err) {
        logger.error('Error initializing Genesis Digital Twin:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to initialize Digital Twin state',
            error: err.message
        });
    }
}

/**
 * POST /api/genesis/calibrate
 * Save/Update 5-Axis Capability Radar scores & archetype calibration
 */
async function calibrateDigitalTwin(req, res) {
    try {
        const sessionId = req.headers['x-genesis-session-id'] || req.body?.session_id || 'default_session';
        const twinId = req.headers['x-digital-twin-id'] || req.body?.twin_id;
        const { scores, archetype, confidence } = req.body;
        const userId = req.user ? req.user.id : null;

        if (!scores || typeof scores !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Valid 5-axis capability scores object required'
            });
        }

        const updatedTwin = await genesisModel.updateCalibration(sessionId, twinId, scores, archetype, confidence, userId);

        return res.status(200).json({
            success: true,
            message: 'Genesis Digital Twin calibration updated successfully',
            twin: updatedTwin
        });
    } catch (err) {
        logger.error('Error calibrating Genesis Digital Twin:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to update Digital Twin calibration',
            error: err.message
        });
    }
}

module.exports = {
    initDigitalTwin,
    calibrateDigitalTwin
};
