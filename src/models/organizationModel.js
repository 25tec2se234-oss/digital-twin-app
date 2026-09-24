const db = require('../db');

async function create(organizationData) {
  const { name, slug, description, logoUrl } = organizationData;
  const result = await db.query(
    'INSERT INTO organizations (name, slug, description, logo_url) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, slug, description || null, logoUrl || null]
  );
  return result.rows[0];
}

async function findById(id) {
  const result = await db.query('SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL', [id]);
  return result.rows[0];
}

async function update(id, updateData) {
  const { description, logoUrl } = updateData;
  const result = await db.query(
    'UPDATE organizations SET description = $1, logo_url = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND deleted_at IS NULL RETURNING *',
    [description, logoUrl, id]
  );
  return result.rows[0];
}

async function findBySlug(slug) {
  const result = await db.query('SELECT * FROM organizations WHERE slug = $1 AND deleted_at IS NULL', [slug]);
  return result.rows[0];
}

async function addMembership(organizationId, userId, role) {
  const result = await db.query(
    'INSERT INTO organization_memberships (organization_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (organization_id, user_id) DO UPDATE SET role = $3, updated_at = CURRENT_TIMESTAMP RETURNING *',
    [organizationId, userId, role]
  );
  return result.rows[0];
}

async function getMembership(organizationId, userId) {
  const result = await db.query(
    'SELECT * FROM organization_memberships WHERE organization_id = $1 AND user_id = $2',
    [organizationId, userId]
  );
  return result.rows[0];
}

async function getUserOrganizations(userId) {
  const result = await db.query(
    `SELECT o.*, om.role as membership_role, om.status as membership_status, om.joined_at 
     FROM organizations o 
     JOIN organization_memberships om ON o.id = om.organization_id 
     WHERE om.user_id = $1 AND o.deleted_at IS NULL`,
    [userId]
  );
  return result.rows;
}

async function getOrganizationMembers(organizationId, limit = 50, offset = 0) {
  const result = await db.query(
    `SELECT u.id, u.name, u.email, u.avatar_url, om.role, om.status, om.joined_at, COUNT(*) OVER() AS total 
     FROM users u 
     JOIN organization_memberships om ON u.id = om.user_id 
     WHERE om.organization_id = $1 
     ORDER BY om.joined_at DESC LIMIT $2 OFFSET $3`,
    [organizationId, limit, offset]
  );
  
  const total = result.rows[0] ? Number(result.rows[0].total) : 0;
  // Remove the total from the objects being returned
  const members = result.rows.map(r => {
    const { total, ...memberData } = r;
    return memberData;
  });
  
  return { members, total };
}

async function updateMemberRole(organizationId, userId, role) {
  const result = await db.query(
    'UPDATE organization_memberships SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE organization_id = $2 AND user_id = $3 RETURNING *',
    [role, organizationId, userId]
  );
  return result.rows[0];
}

async function updateMemberStatus(organizationId, userId, status) {
  const result = await db.query(
    'UPDATE organization_memberships SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE organization_id = $2 AND user_id = $3 RETURNING *',
    [status, organizationId, userId]
  );
  return result.rows[0];
}

async function removeMember(organizationId, userId) {
  const result = await db.query(
    'DELETE FROM organization_memberships WHERE organization_id = $1 AND user_id = $2 RETURNING *',
    [organizationId, userId]
  );
  return result.rows[0];
}

module.exports = {
  create,
  update,
  findById,
  findBySlug,
  addMembership,
  getMembership,
  getUserOrganizations,
  getOrganizationMembers,
  updateMemberRole,
  updateMemberStatus,
  removeMember
};
