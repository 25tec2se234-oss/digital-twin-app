const cron = require('node-cron');
const db = require('../db');
const emailService = require('./emailService');

// Run daily at midnight server time
function initSubscriptionCron() {
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running daily subscription & trial expiry check...');
        try {
            // 1. Notify users whose demo/trial is ending in exactly 1 day
            const endingSoonRes = await db.query(`
                SELECT id, email, name, trial_expires_at 
                FROM users 
                WHERE trial_expires_at::date = (CURRENT_DATE + interval '1 day')::date
                AND subscription_expires_at IS NULL
                AND is_active = true
            `);

            for (const user of endingSoonRes.rows) {
                const expiryStr = new Date(user.trial_expires_at).toLocaleDateString();
                await emailService.sendDemoEndingSoonEmail(user.email, user.name, expiryStr);
                
                // Add in-app notification
                await db.query(`
                    INSERT INTO notifications (user_id, title, message, type) 
                    VALUES ($1, $2, $3, $4)
                `, [user.id, 'Demo Ending Soon', `Your Premium Demo expires on ${expiryStr}. Renew now to keep access.`, 'Alert']).catch(() => {});
            }

            // 2. Notify users whose trial/subscription just expired today
            const justExpiredRes = await db.query(`
                SELECT id, email, name 
                FROM users 
                WHERE (
                    (trial_expires_at::date = CURRENT_DATE AND subscription_expires_at IS NULL)
                    OR
                    (subscription_expires_at::date = CURRENT_DATE)
                )
                AND is_active = true
            `);

            for (const user of justExpiredRes.rows) {
                await emailService.sendSubscriptionExpiredEmail(user.email, user.name);
                
                // Add in-app notification
                await db.query(`
                    INSERT INTO notifications (user_id, title, message, type) 
                    VALUES ($1, $2, $3, $4)
                `, [user.id, 'Subscription Expired', 'Your Premium Access has expired. Please upgrade your plan.', 'Alert']).catch(() => {});
            }

            console.log(`[CRON] Processed ${endingSoonRes.rows.length} expiring soon, and ${justExpiredRes.rows.length} just expired.`);
        } catch (error) {
            console.error('[CRON] Error during subscription check:', error);
        }
    });
}

module.exports = {
    initSubscriptionCron
};
