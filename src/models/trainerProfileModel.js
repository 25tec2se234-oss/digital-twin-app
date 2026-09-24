const { pool } = require('../db');

async function upsertTrainerProfile(userId, profileData) {
  const { title, expertise, experienceYears, bio, qualifications, certifications } = profileData;
  const result = await pool.query(
    `INSERT INTO trainer_profiles (user_id, title, expertise, experience_years, bio, qualifications, certifications)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) 
     DO UPDATE SET 
        title = EXCLUDED.title,
        expertise = EXCLUDED.expertise,
        experience_years = EXCLUDED.experience_years,
        bio = EXCLUDED.bio,
        qualifications = EXCLUDED.qualifications,
        certifications = EXCLUDED.certifications,
        updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      userId, 
      title, 
      JSON.stringify(expertise || []), 
      experienceYears || 0, 
      bio, 
      JSON.stringify(qualifications || []), 
      JSON.stringify(certifications || [])
    ]
  );
  return result.rows[0];
}

async function getTrainerProfile(userId) {
  const result = await pool.query('SELECT * FROM trainer_profiles WHERE user_id = $1', [userId]);
  return result.rows[0];
}

module.exports = {
  upsertTrainerProfile,
  getTrainerProfile
};
