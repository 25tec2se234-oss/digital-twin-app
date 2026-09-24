const { pool } = require('../db');

class OrgCourseEnrollmentModel {
  static async create(organizationId, courseId, traineeId) {
    const query = `
      INSERT INTO org_course_enrollments (organization_id, course_id, trainee_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [organizationId, courseId, traineeId]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT * FROM org_course_enrollments
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCourseAndTrainee(courseId, traineeId) {
    const query = `
      SELECT * FROM org_course_enrollments
      WHERE course_id = $1 AND trainee_id = $2
    `;
    const result = await pool.query(query, [courseId, traineeId]);
    return result.rows[0];
  }

  static async findAllByCourse(courseId) {
    const query = `
      SELECT e.*, u.first_name, u.last_name, u.email 
      FROM org_course_enrollments e
      JOIN users u ON e.trainee_id = u.id
      WHERE e.course_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }

  static async findAllByTrainee(traineeId, organizationId) {
    const query = `
      SELECT e.*, c.title as course_title, c.slug, c.thumbnail 
      FROM org_course_enrollments e
      JOIN org_courses c ON e.course_id = c.id
      WHERE e.trainee_id = $1 AND e.organization_id = $2
      ORDER BY e.last_accessed_at DESC NULLS LAST, e.enrolled_at DESC
    `;
    const result = await pool.query(query, [traineeId, organizationId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE org_course_enrollments
      SET status = $1, 
          started_at = CASE WHEN $1 = 'IN_PROGRESS' AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
          completed_at = CASE WHEN $1 = 'COMPLETED' AND completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async updateLastAccessed(id) {
    const query = `
      UPDATE org_course_enrollments
      SET last_accessed_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }
}

module.exports = OrgCourseEnrollmentModel;
