const asyncHandler = require('../utils/asyncHandler');
const analyzerEngine = require('../services/analyzerEngine');

/**
 * Normalizes an array of strings by lowercasing, trimming, and deduplicating.
 */
function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  const normalized = arr
    .filter(item => typeof item === 'string')
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0);
  return [...new Set(normalized)]; // Deduplicate
}

/**
 * Handle POST request to analyze user career profile
 */
const analyzeProfile = asyncHandler(async (req, res) => {
  const { name, age, goal, educationLevel, academicInterest, interests, skills, experience, achievements, preferredDomains, constraints } = req.body;

  // Input validation - we need at least a goal or some interests to do an analysis
  if ((!interests || !Array.isArray(interests) || interests.length === 0) && (!goal || goal.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: "More information is required. Please provide at least your career goal or one interest."
    });
  }

  // Phase 2: Build a Reliable Profile Model & Normalize
  const profile = {
    name: name ? String(name).trim() : 'Unknown',
    age: age ? String(age).trim() : 'Unknown',
    educationLevel: educationLevel ? String(educationLevel).trim() : 'Unknown',
    academicInterest: academicInterest ? String(academicInterest).trim() : 'Unknown',
    goal: goal ? String(goal).trim() : '',
    skills: normalizeArray(skills),
    interests: normalizeArray(interests),
    experience: normalizeArray(experience),
    achievements: normalizeArray(achievements),
    preferredDomains: normalizeArray(preferredDomains),
    constraints: normalizeArray(constraints)
  };

  try {
    const analysisResult = await analyzerEngine.analyzeProfile(profile);
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      success: false,
      message: "Your analysis could not be completed right now. Please try again."
    });
  }
});

module.exports = {
  analyzeProfile
};
