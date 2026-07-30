const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userService = require('../services/userService');
const db = require('../db');

const listUsers = asyncHandler(async function(req, res) {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const offset = Number(req.query.offset || 0);
  const search = req.query.search || '';

  const result = await userService.listUsers({
    limit: limit,
    offset: offset,
    search: search
  });

  res.json({
    users: result.users,
    total: result.total,
    limit: limit,
    offset: offset
  });
});

const updateRole = asyncHandler(async function(req, res) {
  const userId = req.params.id;
  const role = req.body.role;

  const updated = await userService.updateRole(userId, role);
  if (!updated) {
    throw new ApiError(404, 'User not found.');
  }
  res.json({
    user: {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      isActive: updated.isActive
    }
  });
});

const updateStatus = asyncHandler(async function(req, res) {
  const userId = req.params.id;
  const isActive = req.body.isActive;

  if (userId.toString() === req.user.id.toString()) {
    throw new ApiError(403, 'You cannot block yourself.');
  }

  const updated = await userService.updateActiveStatus(userId, isActive);
  if (!updated) {
    throw new ApiError(404, 'User not found.');
  }
  res.json({
    user: {
      id: updated.id,
      email: updated.email,
      isActive: updated.isActive
    }
  });
});

const getDashboardStats = asyncHandler(async function(req, res) {
  const userId = req.user.id;

  // Run study time and quiz accuracy queries in parallel
  const [twTimeRes, lwTimeRes, twAccRes, lwAccRes] = await Promise.all([
    // This week study minutes
    db.query(
      `SELECT COALESCE(SUM(duration_minutes), 0) AS total 
       FROM learning_sessions 
       WHERE student_id = $1 
         AND start_time >= date_trunc('week', CURRENT_DATE)`,
      [userId]
    ),
    // Last week study minutes
    db.query(
      `SELECT COALESCE(SUM(duration_minutes), 0) AS total 
       FROM learning_sessions 
       WHERE student_id = $1 
         AND start_time >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week') 
         AND start_time < date_trunc('week', CURRENT_DATE)`,
      [userId]
    ),
    // This week average quiz accuracy
    db.query(
      `SELECT COALESCE(AVG(accuracy_percentage), 0) AS avg_acc 
       FROM quiz_attempts 
       WHERE student_id = $1 
         AND created_at >= date_trunc('week', CURRENT_DATE)`,
      [userId]
    ),
    // Last week average quiz accuracy
    db.query(
      `SELECT COALESCE(AVG(accuracy_percentage), 0) AS avg_acc 
       FROM quiz_attempts 
       WHERE student_id = $1 
         AND created_at >= date_trunc('week', CURRENT_DATE - INTERVAL '1 week') 
         AND created_at < date_trunc('week', CURRENT_DATE)`,
      [userId]
    )
  ]);

  const twMinutes = parseFloat(twTimeRes.rows[0].total);
  const lwMinutes = parseFloat(lwTimeRes.rows[0].total);
  
  // Convert minutes to hours and round to 1 decimal place
  const twTimeHours = Math.round((twMinutes / 60) * 10) / 10;
  const lwTimeHours = Math.round((lwMinutes / 60) * 10) / 10;

  const twAccuracy = Math.round(parseFloat(twAccRes.rows[0].avg_acc) * 10) / 10;
  const lwAccuracy = Math.round(parseFloat(lwAccRes.rows[0].avg_acc) * 10) / 10;

  res.json({
    studyTimeThisWeek: twTimeHours,
    studyTimeLastWeek: lwTimeHours,
    accuracyThisWeek: twAccuracy,
    accuracyLastWeek: lwAccuracy
  });
});

module.exports = {
  listUsers,
  updateRole,
  updateStatus,
  getDashboardStats
};
