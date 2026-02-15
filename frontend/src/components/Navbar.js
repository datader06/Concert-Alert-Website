import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { authService, notificationService } from '../services/api';

const Navbar = ({ isAuth, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      // Fetch notification count
      const fetchNotifications = async () => {
        try {
          const notifications = await notificationService.getNotifications();
          const unreadCount = notifications.filter(n => !n.is_read).length;
          setNotificationCount(unreadCount);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuth]);

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🎵</span>
          <span className="logo-text">Spotify Clone</span>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search artists, concerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="navbar-right">
          {isAuth ? (
            <>
              <button
                className="notification-btn"
                onClick={handleNotificationClick}
                title="Notifications"
              >
                🔔
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount}</span>
                )}
              </button>
              <div className="user-info">
                <span className="user-name">{user?.username}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn-link">
                Login
              </a>
              <a href="/signup" className="btn-primary">
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
