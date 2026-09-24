const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgCompetencySnapshotModel = require('../models/orgCompetencySnapshotModel');

// @desc    Get trainee competency profile
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/competency-profile
// @access  Private (Trainer/Admin, or self)
exports.getTraineeProfile = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  
  if (req.user.id !== traineeId) {
     if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
       return next(new ApiError(403, 'Not authorized to view this trainee\'s profile'));
     }
  }

  const profile = await orgCompetencySnapshotModel.getCurrentSnapshots(organizationId, traineeId);

  res.status(200).json({
    success: true,
    data: profile
  });
});

// @desc    Get trainee competency history
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/competency-history
// @access  Private (Trainer/Admin, or self)
exports.getTraineeHistory = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { competency_id, skill_id } = req.query;
  
  if (req.user.id !== traineeId) {
     if (!['ADMIN', 'TRAINER'].includes(req.user.role)) {
       return next(new ApiError(403, 'Not authorized to view this trainee\'s history'));
     }
  }

  const history = await orgCompetencySnapshotModel.getHistoricalSnapshots(organizationId, traineeId, competency_id, skill_id);

  res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});
