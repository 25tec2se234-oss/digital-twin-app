const fs = require('fs');
const path = require('path');

// Load career knowledge base
let careerData = [];
try {
  const dataPath = path.join(__dirname, '../data/careerKnowledge.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  careerData = JSON.parse(rawData);
} catch (error) {
  console.error("Failed to load career knowledge base:", error);
}

/**
 * Normalizes text for matching (lowercase, alphanumeric only, trimmed)
 */
function normalize(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
}

/**
 * Checks if any keyword in array A exists in array B
 */
function calculateOverlap(userItems, careerItems) {
  if (!userItems || !careerItems || !userItems.length || !careerItems.length) return 0;
  
  let matches = 0;
  const normalizedCareerItems = careerItems.map(normalize);
  
  for (const item of userItems) {
    const normItem = normalize(item);
    if (!normItem) continue;
    // Check if normItem is found in any career item, or vice versa
    for (const cItem of normalizedCareerItems) {
      if (cItem.includes(normItem) || normItem.includes(cItem)) {
        matches++;
        break;
      }
    }
  }
  
  return matches;
}

/**
 * Identifies specific missing skills
 */
function identifyGaps(userSkills, requiredSkills) {
  if (!requiredSkills) return [];
  if (!userSkills || userSkills.length === 0) return requiredSkills;
  
  const gaps = [];
  const normalizedUserSkills = userSkills.map(normalize);
  
  for (const reqSkill of requiredSkills) {
    const normReq = normalize(reqSkill);
    let found = false;
    for (const uSkill of normalizedUserSkills) {
      if (normReq.includes(uSkill) || uSkill.includes(normReq)) {
        found = true;
        break;
      }
    }
    if (!found) {
      gaps.push(reqSkill);
    }
  }
  
  return gaps;
}

const aiService = require('./aiService');

/**
 * Analyzes the user's profile against the career database
 * @param {Object} profile 
 * @returns {Object} Structured analysis result
 */
async function analyzeProfile(profile) {
  const { name = 'Unknown', age = 'Unknown', educationLevel = 'Unknown', academicInterest = 'Unknown', goal = '', skills = [], interests = [], experience = [], achievements = [], preferredDomains = [], constraints = [] } = profile;
  
  // Calculate data quality
  let dataPoints = 0;
  if (goal) dataPoints++;
  if (skills.length > 0) dataPoints++;
  if (interests.length > 0) dataPoints++;
  if (educationLevel !== 'Unknown') dataPoints++;
  if (experience.length > 0) dataPoints++;
  
  let dataQuality = 'Limited';
  if (dataPoints >= 4) dataQuality = 'High';
  else if (dataPoints >= 2) dataQuality = 'Medium';

  const systemPrompt = `You are an elite AI Career Counselor and Product Architect. Your task is to analyze the user's profile and provide a comprehensive, explainable career assessment.
CRITICAL RULES:
1. USE ONLY the provided profile. Do NOT invent facts, fake colleges, salaries, or certifications. If data is unavailable, return "Data currently unavailable".
2. SKILLS ≠ INTERESTS ≠ GOALS ≠ CAREER. Do not blindly recommend a career because of one matching keyword.
3. If the user's goal contradicts their skills/interests, EXPLAIN the conflict. Do not override their stated ambition. Provide the pathway to their goal, but also suggest paths aligned with current strengths.
4. Work for BOTH academic (e.g., Doctor, Engineer) and non-academic/skill-based (e.g., Photographer, Esports, Makeup Artist) careers. Adapt to the user's focus.
5. Provide explainable match scores (0-100) based on Goal, Skill, Interest, Education, and Experience alignment.
6. The output MUST be a valid JSON object matching the requested schema exactly. No markdown formatting outside of JSON values. No markdown wrapping.
7. Deduplicate careers and skills.
8. Keep career pathways realistic. Generate a personalized 90-day action plan based on actual skill gaps.
9. For institutions, recommend 2-3 specific real-world Academies, Training Centres, Bootcamps, or Colleges appropriate to the goal. Do NOT hallucinate placement rates or salaries.

JSON SCHEMA:
{
  "profileSummary": { "name": "string", "goal": "string", "keyStrengths": ["string"], "missingElements": ["string"] },
  "primaryCareer": {
    "name": "string",
    "domain": "string",
    "description": "string",
    "matchPercentage": 85,
    "whyItMatches": ["string"],
    "relevantExistingSkills": ["string"],
    "relevantInterests": ["string"],
    "missingSkills": ["string"],
    "importantRequirements": ["string"],
    "confidenceLevel": "High | Medium | Low",
    "salaryBand": "string (or 'Data currently unavailable')"
  },
  "alternativeCareers": [
    {
      "type": "Primary Path | Adjacent Path | Emerging Path",
      "name": "string",
      "reasonForRecommendation": "string",
      "matchPercentage": 75
    }
  ],
  "skillAnalysis": { "coreStrengths": ["string"], "criticalGaps": ["string"] },
  "goalAnalysis": {
    "statedGoal": "string",
    "isConflict": true,
    "currentStrengths": ["string"],
    "goalRequirements": ["string"],
    "educationGaps": ["string"],
    "experienceGaps": ["string"],
    "recommendedNextSteps": ["string"],
    "explanation": "string (Explain relationship/conflict between goal and current profile)"
  },
  "careerCompatibility": [
    { "careerName": "string", "goalFit": "High | Medium | Low", "skillFit": "High | Medium | Low", "interestFit": "High | Medium | Low", "educationFit": "High | Medium | Low", "overallCompatibility": "High | Medium | Low" }
  ],
  "actionPlan90Days": {
    "days1to30": { "focus": "string", "tasks": ["string"] },
    "days31to60": { "focus": "string", "tasks": ["string"] },
    "days61to90": { "focus": "string", "tasks": ["string"] }
  },
  "institutions": [
    {
      "name": "string (e.g. 'National Cricket Academy' or 'IIT Bombay')",
      "type": "Academy | College | Training Centre | Boot Camp",
      "location": "string",
      "whyRecommended": "string",
      "admissionRoute": "string"
    }
  ],
  "dataQuality": { "quality": "High | Medium | Limited", "reason": "string" },
  "confidence": { "level": "High | Medium | Limited", "reason": "string" }
}`;

  const userPrompt = `User Profile:
Name: ${name}
Age: ${age}
Education Level: ${educationLevel}
Academic Interest: ${academicInterest}
Goal: ${goal}
Skills: ${skills.join(', ')}
Interests: ${interests.join(', ')}
Experience: ${experience.join(', ')}
Achievements: ${achievements.join(', ')}
Preferred Domains: ${preferredDomains.join(', ')}
Constraints: ${constraints.join(', ')}

Provide your response strictly as the required JSON object.`;

  let aiStructuredOutput = null;

  try {
    const aiResponse = await aiService.sendMessages({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 3500
    });
    
    if (aiResponse && aiResponse.status === 200) {
      let content = aiResponse.data.content[0].text;
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();

      
      // Attempt to parse
      try {
        aiStructuredOutput = JSON.parse(content);
      } catch (parseErr) {
        console.error("Failed to parse AI JSON response:", parseErr);
        console.error("Raw content:", content);
        // Fallback to static if JSON parse fails
      }
    } else {
      console.error("AI service returned non-200 status:", aiResponse);
    }
  } catch (e) {
    console.error("AI Generation failed:", e);
  }
  
  if (aiStructuredOutput && typeof aiStructuredOutput === 'object') {
    // Add success flag and return
    aiStructuredOutput.success = true;
    aiStructuredOutput.timestamp = new Date().toISOString();
    return aiStructuredOutput;
  }
  
  // ==========================================
  // FALLBACK STATIC LOGIC (If AI fails)
  // ==========================================
  
  // Very simplified static fallback matching the new schema
  const fallbackResult = {
    success: true,
    profileSummary: {
      name,
      goal: goal || "Not specified",
      keyStrengths: skills,
      missingElements: ["More data needed for AI analysis"]
    },
    primaryCareer: {
      name: goal || (interests[0] ? interests[0] + " Professional" : "General Professional"),
      domain: "Various",
      description: "Based on your provided input.",
      matchPercentage: 50,
      whyItMatches: ["Static fallback matching based on your input."],
      relevantExistingSkills: skills,
      relevantInterests: interests,
      missingSkills: ["AI analysis unavailable"],
      importantRequirements: ["AI analysis unavailable"],
      confidenceLevel: "Low",
      salaryBand: "Data currently unavailable"
    },
    alternativeCareers: [
      {
        name: `Senior ${goal || (interests[0] ? interests[0] : 'Professional')}`,
        domain: "Advanced",
        matchPercentage: 75,
        whyAlternative: "A natural progression of your current skills.",
        requiredPivots: ["Advanced training"]
      }
    ],
    skillAnalysis: { 
      coreStrengths: skills.length > 0 ? skills : ["Dedication"], 
      criticalGaps: ["Advanced Strategy", "Specialized Technique"] 
    },
    goalAnalysis: {
      statedGoal: goal || "Not specified",
      isConflict: false,
      currentStrengths: skills.length > 0 ? skills : ["Willingness to learn"],
      goalRequirements: ["Professional coaching", "Consistent practice schedule"],
      educationGaps: ["Formal certification in chosen field"],
      experienceGaps: ["Competitive exposure", "Real-world application"],
      recommendedNextSteps: ["Find a mentor", "Join a local club/academy", "Set daily practice goals"],
      explanation: "This is a premium fallback analysis. Note: Live AI integration requires an active API key with credits."
    },
    careerCompatibility: [],
    actionPlan90Days: {
      days1to30: { focus: "Foundation & Assessment", tasks: ["Evaluate current baseline", "Find a qualified mentor", "Establish daily routines"] },
      days31to60: { focus: "Skill Development", tasks: ["Focus on critical gaps identified", "Increase training intensity", "Participate in local events"] },
      days61to90: { focus: "Real-world Application", tasks: ["Compete in amateur tournaments", "Network with professionals", "Review and refine technique"] }
    },
    institutions: [
      {
        name: "National Sports Academy",
        type: "Training Centre",
        location: "Mumbai, India",
        whyRecommended: "Top-tier coaching facilities for aspiring athletes.",
        admissionRoute: "Performance Trials"
      },
      {
        name: "Global Athletics Institute",
        type: "University",
        location: "Online/Hybrid",
        whyRecommended: "Offers sports science and psychology degrees to complement physical training.",
        admissionRoute: "Merit Based"
      }
    ],
    dataQuality: { quality: dataQuality, reason: "Rich Fallback logic used." },
    confidence: { level: "Medium", reason: "Rich Fallback static logic used." },
    timestamp: new Date().toISOString()
  };

  return fallbackResult;
}

module.exports = {
  analyzeProfile
};
