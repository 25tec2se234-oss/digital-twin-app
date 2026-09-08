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
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, 'x-on=')
      .replace(/<(iframe|object|embed|applet|svg|math)\b/gi, '<x-$1')
      .replace(/data:text\/html/gi, 'data:text/plain')
      .trim();
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
