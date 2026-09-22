const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const { pool } = require('../db');

const SENSITIVE_KEYS = new Set([
  'password', 'newpassword', 'currentpassword', 'confirmpassword',
  'otp', 'otpcode', 'verificationcode', 'token', 'refreshtoken', 
  'accesstoken', 'authorization', 'secret', 'apikey', 'clientsecret',
  'resettoken'
]);

function redactSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitiveData);
  
  const redacted = {};
  for (const key in obj) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else {
      redacted[key] = redactSensitiveData(obj[key]);
    }
  }
  return redacted;
}

async function authenticate(req, _res, next) {
  const header = req.headers.authorization || req.headers['x-auth-token'] || req.headers['x-dt-auth'] || '';
  if (!header.startsWith('Bearer ')) {
    if (req.method === 'GET' && req.accepts('html')) {
      return _res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Loading Dashboard...</title></head>
        <body style="background:#0b1322; color:#fff; font-family:sans-serif; text-align:center; padding-top:50px;">
          <h2>Authenticating...</h2>
          <script>
            var userStr = localStorage.getItem('dt_user') || sessionStorage.getItem('dt_appdata_v3');
            var token = localStorage.getItem('token') || localStorage.getItem('adminToken') || '';
            if (!token && userStr) {
              try {
                var data = JSON.parse(userStr);
                if (data.token) token = data.token;
                else if (data.userData && data.userData.token) token = data.userData.token;
                else if (data.accessToken) token = data.accessToken;
              } catch(e) {}
            }
            if (!token && window.opener && window.opener.APP_DATA) {
              token = window.opener.APP_DATA.userData.token;
            }
            if (token) {
              fetch(window.location.href, { headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'text/html' } })
              .then(res => {
                if (!res.ok) window.location.href = '/login.html';
                return res.text();
              })
              .then(html => {
                if(html) {
                  document.open();
                  document.write(html);
                  document.close();
                }
              });
            } else {
              window.location.href = '/login.html';
            }
          </script>
        </body>
        </html>
      `);
    }
    return next(new ApiError(401, 'Missing authorization token.'));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
    const user = await userModel.findById(payload.sub);
    if (!user || !user.isActive) {
      return next(new ApiError(401, 'Account is inactive or missing.'));
    }
    req.user = user;

    // Log audit trail if modifying request
    if (req.method !== 'GET') {
      let safeBody = '{}';
      try {
        const redactedBody = redactSensitiveData(req.body);
        safeBody = JSON.stringify(redactedBody);
        if (safeBody.length > 2000) safeBody = safeBody.substring(0, 2000) + '...[TRUNCATED]';
      } catch (e) {}

      pool.query(
        'INSERT INTO audit_logs (user_id, action, target_resource, request_payload, ip_address) VALUES ($1, $2, $3, $4, $5)',
        [user.id, `${req.method} ${req.baseUrl}${req.path}`, req.originalUrl, safeBody, req.ip || '127.0.0.1']
      ).catch(() => {});
    }

    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

async function authenticateOptional(req, _res, next) {
  const header = req.headers.authorization || req.headers['x-auth-token'] || req.headers['x-dt-auth'] || '';
  if (!header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });
    const user = await userModel.findById(payload.sub);
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
}

function authorize() {
  const roles = Array.prototype.slice.call(arguments);
  return function(req, _res, next) {
    if (!req.user || roles.indexOf(req.user.role) === -1) {
      return next(new ApiError(403, 'Insufficient permissions.'));
    }
    return next();
  };
}

function requireVerified(req, res, next) {
  if (!req.user || !req.user.emailVerified) {
    return next(new ApiError(403, 'Email verification required.'));
  }
  return next();
}

async function authorizeParentOfStudent(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized.'));
  }
  
  if (req.user.role === 'admin') {
    return next(); // Admins can access any data
  }

  const studentId = req.params.studentId || req.body.studentId;
  if (!studentId) {
    return next(new ApiError(400, 'Student ID is required to verify parent access.'));
  }

  if (req.user.role === 'student' && req.user.id.toString() === studentId.toString()) {
    return next(); // Student can access their own data
  }

  if (req.user.role === 'parent') {
    const linkedStudents = await userModel.getLinkedStudents(req.user.id);
    const isLinked = linkedStudents.some(s => s.id.toString() === studentId.toString());
    if (isLinked) {
      return next(); // Linked parent can access student data
    }
  }

  return next(new ApiError(403, 'Insufficient permissions to access this student data.'));
}

async function authorizeAdmin(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized.'));
  }
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin privileges required.'));
  }
  return next();
}

module.exports = {
  authenticate,
  authenticateOptional,
  authorize,
  requireVerified,
  authorizeParentOfStudent,
  authorizeAdmin
};
