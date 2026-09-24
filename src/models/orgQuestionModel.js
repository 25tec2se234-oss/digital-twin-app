const { pool } = require('../db');
const ApiError = require('../utils/apiError');

class OrgQuestionModel {
  static async create(organizationId, createdBy, data) {
    const { question_text, question_type = 'MCQ_SINGLE', difficulty = 'MEDIUM', explanation, points = 1 } = data;
    const query = `
      INSERT INTO org_questions 
        (organization_id, created_by, question_text, question_type, difficulty, explanation, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId,
      createdBy,
      question_text,
      question_type,
      difficulty,
      explanation,
      points
    ]);
    return result.rows[0];
  }

  static async findByIdAndOrganization(id, organizationId) {
    const query = `
      SELECT q.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', o.id,
              'option_text', o.option_text,
              'order_index', o.order_index,
              'is_correct', o.is_correct
            ) ORDER BY o.order_index ASC
          ) FILTER (WHERE o.id IS NOT NULL), '[]'
        ) as options
      FROM org_questions q
      LEFT JOIN org_question_options o ON q.id = o.question_id
      WHERE q.id = $1 AND q.organization_id = $2
      GROUP BY q.id
    `;
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async findAllByOrganization(organizationId, filters = {}) {
    let query = `
      SELECT id, question_text, question_type, difficulty, points, status, created_at 
      FROM org_questions
      WHERE organization_id = $1
    `;
    const values = [organizationId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    } else {
      query += ` AND status = 'ACTIVE'`;
    }

    if (filters.difficulty) {
      query += ` AND difficulty = $${paramIndex}`;
      values.push(filters.difficulty);
      paramIndex++;
    }

    if (filters.question_type) {
      query += ` AND question_type = $${paramIndex}`;
      values.push(filters.question_type);
      paramIndex++;
    }

    if (filters.search) {
      query += ` AND question_text ILIKE $${paramIndex}`;
      values.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async checkHasAttempts(questionId) {
    // Check if the question is part of any assessment that has active or submitted attempts
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM org_assessment_questions aq
        JOIN org_assessment_attempts a ON aq.assessment_id = a.assessment_id
        WHERE aq.question_id = $1
      ) as has_attempts
    `;
    const result = await pool.query(query, [questionId]);
    return result.rows[0].has_attempts;
  }

  static async update(id, organizationId, data) {
    const hasAttempts = await this.checkHasAttempts(id);
    if (hasAttempts) {
      throw new ApiError(400, 'Cannot modify a question that has been used in assessment attempts. Create a new question instead.');
    }

    const { question_text, question_type, difficulty, explanation, points, status } = data;
    
    // Dynamically build the update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (question_text !== undefined) {
      updates.push(`question_text = $${paramIndex++}`);
      values.push(question_text);
    }
    if (question_type !== undefined) {
      updates.push(`question_type = $${paramIndex++}`);
      values.push(question_type);
    }
    if (difficulty !== undefined) {
      updates.push(`difficulty = $${paramIndex++}`);
      values.push(difficulty);
    }
    if (explanation !== undefined) {
      updates.push(`explanation = $${paramIndex++}`);
      values.push(explanation);
    }
    if (points !== undefined) {
      updates.push(`points = $${paramIndex++}`);
      values.push(points);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (updates.length === 0) return this.findByIdAndOrganization(id, organizationId);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id, organizationId);

    const query = `
      UPDATE org_questions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex++} AND organization_id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteOrArchive(id, organizationId) {
    const hasAttempts = await this.checkHasAttempts(id);
    
    if (hasAttempts) {
      // Soft delete (archive)
      const query = `
        UPDATE org_questions 
        SET status = 'ARCHIVED', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND organization_id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [id, organizationId]);
      return { action: 'archived', question: result.rows[0] };
    } else {
      // Hard delete
      const query = `
        DELETE FROM org_questions 
        WHERE id = $1 AND organization_id = $2
        RETURNING id
      `;
      const result = await pool.query(query, [id, organizationId]);
      return { action: 'deleted', question: result.rows[0] };
    }
  }

  // Options management
  static async addOption(questionId, data) {
    const { option_text, order_index = 0, is_correct = false } = data;
    const query = `
      INSERT INTO org_question_options (question_id, option_text, order_index, is_correct)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [questionId, option_text, order_index, is_correct]);
    return result.rows[0];
  }

  static async updateOption(optionId, questionId, data) {
    const { option_text, order_index, is_correct } = data;
    
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (option_text !== undefined) {
      updates.push(`option_text = $${paramIndex++}`);
      values.push(option_text);
    }
    if (order_index !== undefined) {
      updates.push(`order_index = $${paramIndex++}`);
      values.push(order_index);
    }
    if (is_correct !== undefined) {
      updates.push(`is_correct = $${paramIndex++}`);
      values.push(is_correct);
    }

    if (updates.length === 0) return null;

    values.push(optionId, questionId);

    const query = `
      UPDATE org_question_options
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex++} AND question_id = $${paramIndex}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteOption(optionId, questionId) {
    const query = `
      DELETE FROM org_question_options
      WHERE id = $1 AND question_id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [optionId, questionId]);
    return result.rows[0];
  }
}

module.exports = OrgQuestionModel;
