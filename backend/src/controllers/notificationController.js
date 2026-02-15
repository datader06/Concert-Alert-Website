const Notification = require('../models/Notification');

// Get notifications for user
exports.getNotifications = (req, res) => {
  try {
    const { limit = 50, unread = false } = req.query;

    let notifications;
    if (unread === 'true') {
      notifications = Notification.getUnreadNotifications(req.userId);
    } else {
      notifications = Notification.getUserNotifications(req.userId, parseInt(limit));
    }

    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = (req, res) => {
  try {
    const { notificationId } = req.params;

    const result = Notification.markAsRead(notificationId);

    if (!result) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = (req, res) => {
  try {
    const count = Notification.markAllAsRead(req.userId);
    res.json({ message: `${count} notifications marked as read` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete notification
exports.deleteNotification = (req, res) => {
  try {
    const { notificationId } = req.params;

    const result = Notification.delete(notificationId);

    if (!result) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
