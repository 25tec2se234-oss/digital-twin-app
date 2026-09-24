const db = require('../db');

/**
 * Checks if a user has a specific permission for an organization
 * First, it checks their generic platform role (if they are SUPER_ADMIN, they have access)
 * Then, it checks their specific role in the organization
 */
async function hasPermission(userId, organizationId, permissionKey) {
  // Check if platform admin first
  const userResult = await db.query('SELECT role FROM users WHERE id = $1', [userId]);
  if (userResult.rows[0]?.role === 'admin' || userResult.rows[0]?.role === 'super_admin') {
    return true; // Global admins have all permissions
  }

  // Get user role in the specific organization
  const membershipResult = await db.query(
    'SELECT role FROM organization_memberships WHERE user_id = $1 AND organization_id = $2 AND status = $3',
    [userId, organizationId, 'Active']
  );
  
  if (membershipResult.rowCount === 0) {
    return false; // Not a member of the organization
  }
  
  const orgRole = membershipResult.rows[0].role;
  
  // Check if role has the requested permission
  const permissionResult = await db.query(
    `SELECT 1 
     FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.id
     WHERE rp.role = $1 AND p.permission_key = $2`,
    [orgRole, permissionKey]
  );
  
  return permissionResult.rowCount > 0;
}

/**
 * Gets all permissions for an organization role
 */
async function getRolePermissions(role) {
  const result = await db.query(
    `SELECT p.permission_key, p.description 
     FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.id
     WHERE rp.role = $1`,
    [role]
  );
  return result.rows;
}

module.exports = {
  hasPermission,
  getRolePermissions
};
