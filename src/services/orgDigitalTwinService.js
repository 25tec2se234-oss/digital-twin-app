const { pool } = require('../db');
const OrgAnalyticsService = require('./orgAnalyticsService');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

class OrgDigitalTwinService {
  
  static async generateSnapshot(organizationId) {
    // 1. Mark previous snapshots as stale
    await this.markStale(organizationId);

    // 2. Gather component states
    const workforceState = await OrgAnalyticsService.getWorkforceMetrics(organizationId);
    const competencyState = await OrgAnalyticsService.getCompetencyCoverage(organizationId);
    const gapState = await OrgAnalyticsService.getSkillGapAnalytics(organizationId);
    const trainingState = await OrgAnalyticsService.getTrainingIntelligence(organizationId);
    const learningState = await OrgAnalyticsService.getLearningAnalytics(organizationId);
    
    const fullCompetencyState = { ...competencyState, gaps: gapState };

    // 3. Calculate Coverage & Confidence
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

    // 4. Calculate Trends from historical data
    const historyQuery = `
        SELECT data_coverage, evidence_coverage, competency_coverage, created_at
        FROM org_digital_twin_snapshots
        WHERE organization_id = $1
        ORDER BY created_at DESC LIMIT 5
    `;
    const historyRes = await pool.query(historyQuery, [organizationId]);
    const historicalData = historyRes.rows;
    let trends = {};
    if (historicalData.length > 1) {
        const prev = historicalData[0]; // because we haven't inserted the new one yet, index 0 is the previous
        trends = {
            competencyTrend: competencyCoverage - parseFloat(prev.competency_coverage || 0),
            evidenceTrend: evidenceCoverage - parseFloat(prev.evidence_coverage || 0)
        };
    }

    // 5. Generate AI Explanation
    let aiExplanations = {};
    if (genAI && (evidenceCoverage > 0 || competencyCoverage > 0 || workforceState.totalMembers > 0)) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `
You are an Enterprise AI analyzing an organizational Digital Twin snapshot.
Based ONLY on the provided deterministic data, generate brief analytical insights.
Do NOT invent any data, percentages, or skills. If data is zero or missing, say "Insufficient data".

DATA:
- Workforce: ${JSON.stringify(workforceState)}
- Competency Coverage: ${competencyCoverage.toFixed(1)}%
- Evidence Coverage: ${evidenceCoverage.toFixed(1)}%
- Training Activity: ${JSON.stringify(trainingState)}
- Confidence: ${confidence}

Provide a JSON object with:
{
  "executiveSummary": "1 sentence overview",
  "departmentInsights": "1 sentence on department strengths/weaknesses if applicable",
  "trainingAction": "1 sentence recommendation based on training state",
  "dataWarning": "Any warning about confidence or missing evidence"
}`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            
            // Extract JSON
            const jsonMatch = text.match(/\\{.*\\}/s);
            if (jsonMatch) {
                aiExplanations = JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error("AI Explanation generation failed:", error);
            aiExplanations = { error: "Failed to generate AI insights." };
        }
    } else if (!genAI) {
        aiExplanations = { error: "AI not configured." };
    } else {
        aiExplanations = { message: "Insufficient data to generate meaningful AI insights." };
    }
    
    // Add trends to AI Explanations payload for UI
    aiExplanations.trends = trends;

    // 6. Persist the snapshot
    const insertQuery = `
      INSERT INTO org_digital_twin_snapshots 
        (organization_id, data_coverage, evidence_coverage, competency_coverage, learning_coverage, confidence, 
         workforce_state, competency_state, training_state, learning_state, snapshot_version, is_stale, ai_explanations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const res = await pool.query(insertQuery, [
        organizationId,
        workforceState.totalMembers > 0 ? 100 : 0, // system data coverage
        evidenceCoverage,
        competencyCoverage,
        parseFloat(learningState.activeEnrollments) > 0 ? 100 : 0,
        confidence,
        JSON.stringify(workforceState),
        JSON.stringify(fullCompetencyState),
        JSON.stringify(trainingState),
        JSON.stringify(learningState),
        '2.0',
        false,
        JSON.stringify(aiExplanations)
    ]);

    return res.rows[0];
  }

  static async getLatestSnapshot(organizationId) {
    const query = `
      SELECT * FROM org_digital_twin_snapshots 
      WHERE organization_id = $1 AND is_stale = false
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const res = await pool.query(query, [organizationId]);
    return res.rows[0] || null;
  }

  static async getHistoricalSnapshots(organizationId, limit = 10) {
    const query = `
      SELECT created_at, snapshot_version, data_coverage, evidence_coverage, competency_coverage, confidence, ai_explanations
      FROM org_digital_twin_snapshots
      WHERE organization_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const res = await pool.query(query, [organizationId, limit]);
    return res.rows;
  }

  static async markStale(organizationId) {
    const query = `
      UPDATE org_digital_twin_snapshots
      SET is_stale = true
      WHERE organization_id = $1 AND is_stale = false
    `;
    await pool.query(query, [organizationId]);
  }
}

module.exports = OrgDigitalTwinService;
