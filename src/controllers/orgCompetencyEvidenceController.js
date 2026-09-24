const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCompetencyEvidenceModel = require('../models/orgCompetencyEvidenceModel');

// @desc    Get evidence for a trainee
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/evidence
// @access  Private (Trainer/Admin, or self)
exports.getTraineeEvidence = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  
  // Ensure access control: can only view own evidence unless Trainer/Admin
  if (req.user.id !== traineeId) {
     if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
       return next(new ApiError(403, 'Not authorized to view this trainee\'s evidence'));
     }
  }

  const { competency_id, skill_id } = req.query;

  const evidence = await orgCompetencyEvidenceModel.getEvidenceForTrainee(organizationId, traineeId, { competency_id, skill_id });

  res.status(200).json({
    success: true,
    count: evidence.length,
    data: evidence
  });
});
