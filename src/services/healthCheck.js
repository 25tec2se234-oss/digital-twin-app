const { pool } = require('../db');

async function runSecurityHealthCheck() {
    console.log('[SECURITY] Running Premium Access Health Check...');
    try {
        // Find users who have expired trials and subscriptions, but might still have an active token or session
        // In a real-world scenario we could invalidate their tokens or simply log them
        const anomalyRes = await pool.query(`
            SELECT id, email, trial_expires_at, subscription_expires_at
            FROM users
            WHERE (trial_expires_at < CURRENT_DATE AND (subscription_expires_at IS NULL OR subscription_expires_at < CURRENT_DATE))
            AND is_active = true
            LIMIT 10
        `);

        if (anomalyRes.rows.length > 0) {
            console.log(`[SECURITY] Found ${anomalyRes.rows.length} expired users. Subscription Middleware will actively block them from premium routes.`);
        } else {
            console.log('[SECURITY] Health Check Passed: No anomalies found.');
        }
    } catch (err) {
        console.error('[SECURITY] Health Check Failed:', err.message);
    }
}

module.exports = {
    runSecurityHealthCheck
};
