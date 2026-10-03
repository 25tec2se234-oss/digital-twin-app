const db = require('../db');

async function create(organizationId, data) {
  const { name, description } = data;
  const result = await db.query(
    'INSERT INTO org_departments (organization_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [organizationId, name, description]
  );
  return result.rows[0];
}

async function findByOrganization(organizationId) {
  const result = await db.query(
    `SELECT d.*, COUNT(ud.user_id) as member_count 
     FROM org_departments d 
     LEFT JOIN org_user_departments ud ON d.id = ud.department_id 
     WHERE d.organization_id = $1 AND d.status != 'ARCHIVED'
     GROUP BY d.id
     ORDER BY d.name ASC`,
    [organizationId]
  );
  return result.rows;
}

async function update(id, organizationId, data) {
  const { name, description, status } = data;
  const result = await db.query(
    'UPDATE org_departments SET name = $1, description = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND organization_id = $5 RETURNING *',
    [name, description, status, id, organizationId]
  );
  return result.rows[0];
}

async function archive(id, organizationId) {
  const result = await db.query(
    'UPDATE org_departments SET status = \'ARCHIVED\', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND organization_id = $2 RETURNING *',
    [id, organizationId]
  );
  return result.rows[0];
}

async function assignMember(organizationId, departmentId, userId) {
  // First clear existing assignments for this user in this org
  await db.query('DELETE FROM org_user_departments WHERE organization_id = $1 AND user_id = $2', [organizationId, userId]);
  
  if (departmentId) {
    await db.query(
      'INSERT INTO org_user_departments (organization_id, user_id, department_id) VALUES ($1, $2, $3)',
      [organizationId, userId, departmentId]
    );
  }
}

module.exports = {
  create,
  findByOrganization,
  update,
  archive,
  assignMember
};
