const { pool } = require('../db');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

exports.getProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM futureverse_progress WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Return empty/default state if no progress saved yet
            return res.json({
                level: 1,
                xp: 0,
                mastery: 0,
                exploredNodes: [],
                exploredWorlds: [],
                completedChallenges: {},
                stats: { correct: 0, incorrect: 0, consecutiveCorrect: 0 },
                difficultyMultiplier: 1.0,
                hasSeenGuide: false
            });
        }

        const data = result.rows[0];
        res.json({
            level: data.level,
            xp: data.xp,
            mastery: parseFloat(data.mastery),
            exploredNodes: data.explored_nodes || [],
            exploredWorlds: data.explored_worlds || [],
            completedChallenges: data.completed_challenges || {},
            stats: data.stats || { correct: 0, incorrect: 0, consecutiveCorrect: 0 },
            difficultyMultiplier: parseFloat(data.difficulty_multiplier),
            hasSeenGuide: data.has_seen_guide
        });
    } catch (error) {
        logger.error('Error fetching futureverse progress', error);
        next(new ApiError(500, 'Failed to fetch futureverse progress.'));
    }
};

exports.saveProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const {
            level,
            xp,
            mastery,
            exploredNodes,
            exploredWorlds,
            completedChallenges,
            stats,
            difficultyMultiplier,
            hasSeenGuide
        } = req.body;

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

        await pool.query(query, [
            userId,
            level || 1,
            xp || 0,
            mastery || 0.0,
            difficultyMultiplier || 1.0,
            JSON.stringify(stats || { correct: 0, incorrect: 0, consecutiveCorrect: 0 }),
            JSON.stringify(completedChallenges || {}),
            JSON.stringify(exploredWorlds || []),
            JSON.stringify(exploredNodes || []),
            hasSeenGuide || false
        ]);

        res.json({ success: true, message: 'Progress saved successfully.' });
    } catch (error) {
        logger.error('Error saving futureverse progress', error);
        next(new ApiError(500, 'Failed to save futureverse progress.'));
    }
};
