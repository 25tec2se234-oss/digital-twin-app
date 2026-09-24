const { pool } = require('../db');

class OrgTrainerAvailabilityModel {
  static async getAvailability(organizationId, trainerId, fromDate, toDate) {
    const query = `
      SELECT * FROM org_trainer_availability
      WHERE organization_id = $1 AND trainer_id = $2
        AND available_date >= $3 AND available_date <= $4
      ORDER BY available_date ASC, start_time ASC
    `;
    const result = await pool.query(query, [organizationId, trainerId, fromDate, toDate]);
    return result.rows;
  }

  static async setAvailability(organizationId, trainerId, data) {
    const { available_date, start_time, end_time, timezone, status } = data;
    const query = `
      INSERT INTO org_trainer_availability 
        (organization_id, trainer_id, available_date, start_time, end_time, timezone, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (trainer_id, available_date, start_time, end_time)
      DO UPDATE SET status = EXCLUDED.status, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, trainerId, available_date, start_time, end_time, 
      timezone || 'UTC', status || 'AVAILABLE'
    ]);
    return result.rows[0];
  }
}

module.exports = OrgTrainerAvailabilityModel;
