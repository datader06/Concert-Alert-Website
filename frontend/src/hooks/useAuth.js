import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const isAuthenticated = !!user && !!localStorage.getItem('token');

  return { user, isAuthenticated, loading };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async (unreadOnly = false) => {
    setLoading(true);
    try {
      // Will implement when notifications service is working
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
    setLoading(false);
  };

  return { notifications, unreadCount, loading, loadNotifications };
};

export const useArtistSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Will implement when artist search service is working
      setResults([]);
    } catch (error) {
      console.error('Error searching artists:', error);
    }
    setLoading(false);
  };

  return { results, loading, search };
};
