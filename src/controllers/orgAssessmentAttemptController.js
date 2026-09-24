const asyncHandler = require('../middlewares/async');
const ApiError = require('../utils/apiError');
const orgAssessmentModel = require('../models/orgAssessmentModel');
const orgAssessmentAttemptModel = require('../models/orgAssessmentAttemptModel');
const orgCourseEnrollmentModel = require('../models/orgCourseEnrollmentModel');
const auditLogModel = require('../models/auditLogModel');
const { pool } = require('../db');

// @desc    Start an assessment attempt
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/assessments/:assessmentId/attempts
// @access  Private (Enrolled Trainee)
exports.startAttempt = asyncHandler(async (req, res, next) => {
  const { organizationId, courseId, assessmentId } = req.params;
  const traineeId = req.user.id;

  // 1. Verify enrollment
  const enrollment = await orgCourseEnrollmentModel.findByCourseAndTrainee(courseId, traineeId);
  if (!enrollment) {
    return next(new ApiError(403, 'You are not enrolled in this course.'));
  }

  // 2. Verify assessment exists, belongs to course, is published
  const assessment = await orgAssessmentModel.findByIdAndOrganization(assessmentId, organizationId);
  if (!assessment || assessment.course_id !== courseId) {
    return next(new ApiError(404, 'Assessment not found.'));
  }
  if (assessment.status !== 'PUBLISHED') {
    return next(new ApiError(403, 'This assessment is not available.'));
  }

  // 3. Verify availability window
  const now = new Date();
  if (assessment.available_from && new Date(assessment.available_from) > now) {
    return next(new ApiError(403, 'This assessment is not yet available.'));
  }
  if (assessment.available_until && new Date(assessment.available_until) < now) {
    return next(new ApiError(403, 'This assessment has expired.'));
  }

  // 4. Start attempt (Model checks max_attempts)
  const attempt = await orgAssessmentAttemptModel.startAttempt(organizationId, traineeId, assessment);

  // 5. Strip correct answers from questions payload to prevent cheating
  const secureQuestions = assessment.questions.map(q => {
    // Assuming options were populated by findByIdAndOrganization. We need to fetch options if not.
    // However, our findByIdAndOrganization in orgAssessmentModel only fetched the questions without options.
    // Let's refetch questions WITH options but strip is_correct.
    return q;
  });

  // We need to fetch the options for this assessment securely
  const getQuestionsWithOptionsQuery = `
    SELECT q.id, q.question_text, q.question_type, q.points, aq.order_index as q_order,
      COALESCE(
        json_agg(
          json_build_object(
            'id', o.id,
            'option_text', o.option_text,
            'order_index', o.order_index
          ) ORDER BY o.order_index ASC
        ) FILTER (WHERE o.id IS NOT NULL), '[]'
      ) as options
    FROM org_assessment_questions aq
    JOIN org_questions q ON aq.question_id = q.id
    LEFT JOIN org_question_options o ON q.id = o.question_id
    WHERE aq.assessment_id = $1
    GROUP BY q.id, aq.order_index
    ORDER BY aq.order_index ASC
  `;
  const qResult = await pool.query(getQuestionsWithOptionsQuery, [assessment.id]);
  
  const payload = {
    attempt_id: attempt.id,
    assessment_title: assessment.title,
    duration_minutes: assessment.duration_minutes,
    expires_at: attempt.expires_at,
    questions: qResult.rows // Notice we omitted 'is_correct' in the json_build_object
  };

  auditLogModel.createLog(req.user.id, 'ATTEMPT_STARTED', 'org_assessment_attempts', attempt.id, { assessmentId }, req.ip, req.headers['user-agent']);

  res.status(201).json({
    success: true,
    data: payload
  });
});

// @desc    Save an answer
// @route   PUT /api/v1/organizations/:organizationId/courses/:courseId/assessments/:assessmentId/attempts/:id/answers
// @access  Private (Enrolled Trainee)
exports.saveAnswer = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { question_id, selected_option_id } = req.body;
  const traineeId = req.user.id;

  const attempt = await orgAssessmentAttemptModel.findByIdAndTrainee(id, traineeId);
  if (!attempt) return next(new ApiError(404, 'Attempt not found.'));

  if (attempt.status !== 'IN_PROGRESS') {
    return next(new ApiError(400, 'Cannot modify answers for a submitted or expired attempt.'));
  }

  if (attempt.expires_at && new Date(attempt.expires_at) < new Date()) {
    // Ideally we would mark as EXPIRED here, but we just reject the save
    return next(new ApiError(400, 'Time expired. Please submit your attempt.'));
  }

  const answer = await orgAssessmentAttemptModel.saveAnswer(id, question_id, selected_option_id);

  res.status(200).json({
    success: true,
    data: answer
  });
});

