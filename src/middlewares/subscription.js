const ApiError = require('../utils/apiError');
const { pool } = require('../db');

async function requirePremium(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication is required to access this resource.'
    });
  }

  // Admin users bypass subscription checks
  if (req.user.role === 'admin') {
    return next();
  }

  const now = new Date();
  const trialExpiresAt = req.user.trialExpiresAt ? new Date(req.user.trialExpiresAt) : null;
  const subExpiresAt = req.user.subscriptionExpiresAt ? new Date(req.user.subscriptionExpiresAt) : null;

  const hasActiveTrial = trialExpiresAt && trialExpiresAt > now;
  const hasActiveSub = subExpiresAt && subExpiresAt > now;

  if (hasActiveTrial || hasActiveSub) {
    return next();
  }

  // Log unauthorized premium access attempt
  pool.query(
    'INSERT INTO audit_logs (user_id, action, target_resource, request_payload, ip_address) VALUES ($1, $2, $3, $4, $5)',
    [
      req.user.id, 
      `BLOCKED_PREMIUM_ACCESS: ${req.method} ${req.baseUrl || ''}${req.path}`, 
      req.originalUrl, 
      JSON.stringify(req.body || {}).substring(0, 500), 
      req.ip || '127.0.0.1'
    ]
  ).catch(err => console.error('Failed to log premium access block:', err));

  return res.status(403).json({
    success: false,
    error: 'SubscriptionExpired',
    message: 'Your Plan Is Expired Please Upgrade Your Plan To Get The Access',
    expiredAt: Math.max(trialExpiresAt || 0, subExpiresAt || 0)
  });
}

module.exports = {
  requirePremium
};
