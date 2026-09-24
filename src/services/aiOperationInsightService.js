const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const { pool } = require('../db');

class AIOperationInsightService {
  /**
   * Generates AI insights based on the provided aggregate overview data.
   * Caches results into the org_capacity_insights table.
   */
  static async generateInsights(organizationId, overviewData) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // We strictly limit the AI to factual summarization of the given JSON data.
    const systemPrompt = `
      You are an Enterprise Analytics AI for the Digital Twin Verse platform.
      Your task is to analyze the provided JSON metrics of an organization and output EXACTLY ONE insight as a JSON object.
      
      RULES:
      1. DO NOT invent or fabricate statistics, gaps, or trends.
      2. Base your insight entirely on the provided Data JSON.
      3. Do NOT mention individual employee names.
      4. Your output MUST be a valid JSON object with the following keys:
         - insight_type: one of ["OBSERVATION", "TREND", "GAP", "TRAINING_DEMAND", "CAPACITY_CONSTRAINT", "DATA_QUALITY"]
         - title: A short, professional title (under 50 chars)
         - description: A clear 2-3 sentence explanation based strictly on the metrics.
         - confidence: one of ["LOW", "MEDIUM", "HIGH"] based on how strong the evidence is.
    `;

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Data:\n${JSON.stringify(overviewData, null, 2)}` }
      ]);

      const aiText = result.response.text();
      // Simple parse to extract JSON from markdown if needed
      const jsonStrMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonStrMatch) {
          throw new Error("Failed to parse JSON from AI response");
      }
      const insight = JSON.parse(jsonStrMatch[0]);

      // Save insight to DB
      const insertQuery = `
        INSERT INTO org_capacity_insights 
          (organization_id, insight_type, title, description, source_metrics_json, confidence)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const res = await pool.query(insertQuery, [
        organizationId,
        insight.insight_type,
        insight.title,
        insight.description,
        JSON.stringify(overviewData),
        insight.confidence
      ]);

      return res.rows[0];

    } catch (error) {
      console.error('Error generating AI operation insight:', error);
      return null;
    }
  }

  static async getCachedInsights(organizationId, limit = 5) {
      const query = `
        SELECT * FROM org_capacity_insights
        WHERE organization_id = $1
        ORDER BY generated_at DESC
        LIMIT $2
      `;
      const res = await pool.query(query, [organizationId, limit]);
      return res.rows;
  }
}

module.exports = AIOperationInsightService;
