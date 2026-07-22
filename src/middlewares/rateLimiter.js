const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const { RedisStore } = require('rate-limit-redis');
const { getClient } = require('../services/cacheService');

// Helper to get store configuration based on Redis availability
function getStoreConfig(prefix) {
  const client = getClient();
  if (client) {
    return new RedisStore({
      sendCommand: (...args) => client.call(...args),
      prefix: prefix
    });
  }
  return undefined; // Falls back to memory store if Redis is unavailable
}

const generalLimiter = rateLimit({
  store: getStoreConfig('rate-limit:general:'),
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  store: getStoreConfig('rate-limit:auth:'),
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 5, // Strict 5 attempts per window to prevent brute force
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'SECURITY ALERT: Too many authentication attempts. Please retry later.' }
});

const aiLimiter = rateLimit({
  store: getStoreConfig('rate-limit:ai:'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Strictly 15 requests per 15 minutes per IP to prevent billing abuse
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'SECURITY ALERT: Too many AI requests. Please try again later.' }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
