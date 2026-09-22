const asyncHandler = require('../utils/asyncHandler');
const analyzerEngine = require('../services/analyzerEngine');

/**
 * Handle POST request to analyze user career profile
 */
const analyzeProfile = asyncHandler(async (req, res) => {
  const { interests, skills, academicInterest, achievements } = req.body;

  // Input validation
  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    return res.status(400).json({
      success: false,
      message: "More information is required to provide a reliable analysis. Please provide at least one interest."
    });
  }

  // Ensure skills are properly formatted
  const validSkills = Array.isArray(skills) ? skills.filter(s => typeof s === 'string' && s.trim().length > 0) : [];
  
  const profile = {
    interests,
    skills: validSkills,
    academicInterest: academicInterest || '',
    achievements: Array.isArray(achievements) ? achievements : []
  };

  try {
    const analysisResult = analyzerEngine.analyzeProfile(profile);
    
    // Simulate a slight delay to ensure UI loading state is visible (as per UX standard for "AI" tools)
    // Optional, can be removed if strict latency is required.
    setTimeout(() => {
      res.status(200).json(analysisResult);
    }, 1000);
    
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
