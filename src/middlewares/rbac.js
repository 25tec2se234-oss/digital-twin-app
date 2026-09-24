const ApiError = require('../utils/apiError');
const permissionModel = require('../models/permissionModel');
const organizationModel = require('../models/organizationModel');

/**
 * Ensures the authenticated user belongs to the requested organization.
 * The organization ID can come from params, body, or query.
 */
async function requireOrganizationMembership(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  // Super admins have global access
  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    return next();
  }

  const organizationId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
  
  if (!organizationId) {
    return next(new ApiError(400, 'Organization ID is required.'));
  }

  try {
    const membership = await organizationModel.getMembership(organizationId, req.user.id);
    
    if (!membership || membership.status !== 'Active') {
      // Intentionally generic error message to prevent IDOR enumeration
      return next(new ApiError(403, 'You do not have access to this organization.'));
    }

    // Attach membership info to request for downstream handlers
    req.organizationMembership = membership;
    return next();
  } catch (error) {
    console.error('Organization membership check failed:', error);
    return next(new ApiError(500, 'Unable to verify organization access.'));
  }
}

/**
 * Ensures the authenticated user has a specific permission in the organization context.
 * MUST be used after requireOrganizationMembership (unless it's a super admin).
 */
function requirePermission(permissionKey) {
  return async function(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    const organizationId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
    
    if (!organizationId) {
      // If there's no organization context, we can only check if they're a platform admin
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next();
      }
      return next(new ApiError(400, 'Organization context is required for permission check.'));
    }

    try {
      const hasAccess = await permissionModel.hasPermission(req.user.id, organizationId, permissionKey);
      
      if (!hasAccess) {
        return next(new ApiError(403, `You lack the required permission (${permissionKey}) for this action.`));
      }

      return next();
    } catch (error) {
      console.error('Permission check failed:', error);
      return next(new ApiError(500, 'Unable to verify permissions.'));
    }
  };
}

module.exports = {
  requireOrganizationMembership,
  requirePermission
};
