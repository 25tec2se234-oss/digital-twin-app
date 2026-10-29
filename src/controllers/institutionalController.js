const institutionalService = require('../services/institutionalService');
const ApiError = require('../utils/apiError');

/**
 * Handle inbound institutional pilot inquiry (Public endpoint)
 */
async function submitInquiry(req, res, next) {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || null;

    const result = await institutionalService.submitInquiry(req.body, clientIp, userAgent);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * List inquiries (Platform admin only)
 */
async function listInquiries(req, res, next) {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
      throw new ApiError(403, 'Platform administrative privileges required.');
    }
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await institutionalService.listInquiries(limit, offset);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

/**
 * Create a new student cohort for an organization
 */
async function createCohort(req, res, next) {
  try {
    const organizationId = req.params.organizationId;
    const cohort = await institutionalService.createCohort(organizationId, req.body, req.user.id);
    return res.status(201).json({
      success: true,
      cohort
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * List cohorts belonging to an organization
 */
async function listCohorts(req, res, next) {
  try {
    const organizationId = req.params.organizationId;
    const cohorts = await institutionalService.listCohorts(organizationId);
    return res.status(200).json({
      success: true,
      cohorts
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get cohort details
 */
async function getCohort(req, res, next) {
  try {
    const { organizationId, cohortId } = req.params;
    const cohort = await institutionalService.getCohortById(organizationId, cohortId);
    if (!cohort) {
      throw new ApiError(404, 'Cohort not found in this organization.');
    }
    return res.status(200).json({
      success: true,
      cohort
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Enroll a student into a cohort
 */
async function enrollStudent(req, res, next) {
  try {
    const { organizationId, cohortId } = req.params;
    const { userId, rollNumber } = req.body;
    if (!userId) {
      throw new ApiError(400, 'Student user ID is required.');
    }
    const enrollment = await institutionalService.enrollStudentToCohort(organizationId, cohortId, userId, rollNumber);
    return res.status(201).json({
      success: true,
      enrollment
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get cohort placement readiness heatmap and skill gap report
 */
async function getCohortReadinessReport(req, res, next) {
  try {
    const { organizationId, cohortId } = req.params;
    const report = await institutionalService.getCohortReadinessReport(organizationId, cohortId);
    return res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  submitInquiry,
  listInquiries,
  createCohort,
  listCohorts,
  getCohort,
  enrollStudent,
  getCohortReadinessReport
};
