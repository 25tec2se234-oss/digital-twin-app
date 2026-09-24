const { pool } = require('../db');

class OrgTrainerAssignmentModel {
  static async getAssignments(organizationId, trainingNeedId) {
    const query = `
      SELECT a.*, u.first_name, u.last_name, u.email
      FROM org_trainer_assignments a
      JOIN users u ON a.trainer_id = u.id
      WHERE a.organization_id = $1 AND a.training_need_id = $2
      ORDER BY a.assigned_at DESC
    `;
    const result = await pool.query(query, [organizationId, trainingNeedId]);
    return result.rows;
  }

  static async assignTrainer(organizationId, trainingNeedId, trainerId, assignedBy, reason) {
    const query = `
      INSERT INTO org_trainer_assignments 
        (organization_id, training_need_id, trainer_id, assigned_by, assignment_reason, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING_REVIEW')
      ON CONFLICT (training_need_id, trainer_id) 
      DO UPDATE SET 
        assigned_by = EXCLUDED.assigned_by,
        assignment_reason = EXCLUDED.assignment_reason,
        status = 'PENDING_REVIEW',
        assigned_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [organizationId, trainingNeedId, trainerId, assignedBy, reason]);
    return result.rows[0];
  }

  static async updateAssignmentStatus(organizationId, trainingNeedId, trainerId, status, reason = null) {
    const query = `
      UPDATE org_trainer_assignments
      SET status = $1, reason_declined = $2, responded_at = CURRENT_TIMESTAMP
      WHERE organization_id = $3 AND training_need_id = $4 AND trainer_id = $5
      RETURNING *
    `;
    const result = await pool.query(query, [status, reason, organizationId, trainingNeedId, trainerId]);
    return result.rows[0];
  }
}

module.exports = OrgTrainerAssignmentModel;
