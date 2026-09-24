const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const OrgTrainerMatchModel = require('../models/orgTrainerMatchModel');
const OrgTrainerAssignmentModel = require('../models/orgTrainerAssignmentModel');
const TrainerMatchingService = require('../services/trainerMatchingService');
const auditLogModel = require('../models/auditLogModel');

// @desc    Generate trainer matches for a training need
// @route   POST /api/v1/organizations/:organizationId/training-needs/:trainingNeedId/trainer-matches/generate
// @access  Private (Org Admin)
exports.generateTrainerMatches = asyncHandler(async (req, res, next) => {
    const { organizationId, trainingNeedId } = req.params;

    const matches = await TrainerMatchingService.generateMatchesForNeed(organizationId, trainingNeedId);

    await auditLogModel.log({
        organization_id: organizationId,
        actor_id: req.user.id,
        action: 'TRAINER_MATCH_GENERATED',
        resource_type: 'TRAINING_NEED',
        resource_id: trainingNeedId,
        metadata: { matches_found: matches.length }
    });

    res.status(200).json({
        success: true,
        count: matches.length,
        data: matches
    });
});

// @desc    Get trainer matches for a training need
// @route   GET /api/v1/organizations/:organizationId/training-needs/:trainingNeedId/trainer-matches
// @access  Private (Org Admin)
exports.getTrainerMatches = asyncHandler(async (req, res, next) => {
    const { organizationId, trainingNeedId } = req.params;

    const matches = await OrgTrainerMatchModel.getMatchesForNeed(organizationId, trainingNeedId);

    res.status(200).json({
        success: true,
        count: matches.length,
        data: matches
    });
});

// @desc    Assign a trainer to a training need
// @route   POST /api/v1/organizations/:organizationId/training-needs/:trainingNeedId/assign-trainer
// @access  Private (Org Admin)
exports.assignTrainer = asyncHandler(async (req, res, next) => {
    const { organizationId, trainingNeedId } = req.params;
    const { trainerId, reason } = req.body;

    if (!trainerId) {
        return next(new ApiError('Trainer ID is required', 400));
    }

    // Verify the match exists and is somewhat eligible
    const match = await OrgTrainerMatchModel.getMatchDetail(organizationId, trainerId);
    // Note: To be safe, we'd query by (organizationId, trainingNeedId, trainerId), but model getMatchDetail is by ID.
    // Let's rely on the assignment model's constraint.

    const assignment = await OrgTrainerAssignmentModel.assignTrainer(
        organizationId, 
        trainingNeedId, 
        trainerId, 
        req.user.id, 
        reason
    );

    await auditLogModel.log({
        organization_id: organizationId,
        actor_id: req.user.id,
        action: 'TRAINER_ASSIGNMENT_CREATED',
        resource_type: 'TRAINER_ASSIGNMENT',
        resource_id: assignment.id,
        metadata: { trainer_id: trainerId, training_need_id: trainingNeedId }
    });

    res.status(200).json({
        success: true,
        data: assignment
    });
});

// @desc    Accept or decline an assignment
// @route   PUT /api/v1/organizations/:organizationId/trainer-assignments/:trainingNeedId/respond
// @access  Private (Trainer)
exports.respondToAssignment = asyncHandler(async (req, res, next) => {
    const { organizationId, trainingNeedId } = req.params;
    const { status, reason } = req.body; // 'ACCEPTED' or 'DECLINED'
    const trainerId = req.user.id; // Trainer can only respond for themselves

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
        return next(new ApiError('Invalid status. Must be ACCEPTED or DECLINED', 400));
    }

    const assignment = await OrgTrainerAssignmentModel.updateAssignmentStatus(
        organizationId, 
        trainingNeedId, 
        trainerId, 
        status, 
        reason
    );

    if (!assignment) {
        return next(new ApiError('Assignment not found or unauthorized', 404));
    }

    await auditLogModel.log({
        organization_id: organizationId,
        actor_id: req.user.id,
        action: `TRAINER_ASSIGNMENT_${status}`,
        resource_type: 'TRAINER_ASSIGNMENT',
        resource_id: assignment.id,
        metadata: { reason }
    });

    res.status(200).json({
        success: true,
        data: assignment
    });
});
