const { pool } = require('../db');

class OrgAnalyticsService {
  /**
   * 1. Workforce Analytics
   */
  static async getWorkforceMetrics(organizationId) {
    const query = `
      SELECT 
        COUNT(*) as total_active_people,
        COUNT(CASE WHEN role = 'TRAINER' THEN 1 END) as active_trainers,
        COUNT(CASE WHEN role = 'TRAINEE' THEN 1 END) as active_trainees,
        COUNT(CASE WHEN role = 'ORGANIZATION_ADMIN' THEN 1 END) as active_admins
      FROM organization_memberships
      WHERE organization_id = $1 AND status = 'ACTIVE'
    `;
    const res = await pool.query(query, [organizationId]);
    return res.rows[0];
  }

  /**
   * 2. Competency Intelligence & Coverage
   */
  static async getCompetencyCoverage(organizationId) {
    // We get the total number of trainees
    const workforce = await this.getWorkforceMetrics(organizationId);
    const totalTrainees = parseInt(workforce.active_trainees) || 0;

    const query = `
      SELECT 
        COUNT(DISTINCT user_id) as people_with_evidence,
        COUNT(CASE WHEN score >= 50 THEN 1 END) as people_meeting_required_level,
        COUNT(CASE WHEN score < 50 THEN 1 END) as people_below_required_level
      FROM org_competency_snapshots
      WHERE organization_id = $1 AND is_current = true
    `;
    const res = await pool.query(query, [organizationId]);
    const data = res.rows[0];

    const peopleWithEvidence = parseInt(data.people_with_evidence) || 0;
    const evidenceCoveragePercent = totalTrainees > 0 ? ((peopleWithEvidence / totalTrainees) * 100).toFixed(2) : 0;

    return {
      total_trainees: totalTrainees,
      people_with_evidence: peopleWithEvidence,
      people_meeting_required_level: parseInt(data.people_meeting_required_level) || 0,
      people_below_required_level: parseInt(data.people_below_required_level) || 0,
      evidence_coverage_percent: evidenceCoveragePercent
    };
  }

  /**
   * 3. Skill Gap Intelligence
   */
  static async getSkillGapAnalytics(organizationId) {
    const query = `
      SELECT 
        COUNT(*) as total_identified_gaps,
        COUNT(CASE WHEN priority = 'CRITICAL' THEN 1 END) as critical_gaps,
        COUNT(CASE WHEN priority = 'HIGH' THEN 1 END) as high_gaps,
        COUNT(CASE WHEN priority = 'MEDIUM' THEN 1 END) as medium_gaps,
        COUNT(CASE WHEN priority = 'LOW' THEN 1 END) as low_gaps,
        COUNT(CASE WHEN gap_type = 'SCORE_GAP' THEN 1 END) as score_gaps,
        COUNT(CASE WHEN gap_type = 'LEVEL_GAP' THEN 1 END) as level_gaps,
        COUNT(CASE WHEN gap_type = 'EVIDENCE_GAP' THEN 1 END) as evidence_gaps,
        COUNT(CASE WHEN gap_type = 'STALE_EVIDENCE' THEN 1 END) as stale_evidence_gaps
      FROM org_skill_gaps
      WHERE organization_id = $1 AND is_current = true
    `;
    const res = await pool.query(query, [organizationId]);
    return res.rows[0];
  }

  /**
   * 4. Training Intelligence
   */
  static async getTrainingIntelligence(organizationId) {
    const needsQuery = `
      SELECT 
        COUNT(*) as total_training_needs,
        COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open_needs,
        COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_needs,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_needs
      FROM org_training_needs
      WHERE organization_id = $1
    `;
    const needsRes = await pool.query(needsQuery, [organizationId]);

    const assignmentQuery = `
      SELECT 
        COUNT(*) as total_assignments,
        COUNT(CASE WHEN status = 'PENDING_REVIEW' THEN 1 END) as pending_assignments,
        COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as accepted_assignments
      FROM org_trainer_assignments
      WHERE organization_id = $1
    `;
    const assignRes = await pool.query(assignmentQuery, [organizationId]);

    return {
      needs: needsRes.rows[0],
      assignments: assignRes.rows[0]
    };
  }

  /**
   * 5. Learning & Assessment Analytics (Step 3 & 4 data)
   */
  static async getLearningAnalytics(organizationId) {
    const enrollQuery = `
      SELECT 
        COUNT(*) as total_enrollments,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_enrollments,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_enrollments
      FROM org_course_enrollments
      WHERE organization_id = $1
    `;
    const enrollRes = await pool.query(enrollQuery, [organizationId]);

    const assessQuery = `
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_attempts,
        COUNT(CASE WHEN passed = true THEN 1 END) as passed_attempts
      FROM org_assessment_attempts
      WHERE organization_id = $1
    `;
    const assessRes = await pool.query(assessQuery, [organizationId]);

    return {
      enrollments: enrollRes.rows[0],
      assessments: assessRes.rows[0]
    };
  }

  /**
   * Aggregate all metrics for the dashboard
   */
  static async getOverview(organizationId) {
    const workforce = await this.getWorkforceMetrics(organizationId);
    const competency = await this.getCompetencyCoverage(organizationId);
    const skillGaps = await this.getSkillGapAnalytics(organizationId);
    const training = await this.getTrainingIntelligence(organizationId);
    const learning = await this.getLearningAnalytics(organizationId);

    // Capacity Index logic: Based on evidence coverage and passed assessments (transparent calculation)
    let capacityIndex = 'NOT_AVAILABLE';
    let dataConfidence = 'LOW';
    if (competency.evidence_coverage_percent > 0) {
      // 50% weighted on evidence coverage, 50% weighted on absence of critical gaps
      const gapPenalty = Math.min((parseInt(skillGaps.critical_gaps) * 5), 50); 
      const calculatedIndex = (parseFloat(competency.evidence_coverage_percent) * 0.5) + (50 - gapPenalty);
      capacityIndex = Math.max(calculatedIndex, 0).toFixed(2);
      dataConfidence = competency.evidence_coverage_percent > 50 ? 'HIGH' : 'MEDIUM';
    }

    return {
      generated_at: new Date(),
      capacity_index: capacityIndex,
      data_confidence: dataConfidence,
      workforce,
      competency,
      skill_gaps: skillGaps,
      training,
      learning
    };
  }
}

module.exports = OrgAnalyticsService;
