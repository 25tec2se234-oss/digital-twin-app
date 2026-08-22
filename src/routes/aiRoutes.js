const express = require('express');
const Joi = require('joi');
const aiController = require('../controllers/aiController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');
const { requirePremium } = require('../middlewares/subscription');
const { aiLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

const aiSchema = Joi.object({
  body: Joi.object({
    system: Joi.string().allow('').optional(),
    max_tokens: Joi.number().min(64).max(2000).optional(),
    messages: Joi.array().items(Joi.object({
      role: Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().allow('').required()
    })).min(1).required()
  }).required()
});

/**
 * @openapi
 * /ai/messages:
 *   post:
 *     summary: Forward AI messages securely
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [messages]
 *             properties:
 *               system:
 *                 type: string
 *               max_tokens:
 *                 type: integer
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: AI response
 *       403:
 *         description: Subscription Expired
 */
router.post('/ai/messages', authenticate, requirePremium, aiLimiter, validate(aiSchema), aiController.sendMessages);
router.post('/messages', authenticate, requirePremium, aiLimiter, validate(aiSchema), aiController.sendMessages);
// Public unauthenticated route for Achievement Analyzer
router.post('/public-analyzer', aiLimiter, validate(aiSchema), aiController.sendMessages);

module.exports = router;