// @desc    Final submit attempt
// @route   POST /api/v1/organizations/:organizationId/courses/:courseId/assessments/:assessmentId/attempts/:id/submit
// @access  Private (Enrolled Trainee)
exports.submitAttempt = asyncHandler(async (req, res, next) => {
  const { organizationId, assessmentId, id } = req.params;
  const traineeId = req.user.id;

  const attempt = await orgAssessmentAttemptModel.findByIdAndTrainee(id, traineeId);
  if (!attempt) return next(new ApiError(404, 'Attempt not found.'));

  if (attempt.status !== 'IN_PROGRESS') {
    return next(new ApiError(400, 'This attempt has already been submitted or expired.'));
  }

  const assessment = await orgAssessmentModel.findByIdAndOrganization(assessmentId, organizationId);
  if (!assessment) return next(new ApiError(404, 'Assessment not found.'));

  // Evaluate Server-Side
  let totalPoints = 0;
  let earnedPoints = 0;
  
  // We need to fetch authoritative answers and points
  const authQuery = `
    SELECT q.id as question_id, q.points, o.id as correct_option_id
    FROM org_assessment_questions aq
    JOIN org_questions q ON aq.question_id = q.id
    JOIN org_question_options o ON q.id = o.question_id
    WHERE aq.assessment_id = $1 AND o.is_correct = true
  `;
  const authResult = await pool.query(authQuery, [assessmentId]);
  const authoratativeData = authResult.rows; // [{question_id, points, correct_option_id}]

  const traineeAnswers = attempt.answers || []; // [{question_id, selected_option_id}]

  // Prepare snapshot data to preserve historical integrity
  const snapshotData = {
    passing_percentage: assessment.passing_percentage,
    questions: []
  };

  authoratativeData.forEach(authItem => {
    totalPoints += authItem.points;
    const tAnswer = traineeAnswers.find(a => a.question_id === authItem.question_id);
    
    let isCorrect = false;
    if (tAnswer && tAnswer.selected_option_id === authItem.correct_option_id) {
      earnedPoints += authItem.points;
      isCorrect = true;
    }

    snapshotData.questions.push({
      question_id: authItem.question_id,
      points: authItem.points,
      selected_option_id: tAnswer ? tAnswer.selected_option_id : null,
      correct_option_id: authItem.correct_option_id,
      is_correct: isCorrect
    });
  });

  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  const isPassed = percentage >= assessment.passing_percentage;

  const result = await orgAssessmentAttemptModel.submitAttempt(id, {
    score: earnedPoints,
    percentage: parseFloat(percentage.toFixed(2)),
    is_passed: isPassed
  }, snapshotData);

  auditLogModel.createLog(traineeId, 'ATTEMPT_SUBMITTED', 'org_assessment_attempts', id, { score: earnedPoints, percentage }, req.ip, req.headers['user-agent']);

  // Phase I: Trigger Competency Engine to process this assessment
  // Doing this asynchronously so we don't block the response
  const competencyEngineService = require('../services/competencyEngineService');
  competencyEngineService.processAssessmentSubmission(organizationId, traineeId, id).catch(err => {
    console.error('Error in competency engine processing:', err);
  });

  res.status(200).json({
    success: true,
    data: {
      status: result.status,
      score: result.score,
      percentage: result.percentage,
      is_passed: result.is_passed
    }
  });
});

// @desc    Get all attempts for an assessment (Trainer/Admin monitoring)
// @route   GET /api/v1/organizations/:organizationId/courses/:courseId/assessments/:assessmentId/attempts
// @access  Private (Admin or Trainer)
exports.getAssessmentAttempts = asyncHandler(async (req, res, next) => {
  const { assessmentId } = req.params;
  
  // Checking permissions is done in routes, so here we just query
  const query = `
    SELECT a.*, t.first_name, t.last_name, t.email
    FROM org_assessment_attempts a
    JOIN users t ON a.trainee_id = t.id
    WHERE a.assessment_id = $1
    ORDER BY a.submitted_at DESC NULLS FIRST
  `;
  
  const result = await pool.query(query, [assessmentId]);

  res.status(200).json({
    success: true,
    count: result.rowCount,
    data: result.rows
  });
});
