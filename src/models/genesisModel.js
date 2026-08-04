const db = require('../db');
const logger = require('../config/logger');

// In-Memory Fallback Cache to guarantee ZERO downtime/errors even if DB re-connects
const memoryTwinStore = new Map();

// Helper to generate formatted Digital Twin ID
function generateTwinId() {
    const num = Math.floor(1000 + Math.random() * 9000);
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `DTV-GEN-${num}-${suffix}`;
}

// Auto-Ensure PostgreSQL Table Exists
let isTableInitialized = false;

async function ensureTableExists() {
    if (isTableInitialized) return;
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS genesis_twins (
                id SERIAL PRIMARY KEY,
                twin_id VARCHAR(64) UNIQUE NOT NULL,
                session_id VARCHAR(128) NOT NULL,
                user_id INTEGER,
                archetype VARCHAR(128) DEFAULT 'The Creative Architect',
                confidence NUMERIC(5,2) DEFAULT 94.8,
                scores JSONB DEFAULT '{"logic": 80, "creativity": 75, "velocity": 85, "domain": 70, "grit": 82}'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_genesis_twins_session_id ON genesis_twins(session_id);
            CREATE INDEX IF NOT EXISTS idx_genesis_twins_twin_id ON genesis_twins(twin_id);
        `);
        isTableInitialized = true;
        logger.info('Genesis Twins PostgreSQL table verified successfully.');
    } catch (err) {
        logger.error('Database query error in Genesis ensureTableExists (using memory fallback):', err.message);
    }
}

/**
 * Retrieve or Create a Persistent Digital Twin for a Student
 */
async function getOrCreateTwin(sessionId, userId = null) {
    await ensureTableExists();

    // 1. Try DB lookup first
    if (isTableInitialized) {
        try {
            let res;
            if (userId) {
                res = await db.query('SELECT * FROM genesis_twins WHERE user_id = $1 ORDER BY id DESC LIMIT 1', [userId]);
            } else if (sessionId) {
                res = await db.query('SELECT * FROM genesis_twins WHERE session_id = $1 ORDER BY id DESC LIMIT 1', [sessionId]);
            }

            if (res && res.rows.length > 0) {
                const row = res.rows[0];
                return {
                    twinId: row.twin_id,
                    sessionId: row.session_id,
                    userId: row.user_id,
                    archetype: row.archetype,
                    confidence: parseFloat(row.confidence),
                    scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            }

            // Create new persistent twin in DB
            const newTwinId = generateTwinId();
            const defaultScores = { logic: 80, creativity: 75, velocity: 85, domain: 70, grit: 82 };
            const defaultArchetype = 'The Creative Architect';
            const defaultConfidence = 94.8;

            const insertRes = await db.query(
                `INSERT INTO genesis_twins (twin_id, session_id, user_id, archetype, confidence, scores)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [newTwinId, sessionId, userId, defaultArchetype, defaultConfidence, JSON.stringify(defaultScores)]
            );

            const row = insertRes.rows[0];
            return {
                twinId: row.twin_id,
                sessionId: row.session_id,
                userId: row.user_id,
                archetype: row.archetype,
                confidence: parseFloat(row.confidence),
                scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            };
        } catch (err) {
            logger.error('Error in Genesis getOrCreateTwin DB query (falling back to memory):', err.message);
        }
    }

    // 2. Memory Fallback if DB is unreachable
    const key = userId ? `user_${userId}` : `sess_${sessionId}`;
    if (memoryTwinStore.has(key)) {
        return memoryTwinStore.get(key);
    }

    const memoryTwin = {
        twinId: generateTwinId(),
        sessionId: sessionId,
        userId: userId,
        archetype: 'The Creative Architect',
        confidence: 94.8,
        scores: { logic: 80, creativity: 75, velocity: 85, domain: 70, grit: 82 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    memoryTwinStore.set(key, memoryTwin);
    return memoryTwin;
}

/**
 * Update 5-Axis Capability Vector & Archetype Calibration
 */
async function updateCalibration(sessionId, twinId, scores, archetype, confidence, userId = null) {
    await ensureTableExists();

    const finalArchetype = archetype || 'The Creative Architect';
    const finalConfidence = confidence ? parseFloat(confidence) : 94.8;

    if (isTableInitialized) {
        try {
            const res = await db.query(
                `UPDATE genesis_twins 
                 SET scores = $1, archetype = COALESCE($2, archetype), confidence = COALESCE($3, confidence), updated_at = NOW()
                 WHERE twin_id = $4 OR session_id = $5 OR (user_id IS NOT NULL AND user_id = $6)
                 RETURNING *`,
                [JSON.stringify(scores), finalArchetype, finalConfidence, twinId, sessionId, userId]
            );

            if (res.rows.length > 0) {
                const row = res.rows[0];
                return {
                    twinId: row.twin_id,
                    sessionId: row.session_id,
                    userId: row.user_id,
                    archetype: row.archetype,
                    confidence: parseFloat(row.confidence),
                    scores: typeof row.scores === 'string' ? JSON.parse(row.scores) : row.scores,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            }
        } catch (err) {
            logger.error('Error updating Genesis calibration in DB:', err.message);
        }
    }

    // Memory Fallback update
    const key = userId ? `user_${userId}` : `sess_${sessionId}`;
    const existing = memoryTwinStore.get(key) || {
        twinId: twinId || generateTwinId(),
        sessionId,
        userId
    };

    const updated = {
        ...existing,
        scores,
        archetype: finalArchetype,
        confidence: finalConfidence,
        updatedAt: new Date().toISOString()
    };
    memoryTwinStore.set(key, updated);
    return updated;
}

module.exports = {
    getOrCreateTwin,
    updateCalibration,
    generateTwinId
};
