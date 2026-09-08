const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const { RedisStore } = require('rate-limit-redis');
const cacheService = require('../services/cacheService');

class DynamicStore {
  constructor(prefix) {
    this.prefix = prefix;
    this.memoryStore = undefined;
    this.redisStore = null;
  }

  getStore() {
    if (env.NODE_ENV === 'test') return undefined; // Let express-rate-limit use default memory store internally
    if (cacheService.isReady()) {
      if (!this.redisStore) {
        const client = cacheService.getClient();
        if (client) {
          this.redisStore = new RedisStore({
            sendCommand: (...args) => client.call(...args),
            prefix: this.prefix
          });
        }
      }
      if (this.redisStore) return this.redisStore;
    }
    return undefined; // fallback to default
  }

  async increment(key) {
    const store = this.getStore();
    if (store) return store.increment(key);
    
    // Lazy initialize fallback memory store
    if (!this.memoryStore) {
      const { MemoryStore } = require('express-rate-limit');
      this.memoryStore = new MemoryStore();
    }
    return this.memoryStore.increment(key);
  }

  async decrement(key) {
    const store = this.getStore();
    if (store) return store.decrement(key);
    if (this.memoryStore) return this.memoryStore.decrement(key);
  }

  async resetKey(key) {
    const store = this.getStore();
    if (store) return store.resetKey(key);
    if (this.memoryStore) return this.memoryStore.resetKey(key);
  }
}

function getStoreConfig(prefix) {
  if (env.NODE_ENV === 'test') return undefined;
  return new DynamicStore(prefix);
}

const generalLimiter = rateLimit({
  store: getStoreConfig('rate-limit:general:'),
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true
});

const authLimiter = rateLimit({
  store: getStoreConfig('rate-limit:auth:'),
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX, // Configurable limit instead of strict 5
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true,
  message: { error: 'SECURITY ALERT: Too many authentication attempts. Please retry later.' }
});

const aiLimiter = rateLimit({
  store: getStoreConfig('rate-limit:ai:'),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Strictly 15 requests per 15 minutes per IP to prevent billing abuse
  standardHeaders: true,
  legacyHeaders: false,
  passOnStoreError: true,
  message: { error: 'SECURITY ALERT: Too many AI requests. Please try again later.' }
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter
};
