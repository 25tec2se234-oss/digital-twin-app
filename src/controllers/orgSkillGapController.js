const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const orgSkillGapModel = require('../models/orgSkillGapModel');
const SkillGapService = require('../services/skillGapService');

// @desc    Get trainee's skill gaps
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/skill-gaps
// @access  Private
exports.getTraineeGaps = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { history } = req.query;

  // Authorization check (Trainee viewing own gaps or Trainer/Admin viewing them)
  if (req.user.role === 'TRAINEE' && req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to view other trainees skill gaps'));
  }

  const gaps = await orgSkillGapModel.getTraineeGaps(organizationId, traineeId, history === 'true');

  res.status(200).json({
    success: true,
    count: gaps.length,
    data: gaps
  });
});

// @desc    Get trainee's training needs and recommendations
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/training-needs
// @access  Private
exports.getTraineeTrainingNeeds = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;

  if (req.user.role === 'TRAINEE' && req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to view other trainees training needs'));
  }

  const needs = await orgSkillGapModel.getTraineeTrainingNeeds(organizationId, traineeId);

  res.status(200).json({
    success: true,
    count: needs.length,
    data: needs
  });
});

// @desc    Get organization training needs aggregation
// @route   GET /api/v1/organizations/:organizationId/training-needs
// @access  Private (Admin)
exports.getOrganizationTrainingNeeds = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;

  const aggregatedNeeds = await orgSkillGapModel.getOrganizationTrainingNeeds(organizationId);

  res.status(200).json({
    success: true,
    count: aggregatedNeeds.length,
    data: aggregatedNeeds
  });
});

// @desc    Manually trigger recalculation for a trainee role
// @route   POST /api/v1/organizations/:organizationId/trainees/:traineeId/recalculate-gaps
// @access  Private (Admin)
exports.recalculateGaps = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;
  const { targetType, targetId } = req.body;

  if (!targetType || !targetId) {
    return next(new ApiError(400, 'targetType and targetId are required'));
  }

  await SkillGapService.calculateTraineeGapsForTarget(organizationId, traineeId, targetType, targetId);

  res.status(200).json({
    success: true,
    message: 'Skill gaps recalculated successfully.'
  });
});

// @desc    Get AI Gap Report for a trainee
// @route   GET /api/v1/organizations/:organizationId/trainees/:traineeId/ai-gap-report
// @access  Private
const AICompetencyGapEngine = require('../services/aiCompetencyGapEngine');
exports.getAIGapReport = asyncHandler(async (req, res, next) => {
  const { organizationId, traineeId } = req.params;

  if (req.user.role === 'TRAINEE' && req.user.id !== traineeId) {
    return next(new ApiError(403, 'Not authorized to view other trainees reports'));
  }

  const report = await AICompetencyGapEngine.generateIndividualGapReport(organizationId, traineeId);

  res.status(200).json({
    success: true,
    data: report
  });
});

const AITrainingNeedsAnalyzer = require('../services/aiTrainingNeedsAnalyzer');
exports.getAITrainingNeedsAnalysis = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const filters = {
    departmentId: req.query.departmentId,
    roleId: req.query.roleId,
    traineeId: req.query.traineeId
  };

  const report = await AITrainingNeedsAnalyzer.analyze(organizationId, filters);

  res.status(200).json(report);
});

exports.getAITrainingNeedsExport = asyncHandler(async (req, res, next) => {
  const { organizationId } = req.params;
  const { format } = req.query; // 'csv' or 'pdf'
  const filters = {
    departmentId: req.query.departmentId,
    roleId: req.query.roleId,
    traineeId: req.query.traineeId
  };

  const report = await AITrainingNeedsAnalyzer.analyze(organizationId, filters);

  if (!report.success || !report.data || report.data.length === 0) {
    return res.status(404).send('No data available to export.');
  }

  if (format === 'csv') {
    const { parse } = require('json2csv'); // Requires json2csv package
    try {
      const csv = parse(report.data);
      res.header('Content-Type', 'text/csv');
      res.attachment('training_needs_report.csv');
      return res.send(csv);
    } catch (err) {
      return next(new ApiError(500, 'Error generating CSV'));
    }
  } else if (format === 'pdf') {
    // Basic PDF placeholder generation (In a real app, use PDFKit or Puppeteer)
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=training_needs_report.pdf');
    doc.pipe(res);
    doc.fontSize(20).text('AI Training Needs Analyzer Report', { align: 'center' });
    doc.moveDown();
    report.data.forEach((item, index) => {
      doc.fontSize(14).text(`${index + 1}. ${item.training_need}`, { underline: true });
      doc.fontSize(12).text(`Priority: ${item.priority}`);
      doc.fontSize(12).text(`Affected Members: ${item.affected_members}`);
      doc.fontSize(12).text(`Departments: ${item.affected_department}`);
      doc.fontSize(12).text(`Recommended Training: ${item.recommended_training}`);
      doc.fontSize(12).text(`AI Reason: ${item.reason}`);
      doc.moveDown();
    });
    doc.end();
  } else {
    return next(new ApiError(400, 'Invalid export format. Use csv or pdf.'));
  }
});
