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
  const { interests = [], skills = [], academicInterest = '', achievements = [] } = profile;
  
  // Try to use AI to generate tailored JSON
  const systemPrompt = `You are an elite AI Career Counselor. Based on the user's interests, skills, and academic focus, provide exactly 3 highly personalized career recommendations.
Return the output ONLY as a valid JSON array of objects. Do not include markdown formatting or backticks.
Schema for each object:
{
  "id": "slug_format",
  "name": "Career Title",
  "domain": "Industry Domain",
  "description": "Short description",
  "salaryBand": "e.g., ₹8L - ₹25L per annum",
  "marketGrowth": "e.g., 20% YoY",
  "certifications": ["Cert 1", "Cert 2"],
  "techStack": ["Tool 1", "Tool 2"],
  "category": "Strong Current Alignment",
  "currentAlignment": "Strong alignment",
  "isConflict": false,
  "stats": { "interestMatches": 5, "coreSkillMatches": 3, "skillAlignmentRatio": 0.8, "interestAlignmentRatio": 0.9 },
  "skillsAlreadyHave": ["Skill 1", "Skill 2"],
  "skillsToDevelop": ["Skill 3", "Skill 4"],
  "optionalSkillsToDevelop": ["Skill 5"],
  "educationPathway": ["Degree 1", "Degree 2"],
  "reasons": ["Reason 1", "Reason 2"],
  "roadmap": ["Step 1", "Step 2", "Step 3", "Step 4"]
}`;

  const userPrompt = `User Profile:\nInterests: ${interests.join(', ')}\nSkills: ${skills.join(', ')}\nAcademic Interest: ${academicInterest}\nAchievements: ${achievements.join(', ')}`;

  try {
    const aiResponse = await aiService.sendMessages({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 2500
    });
    
    if (aiResponse && aiResponse.status === 200) {
      let content = aiResponse.data.content[0].text;
      // Clean markdown if present
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const generatedCareers = JSON.parse(content);
      
      return {
        success: true,
        profileSummary: { interests, skills, academicInterest },
        topRecommendations: generatedCareers,
        categories: {
          'Strong Current Alignment': generatedCareers,
          'Interest-Aligned Opportunities': [],
          'Emerging Opportunities': [],
          'Career Transition Options': []
        },
        scenarios: [],
        timestamp: new Date().toISOString()
      };
    }
  } catch (e) {
    console.error("AI Generation failed, falling back to static logic", e);
  }
  
  // Fallback to static logic if AI fails
  const results = careerData.map(career => {
    // 1. Calculate Scores
    const interestMatches = calculateOverlap(interests, career.interests);
    const coreSkillMatches = calculateOverlap(skills, career.coreSkills);
    const optionalSkillMatches = calculateOverlap(skills, career.optionalSkills);
    
    // Weighted scoring logic
    const maxCoreSkills = career.coreSkills.length || 1;
    const maxInterests = career.interests.length || 1;
    
    const skillAlignmentRatio = coreSkillMatches / maxCoreSkills;
    const interestAlignmentRatio = interestMatches / maxInterests;
    
    // 2. Identify Gaps
    const missingCoreSkills = identifyGaps(skills, career.coreSkills);
    const missingOptionalSkills = identifyGaps(skills, career.optionalSkills);
    const existingSkills = career.coreSkills.filter(s => !missingCoreSkills.includes(s));
    
    // 3. Categorize Alignment
    let currentAlignment = 'Low current alignment';
    if (skillAlignmentRatio > 0.7) {
      currentAlignment = 'Strong alignment';
    } else if (skillAlignmentRatio > 0.4) {
      currentAlignment = 'Moderate alignment';
    } else if (skillAlignmentRatio > 0.15) {
      currentAlignment = 'Developing alignment';
    }

    // Determine category based on logic
    let category = 'Emerging Opportunities';
    if (skillAlignmentRatio > 0.6) {
      category = 'Strong Current Alignment';
    } else if (interestAlignmentRatio > 0.5) {
      category = 'Interest-Aligned Opportunities';
    } else if (skillAlignmentRatio < 0.2 && interestAlignmentRatio > 0) {
      category = 'Career Transition Options';
    }
    
    // 4. Determine if there is a conflict (High Interest, Low Skill)
    const isConflict = interestAlignmentRatio >= 0.5 && skillAlignmentRatio <= 0.3;
    
    // Generate explainability statement
    const reasons = [];
    if (interestMatches > 0) reasons.push(`Matches your stated interests.`);
    if (coreSkillMatches > 0) reasons.push(`You already possess ${coreSkillMatches} core skills for this role.`);
    
    return {
      id: career.id,
      name: career.name,
      domain: career.domain,
      description: career.description,
      salaryBand: career.salaryBand,
      marketGrowth: career.marketGrowth,
      certifications: career.certifications,
      techStack: career.techStack,
      category,
      currentAlignment,
      isConflict,
      stats: {
        interestMatches,
        coreSkillMatches,
        skillAlignmentRatio,
        interestAlignmentRatio
      },
      skillsAlreadyHave: existingSkills,
      skillsToDevelop: missingCoreSkills,
      optionalSkillsToDevelop: missingOptionalSkills,
      educationPathway: career.requiredEducation,
      reasons,
      roadmap: [
        "Master the foundational concepts for missing core skills",
        "Build a practical project to demonstrate capability",
        "Consider relevant certifications or formal education pathways",
        "Apply for entry-level roles or internships"
      ]
    };
  });
  
  // Sort by combination of interest and skill
  results.sort((a, b) => {
    const scoreA = (a.stats.skillAlignmentRatio * 0.6) + (a.stats.interestAlignmentRatio * 0.4);
    const scoreB = (b.stats.skillAlignmentRatio * 0.6) + (b.stats.interestAlignmentRatio * 0.4);
    return scoreB - scoreA;
  });

  // Group into categories
  const categories = {
    'Strong Current Alignment': results.filter(r => r.category === 'Strong Current Alignment'),
    'Interest-Aligned Opportunities': results.filter(r => r.category === 'Interest-Aligned Opportunities'),
    'Emerging Opportunities': results.filter(r => r.category === 'Emerging Opportunities'),
    'Career Transition Options': results.filter(r => r.category === 'Career Transition Options')
  };

  // IF-BUT Scenarios
  const scenarios = [];
  
  // Scenario 1: Strong skills but different primary interest
  const strongestSkillCareer = [...results].sort((a,b) => b.stats.skillAlignmentRatio - a.stats.skillAlignmentRatio)[0];
  const strongestInterestCareer = [...results].sort((a,b) => b.stats.interestAlignmentRatio - a.stats.interestAlignmentRatio)[0];
  
  if (strongestSkillCareer && strongestInterestCareer && strongestSkillCareer.id !== strongestInterestCareer.id) {
    if (strongestSkillCareer.stats.skillAlignmentRatio >= 0.5 && strongestInterestCareer.stats.interestAlignmentRatio >= 0.5) {
      scenarios.push({
        type: 'interest_skill_conflict',
        title: 'Interest vs Current Skills',
        condition: `IF you choose ${strongestSkillCareer.name}`,
        but: `BUT your primary interest is ${strongestInterestCareer.name}`,
        then: `Your current skills strongly align with ${strongestSkillCareer.name}, which makes it an easier immediate path. However, to transition to ${strongestInterestCareer.name}, you need to focus heavily on acquiring: ${strongestInterestCareer.skillsToDevelop.slice(0, 3).join(', ')}.`
      });
    }
  }

  // Scenario 2: High interest, low skills
  if (strongestInterestCareer && strongestInterestCareer.stats.skillAlignmentRatio <= 0.2 && strongestInterestCareer.stats.interestAlignmentRatio >= 0.5) {
    scenarios.push({
      type: 'high_interest_low_skill',
      title: 'Passion vs Preparation',
      condition: `IF your goal is ${strongestInterestCareer.name}`,
      but: `BUT your current skills are limited for this role`,
      then: `You will need a dedicated transition roadmap. However, with a market growth of ${strongestInterestCareer.marketGrowth}, the ROI is significant. Focus on foundational education first (${strongestInterestCareer.educationPathway[0] || 'Relevant certifications'}) before applying for entry-level roles.`
    });
  }

  // Scenario 3: Multiple matching paths
  if (categories['Strong Current Alignment'].length > 1) {
    const c1 = categories['Strong Current Alignment'][0];
    const c2 = categories['Strong Current Alignment'][1];
    scenarios.push({
      type: 'multiple_paths',
      title: 'Multiple Strong Matches',
      condition: `IF you are deciding between ${c1.name} and ${c2.name}`,
      but: `BUT both are strong matches for your current skills`,
      then: `Choose ${c1.name} if you prefer ${c1.domain} and want to focus on ${c1.skillsAlreadyHave[0] || 'current strengths'}. Choose ${c2.name} if you want to leverage your skills in ${c2.domain}.`
    });
  }

  return {
    success: true,
    profileSummary: {
      interests,
      skills,
      academicInterest
    },
    topRecommendations: results.slice(0, 5),
    categories,
    scenarios,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  analyzeProfile
};
