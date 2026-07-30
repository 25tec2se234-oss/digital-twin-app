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


const getLeaderboardData = asyncHandler(async function(req, res) {
  const userId = req.user.id;

  // Fetch top 3 snapshots
  let snapshots = await db.query(
    "SELECT score, rank, display_name, city, user_id FROM leaderboard_snapshot WHERE period = 'weekly' ORDER BY rank ASC LIMIT 3"
  );

  if (snapshots.rows.length === 0) {
    // Fallback: build dynamic top 3 based on users' aggregated study + quiz points
    snapshots = await db.query(
      `SELECT COALESCE(SUM(points), 10) as score, 
              ROW_NUMBER() OVER(ORDER BY COALESCE(SUM(points), 10) DESC)::int as rank,
              name as display_name, city, id as user_id 
       FROM users 
       LEFT JOIN (
         SELECT student_id, (duration_minutes * 2) as points FROM learning_sessions
         UNION ALL
         SELECT student_id, (accuracy_percentage::int * 3) as points FROM quiz_attempts
       ) a ON users.id = a.student_id
       WHERE public_leaderboard_opt_in = TRUE
       GROUP BY users.id, name, city
       ORDER BY score DESC LIMIT 3`
    );
  }

  // User rank
  let userRankRes = await db.query(
    "SELECT score, rank FROM leaderboard_snapshot WHERE period = 'weekly' AND user_id = $1",
    [userId]
  );

  let userScore = 0;
  let userRank = '-';
  if (userRankRes.rows.length > 0) {
    userScore = userRankRes.rows[0].score;
    userRank = userRankRes.rows[0].rank;
  } else {
    // Fallback rank calculation
    const allRank = await db.query(
      `SELECT score, rank FROM (
         SELECT users.id as user_id, COALESCE(SUM(points), 10) as score,
                ROW_NUMBER() OVER(ORDER BY COALESCE(SUM(points), 10) DESC)::int as rank
         FROM users 
         LEFT JOIN (
           SELECT student_id, (duration_minutes * 2) as points FROM learning_sessions
           UNION ALL
           SELECT student_id, (accuracy_percentage::int * 3) as points FROM quiz_attempts
         ) a ON users.id = a.student_id
         WHERE public_leaderboard_opt_in = TRUE
         GROUP BY users.id
      ) r WHERE user_id = $1`,
      [userId]
    );
    if (allRank.rows.length > 0) {
      userScore = allRank.rows[0].score;
      userRank = allRank.rows[0].rank;
    }
  }

  // Get user's opt-in status and overall XP
  const optInRes = await db.query("SELECT public_leaderboard_opt_in FROM users WHERE id = $1", [userId]);
  const xpRes = await db.query("SELECT COALESCE(SUM(points_awarded), 0) as total FROM user_activity_log WHERE user_id = $1", [userId]);

  res.json({
    leaderboard: snapshots.rows,
    userRank: userRank,
    userScore: userScore,
    userXp: parseInt(xpRes.rows[0].total, 10),
    optIn: optInRes.rows.length > 0 ? optInRes.rows[0].public_leaderboard_opt_in : true
  });
});

const updateLeaderboardOptIn = asyncHandler(async function(req, res) {
  const userId = req.user.id;
  const { optIn } = req.body;

  await db.query("UPDATE users SET public_leaderboard_opt_in = $1 WHERE id = $2", [optIn, userId]);

  res.json({ success: true, optIn });
});

const getUserGoals = asyncHandler(async function(req, res) {
  const userId = req.user.id;
  const result = await db.query("SELECT * FROM goals WHERE student_id = $1 ORDER BY created_at DESC", [userId]);
  res.json({ goals: result.rows });
});

const createUserGoal = asyncHandler(async function(req, res) {
  const userId = req.user.id;
  const { title, category } = req.body;

  if (!title) {
    throw new ApiError(400, 'Title is required');
  }

  const result = await db.query(
    "INSERT INTO goals (student_id, title, category, status) VALUES ($1, $2, $3, 'In_Progress') RETURNING *",
    [userId, title, category || 'Daily']
  );

  res.json({ success: true, goal: result.rows[0] });
});

const toggleGoalStatus = asyncHandler(async function(req, res) {
  const userId = req.user.id;
  const goalId = req.params.id;
  const { status } = req.body;

  const result = await db.query(
    "UPDATE goals SET status = $1 WHERE id = $2 AND student_id = $3 RETURNING *",
    [status, goalId, userId]
  );

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Goal not found');
  }

  // Award XP if marked as Achieved
  if (status === 'Achieved') {
    await db.query(
      "INSERT INTO user_activity_log (user_id, action_type, points_awarded) VALUES ($1, 'simulation_complete', 50)",
      [userId]
    );
  }

  res.json({ success: true, goal: result.rows[0] });
});

const purchaseStreakShield = asyncHandler(async function(req, res) {
  const userId = req.user.id;

  // Check XP balance
  const xpRes = await db.query("SELECT COALESCE(SUM(points_awarded), 0) as total FROM user_activity_log WHERE user_id = $1", [userId]);
  const currentXp = parseInt(xpRes.rows[0].total, 10);

  if (currentXp < 100) {
    throw new ApiError(400, 'Insufficient XP. You need at least 100 XP to purchase a Streak Shield.');
  }

  // Deduct 100 XP
  await db.query(
    "INSERT INTO user_activity_log (user_id, action_type, points_awarded) VALUES ($1, 'daily_login', -100)",
    [userId]
  );

  // Update app_data
  const userRes = await db.query("SELECT app_data FROM users WHERE id = $1", [userId]);
  let appData = userRes.rows[0].app_data || {};
  if (typeof appData === 'string') {
    appData = JSON.parse(appData);
  }
  
  appData.streakShields = (appData.streakShields || 0) + 1;

  await db.query("UPDATE users SET app_data = $1 WHERE id = $2", [JSON.stringify(appData), userId]);

  res.json({
    success: true,
    streakShields: appData.streakShields,
    remainingXp: currentXp - 100
  });
});

const generateReportCard = asyncHandler(async function(req, res) {
  const userId = req.user.id;

  const [userRes, sessionsRes, quizzesRes] = await Promise.all([
    db.query("SELECT name, email, field_of_study, target_career FROM users WHERE id = $1", [userId]),
    db.query("SELECT subject, duration_minutes, session_type, start_time FROM learning_sessions WHERE student_id = $1 ORDER BY start_time DESC LIMIT 15", [userId]),
    db.query("SELECT q.title, qa.score, qa.accuracy_percentage, qa.created_at FROM quiz_attempts qa LEFT JOIN quizzes q ON qa.quiz_id = q.id WHERE qa.student_id = $1 ORDER BY qa.created_at DESC LIMIT 10", [userId])
  ]);

  res.json({
    user: userRes.rows[0],
    sessions: sessionsRes.rows,
    quizzes: quizzesRes.rows
  });
});

module.exports = {
  listUsers,
  updateRole,
  updateStatus,
  getDashboardStats,
  getLeaderboardData,
  updateLeaderboardOptIn,
  getUserGoals,
  createUserGoal,
  toggleGoalStatus,
  purchaseStreakShield,
  generateReportCard
};
