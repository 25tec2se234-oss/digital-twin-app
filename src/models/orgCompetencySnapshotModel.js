const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgCompetencySnapshotModel {
  static async getCurrentSnapshots(organizationId, traineeId) {
    // Get all current competency snapshots for this trainee
    const compQuery = `
      SELECT s.*, c.name, c.category
      FROM org_competency_snapshots s
      JOIN org_competencies c ON s.competency_id = c.id
      WHERE s.organization_id = $1 AND s.trainee_id = $2 AND s.is_current = true AND s.competency_id IS NOT NULL
    `;
    const competencies = await pool.query(compQuery, [organizationId, traineeId]);

    // Get all current skill snapshots for this trainee
    const skillQuery = `
      SELECT s.*, sk.name, sk.category
      FROM org_competency_snapshots s
      JOIN org_skills sk ON s.skill_id = sk.id
      WHERE s.organization_id = $1 AND s.trainee_id = $2 AND s.is_current = true AND s.skill_id IS NOT NULL
    `;
    const skills = await pool.query(skillQuery, [organizationId, traineeId]);

    return {
      competencies: competencies.rows,
      skills: skills.rows
    };
  }

  static async getHistoricalSnapshots(organizationId, traineeId, competencyId, skillId) {
    let query = `
      SELECT * FROM org_competency_snapshots
      WHERE organization_id = $1 AND trainee_id = $2
    `;
    const values = [organizationId, traineeId];
    let paramIndex = 3;

    if (competencyId) {
      query += ` AND competency_id = $${paramIndex++}`;
      values.push(competencyId);
    }

    if (skillId) {
      query += ` AND skill_id = $${paramIndex++}`;
      values.push(skillId);
    }

    query += ` ORDER BY snapshot_date ASC`;
    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = OrgCompetencySnapshotModel;
