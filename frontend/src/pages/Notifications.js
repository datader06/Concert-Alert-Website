import React, { useState, useEffect } from 'react';
import '../styles/Pages.css';
import { notificationService } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const result = await notificationService.getNotifications(50, false);
      if (result.ok && result.data) {
        setNotifications(result.data);
      } else {
        // Fallback to placeholder if API fails
        setNotifications([
          {
            id: 1,
            artist_name: 'The Weeknd',
            event_name: 'After Hours Tour - NYC',
            event_date: new Date().toISOString(),
            message: 'The Weeknd is performing at Madison Square Garden!',
            is_read: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-page">
      <h1>🔔 Concert Alerts</h1>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <p>No concert alerts yet</p>
          <p className="hint">Follow your favorite artists to get alerts about their concerts!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h3>{notif.artist_name}</h3>
                <p>{notif.message}</p>
                <small>{new Date(notif.event_date).toLocaleDateString()}</small>
              </div>
              <div className="notification-actions">
                {!notif.is_read && (
                  <button
                    className="btn-read"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    ✓
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(notif.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
