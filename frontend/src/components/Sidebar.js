import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isAuth }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h4 className="section-title">Menu</h4>
          <ul className="menu-list">
            <li>
              <Link to="/" className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/discover" className={`menu-item ${isActive('/discover') ? 'active' : ''}`}>
                🔥 Discover
              </Link>
            </li>
            <li>
              <Link to="/concerts" className={`menu-item ${isActive('/concerts') ? 'active' : ''}`}>
                🎪 Concerts
              </Link>
            </li>
            <li>
              <Link to="/albums" className={`menu-item ${isActive('/albums') ? 'active' : ''}`}>
                📀 Albums
              </Link>
            </li>
          </ul>
        </div>

        {isAuth && (
          <div className="sidebar-section">
            <h4 className="section-title">Your Library</h4>
            <ul className="menu-list">
              <li>
                <Link to="/favorites" className={`menu-item ${isActive('/favorites') ? 'active' : ''}`}>
                  ❤️ Favorite Artists
                </Link>
              </li>
              <li>
                <Link to="/notifications" className={`menu-item ${isActive('/notifications') ? 'active' : ''}`}>
                  🔔 Notifications
                </Link>
              </li>
              <li>
                <Link to="/profile" className={`menu-item ${isActive('/profile') ? 'active' : ''}`}>
                  👤 Profile
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
