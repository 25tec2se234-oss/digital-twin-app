const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const leaderboardModel = require('../models/leaderboardModel');
const { authenticateOptional } = require('../middlewares/auth');

const router = express.Router();

/**
 * Middleware: Guest Session Handler
 * Uses existing user session if logged in, otherwise ensures a guest_session_id cookie exists.
 */
function guestSessionMiddleware(req, res, next) {
  if (req.user && req.user.id) {
    req.sessionId = null; // Prioritize logged in user
    return next();
  }

  let sessionId = req.cookies.guest_session_id;
  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString('hex');
    // Set cookie for 1 year
    res.cookie('guest_session_id', sessionId, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  }
  req.sessionId = sessionId;
  next();
}

/**
 * Simple in-memory cache for the leaderboard to reduce DB load
 */
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

// Strict rate limiter for tracking actions
const trackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 actions per minute
  message: { error: 'Too many actions recorded. Please slow down.' }
});

/**
 * GET /api/leaderboard?period=weekly&page=1&limit=25
 */
router.get('/', authenticateOptional, guestSessionMiddleware, async (req, res, next) => {
  try {
    const period = req.query.period || 'weekly';
    if (!['all_time', 'monthly', 'weekly'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period. Must be all_time, monthly, or weekly.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ error: 'Invalid page or limit parameters.' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    const cacheKey = `leaderboard_${period}_${page}_${limit}_${isAdmin}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return res.json({ data: cached.data });
    }

    let data = await leaderboardModel.getLeaderboardSnapshot(period, page, limit, isAdmin);
    
    // Fallback: If snapshot is empty, trigger cron calculation immediately once and re-fetch
    if (!data || data.length === 0) {
      const leaderboardCron = require('../services/leaderboardCron');
      await leaderboardCron.runCronJob();
      data = await leaderboardModel.getLeaderboardSnapshot(period, page, limit, isAdmin);
    }

    cache.set(cacheKey, { timestamp: Date.now(), data });
    
    res.json({ data });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/leaderboard/me
 * Get current user's rank for all periods
 */
router.get('/me', authenticateOptional, guestSessionMiddleware, async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionId = req.sessionId;

    const [weekly, monthly, allTime] = await Promise.all([
      leaderboardModel.getUserRank(userId, sessionId, 'weekly'),
      leaderboardModel.getUserRank(userId, sessionId, 'monthly'),
      leaderboardModel.getUserRank(userId, sessionId, 'all_time')
    ]);

    res.json({
      weekly: weekly || { rank: 0, score: 0 },
      monthly: monthly || { rank: 0, score: 0 },
      all_time: allTime || { rank: 0, score: 0 }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leaderboard/preference
 * Toggle public opt-in
 */
router.post('/preference', authenticateOptional, async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Must be logged in to set preference.' });
    }
    const { optIn } = req.body;
    if (typeof optIn !== 'boolean') {
      return res.status(400).json({ error: 'optIn must be a boolean.' });
    }
    await leaderboardModel.setPublicOptIn(req.user.id, optIn);
    res.json({ success: true, optIn });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/leaderboard/track
 * Track user action
 */
router.post('/track', authenticateOptional, guestSessionMiddleware, trackLimiter, async (req, res, next) => {
  try {
    const { action } = req.body;
    if (!action) {
      return res.status(400).json({ error: 'Action is required.' });
    }

    const userId = req.user ? req.user.id : null;
    const sessionId = req.sessionId;

    const points = await leaderboardModel.trackActivity(userId, sessionId, action);
    res.json({ success: true, pointsAwarded: points });
  } catch (error) {
    if (error.message.includes('Invalid or inactive action type')) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

module.exports = router;
