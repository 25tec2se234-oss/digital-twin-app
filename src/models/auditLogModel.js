const { pool } = require('../db');

async function createLog(userId, action, resourceType, resourceId, details, ipAddress, userAgent) {
  try {
    const result = await pool.query(
      `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userId, action, resourceType, resourceId, JSON.stringify(details || {}), ipAddress, userAgent]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
}

module.exports = {
  createLog
};
