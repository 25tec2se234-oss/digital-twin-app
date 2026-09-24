const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgRequirementModel {
  static async addRequirement(organizationId, createdBy, data) {
    const { 
      target_type, target_id, competency_id, skill_id, 
      required_level, required_score, importance, mandatory, 
      effective_until 
    } = data;

    if (!competency_id && !skill_id) {
      throw new ApiError(400, 'Must specify either a competency_id or skill_id for the requirement.');
    }

    const query = `
      INSERT INTO org_competency_requirements 
        (organization_id, target_type, target_id, competency_id, skill_id, 
         required_level, required_score, importance, mandatory, effective_until, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (organization_id, target_type, target_id, competency_id, skill_id) 
      DO UPDATE SET 
        required_level = EXCLUDED.required_level,
        required_score = EXCLUDED.required_score,
        importance = EXCLUDED.importance,
        mandatory = EXCLUDED.mandatory,
        effective_until = EXCLUDED.effective_until,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      organizationId, target_type, target_id, competency_id || null, skill_id || null,
      required_level, required_score, importance || 'MEDIUM', mandatory || false, 
      effective_until || null, createdBy
    ]);
    return result.rows[0];
  }

  static async getTargetRequirements(organizationId, targetType, targetId) {
    const query = `
      SELECT r.*, c.name as competency_name, s.name as skill_name
      FROM org_competency_requirements r
      LEFT JOIN org_competencies c ON r.competency_id = c.id
      LEFT JOIN org_skills s ON r.skill_id = s.id
      WHERE r.organization_id = $1 AND r.target_type = $2 AND r.target_id = $3
      ORDER BY r.mandatory DESC, r.importance DESC
    `;
    const result = await pool.query(query, [organizationId, targetType, targetId]);
    return result.rows;
  }

  static async removeRequirement(organizationId, id) {
    const query = `
      DELETE FROM org_competency_requirements
      WHERE id = $1 AND organization_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }
}

module.exports = OrgRequirementModel;
