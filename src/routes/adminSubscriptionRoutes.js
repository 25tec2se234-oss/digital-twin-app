const express = require('express');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { pool } = require('../db');

const router = express.Router();

router.use(authenticate);
router.use(authorizeAdmin);

// Grant or Extend Subscription
router.post('/grant', async (req, res) => {
    try {
        const { userId, days } = req.body;
        if (!userId || !days) {
            return res.status(400).json({ error: 'Missing userId or days' });
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));

        await pool.query(
            'UPDATE users SET subscription_expires_at = $1 WHERE id = $2',
            [expiresAt, userId]
        );

        await pool.query(
            'INSERT INTO audit_logs (user_id, action, target_resource, request_payload, ip_address) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, 'ADMIN_GRANT_SUBSCRIPTION', \`User \${userId}\`, JSON.stringify({ days }), req.ip]
        );

        res.json({ success: true, message: \`Subscription extended by \${days} days.\`, expiresAt });
    } catch (error) {
        console.error('Error granting subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Revoke Subscription
router.post('/revoke', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const now = new Date();
        // Set it to yesterday to expire immediately
        now.setDate(now.getDate() - 1);

        await pool.query(
            'UPDATE users SET subscription_expires_at = $1, trial_expires_at = $1 WHERE id = $2',
            [now, userId]
        );

        await pool.query(
            'INSERT INTO audit_logs (user_id, action, target_resource, request_payload, ip_address) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, 'ADMIN_REVOKE_SUBSCRIPTION', \`User \${userId}\`, '{}', req.ip]
        );

        res.json({ success: true, message: 'Subscription revoked immediately.' });
    } catch (error) {
        console.error('Error revoking subscription:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
