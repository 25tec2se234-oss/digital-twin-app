const { pool } = require('../db');
const crypto = require('crypto');

async function create(organizationId, inviterId, email, role, expiresInDays = 7) {
  // Generate a secure random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token for storage (SHA-256)
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const result = await pool.query(
    `INSERT INTO organization_invitations 
     (organization_id, inviter_id, email, role, token_hash, expires_at) 
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP + interval '1 day' * $6)
     RETURNING *`,
    [organizationId, inviterId, email, role, tokenHash, expiresInDays]
  );
  
  // Return both the record and the RAW token (so the controller can email it)
  return {
    invitation: result.rows[0],
    rawToken
  };
}

async function findByTokenHash(tokenHash) {
  const result = await pool.query(
    `SELECT i.*, o.name as organization_name 
     FROM organization_invitations i
     JOIN organizations o ON i.organization_id = o.id
     WHERE i.token_hash = $1`,
    [tokenHash]
  );
  return result.rows[0];
}

async function findPendingByOrganization(organizationId) {
  const result = await pool.query(
    `SELECT i.*, u.name as inviter_name 
     FROM organization_invitations i
     JOIN users u ON i.inviter_id = u.id
     WHERE i.organization_id = $1 AND i.status = 'PENDING'
     ORDER BY i.created_at DESC`,
    [organizationId]
  );
  return result.rows;
}

async function updateStatus(invitationId, status) {
  const result = await pool.query(
    `UPDATE organization_invitations 
     SET status = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 RETURNING *`,
    [status, invitationId]
  );
  return result.rows[0];
}

async function checkExisting(organizationId, email) {
  const result = await pool.query(
    `SELECT * FROM organization_invitations 
     WHERE organization_id = $1 AND email = $2 AND status = 'PENDING' AND expires_at > CURRENT_TIMESTAMP`,
    [organizationId, email]
  );
  return result.rows.length > 0;
}

module.exports = {
  create,
  findByTokenHash,
  findPendingByOrganization,
  updateStatus,
  checkExisting
};
