const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIExplanationService {
  /**
   * Generates a safe, read-only explanation of a skill gap.
   * AI receives ONLY verified, structured data and returns text.
   */
  static async explainSkillGap(traineeName, roleName, gapType, currentLevel, requiredLevel, currentScore, requiredScore, priority) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Construct the structured prompt (prevent prompt injection by strictly separating data)
    const systemPrompt = `
      You are an AI learning advisor for the Digital Twin Verse platform.
      Your task is to provide a brief, professional, and encouraging explanation of a skill gap.
      
      RULES:
      1. You MUST NOT invent scores, levels, or reasons.
      2. You MUST rely purely on the structured data provided below.
      3. Do NOT provide personal advice outside of the context.
      4. Keep the explanation under 3 sentences.
    `;
    
    const structuredData = `
      Trainee: ${traineeName}
      Target Role: ${roleName}
      Gap Type: ${gapType}
      Current Level: ${currentLevel || 'Not assessed'}
      Required Level: ${requiredLevel || 'Not specified'}
      Current Score: ${currentScore || 'N/A'}
      Required Score: ${requiredScore || 'N/A'}
      Priority: ${priority}
    `;

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Data:\n${structuredData}` }
      ]);
      return result.response.text();
    } catch (error) {
      console.error('Error generating AI explanation:', error);
      // Fallback determinism
      return `Your current evidence indicates a gap compared to the requirements for the ${roleName} role.`;
    }
  }

  /**
   * Generates a safe, read-only explanation of a trainer match result.
   */
  static async explainTrainerMatch(trainerName, needTitle, matchData) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `
      You are an AI learning administrator for the Digital Twin Verse platform.
      Your task is to provide a professional, neutral, and clear summary of why a trainer was matched to a training requirement.
      
      RULES:
      1. You MUST NOT invent qualifications, certifications, scores, or experience.
      2. You MUST rely purely on the structured data provided below.
      3. Keep the explanation under 4 sentences.
      4. Explicitly state if evidence is missing or insufficient based on the data.
    `;
    
    const structuredData = `
      Trainer: ${trainerName}
      Requirement: ${needTitle}
      Overall Match Score: ${matchData.scores.overall_match_score}%
      Competency Score: ${matchData.scores.competency_score * 100}%
      Experience Score: ${matchData.scores.experience_score}%
      Mandatory Requirements Met: ${matchData.scores.mandatory_requirements_met ? 'Yes' : 'No'}
      Confidence: ${matchData.scores.confidence}
      Match Status: ${matchData.scores.match_status}
      Detailed Breakdown: ${JSON.stringify(matchData.explanation)}
    `;

    try {
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `Data:\n${structuredData}` }
      ]);
      return result.response.text();
    } catch (error) {
      console.error('Error generating AI trainer explanation:', error);
      return `This trainer achieved an overall match score of ${matchData.scores.overall_match_score}% based on available competency evidence.`;
    }
  }
}

module.exports = AIExplanationService;
