const { pool } = require('../db');

async function upsertTraineeProfile(userId, profileData) {
  const { learningGoals, skills } = profileData;
  const result = await pool.query(
    `INSERT INTO trainee_profiles (user_id, learning_goals, skills)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) 
     DO UPDATE SET 
        learning_goals = EXCLUDED.learning_goals,
        skills = EXCLUDED.skills,
        updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      userId, 
      JSON.stringify(learningGoals || []), 
      JSON.stringify(skills || [])
    ]
  );
  return result.rows[0];
}

async function getTraineeProfile(userId) {
  const result = await pool.query('SELECT * FROM trainee_profiles WHERE user_id = $1', [userId]);
  return result.rows[0];
}

module.exports = {
  upsertTraineeProfile,
  getTraineeProfile
};
