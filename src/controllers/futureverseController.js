const { pool } = require('../db');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');
const aiService = require('../services/aiService');

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

// Public leaderboard — no auth required
exports.getLeaderboard = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.name,
                fp.level,
                fp.mastery,
                fp.stats,
                fp.explored_worlds,
                fp.explored_nodes,
                (fp.level * 5 + fp.mastery * 1.5) AS profile_power,
                fp.updated_at
            FROM futureverse_progress fp
            JOIN users u ON u.id = fp.user_id
            WHERE fp.level > 0
            ORDER BY (fp.level * 5 + fp.mastery * 1.5) DESC
            LIMIT 20
        `);

        const leaderboard = result.rows.map((row, index) => {
            const nameParts = (row.name || 'Explorer').trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts[1] || '';
            const displayName = lastName
                ? `${firstName} ${lastName.charAt(0)}.`
                : firstName;

            return {
                rank: index + 1,
                name: displayName,
                level: row.level,
                mastery: Math.round(parseFloat(row.mastery)),
                profilePower: Math.min(100, Math.round(parseFloat(row.profile_power))),
                worldsExplored: Array.isArray(row.explored_worlds) ? row.explored_worlds.length : 0,
                nodesDecoded: Array.isArray(row.explored_nodes) ? row.explored_nodes.length : 0,
                correctAnswers: (row.stats && row.stats.correct) || 0,
                lastActive: row.updated_at
            };
        });

        res.json({ leaderboard });
    } catch (error) {
        logger.error('Error fetching futureverse leaderboard', error);
        next(new ApiError(500, 'Failed to fetch leaderboard.'));
    }
};

exports.generateNode = async (req, res, next) => {
    try {
        const { worldId, level, exploredTitles } = req.body;
        
        let avoidStr = "";
        if (exploredTitles && exploredTitles.length > 0) {
            avoidStr = `\nCRITICAL: The user has already learned about the following topics:\n[${exploredTitles.join(', ')}]\nDo NOT generate any topic that is similar to these. Generate something completely NEW and UNIQUE.`;
        }

        const systemPrompt = `You are the central AI intelligence of the Digital Twin Futureverse.
Generate a single new procedural deep dive node for the world sector: "${worldId}". The user is currently at Phase ${level || 2}.${avoidStr}
The response MUST be a valid JSON object matching this schema exactly:
{
  "title": "A short, professional sci-fi/tech topic title (max 6 words)",
  "desc": "A brief 1-sentence description.",
  "content": "HTML string containing <h3>, <p>, and possibly <div class='bg-indigo-500/10 p-4 rounded-xl'> blocks. Focus on advanced, futuristic concepts related to the world.",
  "readTime": 4,
  "challenge": {
    "type": "mcq",
    "question": "A situational question based on the content.",
    "options": [
      { "id": "A", "text": "Wrong option 1", "correct": false },
      { "id": "B", "text": "Correct option", "correct": true },
      { "id": "C", "text": "Wrong option 2", "correct": false },
      { "id": "D", "text": "Wrong option 3", "correct": false }
    ],
    "why": "Explanation of why the correct option is right."
  }
}
Do NOT wrap the JSON in Markdown (like \`\`\`json). Return ONLY raw JSON.`;

        const result = await aiService.sendMessages({
            system: systemPrompt,
            messages: [{ role: 'user', content: `Generate a node for ${worldId}.` }],
            max_tokens: 1500
        });

        if (result.error) {
            return res.status(result.status || 500).json({ error: result.error });
        }

        let generatedNode;
        try {
            let aiText = result.data.content[0].text;
            const match = aiText.match(/\{[\s\S]*\}/);
            if (!match) {
                logger.error('No JSON object found in AI response:', aiText);
                throw new Error("No JSON object found");
            }
            generatedNode = JSON.parse(match[0]);
            
            // Add required properties
            generatedNode.id = `${worldId}-proc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
        } catch (e) {
            logger.error('Failed to parse AI procedural node', e);
            return res.status(500).json({ error: 'Failed to generate valid node content.' });
        }

        res.json({ node: generatedNode });
    } catch (error) {
        logger.error('Error generating procedural node', error);
        next(new ApiError(500, 'Failed to generate procedural node.'));
    }
};
