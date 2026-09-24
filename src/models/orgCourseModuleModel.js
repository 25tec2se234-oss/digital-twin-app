const { pool } = require('../db');

class OrgCourseModuleModel {
  static async create(courseId, data) {
    const { title, description } = data;

    // Get the next order_index
    const maxOrderRes = await pool.query(
      'SELECT COALESCE(MAX(order_index), 0) + 1 AS next_order FROM org_course_modules WHERE course_id = $1',
      [courseId]
    );
    const nextOrder = maxOrderRes.rows[0].next_order;

    const query = `
      INSERT INTO org_course_modules (course_id, title, description, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [courseId, title, description, nextOrder]);
    return result.rows[0];
  }

  static async findByIdAndCourse(id, courseId) {
    const query = `
      SELECT * FROM org_course_modules
      WHERE id = $1 AND course_id = $2
    `;
    const result = await pool.query(query, [id, courseId]);
    return result.rows[0];
  }

  static async findAllByCourse(courseId) {
    const query = `
      SELECT * FROM org_course_modules
      WHERE course_id = $1
      ORDER BY order_index ASC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async update(id, courseId, updateData) {
    const allowedFields = ['title', 'description'];
    const updates = [];
    const values = [id, courseId];
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
      UPDATE org_course_modules 
      SET ${updates.join(', ')}
      WHERE id = $1 AND course_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, courseId) {
    const query = `
      DELETE FROM org_course_modules
      WHERE id = $1 AND course_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, courseId]);
    return result.rows[0];
  }

  static async reorder(courseId, orderedModuleIds) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < orderedModuleIds.length; i++) {
        const moduleId = orderedModuleIds[i];
        await client.query(
          'UPDATE org_course_modules SET order_index = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND course_id = $3',
          [i + 1, moduleId, courseId]
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

module.exports = OrgCourseModuleModel;
