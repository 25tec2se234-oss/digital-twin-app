const { pool } = require('../db');

class OrgCourseModel {
  static async create(data) {
    const {
      organization_id,
      title,
      slug,
      short_description,
      description,
      thumbnail,
      category,
      level,
      language,
      estimated_duration,
      trainer_id,
      created_by
    } = data;

    const query = `
      INSERT INTO org_courses (
        organization_id, title, slug, short_description, description, 
        thumbnail, category, level, language, estimated_duration, 
        trainer_id, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      organization_id, title, slug, short_description, description,
      thumbnail, category, level, language, estimated_duration,
      trainer_id, created_by
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByIdAndOrganization(id, organizationId) {
    const query = `
      SELECT * FROM org_courses 
      WHERE id = $1 AND organization_id = $2
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findBySlugAndOrganization(slug, organizationId) {
    const query = `
      SELECT * FROM org_courses 
      WHERE slug = $1 AND organization_id = $2
    `;
    const result = await pool.query(query, [slug, organizationId]);
    return result.rows[0];
  }

  static async findAllByOrganization(organizationId, filters = {}) {
    let query = `SELECT * FROM org_courses WHERE organization_id = $1`;
    const values = [organizationId];
    let count = 2;

    if (filters.status) {
      query += ` AND status = $${count}`;
      values.push(filters.status);
      count++;
    }

    if (filters.trainer_id) {
      query += ` AND trainer_id = $${count}`;
      values.push(filters.trainer_id);
      count++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, organizationId, updateData) {
    const allowedFields = [
      'title', 'slug', 'short_description', 'description', 
      'thumbnail', 'category', 'level', 'language', 
      'estimated_duration', 'status', 'trainer_id'
    ];

    const updates = [];
    const values = [id, organizationId];
    let count = 3;

    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${count}`);
        values.push(updateData[key]);
        count++;
      }
    }

    if (updates.length === 0) return null;

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const query = `
      UPDATE org_courses 
      SET ${updates.join(', ')}
      WHERE id = $1 AND organization_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async archive(id, organizationId) {
    return this.update(id, organizationId, { status: 'ARCHIVED' });
  }

  static async publish(id, organizationId) {
    return this.update(id, organizationId, { status: 'PUBLISHED' });
  }
}

module.exports = OrgCourseModel;
