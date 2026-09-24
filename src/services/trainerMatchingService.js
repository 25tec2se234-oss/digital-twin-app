const { pool } = require('../db');
const OrgTrainerMatchModel = require('../models/orgTrainerMatchModel');
const AIExplanationService = require('./aiExplanationService');

class TrainerMatchingService {
  /**
   * Generates matches for a specific training need and saves them to the DB.
   */
  static async generateMatchesForNeed(organizationId, trainingNeedId) {
    // 1. Get Training Need & Target Role Requirements
    const needQuery = `
      SELECT n.*, r.id as role_id, g.gap_type as title
      FROM org_training_needs n
      JOIN org_skill_gaps g ON n.gap_id = g.id
      JOIN org_roles r ON g.role_id = r.id
      WHERE n.organization_id = $1 AND n.id = $2
    `;
    const needResult = await pool.query(needQuery, [organizationId, trainingNeedId]);
    if (needResult.rows.length === 0) throw new Error('Training Need not found');
    const need = needResult.rows[0];

    // Get requirements for the role
    const reqQuery = `
      SELECT * FROM org_competency_requirements
      WHERE role_id = $1
    `;
    const reqResult = await pool.query(reqQuery, [need.role_id]);
    const requirements = reqResult.rows;

    if (requirements.length === 0) {
        throw new Error('No competency requirements found for this role');
    }

    // 2. Get all eligible trainers in the organization
    const trainersQuery = `
      SELECT u.id as trainer_id, u.first_name, u.last_name, tp.expertise, tp.experience_years, tp.qualifications, tp.certifications
      FROM users u
      JOIN trainer_profiles tp ON u.id = tp.user_id
      JOIN organization_memberships m ON u.id = m.user_id
      WHERE m.organization_id = $1 AND m.status = 'ACTIVE' AND m.role IN ('TRAINER', 'ORGANIZATION_ADMIN')
    `;
    const trainersResult = await pool.query(trainersQuery, [organizationId]);
    const trainers = trainersResult.rows;

    const matches = [];

    // 3. Evaluate each trainer
    for (const trainer of trainers) {
      const match = await this.evaluateTrainer(organizationId, trainer, requirements, need);
      
      // 4. Generate AI Explanation
      const aiExplanation = await AIExplanationService.explainTrainerMatch(
        `${trainer.first_name} ${trainer.last_name}`,
        need.title, // Assume need has a title
        match
      );

      // Save result
      const savedMatch = await OrgTrainerMatchModel.saveMatch(
        organizationId,
        trainingNeedId,
        trainer.trainer_id,
        match.scores,
        match.explanation,
        aiExplanation
      );
      matches.push(savedMatch);
    }

    return matches;
  }

  static async evaluateTrainer(organizationId, trainer, requirements, need) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    let mandatoryMet = true;
    let explanation = { breakdown: [] };
    let missingEvidenceCount = 0;

    // Fetch trainer's current competency snapshots
    const compQuery = `
      SELECT * FROM org_competency_snapshots
      WHERE organization_id = $1 AND user_id = $2 AND is_current = true
    `;
    const compResult = await pool.query(compQuery, [organizationId, trainer.trainer_id]);
    const snapshots = compResult.rows;

    let competencyPoints = 0;
    let maxCompetencyPoints = 0;

    for (const req of requirements) {
        let reqWeight = req.importance === 'CRITICAL' ? 3 : req.importance === 'HIGH' ? 2 : 1;
        maxCompetencyPoints += reqWeight * 100;

        const snapshot = snapshots.find(s => 
            s.competency_id === req.competency_id && 
            (s.skill_id === req.skill_id || (!s.skill_id && !req.skill_id))
        );

        let score = 0;
        let evidenceStatus = 'INSUFFICIENT_EVIDENCE';

        if (snapshot) {
            if (snapshot.score >= req.required_score) {
                score = 100;
                evidenceStatus = 'VERIFIED';
            } else {
                score = (snapshot.score / req.required_score) * 100;
                evidenceStatus = 'PARTIAL_EVIDENCE';
            }
        } else {
            missingEvidenceCount++;
        }

        if (req.is_mandatory && score < 100) {
            mandatoryMet = false;
        }

        competencyPoints += (score * reqWeight);
        
        explanation.breakdown.push({
            competency_id: req.competency_id,
            skill_id: req.skill_id,
            required_score: req.required_score,
            trainer_score: snapshot ? snapshot.score : 0,
            is_mandatory: req.is_mandatory,
            evidence_status: evidenceStatus,
            match_percentage: Math.min(score, 100)
        });
    }

    let competencyScore = maxCompetencyPoints > 0 ? (competencyPoints / maxCompetencyPoints) : 0;
    
    // Evaluate Experience
    let experienceScore = Math.min((trainer.experience_years / 5) * 100, 100); // Assume 5 years is 100% for baseline

    // Overall weighting
    // Competency = 70%, Experience = 30%
    let overallScore = (competencyScore * 0.7) + (experienceScore * 0.3);

    let confidence = 'HIGH';
    if (missingEvidenceCount > 0) confidence = 'MEDIUM';
    if (missingEvidenceCount > (requirements.length / 2)) confidence = 'LOW';
    if (snapshots.length === 0) confidence = 'NONE';

    let matchStatus = 'ELIGIBLE';
    if (!mandatoryMet) matchStatus = 'INELIGIBLE';
    else if (overallScore < 50) matchStatus = 'PARTIALLY_MATCHED';
    if (confidence === 'NONE' || confidence === 'LOW') matchStatus = 'INSUFFICIENT_EVIDENCE';

    return {
        scores: {
            overall_match_score: overallScore,
            competency_score: competencyScore,
            skill_score: competencyScore, // Simplified for now
            qualification_score: 0,
            certification_score: 0,
            experience_score: experienceScore,
            availability_score: 100, // Placeholder
            language_score: 100, // Placeholder
            workload_score: 100, // Placeholder
            performance_score: 0,
            mandatory_requirements_met: mandatoryMet,
            confidence: confidence,
            match_status: matchStatus
        },
        explanation: explanation
    };
  }
}

module.exports = TrainerMatchingService;
