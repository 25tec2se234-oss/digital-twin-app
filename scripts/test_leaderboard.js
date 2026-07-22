const { trackActivity, aggregateScores, bulkUpsertSnapshots } = require('../src/models/leaderboardModel');
const cron = require('../src/services/leaderboardCron');
const db = require('../src/db');

async function run() {
  try {
    console.log('Testing Leaderboard tracking...');
    
    // Simulate guest action
    const sessionId = 'guest-session-123';
    await trackActivity(null, sessionId, 'daily_login');
    await trackActivity(null, sessionId, 'simulation_complete');

    // Simulate logged in user action
    const res = await db.query('SELECT id FROM users LIMIT 1');
    if (res.rows.length > 0) {
      const userId = res.rows[0].id;
      await trackActivity(userId, null, 'assessment_complete');
      console.log('Added points for user ' + userId);
    }
    
    console.log('Running cron aggregation...');
    await cron.runCronJob();

    console.log('Done!');
  } catch(e) {
    console.error(e);
  } finally {
    db.pool.end();
  }
}

run();
