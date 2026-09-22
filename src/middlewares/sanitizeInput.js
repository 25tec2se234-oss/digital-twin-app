const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify')(new JSDOM('').window);

const SENSITIVE_KEYS = new Set([
  'password', 'newpassword', 'currentpassword', 'confirmpassword',
  'otp', 'otpcode', 'verificationcode', 'token', 'refreshtoken', 
  'accesstoken', 'authorization', 'secret', 'apikey', 'clientsecret',
  'resettoken'
]);

function sanitizeValue(value, key = null) {
  if (key && typeof key === 'string' && SENSITIVE_KEYS.has(key.toLowerCase())) {
    return value;
  }

  if (typeof value === 'string') {
    // Only allow specific safe tags and attributes to prevent XSS.
    let sanitized = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'title', 'class', 'target'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false
    });
    return sanitized.trim();
  }

  if (Array.isArray(value)) {
    return value.map(function(item) {
      return sanitizeValue(item, key);
    });
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce(function(acc, k) {
      acc[k] = sanitizeValue(value[k], k);
      return acc;
    }, {});
  }

  return value;
}

function sanitizeInput(req, res, next) {
  if (req.originalUrl && req.originalUrl.startsWith('/api/v1/auth')) {
    return next();
  }

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  return next();
}

module.exports = sanitizeInput;
