const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const { pool } = require('../db');

class AICompetencyGapEngine {
  /**
   * Generates a fully explainable, deterministic AI competency gap report for a specific member.
   * STRICT RULE: No fabrication. Relies purely on deterministic database metrics.
   * AI only generates the explanation (Reason) and formats the output.
   */
  static async generateIndividualGapReport(organizationId, traineeId) {
    if (!genAI) {
      throw new Error('AI Competency Gap Engine is not configured (Missing API Key).');
    }

    // 1. Fetch deterministic gaps
    const gapQuery = `
      SELECT g.*, 
        c.name as competency_name, 
        r.name as role_name
      FROM org_skill_gaps g
      JOIN org_competencies c ON g.competency_id = c.id
      LEFT JOIN org_roles r ON g.target_type = 'ROLE' AND g.target_id = r.id
      WHERE g.organization_id = $1 AND g.trainee_id = $2 AND g.is_current = true
    `;
    const gapsRes = await pool.query(gapQuery, [organizationId, traineeId]);
    const gaps = gapsRes.rows;

    if (!gaps.length) {
      return "No competency gaps identified for this member.";
    }

    // 2. Fetch specific evidence for these gaps
    const evidenceQuery = `
      SELECT competency_id, evidence_type, source_id, evidence_value, verification_status, confidence
      FROM org_competency_evidence
      WHERE organization_id = $1 AND trainee_id = $2
    `;
    const evidenceRes = await pool.query(evidenceQuery, [organizationId, traineeId]);
    const evidences = evidenceRes.rows;

    // 3. Fetch training needs & recommendations
    const needsQuery = `
      SELECT n.competency_id, c.title as recommended_course
      FROM org_training_needs n
      LEFT JOIN org_training_recommendations r ON n.id = r.training_need_id
      LEFT JOIN org_courses c ON r.course_id = c.id
      WHERE n.organization_id = $1 AND n.trainee_id = $2 AND n.status NOT IN ('RESOLVED', 'DISMISSED')
    `;
    const needsRes = await pool.query(needsQuery, [organizationId, traineeId]);
    const needs = needsRes.rows;

    // 4. Construct the structured deterministic context for the LLM
    const promptData = gaps.map(gap => {
      const compEvidences = evidences.filter(e => e.competency_id === gap.competency_id);
      const compNeed = needs.find(n => n.competency_id === gap.competency_id);
      
      const isMissing = gap.current_score === null || gap.gap_type === 'EVIDENCE_GAP';

      return {
        competency: gap.competency_name,
        role: gap.role_name,
        required: gap.required_score ? `${gap.required_score}/5` : "Not defined",
        current: isMissing ? "Insufficient evidence" : `${gap.current_score}/5`,
        gap: isMissing ? "Missing evidence" : (gap.score_gap ? `${gap.score_gap} levels` : "0 levels"),
        priority: gap.priority || 'Medium',
        confidence: gap.confidence || 'LOW',
        evidence_list: compEvidences.length ? compEvidences.map(e => `${e.evidence_type} (${e.verification_status})`).join(" + ") : (isMissing ? "Insufficient evidence" : "None"),
        recommended_training: compNeed && compNeed.recommended_course ? compNeed.recommended_course : "No matching training available"
      };
    });

    const systemPrompt = `
      You are the DTV Competency Intelligence Engine.
      Your task is to generate a deterministic, explainable AI Competency Gap Report based purely on the provided JSON data.

      CRITICAL AI RULES:
      - NO FABRICATION.
      - Do not invent skills, certificates, assessments, training completions, evidence, or organization statistics.
      - If data is missing or current score is null, you MUST output: "Insufficient evidence".
      - Your output format must EXACTLY match the requested format below.
      - You are only responsible for generating a clear, logical "Reason" based on the data. Do NOT calculate the scores yourself.

      OUTPUT FORMAT EXPECTED PER COMPETENCY:
      Competency: [Competency Name]
      Required: [Required Level]
      Current: [Current Level]
      Gap: [Gap amount]
      Evidence: [List of evidence types, or "Insufficient evidence"]
      Confidence: [Confidence Level]
      Priority: [Priority Level]
      Recommended Training: [Recommended Course Name]
      Reason: [1-2 sentences explaining why this gap exists based on the evidence and scores]
      ---
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Deterministic Input Data:\n${JSON.stringify(promptData, null, 2)}` }
      ]);
      
      // Audit log the AI request securely
      return result.response.text();
    } catch (error) {
      console.error('AI Engine Error:', error);
      // Graceful degradation
      return promptData.map(d => `Competency: ${d.competency}\nRequired: ${d.required}\nCurrent: ${d.current}\nGap: ${d.gap}\nEvidence: ${d.evidence_list}\nConfidence: ${d.confidence}\nPriority: ${d.priority}\nRecommended Training: ${d.recommended_training}\nReason: Deterministic system fallback due to AI unavailability.\n---`).join('\n\n');
    }
  }

  /**
   * Generates Department Gap Report
   */
  static async generateDepartmentGapReport(organizationId, departmentId) {
    if (!genAI) throw new Error('AI Competency Gap Engine is not configured.');
    return "Department gap report generation logic initialized. (Pending specific department metrics)";
  }

  /**
   * Generates Organization Gap Report
   */
  static async generateOrganizationGapReport(organizationId) {
    if (!genAI) throw new Error('AI Competency Gap Engine is not configured.');
    return "Organization gap report generation logic initialized. (Pending organization metrics)";
  }
}

module.exports = AICompetencyGapEngine;
