const db = require('../src/db');
async function run() {
  const res = await db.query("SELECT id, email, subscription_expires_at, EXTRACT(EPOCH FROM (subscription_expires_at - CURRENT_TIMESTAMP))/86400 as days_left FROM users WHERE email = 'kumarkartikey020@gmail.com' OR name ILIKE '%Kumar%'");
  console.table(res.rows);
  db.pool.end();
}
run();
