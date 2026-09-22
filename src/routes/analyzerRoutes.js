const express = require('express');
const analyzerController = require('../controllers/analyzerController');

const router = express.Router();

/**
 * @openapi
 * /analyzer/analyze:
 *   post:
 *     summary: Analyze career profile
 *     tags:
 *       - Analyzer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               academicInterest:
 *                 type: string
 *               achievements:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Analysis complete
 *       400:
 *         description: Invalid input
 */
router.post('/analyze', analyzerController.analyzeProfile);

module.exports = router;
