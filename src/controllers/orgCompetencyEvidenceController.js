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

// @desc    Add manual evidence (e.g. Project, Uploaded Certificate)
// @route   POST /api/v1/organizations/:organizationId/trainees/:traineeId/evidence
// @access  Private (Trainer/Admin, or self for self-reported)
exports.addEvidence = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { competency_id, skill_id, evidence_type, source_id, evidence_value, normalized_score, confidence } = req.body;

  // Determine verification status
  let verification_status = 'PENDING';
  let finalConfidence = confidence || 'LOW';

  if (['ADMIN', 'TRAINER'].includes(req.user.role)) {
    verification_status = 'VERIFIED';
    finalConfidence = confidence || 'HIGH';
  } else if (req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to add evidence for this trainee'));
  }

  const evidence = await orgCompetencyEvidenceModel.addEvidence(organizationId, traineeId, {
    competency_id,
    skill_id,
    evidence_type: evidence_type || 'UPLOADED_EVIDENCE', // PROJECT, CERTIFICATE, etc.
    source_id: source_id || req.user.id,
    evidence_value: evidence_value || 'Completed',
    normalized_score: normalized_score || null,
    confidence: finalConfidence,
    verification_status,
    metadata: { added_by: req.user.id }
  });

  // If verified, trigger competency engine recalculation
  if (verification_status === 'VERIFIED') {
    const competencyEngineService = require('../services/competencyEngineService');
    if (skill_id) {
       await competencyEngineService.recalculateTraineeSkill(organizationId, traineeId, skill_id);
    } else if (competency_id) {
       await competencyEngineService.recalculateTraineeCompetency(organizationId, traineeId, competency_id);
    }
  }

  res.status(201).json({
    success: true,
    data: evidence
  });
});
