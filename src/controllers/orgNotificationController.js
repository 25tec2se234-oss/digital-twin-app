const OrgNotificationService = require('../services/orgNotificationService');

exports.getMyNotifications = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const notifications = await OrgNotificationService.getNotifications(organizationId, userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { organizationId, notificationId } = req.params;
    const userId = req.user.id;
    const notification = await OrgNotificationService.markAsRead(organizationId, userId, notificationId);
    if (!notification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const prefs = await OrgNotificationService.getPreferences(organizationId, userId);
    res.json({ success: true, data: prefs });
  } catch (error) {
    console.error('Error getting preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch preferences' });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user.id;
    const { preferences } = req.body;
    
    if (!preferences) {
        return res.status(400).json({ success: false, message: 'Preferences object required' });
    }

    const updated = await OrgNotificationService.updatePreferences(organizationId, userId, preferences);
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
};
