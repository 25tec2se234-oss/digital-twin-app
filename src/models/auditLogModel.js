const { pool } = require('../db');

/**
 * Creates an audit log record with multi-tenant organization tracking
 */
async function createLog(...args) {
  try {
    let userId, organizationId, action, resourceType, resourceId, details, ipAddress, userAgent;

    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      // Object style
      ({
        userId,
        organizationId,
        action,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent
      } = args[0]);
    } else if (args.length >= 8) {
      // 8-arg signature: (userId, organizationId, action, resourceType, resourceId, details, ipAddress, userAgent)
      [userId, organizationId, action, resourceType, resourceId, details, ipAddress, userAgent] = args;
    } else {
      // 7-arg legacy signature: (userId, action, resourceType, resourceId, details, ipAddress, userAgent)
      [userId, action, resourceType, resourceId, details, ipAddress, userAgent] = args;
      // Derive organizationId if resourceType is 'organization' or from details
      if (resourceType === 'organization') {
        organizationId = resourceId;
      } else if (details && details.organization_id) {
        organizationId = details.organization_id;
      }
    }

    const result = await pool.query(
      `INSERT INTO audit_logs 
        (user_id, organization_id, action, resource_type, resource_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        userId || null,
        organizationId || null,
        action,
        resourceType || null,
        resourceId ? String(resourceId) : null,
        JSON.stringify(details || {}),
        ipAddress || null,
        userAgent || null
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create audit log:', error.message);
    return null;
  }
}

/**
 * Retrieves paginated activity records for an organization
 */
async function getOrganizationActivity(organizationId, options = {}) {
  const limit = Math.min(Math.max(parseInt(options.limit, 10) || 20, 1), 100);
  const offset = Math.max(parseInt(options.offset, 10) || 0, 0);

  const query = `
    SELECT 
      al.id,
      al.organization_id,
      al.action,
      al.resource_type,
      al.resource_id,
      al.details,
      al.created_at,
      u.id as actor_id,
      u.name as actor_name,
      u.email as actor_email,
      u.avatar_url as actor_avatar,
      COUNT(*) OVER() AS total_count
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.organization_id = $1
    ORDER BY al.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await pool.query(query, [organizationId, limit, offset]);
  const total = result.rows[0] ? parseInt(result.rows[0].total_count, 10) : 0;
  
  const activities = result.rows.map(row => {
    const { total_count, ...activity } = row;
    return activity;
  });

  return { activities, total, limit, offset };
}

module.exports = {
  createLog,
  getOrganizationActivity
};
