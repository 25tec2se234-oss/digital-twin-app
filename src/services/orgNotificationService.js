const { pool } = require('../db');

class OrgNotificationService {
  /**
   * Publishes a new in-app notification.
   * @param {string} idempotencyKey A unique string for this specific event to prevent duplicates.
   */
  static async publishNotification(organizationId, userId, type, priority, title, message, actionUrl, idempotencyKey) {
    try {
      // 1. Check Preferences
      const prefQuery = `SELECT preferences FROM org_notification_preferences WHERE organization_id = $1 AND user_id = $2`;
      const prefRes = await pool.query(prefQuery, [organizationId, userId]);
      
      let inAppEnabled = true;
      if (prefRes.rows.length > 0) {
        const prefs = prefRes.rows[0].preferences;
        if (prefs && prefs.in_app === false) {
            inAppEnabled = false;
        }
      }

      if (!inAppEnabled && priority !== 'CRITICAL') {
          // We respect opt-out unless it's a critical mandatory alert
          return null;
      }

      // 2. Insert Notification
      const insertQuery = `
        INSERT INTO org_notifications 
          (organization_id, user_id, type, priority, title, message, action_url, idempotency_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (idempotency_key) DO NOTHING
        RETURNING *
      `;
      const res = await pool.query(insertQuery, [
        organizationId, userId, type, priority, title, message, actionUrl, idempotencyKey
      ]);

      return res.rows[0] || null;
    } catch (error) {
      console.error('Failed to publish notification:', error);
      throw error;
    }
  }

  static async getNotifications(organizationId, userId, limit = 50) {
    const query = `
      SELECT * FROM org_notifications 
      WHERE organization_id = $1 AND user_id = $2
      ORDER BY created_at DESC
      LIMIT $3
    `;
    const res = await pool.query(query, [organizationId, userId, limit]);
    return res.rows;
  }

  static async markAsRead(organizationId, userId, notificationId) {
    const query = `
      UPDATE org_notifications 
      SET is_read = true 
      WHERE organization_id = $1 AND user_id = $2 AND id = $3
      RETURNING *
    `;
    const res = await pool.query(query, [organizationId, userId, notificationId]);
    return res.rows[0];
  }

  static async getPreferences(organizationId, userId) {
      const query = `SELECT preferences FROM org_notification_preferences WHERE organization_id = $1 AND user_id = $2`;
      const res = await pool.query(query, [organizationId, userId]);
      if (res.rows.length === 0) {
          return { email: true, in_app: true };
      }
      return res.rows[0].preferences;
  }

  static async updatePreferences(organizationId, userId, preferences) {
      const query = `
        INSERT INTO org_notification_preferences (organization_id, user_id, preferences)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, organization_id) 
        DO UPDATE SET preferences = $3
        RETURNING preferences
      `;
      const res = await pool.query(query, [organizationId, userId, preferences]);
      return res.rows[0].preferences;
  }
}

module.exports = OrgNotificationService;
