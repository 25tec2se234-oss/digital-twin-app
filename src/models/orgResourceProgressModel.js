const { pool } = require('../db');

class OrgResourceProgressModel {
  static async getOrCreate(enrollmentId, resourceId) {
    const checkQuery = `
      SELECT * FROM org_resource_progress
      WHERE enrollment_id = $1 AND resource_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [enrollmentId, resourceId]);

    if (checkResult.rows.length > 0) {
      return checkResult.rows[0];
    }

    const insertQuery = `
      INSERT INTO org_resource_progress (enrollment_id, resource_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [enrollmentId, resourceId]);
    return insertResult.rows[0];
  }

  static async updateProgress(enrollmentId, resourceId, progressPercentage) {
    const status = progressPercentage >= 100 ? 'COMPLETED' : (progressPercentage > 0 ? 'IN_PROGRESS' : 'NOT_STARTED');
    const completedAtUpdate = status === 'COMPLETED' ? 'CURRENT_TIMESTAMP' : 'completed_at'; // retain existing if already completed or don't set if not

    const query = `
      INSERT INTO org_resource_progress (enrollment_id, resource_id, status, progress_percentage, started_at, last_accessed_at, completed_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CASE WHEN $3 = 'COMPLETED' THEN CURRENT_TIMESTAMP ELSE NULL END)
      ON CONFLICT (enrollment_id, resource_id)
      DO UPDATE SET 
        progress_percentage = $4,
        status = $3,
        last_accessed_at = CURRENT_TIMESTAMP,
        started_at = COALESCE(org_resource_progress.started_at, CURRENT_TIMESTAMP),
        completed_at = CASE WHEN $3 = 'COMPLETED' AND org_resource_progress.completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE org_resource_progress.completed_at END
      RETURNING *
    `;
    const result = await pool.query(query, [enrollmentId, resourceId, status, progressPercentage]);
    return result.rows[0];
  }

  static async findAllByEnrollment(enrollmentId) {
    const query = `
      SELECT * FROM org_resource_progress
      WHERE enrollment_id = $1
    `;
    const result = await pool.query(query, [enrollmentId]);
    return result.rows;
  }
}

module.exports = OrgResourceProgressModel;
