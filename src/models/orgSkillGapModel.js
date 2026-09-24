const { pool } = require('../db');

class OrgSkillGapModel {
  static async getTraineeGaps(organizationId, traineeId, includeHistory = false) {
    let query = `
      SELECT g.*, 
        c.name as competency_name, 
        s.name as skill_name,
        r.name as role_name
      FROM org_skill_gaps g
      LEFT JOIN org_competencies c ON g.competency_id = c.id
      LEFT JOIN org_skills s ON g.skill_id = s.id
      LEFT JOIN org_roles r ON g.target_type = 'ROLE' AND g.target_id = r.id
      WHERE g.organization_id = $1 AND g.trainee_id = $2
    `;
    if (!includeHistory) {
      query += ` AND g.is_current = true`;
    }
    query += ` ORDER BY 
      CASE g.priority 
        WHEN 'CRITICAL' THEN 1 
        WHEN 'HIGH' THEN 2 
        WHEN 'MEDIUM' THEN 3 
        WHEN 'LOW' THEN 4 
        ELSE 5 
      END ASC, g.gap_type DESC, g.calculated_at DESC`;
      
    const result = await pool.query(query, [organizationId, traineeId]);
    return result.rows;
  }

  static async getTraineeTrainingNeeds(organizationId, traineeId) {
    const query = `
      SELECT n.*, 
        c.name as competency_name, 
        s.name as skill_name,
        COALESCE(
          json_agg(
            json_build_object(
              'course_id', rec.course_id,
              'course_title', cr.title,
              'matching_score', rec.matching_score
            )
          ) FILTER (WHERE rec.id IS NOT NULL), '[]'
        ) as recommendations
      FROM org_training_needs n
      LEFT JOIN org_competencies c ON n.competency_id = c.id
      LEFT JOIN org_skills s ON n.skill_id = s.id
      LEFT JOIN org_training_recommendations rec ON n.id = rec.training_need_id
      LEFT JOIN org_courses cr ON rec.course_id = cr.id
      WHERE n.organization_id = $1 AND n.trainee_id = $2 AND n.status NOT IN ('RESOLVED', 'DISMISSED')
      GROUP BY n.id, c.name, s.name
      ORDER BY 
        CASE n.priority 
          WHEN 'CRITICAL' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'MEDIUM' THEN 3 
          WHEN 'LOW' THEN 4 
          ELSE 5 
        END ASC
    `;
    const result = await pool.query(query, [organizationId, traineeId]);
    return result.rows;
  }

  static async getOrganizationTrainingNeeds(organizationId) {
    const query = `
      SELECT 
        n.competency_id, c.name as competency_name,
        n.skill_id, s.name as skill_name,
        n.priority,
        COUNT(DISTINCT n.trainee_id) as affected_people
      FROM org_training_needs n
      LEFT JOIN org_competencies c ON n.competency_id = c.id
      LEFT JOIN org_skills s ON n.skill_id = s.id
      WHERE n.organization_id = $1 AND n.status NOT IN ('RESOLVED', 'DISMISSED')
      GROUP BY n.competency_id, c.name, n.skill_id, s.name, n.priority
      ORDER BY affected_people DESC
    `;
    const result = await pool.query(query, [organizationId]);
    return result.rows;
  }
}

module.exports = OrgSkillGapModel;
