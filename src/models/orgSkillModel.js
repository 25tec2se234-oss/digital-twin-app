const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgSkillModel {
  static async create(organizationId, createdBy, data) {
    const { name, code, description, category } = data;

    // Check if code exists globally or within org
    const checkQuery = `
      SELECT id FROM org_skills 
      WHERE code = $1 AND (organization_id = $2 OR organization_id IS NULL)
    `;
    const exists = await pool.query(checkQuery, [code, organizationId]);
    if (exists.rows.length > 0) {
      throw new ApiError(400, 'Skill code already exists in this scope.');
    }

    const query = `
      INSERT INTO org_skills 
        (organization_id, name, code, description, category, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, name, code, description, category, createdBy
    ]);
    return result.rows[0];
  }

  static async findById(id, organizationId) {
    const query = `
      SELECT * FROM org_skills
      WHERE id = $1 AND (organization_id = $2 OR organization_id IS NULL)
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findAll(organizationId, filters = {}) {
    let query = `
      SELECT id, name, code, category, status, organization_id
      FROM org_skills
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
    const skill = await this.findById(id, organizationId);
    if (!skill) throw new ApiError(404, 'Skill not found.');
    if (skill.organization_id === null && organizationId !== null) {
      throw new ApiError(403, 'Cannot modify a global skill.');
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (data.name !== undefined) { updates.push(`name = $${paramIndex++}`); values.push(data.name); }
    if (data.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(data.description); }
    if (data.category !== undefined) { updates.push(`category = $${paramIndex++}`); values.push(data.category); }
    if (data.status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(data.status); }

    if (updates.length === 0) return skill;

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE org_skills
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

  static async assignToCompetency(competencyId, skillId, weight) {
    const query = `
      INSERT INTO org_competency_skills (competency_id, skill_id, weight)
      VALUES ($1, $2, $3)
      ON CONFLICT (competency_id, skill_id) DO UPDATE SET weight = EXCLUDED.weight
      RETURNING *
    `;
    const result = await pool.query(query, [competencyId, skillId, weight || 1.0]);
    return result.rows[0];
  }

  static async removeFromCompetency(competencyId, skillId) {
    const query = `
      DELETE FROM org_competency_skills
      WHERE competency_id = $1 AND skill_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [competencyId, skillId]);
    return result.rows[0];
  }
}

module.exports = OrgSkillModel;
