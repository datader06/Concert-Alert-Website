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
          const result = await notificationService.getNotifications();

          // Ensure we have valid data and it's an array
          if (result && result.ok && result.data) {
            const notifications = Array.isArray(result.data) ? result.data : [];
            const unreadCount = notifications.filter(n => !n.is_read).length;
            setNotificationCount(unreadCount);
          } else {
            // No valid notifications
            setNotificationCount(0);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotificationCount(0); // Reset count on error
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">Pulse</span>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search artists, tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate('/discover', { state: { searchQuery } });
              }
            }}
          />
        </div>

        <div className="navbar-right">
          {isAuth ? (
            <>
              <button
                className="notification-btn"
                onClick={() => navigate('/notifications')}
                title="Notifications"
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', position: 'relative' }}
              >
                🔔
                {notificationCount > 0 && (
                  <span className="notification-badge" style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    background: 'var(--secondary)', color: 'white',
                    fontSize: '0.7rem', padding: '2px 5px', borderRadius: '50%'
                  }}>
                    {notificationCount}
                  </span>
                )}
              </button>

              <div className="user-profile-pill" style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)',
                borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ width: '30px', height: '30px', background: 'var(--gradient-main)', borderRadius: '50%' }}></div>
                <span className="user-name">{user?.username || 'User'}</span>
              </div>

              <button className="btn-logout" onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem'
              }}>
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => navigate('/login')} className="btn-link" style={{ color: 'white' }}>Login</button>
              <button onClick={() => navigate('/signup')} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
