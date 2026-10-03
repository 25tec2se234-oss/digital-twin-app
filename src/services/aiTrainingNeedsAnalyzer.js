const { pool } = require('../db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

class AITrainingNeedsAnalyzer {
  static async analyze(organizationId, filters = {}) {
    // 1. Fetch training needs deterministically
    let query = `
      SELECT 
        n.competency_id, c.name as competency_name,
        n.skill_id, s.name as skill_name,
        n.priority,
        n.status,
        COUNT(DISTINCT n.trainee_id)::integer as affected_members,
        array_agg(DISTINCT d.name) as affected_departments,
        array_agg(DISTINCT r.name) as affected_roles,
        array_agg(DISTINCT cr.title) as existing_trainings,
        MAX(n.updated_at) as last_calculated
      FROM org_training_needs n
      LEFT JOIN org_competencies c ON n.competency_id = c.id
      LEFT JOIN org_skills s ON n.skill_id = s.id
      LEFT JOIN org_trainees t ON n.trainee_id = t.user_id AND t.organization_id = n.organization_id
      LEFT JOIN org_departments d ON t.department_id = d.id
      LEFT JOIN org_roles r ON t.role_id = r.id
      LEFT JOIN org_training_recommendations rec ON n.id = rec.training_need_id
      LEFT JOIN org_courses cr ON rec.course_id = cr.id
      WHERE n.organization_id = $1 AND n.status NOT IN ('RESOLVED', 'DISMISSED')
    `;
    const queryParams = [organizationId];

    if (filters.departmentId) {
      queryParams.push(filters.departmentId);
      query += ` AND t.department_id = $${queryParams.length}`;
    }
    if (filters.roleId) {
      queryParams.push(filters.roleId);
      query += ` AND t.role_id = $${queryParams.length}`;
    }
    if (filters.traineeId) {
      queryParams.push(filters.traineeId);
      query += ` AND n.trainee_id = $${queryParams.length}`;
    }

    query += `
      GROUP BY n.competency_id, c.name, n.skill_id, s.name, n.priority, n.status
      ORDER BY 
        CASE n.priority 
          WHEN 'CRITICAL' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'MEDIUM' THEN 3 
          WHEN 'LOW' THEN 4 
          ELSE 5 
        END ASC, affected_members DESC
    `;

    const needsRes = await pool.query(query, queryParams);
    const aggregatedNeeds = needsRes.rows;

    if (aggregatedNeeds.length === 0) {
      return { data: [], message: 'No training needs identified for the given scope.' };
    }

    // 2. Format Data for AI to Explain
    const promptData = aggregatedNeeds.map(need => ({
      training_need: need.competency_name || need.skill_name || 'General Skill Gap',
      affected_members: need.affected_members,
      affected_department: need.affected_departments.filter(Boolean).join(', ') || 'Various/None',
      competency_gap: need.competency_name || need.skill_name || 'General',
      priority: need.priority,
      existing_training_availability: need.existing_trainings.filter(Boolean).length > 0 ? 'Yes' : 'No',
      recommended_training: need.existing_trainings.filter(Boolean).join(', ') || 'No existing training available',
      evidence: `Determined from ${need.affected_members} member profiles with missing or insufficient proficiency levels.`,
      confidence: 'HIGH', // Data is deterministically aggregated from the DB
      last_calculated: need.last_calculated
    }));

    // 3. Request AI Explanation (Reasoning)
    let aiExplanation = [];
    if (genAI) {
      const systemPrompt = `
        You are the DTV AI Training Needs Analyzer.
        Your task is to review the following deterministic organizational training needs and provide a concise 'Reason' for EACH need.
        
        CRITICAL RULES:
        - NO FABRICATION. Do not invent numbers or statistics.
        - If 17 employees need training, refer to that exactly as provided.
        - Do NOT manipulate the priority or gap data.
        - Format your response strictly as a JSON array of objects with exactly two keys: "training_need" and "reason".
        - The reason should be a 1-2 sentence explanation of why this is a priority based on the provided data (e.g. "Critical priority because it affects 5 members in the Engineering department without existing training available.").
      `;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          { text: systemPrompt },
          { text: JSON.stringify(promptData, null, 2) }
        ]);
        
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\[.*\]/s);
        if (jsonMatch) {
          aiExplanation = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error('AI Training Needs Analyzer Error:', error);
      }
    }

    // 4. Merge deterministic data with AI reasoning
    const finalReport = promptData.map(data => {
      const explanation = aiExplanation.find(ai => ai.training_need === data.training_need);
      return {
        ...data,
        reason: explanation ? explanation.reason : `Determined automatically by the system based on ${data.affected_members} affected members and ${data.priority} priority.`
      };
    });

    return {
      success: true,
      data: finalReport
    };
  }
}

module.exports = AITrainingNeedsAnalyzer;
