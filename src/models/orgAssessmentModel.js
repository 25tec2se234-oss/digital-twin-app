const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgAssessmentModel {
  static async create(organizationId, courseId, createdBy, data) {
    const { 
      title, description, instructions, duration_minutes, 
      passing_percentage, max_attempts, randomize_questions, 
      randomize_options, show_results, allow_review, 
      available_from, available_until 
    } = data;

    const query = `
      INSERT INTO org_assessments 
        (organization_id, course_id, created_by, title, description, instructions, 
         duration_minutes, passing_percentage, max_attempts, randomize_questions, 
         randomize_options, show_results, allow_review, available_from, available_until)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, courseId, createdBy, title, description, instructions,
      duration_minutes, passing_percentage, max_attempts, randomize_questions,
      randomize_options, show_results, allow_review, available_from, available_until
    ]);
    return result.rows[0];
  }

  static async findByIdAndOrganization(id, organizationId) {
    const query = `
      SELECT a.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', q.id,
              'question_text', q.question_text,
              'question_type', q.question_type,
              'difficulty', q.difficulty,
              'points', q.points,
              'order_index', aq.order_index
            ) ORDER BY aq.order_index ASC
          ) FILTER (WHERE q.id IS NOT NULL), '[]'
        ) as questions
      FROM org_assessments a
      LEFT JOIN org_assessment_questions aq ON a.id = aq.assessment_id
      LEFT JOIN org_questions q ON aq.question_id = q.id
      WHERE a.id = $1 AND a.organization_id = $2
      GROUP BY a.id
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findAllByCourse(courseId, organizationId, status = null) {
    let query = `
      SELECT id, title, duration_minutes, passing_percentage, max_attempts, 
             status, available_from, available_until, created_at 
      FROM org_assessments
      WHERE course_id = $1 AND organization_id = $2
    `;
    const values = [courseId, organizationId];
    
    if (status) {
      query += ` AND status = $3`;
      values.push(status);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(id, organizationId, data) {
    // If it has submitted attempts, restrict fields that can change historical integrity
    const hasAttemptsQuery = `
      SELECT EXISTS (
        SELECT 1 FROM org_assessment_attempts WHERE assessment_id = $1 AND status IN ('SUBMITTED')
      ) as has_attempts
    `;
    const attemptResult = await pool.query(hasAttemptsQuery, [id]);
    const hasAttempts = attemptResult.rows[0].has_attempts;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Allowed to update anytime
    if (data.title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(data.title); }
    if (data.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(data.description); }
    if (data.instructions !== undefined) { updates.push(`instructions = $${paramIndex++}`); values.push(data.instructions); }
    if (data.show_results !== undefined) { updates.push(`show_results = $${paramIndex++}`); values.push(data.show_results); }
    if (data.allow_review !== undefined) { updates.push(`allow_review = $${paramIndex++}`); values.push(data.allow_review); }
    if (data.available_from !== undefined) { updates.push(`available_from = $${paramIndex++}`); values.push(data.available_from); }
    if (data.available_until !== undefined) { updates.push(`available_until = $${paramIndex++}`); values.push(data.available_until); }

    // Restricted if has attempts
    if (!hasAttempts) {
      if (data.duration_minutes !== undefined) { updates.push(`duration_minutes = $${paramIndex++}`); values.push(data.duration_minutes); }
      if (data.passing_percentage !== undefined) { updates.push(`passing_percentage = $${paramIndex++}`); values.push(data.passing_percentage); }
      if (data.max_attempts !== undefined) { updates.push(`max_attempts = $${paramIndex++}`); values.push(data.max_attempts); }
      if (data.randomize_questions !== undefined) { updates.push(`randomize_questions = $${paramIndex++}`); values.push(data.randomize_questions); }
      if (data.randomize_options !== undefined) { updates.push(`randomize_options = $${paramIndex++}`); values.push(data.randomize_options); }
    } else if (
      data.duration_minutes !== undefined || 
      data.passing_percentage !== undefined || 
      data.max_attempts !== undefined || 
      data.randomize_questions !== undefined || 
      data.randomize_options !== undefined
    ) {
      throw new ApiError(400, 'Cannot modify structural configuration (duration, passing %, etc.) for an assessment with submitted attempts.');
    }

    if (data.status !== undefined) {
       // Publishing logic handled separately, but we can accept status changes directly
       updates.push(`status = $${paramIndex++}`); values.push(data.status); 
    }

    if (updates.length === 0) return this.findByIdAndOrganization(id, organizationId);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, organizationId);

    const query = `
      UPDATE org_assessments
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex++} AND organization_id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async assignQuestion(assessmentId, questionId, orderIndex) {
    const query = `
      INSERT INTO org_assessment_questions (assessment_id, question_id, order_index)
      VALUES ($1, $2, $3)
      ON CONFLICT (assessment_id, question_id) 
      DO UPDATE SET order_index = EXCLUDED.order_index
      RETURNING *
    `;
    const result = await pool.query(query, [assessmentId, questionId, orderIndex]);
    return result.rows[0];
  }

  static async removeQuestion(assessmentId, questionId) {
    const query = `
      DELETE FROM org_assessment_questions
      WHERE assessment_id = $1 AND question_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [assessmentId, questionId]);
    return result.rows[0];
  }

  static async validateForPublishing(id, organizationId) {
    const assessment = await this.findByIdAndOrganization(id, organizationId);
    if (!assessment) throw new ApiError(404, 'Assessment not found.');

    if (!assessment.questions || assessment.questions.length === 0) {
      throw new ApiError(400, 'Assessment must contain at least one question to be published.');
    }

    // Verify all questions have at least one correct option
    const verifyQuestionsQuery = `
      SELECT q.id, q.question_text, COUNT(o.id) as option_count, SUM(CASE WHEN o.is_correct THEN 1 ELSE 0 END) as correct_count
      FROM org_assessment_questions aq
      JOIN org_questions q ON aq.question_id = q.id
      LEFT JOIN org_question_options o ON q.id = o.question_id
      WHERE aq.assessment_id = $1
      GROUP BY q.id
    `;
    const qResult = await pool.query(verifyQuestionsQuery, [id]);
    
    for (const q of qResult.rows) {
      if (q.option_count === 0) {
        throw new ApiError(400, 'Question "' + q.question_text.substring(0,20) + '..." has no options.');
      }
      if (q.correct_count === 0) {
        throw new ApiError(400, 'Question "' + q.question_text.substring(0,20) + '..." has no correct option selected.');
      }
    }

    return true;
  }
}

module.exports = OrgAssessmentModel;
