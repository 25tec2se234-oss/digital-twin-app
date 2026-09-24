const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgAssessmentAttemptModel {
  static async startAttempt(organizationId, traineeId, assessment) {
    // Determine attempt number
    const attemptCountQuery = `
      SELECT COUNT(*) as count 
      FROM org_assessment_attempts 
      WHERE assessment_id = $1 AND trainee_id = $2
    `;
    const countResult = await pool.query(attemptCountQuery, [assessment.id, traineeId]);
    const attemptNumber = parseInt(countResult.rows[0].count, 10) + 1;

    if (attemptNumber > assessment.max_attempts) {
      throw new ApiError(403, 'Maximum attempts reached for this assessment.');
    }

    // Determine expiration
    let expiresAt = null;
    if (assessment.duration_minutes) {
      expiresAt = new Date(Date.now() + assessment.duration_minutes * 60000);
    }
    
    if (assessment.available_until) {
      const availableUntil = new Date(assessment.available_until);
      if (expiresAt && availableUntil < expiresAt) {
        expiresAt = availableUntil;
      } else if (!expiresAt) {
        expiresAt = availableUntil;
      }
    }

    const query = `
      INSERT INTO org_assessment_attempts 
        (assessment_id, trainee_id, organization_id, attempt_number, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [
      assessment.id, traineeId, organizationId, attemptNumber, expiresAt
    ]);

    return result.rows[0];
  }

  static async findByIdAndTrainee(id, traineeId) {
    const query = `
      SELECT a.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ans.id,
              'question_id', ans.question_id,
              'selected_option_id', ans.selected_option_id
            )
          ) FILTER (WHERE ans.id IS NOT NULL), '[]'
        ) as answers
      FROM org_assessment_attempts a
      LEFT JOIN org_attempt_answers ans ON a.id = ans.attempt_id
      WHERE a.id = $1 AND a.trainee_id = $2
      GROUP BY a.id
    `;
    const result = await pool.query(query, [id, traineeId]);
    return result.rows[0];
  }

  static async findAllByTraineeAndAssessment(traineeId, assessmentId) {
    const query = `
      SELECT * FROM org_assessment_attempts
      WHERE trainee_id = $1 AND assessment_id = $2
      ORDER BY attempt_number DESC
    `;
    const result = await pool.query(query, [traineeId, assessmentId]);
    return result.rows;
  }

  static async saveAnswer(attemptId, questionId, selectedOptionId) {
    const query = `
      INSERT INTO org_attempt_answers (attempt_id, question_id, selected_option_id, answered_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (attempt_id, question_id) 
      DO UPDATE SET selected_option_id = EXCLUDED.selected_option_id, answered_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [attemptId, questionId, selectedOptionId]);
    return result.rows[0];
  }

  static async submitAttempt(attemptId, evaluationResult, snapshotData) {
    const { score, percentage, is_passed } = evaluationResult;
    
    const query = `
      UPDATE org_assessment_attempts
      SET status = 'SUBMITTED',
          submitted_at = CURRENT_TIMESTAMP,
          score = $1,
          percentage = $2,
          is_passed = $3,
          snapshot_data = $4
      WHERE id = $5 AND status = 'IN_PROGRESS'
      RETURNING *
    `;
    const result = await pool.query(query, [
      score, percentage, is_passed, snapshotData, attemptId
    ]);
    
    if (result.rows.length === 0) {
       throw new ApiError(400, 'Attempt could not be submitted. It may have already been submitted.');
    }
    
    return result.rows[0];
  }
}

module.exports = OrgAssessmentAttemptModel;
