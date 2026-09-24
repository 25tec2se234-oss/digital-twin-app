const { pool } = require('../db');
const OrgAnalyticsService = require('./orgAnalyticsService');

class OrgDigitalTwinService {
  
  /**
   * Generates a point-in-time Digital Twin representation of the organization.
   * Pulls strictly from established OrgAnalyticsService to avoid duplicating source-of-truth logic.
   */
  static async generateSnapshot(organizationId) {
    // 1. Gather component states — using correct OrgAnalyticsService method names
    const workforceState = await OrgAnalyticsService.getWorkforceMetrics(organizationId);
    const competencyState = await OrgAnalyticsService.getCompetencyCoverage(organizationId);
    const gapState = await OrgAnalyticsService.getSkillGapAnalytics(organizationId);
    const trainingState = await OrgAnalyticsService.getTrainingIntelligence(organizationId);
    const learningState = await OrgAnalyticsService.getLearningAnalytics(organizationId);
    
    // We can merge gap state into competency state for the twin
    const fullCompetencyState = { ...competencyState, gaps: gapState };

    // 2. Calculate Coverage & Confidence transparently
    // Example Methodology:
    // If we have 10 required competencies but only 2 have evidence, competency_coverage = 20%
    const totalRequired = parseInt(fullCompetencyState.totalRequiredCompetencies) || 0;
    const totalWithEvidence = parseInt(fullCompetencyState.totalWithEvidence) || 0;
    const competencyCoverage = totalRequired > 0 ? (totalWithEvidence / totalRequired) * 100 : 0;

    const evidenceCoverage = parseFloat(fullCompetencyState.evidenceCoveragePercentage) || 0;
    
    let confidence = 'LOW';
    if (evidenceCoverage > 75 && competencyCoverage > 75) {
        confidence = 'HIGH';
    } else if (evidenceCoverage > 40 || competencyCoverage > 40) {
        confidence = 'MEDIUM';
    }

    // 3. Persist the snapshot
    const insertQuery = `
      INSERT INTO org_digital_twin_snapshots 
        (organization_id, data_coverage, evidence_coverage, competency_coverage, learning_coverage, confidence, 
         workforce_state, competency_state, training_state, learning_state)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const res = await pool.query(insertQuery, [
        organizationId,
        100, // system data coverage
        evidenceCoverage,
        competencyCoverage,
        parseFloat(learningState.activeEnrollments) > 0 ? 100 : 0, // simplified learning coverage
        confidence,
        JSON.stringify(workforceState),
        JSON.stringify(fullCompetencyState),
        JSON.stringify(trainingState),
        JSON.stringify(learningState)
    ]);

    return res.rows[0];
  }

  static async getLatestSnapshot(organizationId) {
    const query = `
      SELECT * FROM org_digital_twin_snapshots 
      WHERE organization_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const res = await pool.query(query, [organizationId]);
    return res.rows[0] || null;
  }
}

module.exports = OrgDigitalTwinService;
