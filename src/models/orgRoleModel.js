const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgRoleModel {
  static async create(organizationId, createdBy, data) {
    const { name, description, department } = data;

    const checkQuery = `
      SELECT id FROM org_roles 
      WHERE name = $1 AND organization_id = $2
    `;
    const exists = await pool.query(checkQuery, [name, organizationId]);
    if (exists.rows.length > 0) {
      throw new ApiError(400, 'Role name already exists in this organization.');
    }

    const query = `
      INSERT INTO org_roles (organization_id, name, description, department, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [organizationId, name, description, department, createdBy]);
    return result.rows[0];
  }

  static async findById(id, organizationId) {
    const query = `
      SELECT * FROM org_roles
      WHERE id = $1 AND organization_id = $2
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findAll(organizationId, filters = {}) {
    let query = `
      SELECT id, name, description, department, status 
      FROM org_roles
      WHERE organization_id = $1
    `;
    const values = [organizationId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(filters.status);
    }
    
    if (filters.department) {
      query += ` AND department = $${paramIndex++}`;
      values.push(filters.department);
    }

    query += ` ORDER BY name ASC`;
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, organizationId, data) {
    const role = await this.findById(id, organizationId);
    if (!role) throw new ApiError(404, 'Role not found.');

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(data.name); }
    if (data.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(data.description); }
    if (data.department !== undefined) { updates.push(`department = $${paramIndex++}`); values.push(data.department); }
    if (data.status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(data.status); }

    if (updates.length === 0) return role;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE org_roles
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex++}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async archive(id, organizationId) {
    return this.update(id, organizationId, { status: 'ARCHIVED' });
  }
}

module.exports = OrgRoleModel;
