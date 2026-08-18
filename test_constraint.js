const { pool } = require('./src/db');

async function run() {
  try {
    const res = await pool.query("SELECT constraint_name, constraint_type FROM information_schema.table_constraints WHERE table_name = 'futureverse_progress'");
    console.log(res.rows);
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
run();
