const { pool } = require('../db');

class OrgTrainerMatchModel {
  static async getMatchesForNeed(organizationId, trainingNeedId) {
    const query = `
      SELECT m.*, u.first_name, u.last_name, tp.title as trainer_title, tp.bio as trainer_bio
      FROM org_trainer_matches m
      JOIN users u ON m.trainer_id = u.id
      JOIN trainer_profiles tp ON tp.user_id = u.id
      WHERE m.organization_id = $1 AND m.training_need_id = $2
      ORDER BY m.overall_match_score DESC
    `;
    const result = await pool.query(query, [organizationId, trainingNeedId]);
    return result.rows;
  }

  static async getMatchDetail(organizationId, matchId) {
    const query = `
      SELECT m.*, u.first_name, u.last_name, tp.title as trainer_title, tp.bio as trainer_bio
      FROM org_trainer_matches m
      JOIN users u ON m.trainer_id = u.id
      JOIN trainer_profiles tp ON tp.user_id = u.id
      WHERE m.organization_id = $1 AND m.id = $2
    `;
    const result = await pool.query(query, [organizationId, matchId]);
    return result.rows[0];
  }

  static async saveMatch(organizationId, trainingNeedId, trainerId, scores, explanationJson, aiExplanation) {
    const query = `
      INSERT INTO org_trainer_matches (
        organization_id, training_need_id, trainer_id,
        overall_match_score, competency_score, skill_score, 
        qualification_score, certification_score, experience_score,
        availability_score, language_score, workload_score, performance_score,
        mandatory_requirements_met, confidence, match_status,
        explanation_json, ai_explanation, engine_version
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      )
      ON CONFLICT (training_need_id, trainer_id) 
      DO UPDATE SET
        overall_match_score = EXCLUDED.overall_match_score,
        competency_score = EXCLUDED.competency_score,
        skill_score = EXCLUDED.skill_score,
        qualification_score = EXCLUDED.qualification_score,
        certification_score = EXCLUDED.certification_score,
        experience_score = EXCLUDED.experience_score,
        availability_score = EXCLUDED.availability_score,
        language_score = EXCLUDED.language_score,
        workload_score = EXCLUDED.workload_score,
        performance_score = EXCLUDED.performance_score,
        mandatory_requirements_met = EXCLUDED.mandatory_requirements_met,
        confidence = EXCLUDED.confidence,
        match_status = EXCLUDED.match_status,
        explanation_json = EXCLUDED.explanation_json,
        ai_explanation = EXCLUDED.ai_explanation,
        engine_version = EXCLUDED.engine_version,
        generated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [
      organizationId, trainingNeedId, trainerId,
      scores.overall_match_score, scores.competency_score, scores.skill_score,
      scores.qualification_score, scores.certification_score, scores.experience_score,
      scores.availability_score, scores.language_score, scores.workload_score, scores.performance_score,
      scores.mandatory_requirements_met, scores.confidence, scores.match_status,
      explanationJson, aiExplanation, '1.0'
    ]);
    return result.rows[0];
  }
}

module.exports = OrgTrainerMatchModel;
