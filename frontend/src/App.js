import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';

// Pages
import Home from './pages/Home';
import ArtistDetail from './pages/ArtistDetail';
import Discover from './pages/Discover';
import Concerts from './pages/Concerts';
import Albums from './pages/Albums';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Context
import { ToastProvider } from './context/ToastContext';

// Hooks
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setAuthState(true);
  };

  const handleLogout = () => {
    setAuthState(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#121212',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        {authState ? (
          <>
            <Navbar
              isAuth={authState}
              user={user}
              onLogout={handleLogout}
            />
            <div className="app-container">
              <Sidebar
                isAuth={authState}
              />
              <main className="main-content">
                <Breadcrumbs />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/artist/:id" element={<ArtistDetail />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/concerts" element={<Concerts />} />
                  <Route path="/albums" element={<Albums />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile user={user} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup onSignupSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </ToastProvider>
  );
}

export default App;
