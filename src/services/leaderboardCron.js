const cron = require('node-cron');
const leaderboardModel = require('../models/leaderboardModel');
const logger = require('../config/logger'); // Assuming a logger exists, fallback to console if not

function logInfo(msg) {
  if (logger && logger.info) logger.info(msg);
  else console.log(msg);
}

function logError(msg, err) {
  if (logger && logger.error) logger.error(msg, err);
  else console.error(msg, err);
}

/**
 * Generate a fun guest name based on session id or random number
 */
function generateGuestName(sessionId) {
  const adjectives = ['Curious', 'Brave', 'Smart', 'Quick', 'Keen', 'Eager', 'Clever', 'Bright'];
  const nouns = ['Explorer', 'Learner', 'Student', 'Scholar', 'Thinker', 'Innovator', 'Pioneer'];
  
  // Use session id to pick deterministic but pseudo-random name, or fallback to random
  let hash = 0;
  if (sessionId) {
    for (let i = 0; i < sessionId.length; i++) {
      hash = sessionId.charCodeAt(i) + ((hash << 5) - hash);
    }
  } else {
    hash = Math.floor(Math.random() * 100000);
  }
  
  const adj = adjectives[Math.abs(hash) % adjectives.length];
  const noun = nouns[Math.abs(hash >> 2) % nouns.length];
  const num = Math.abs(hash) % 1000;
  
  return `${adj} ${noun} ${num}`;
}

async function runAggregationForPeriod(period, startDate, endDate) {
  logInfo(`[Leaderboard Cron] Starting aggregation for period: ${period}`);
  try {
    // 1. Get raw aggregated scores from real user activity logs
    const aggregates = await leaderboardModel.aggregateScores(startDate, endDate);
    if (aggregates.length === 0) {
      logInfo(`[Leaderboard Cron] No authentic activity for period ${period}. Clearing snapshot.`);
      await leaderboardModel.clearSnapshot(period);
      return;
    }

    // 2. Collect user IDs to fetch details (Display Name, City)
    const userIds = aggregates.filter(a => a.user_id).map(a => a.user_id);
    const userDetailsMap = await leaderboardModel.getUserDetails(userIds);
    
    // 3. Fetch previous ranks to calculate trend
    const previousRanksMap = await leaderboardModel.getPreviousRanks(period);

    // 4. Construct snapshot objects from real activity logs only
    const snapshots = [];

    for (let i = 0; i < aggregates.length; i++) {
      const agg = aggregates[i];
      const key = agg.user_id ? `user_${agg.user_id}` : `session_${agg.session_id}`;
      const previousRank = previousRanksMap[key] || null;

      let displayName = 'Anonymous';
      let city = null;

      if (agg.user_id && userDetailsMap[agg.user_id]) {
        let fullName = userDetailsMap[agg.user_id].name || 'Student';
        let parts = fullName.split(' ');
        if (parts.length > 1) {
          displayName = `${parts[0]} ${parts[parts.length-1].charAt(0)}.`;
        } else {
          displayName = parts[0];
        }
        city = userDetailsMap[agg.user_id].city;
      } else if (agg.session_id) {
        displayName = generateGuestName(agg.session_id);
      }

      snapshots.push({
        user_id: agg.user_id,
        session_id: agg.session_id,
        period: period,
        score: agg.total_score,
        rank: i + 1,
        previous_rank: previousRank,
        display_name: displayName,
        city: city
      });
    }

    // 5. Bulk Upsert real snapshots
    await leaderboardModel.bulkUpsertSnapshots(snapshots);
    logInfo(`[Leaderboard Cron] Completed aggregation for period: ${period}. Processed ${snapshots.length} real users.`);

  } catch (err) {
    logError(`[Leaderboard Cron] Error aggregating for period: ${period}`, err);
  }
}

async function runCronJob() {
  logInfo('[Leaderboard Cron] Job Triggered.');
  
  // All Time
  await runAggregationForPeriod('all_time', null, null);
  
  // Monthly (Start of current month to now)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  await runAggregationForPeriod('monthly', startOfMonth, null);
  
  // Weekly (Start of current week to now)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0,0,0,0);
  await runAggregationForPeriod('weekly', startOfWeek, null);
}

// Start cron: run every 10 minutes & execute once on startup
function init() {
  logInfo('[Leaderboard Cron] Initializing cron schedule (every 10 minutes).');
  cron.schedule('*/10 * * * *', async () => {
    await runCronJob();
  });
  
  // Run once immediately on startup
  setTimeout(runCronJob, 1500);
}

module.exports = {
  init,
  runCronJob
};
