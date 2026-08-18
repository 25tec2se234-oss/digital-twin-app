const { pool } = require('./src/db');

async function run() {
  try {
    const query = `
        INSERT INTO futureverse_progress (
            user_id, level, xp, mastery, difficulty_multiplier, 
            stats, completed_challenges, explored_worlds, explored_nodes, has_seen_guide, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id) DO UPDATE SET
            level = EXCLUDED.level,
            xp = EXCLUDED.xp,
            mastery = EXCLUDED.mastery,
            difficulty_multiplier = EXCLUDED.difficulty_multiplier,
            stats = EXCLUDED.stats,
            completed_challenges = EXCLUDED.completed_challenges,
            explored_worlds = EXCLUDED.explored_worlds,
            explored_nodes = EXCLUDED.explored_nodes,
            has_seen_guide = EXCLUDED.has_seen_guide,
            updated_at = CURRENT_TIMESTAMP;
    `;
    const values = [
        '968ab4fd-89e2-4d41-a751-41f611dad7fa', 1, 0, 0, 1.0, 
        {}, [], [], [], false
    ];
    await pool.query(query, values);
    console.log("Success");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    process.exit(0);
  }
}
run();
