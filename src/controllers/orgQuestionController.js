const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgQuestionModel = require('../models/orgQuestionModel');
const auditLogModel = require('../models/auditLogModel');

// @desc    Create a new question
// @route   POST /api/v1/organizations/:organizationId/questions
// @access  Private (Admin or Trainer)
exports.createQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { question_text, question_type, difficulty, explanation, points, options } = req.body;

  if (!question_text) {
    return next(new ApiError(400, 'Question text is required.'));
  }

  const question = await orgQuestionModel.create(organizationId, req.user.id, {
    question_text,
    question_type,
    difficulty,
    explanation,
    points
  });

  // Handle options if provided
  const createdOptions = [];
  if (options && Array.isArray(options)) {
    for (const [index, opt] of options.entries()) {
      const createdOpt = await orgQuestionModel.addOption(question.id, {
        option_text: opt.option_text,
        order_index: opt.order_index !== undefined ? opt.order_index : index,
        is_correct: opt.is_correct || false
      });
      createdOptions.push(createdOpt);
    }
  }

  question.options = createdOptions;

  auditLogModel.createLog(req.user.id, 'QUESTION_CREATED', 'org_questions', question.id, { title: question_text.substring(0, 50) }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: question
  });
});

// @desc    Get a single question
// @route   GET /api/v1/organizations/:organizationId/questions/:id
// @access  Private (Admin or Trainer)
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) {
    return next(new ApiError(404, 'Question not found.'));
  }

  res.status(200).json({
    success: true,
    data: question
  });
});

// @desc    Get all questions for organization
// @route   GET /api/v1/organizations/:organizationId/questions
// @access  Private (Admin or Trainer)
exports.getQuestions = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { status, difficulty, question_type, search } = req.query;

  const questions = await orgQuestionModel.findAllByOrganization(organizationId, {
    status,
    difficulty,
    question_type,
    search
  });

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions
  });
});

// @desc    Update a question
// @route   PUT /api/v1/organizations/:organizationId/questions/:id
// @access  Private (Admin or Trainer)
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) {
    return next(new ApiError(404, 'Question not found.'));
  }

  const updatedQuestion = await orgQuestionModel.update(id, organizationId, req.body);

  auditLogModel.createLog(req.user.id, 'QUESTION_UPDATED', 'org_questions', id, { fields: Object.keys(req.body) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    data: updatedQuestion
  });
});

// @desc    Delete or archive a question
// @route   DELETE /api/v1/organizations/:organizationId/questions/:id
// @access  Private (Admin or Trainer)
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) {
    return next(new ApiError(404, 'Question not found.'));
  }

  const result = await orgQuestionModel.deleteOrArchive(id, organizationId);

  auditLogModel.createLog(req.user.id, result.action === 'archived' ? 'QUESTION_ARCHIVED' : 'QUESTION_DELETED', 'org_questions', id, { title: question.question_text.substring(0, 50) }, req.ip, req.headers['user-agent']);

  res.status(200).json({
    success: true,
    message: 'Question successfully ' + result.action,
    data: {}
  });
});

// @desc    Add option to question
// @route   POST /api/v1/organizations/:organizationId/questions/:id/options
// @access  Private (Admin or Trainer)
exports.addOption = asyncHandler(async (req, res, next) => {
  const { organizationId, id } = req.params;
  const { option_text, order_index, is_correct } = req.body;

  if (!option_text) {
    return next(new ApiError(400, 'Option text is required.'));
  }

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) {
    return next(new ApiError(404, 'Question not found.'));
  }
  
  // Check if safe to edit
  const hasAttempts = await orgQuestionModel.checkHasAttempts(id);
  if (hasAttempts) {
    return next(new ApiError(400, 'Cannot modify options for a question used in assessment attempts.'));
  }

  const option = await orgQuestionModel.addOption(id, { option_text, order_index, is_correct });

  res.status(201).json({
    success: true,
    data: option
  });
});

// @desc    Update option
// @route   PUT /api/v1/organizations/:organizationId/questions/:id/options/:optionId
// @access  Private (Admin or Trainer)
exports.updateOption = asyncHandler(async (req, res, next) => {
  const { organizationId, id, optionId } = req.params;

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) return next(new ApiError(404, 'Question not found.'));

  const hasAttempts = await orgQuestionModel.checkHasAttempts(id);
  if (hasAttempts) {
    return next(new ApiError(400, 'Cannot modify options for a question used in assessment attempts.'));
  }

  const updatedOption = await orgQuestionModel.updateOption(optionId, id, req.body);
  if (!updatedOption) return next(new ApiError(404, 'Option not found.'));

  res.status(200).json({
    success: true,
    data: updatedOption
  });
});

// @desc    Delete option
// @route   DELETE /api/v1/organizations/:organizationId/questions/:id/options/:optionId
// @access  Private (Admin or Trainer)
exports.deleteOption = asyncHandler(async (req, res, next) => {
  const { organizationId, id, optionId } = req.params;

  const question = await orgQuestionModel.findByIdAndOrganization(id, organizationId);
  if (!question) return next(new ApiError(404, 'Question not found.'));

  const hasAttempts = await orgQuestionModel.checkHasAttempts(id);
  if (hasAttempts) {
    return next(new ApiError(400, 'Cannot modify options for a question used in assessment attempts.'));
  }

  const deleted = await orgQuestionModel.deleteOption(optionId, id);
  if (!deleted) return next(new ApiError(404, 'Option not found.'));

  res.status(200).json({
    success: true,
    data: {}
  });
});
