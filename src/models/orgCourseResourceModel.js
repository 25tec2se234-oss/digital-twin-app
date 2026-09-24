const { pool } = require('../db');

class OrgCourseResourceModel {
  static async create(moduleId, data) {
    const { title, description, resource_type, storage_url, duration, file_size, mime_type, is_required } = data;

    // Get the next order_index
    const maxOrderRes = await pool.query(
      'SELECT COALESCE(MAX(order_index), 0) + 1 AS next_order FROM org_course_resources WHERE module_id = $1',
      [moduleId]
    );
    const nextOrder = maxOrderRes.rows[0].next_order;

    const query = `
      INSERT INTO org_course_resources (
        module_id, title, description, resource_type, storage_url, 
        duration, file_size, mime_type, order_index, is_required
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      moduleId, title, description, resource_type, storage_url,
      duration || 0, file_size || 0, mime_type, nextOrder,
      is_required !== undefined ? is_required : true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByIdAndModule(id, moduleId) {
    const query = `
      SELECT * FROM org_course_resources
      WHERE id = $1 AND module_id = $2
    `;
    const result = await pool.query(query, [id, moduleId]);
    return result.rows[0];
  }

  static async findAllByModule(moduleId) {
    const query = `
      SELECT * FROM org_course_resources
      WHERE module_id = $1
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [moduleId]);
    return result.rows;
  }

  static async update(id, moduleId, updateData) {
    const allowedFields = ['title', 'description', 'duration', 'is_required'];
    const updates = [];
    const values = [id, moduleId];
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
      UPDATE org_course_resources 
      SET ${updates.join(', ')}
      WHERE id = $1 AND module_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, moduleId) {
    const query = `
      DELETE FROM org_course_resources
      WHERE id = $1 AND module_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, moduleId]);
    return result.rows[0];
  }

  static async reorder(moduleId, orderedResourceIds) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < orderedResourceIds.length; i++) {
        const resourceId = orderedResourceIds[i];
        await client.query(
          'UPDATE org_course_resources SET order_index = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND module_id = $3',
          [i + 1, resourceId, moduleId]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

module.exports = OrgCourseResourceModel;
