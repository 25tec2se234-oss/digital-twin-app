const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgCompetencyEvidenceModel {
  static async addEvidence(organizationId, traineeId, data) {
    const { 
      competency_id, skill_id, evidence_type, source_id, 
      evidence_value, normalized_score, confidence, verification_status, metadata 
    } = data;

    if (!competency_id && !skill_id) {
      throw new ApiError(400, 'Evidence must be linked to either a competency or a skill.');
    }

    const query = `
      INSERT INTO org_competency_evidence 
        (organization_id, trainee_id, competency_id, skill_id, evidence_type, 
         source_id, evidence_value, normalized_score, confidence, 
         verification_status, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (trainee_id, evidence_type, source_id, skill_id, competency_id) 
      DO UPDATE SET 
        evidence_value = EXCLUDED.evidence_value,
        normalized_score = EXCLUDED.normalized_score,
        confidence = EXCLUDED.confidence,
        verification_status = EXCLUDED.verification_status,
        metadata = EXCLUDED.metadata,
        observed_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, traineeId, competency_id || null, skill_id || null, 
      evidence_type, source_id, evidence_value, normalized_score, 
      confidence || 'MEDIUM', verification_status || 'VERIFIED', metadata || {}
    ]);
    
    return result.rows[0];
  }

  static async getEvidenceForTrainee(organizationId, traineeId, filters = {}) {
    let query = `
      SELECT e.*, c.name as competency_name, s.name as skill_name
      FROM org_competency_evidence e
      LEFT JOIN org_competencies c ON e.competency_id = c.id
      LEFT JOIN org_skills s ON e.skill_id = s.id
      WHERE e.organization_id = $1 AND e.trainee_id = $2
    `;
    const values = [organizationId, traineeId];
    let paramIndex = 3;

    if (filters.competency_id) {
      query += ` AND e.competency_id = $${paramIndex++}`;
      values.push(filters.competency_id);
    }
    
    if (filters.skill_id) {
      query += ` AND e.skill_id = $${paramIndex++}`;
      values.push(filters.skill_id);
    }

    query += ` ORDER BY e.observed_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = OrgCompetencyEvidenceModel;
