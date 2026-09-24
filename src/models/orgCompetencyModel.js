const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgCompetencyModel {
  static async create(organizationId, createdBy, data) {
    const { name, code, description, category, level_framework } = data;

    // Check if code exists globally or within org
    const checkQuery = `
      SELECT id FROM org_competencies 
      WHERE code = $1 AND (organization_id = $2 OR organization_id IS NULL)
    `;
    const exists = await pool.query(checkQuery, [code, organizationId]);
    if (exists.rows.length > 0) {
      throw new ApiError(400, 'Competency code already exists in this scope.');
    }

    const query = `
      INSERT INTO org_competencies 
        (organization_id, name, code, description, category, level_framework, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, name, code, description, category, 
      level_framework || 'DEFAULT_5_LEVEL', createdBy
    ]);
    return result.rows[0];
  }

  static async findById(id, organizationId) {
    const query = `
      SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'name', s.name,
              'code', s.code,
              'weight', cs.weight
            )
          ) FILTER (WHERE s.id IS NOT NULL), '[]'
        ) as skills
      FROM org_competencies c
      LEFT JOIN org_competency_skills cs ON c.id = cs.competency_id
      LEFT JOIN org_skills s ON cs.skill_id = s.id
      WHERE c.id = $1 AND (c.organization_id = $2 OR c.organization_id IS NULL)
      GROUP BY c.id
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findAll(organizationId, filters = {}) {
    let query = `
      SELECT id, name, code, category, status, organization_id, level_framework
      FROM org_competencies
      WHERE (organization_id = $1 OR organization_id IS NULL)
    `;
    const values = [organizationId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex++}`;
      values.push(filters.status);
    }
    
    if (filters.category) {
      query += ` AND category = $${paramIndex++}`;
      values.push(filters.category);
    }

    query += ` ORDER BY name ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, organizationId, data) {
    const competency = await this.findById(id, organizationId);
    if (!competency) throw new ApiError(404, 'Competency not found.');
    if (competency.organization_id === null && organizationId !== null) {
      throw new ApiError(403, 'Cannot modify a global competency.');
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(data.name); }
    if (data.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(data.description); }
    if (data.category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(data.category); }
    if (data.status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(data.status); }

    if (updates.length === 0) return competency;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE org_competencies
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

module.exports = OrgCompetencyModel;
