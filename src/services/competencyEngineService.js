const { pool } = require('../db');
const orgCompetencyEvidenceModel = require('../models/orgCompetencyEvidenceModel');
const orgCompetencyLevelModel = require('../models/orgCompetencyLevelModel');

class CompetencyEngineService {
  
  // Phase I: Ingest Assessment Results and generate Evidence
  static async processAssessmentSubmission(organizationId, traineeId, attemptId) {
    // 1. Get assessment details, questions, and mapped skills
    const attemptQuery = `
      SELECT a.id, a.assessment_id, a.score_percentage
      FROM org_assessment_attempts a
      WHERE a.id = $1 AND a.organization_id = $2
    `;
    const attemptResult = await pool.query(attemptQuery, [attemptId, organizationId]);
    if (attemptResult.rows.length === 0) return;
    const attempt = attemptResult.rows[0];

    // Check if the assessment as a whole is mapped to any skills
    const mappingQuery = `
      SELECT skill_id, weight 
      FROM org_assessment_skills 
      WHERE assessment_id = $1 AND question_id IS NULL
    `;
    const mappings = await pool.query(mappingQuery, [attempt.assessment_id]);

    for (const row of mappings.rows) {
      await orgCompetencyEvidenceModel.addEvidence(organizationId, traineeId, {
        skill_id: row.skill_id,
        evidence_type: 'ASSESSMENT',
        source_id: attempt.id,
        evidence_value: attempt.score_percentage,
        normalized_score: attempt.score_percentage, // Assessments are naturally 0-100
        confidence: 'HIGH',
        verification_status: 'VERIFIED',
        metadata: { weight: row.weight, assessment_id: attempt.assessment_id }
      });
      // Trigger recalculation for this skill for this trainee
      await this.recalculateTraineeSkill(organizationId, traineeId, row.skill_id);
    }
  }

  // Phase J: Centralized Calculation
  static async recalculateTraineeSkill(organizationId, traineeId, skillId) {
    // 1. Get all verified evidence for this skill for this trainee
    const evidenceQuery = `
      SELECT * FROM org_competency_evidence
      WHERE organization_id = $1 AND trainee_id = $2 AND skill_id = $3 AND verification_status = 'VERIFIED'
      ORDER BY observed_at ASC
    `;
    const evidenceResult = await pool.query(evidenceQuery, [organizationId, traineeId, skillId]);
    
    if (evidenceResult.rows.length === 0) return; // No evidence, skip

    // Simple calculation for now: Weighted average based on confidence?
    // Let's keep it simple: take the most recent high confidence, or average them.
    // DTV Rules: Trainer > Assessment > Course > Self-Reported
    let finalScore = 0;
    
    // Sort evidence by type precedence
    const typeWeights = {
      'TRAINER_EVALUATION': 1.0,
      'ASSESSMENT': 0.8,
      'VERIFIED_QUALIFICATION': 0.8,
      'COURSE_COMPLETION': 0.5,
      'SELF_REPORTED': 0.2
    };

    let totalWeight = 0;
    let weightedSum = 0;

    for (const e of evidenceResult.rows) {
      const w = typeWeights[e.evidence_type] || 0.5;
      weightedSum += (parseFloat(e.normalized_score) * w);
      totalWeight += w;
    }

    if (totalWeight > 0) {
      finalScore = weightedSum / totalWeight;
    }

    // Phase L: Save Snapshot
    await this.saveSnapshot(organizationId, traineeId, null, skillId, finalScore, evidenceResult.rows.length);

    // After recalculating skill, we must recalculate any parent competencies this skill belongs to
    const parentQuery = `
      SELECT competency_id FROM org_competency_skills WHERE skill_id = $1
    `;
    const parents = await pool.query(parentQuery, [skillId]);
    for (const parent of parents.rows) {
      await this.recalculateTraineeCompetency(organizationId, traineeId, parent.competency_id);
    }
  }

  static async recalculateTraineeCompetency(organizationId, traineeId, competencyId) {
    // 1. Find all skills mapped to this competency
    const mappingQuery = `
      SELECT skill_id, weight 
      FROM org_competency_skills 
      WHERE competency_id = $1
    `;
    const mappings = await pool.query(mappingQuery, [competencyId]);

    if (mappings.rows.length === 0) return;

    let totalWeight = 0;
    let weightedSum = 0;
    let evidenceCount = 0;

    for (const map of mappings.rows) {
      // Get current snapshot for this skill
      const snapQuery = `
        SELECT score, evidence_count FROM org_competency_snapshots
        WHERE organization_id = $1 AND trainee_id = $2 AND skill_id = $3 AND is_current = true
      `;
      const snapResult = await pool.query(snapQuery, [organizationId, traineeId, map.skill_id]);
      if (snapResult.rows.length > 0) {
        const snap = snapResult.rows[0];
        const w = parseFloat(map.weight);
        weightedSum += (parseFloat(snap.score) * w);
        totalWeight += w;
        evidenceCount += parseInt(snap.evidence_count);
      }
    }

    if (totalWeight > 0) {
      const finalScore = weightedSum / totalWeight;
      await this.saveSnapshot(organizationId, traineeId, competencyId, null, finalScore, evidenceCount);
    }
  }

  static async saveSnapshot(organizationId, traineeId, competencyId, skillId, score, evidenceCount) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Mark existing as not current
      const updateQuery = `
        UPDATE org_competency_snapshots 
        SET is_current = false
        WHERE organization_id = $1 AND trainee_id = $2 
          AND competency_id IS NOT DISTINCT FROM $3
          AND skill_id IS NOT DISTINCT FROM $4
      `;
      await client.query(updateQuery, [organizationId, traineeId, competencyId || null, skillId || null]);

      // 2. Determine level if it's a competency
      let levelName = null;
      let levelOrder = null;
      if (competencyId) {
        const compQuery = `SELECT level_framework FROM org_competencies WHERE id = $1`;
        const compRes = await client.query(compQuery, [competencyId]);
        if (compRes.rows.length > 0) {
          const framework = compRes.rows[0].level_framework;
          const level = await orgCompetencyLevelModel.getLevelForScore(organizationId, framework, score);
          if (level) {
            levelName = level.level_name;
            levelOrder = level.level_order;
          }
        }
      }

      // 3. Insert new snapshot
      const insertQuery = `
        INSERT INTO org_competency_snapshots 
          (organization_id, trainee_id, competency_id, skill_id, score, level_name, level_order, evidence_count, is_current)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      `;
      await client.query(insertQuery, [
        organizationId, traineeId, competencyId || null, skillId || null, 
        score, levelName, levelOrder, evidenceCount
      ]);

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Error saving competency snapshot:', e);
    } finally {
      client.release();
    }
  }
}

module.exports = CompetencyEngineService;
