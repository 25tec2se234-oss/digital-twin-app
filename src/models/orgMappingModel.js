const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgMappingModel {
  static async mapAssessmentToSkill(organizationId, assessmentId, questionId, skillId, weight = 1.0) {
    const query = `
      INSERT INTO org_assessment_skills (assessment_id, question_id, skill_id, weight)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (assessment_id, question_id, skill_id) DO UPDATE SET weight = EXCLUDED.weight
      RETURNING *
    `;
    const result = await pool.query(query, [assessmentId, questionId || null, skillId, weight]);
    return result.rows[0];
  }

  static async removeAssessmentSkillMapping(organizationId, assessmentId, questionId, skillId) {
    const query = `
      DELETE FROM org_assessment_skills
      WHERE assessment_id = $1 AND question_id IS NOT DISTINCT FROM $2 AND skill_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [assessmentId, questionId || null, skillId]);
    return result.rows[0];
  }

  static async mapCourseToSkill(organizationId, courseId, skillId) {
    const query = `
      INSERT INTO org_course_skills (course_id, skill_id)
      VALUES ($1, $2)
      ON CONFLICT (course_id, skill_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [courseId, skillId]);
    return result.rows[0];
  }

  static async removeCourseSkillMapping(organizationId, courseId, skillId) {
    const query = `
      DELETE FROM org_course_skills
      WHERE course_id = $1 AND skill_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [courseId, skillId]);
    return result.rows[0];
  }
}

module.exports = OrgMappingModel;
