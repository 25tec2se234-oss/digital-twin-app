const db = require('../src/db');
const leaderboardCron = require('../src/services/leaderboardCron');

async function clean() {
  try {
    console.log('Cleaning any dummy seed data from database...');
    await db.query("DELETE FROM leaderboard_snapshot WHERE session_id LIKE 'community_seed_%'");
    await db.query("DELETE FROM user_activity_log WHERE session_id LIKE 'community_seed_%'");
    console.log('Running authentic cron aggregation on real user logs...');
    await leaderboardCron.runCronJob();
    console.log('Leaderboard is now 100% authentic and clean!');
  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    db.pool.end();
  }
}

clean();
