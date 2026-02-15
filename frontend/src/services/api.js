const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getHeaders = (includeAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }
  return headers;
};

// Auth Service
export const authService = {
  signup: async (email, password, username, city, country) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password, username, city, country })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { ok: true, data };
      } else {
        return { ok: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { ok: false, error: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { ok: true, data };
      } else {
        return { ok: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { ok: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  },

  updateProfile: async (city, country, profile_image) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ city, country, profile_image })
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
};

// Artist Service
export const artistService = {
  getAllArtists: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists`);
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching artists:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getTrendingArtists: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/trending`);
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching trending:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  searchArtists: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return { ok: response.ok, data: data.artists || [] };
    } catch (error) {
      console.error('Error searching artists:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getArtist: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${id}`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching artist:', error);
      return { ok: false, error: error.message };
    }
  },

  getUserFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/user/favorites`, {
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  addFavorite: async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}/favorite`, {
        method: 'POST',
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error adding favorite:', error);
      return { ok: false, error: error.message };
    }
  },

  removeFavorite: async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}/favorite`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { ok: false, error: error.message };
    }
  },

  // NEW: Get artist metadata (Spotify + MusicBrainz)
  getArtistMetadata: async (artistId, source = 'spotify') => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}/metadata?source=${source}`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching artist metadata:', error);
      return { ok: false, error: error.message };
    }
  },

  // NEW: Get artist albums
  getArtistAlbums: async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}/albums`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching artist albums:', error);
      return { ok: false, error: error.message };
    }
  },

  // NEW: Get latest releases
  getLatestReleases: async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}/latest-releases`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching latest releases:', error);
      return { ok: false, error: error.message };
    }
  }
};

// Concert Service
export const concertService = {
  getUpcomingConcerts: async (limit = 50) => {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts?limit=${limit}`);
      const data = await response.json();
      // API returns {concerts: [...], count: N}
      const concerts = data.concerts || data;
      return { ok: response.ok, data: Array.isArray(concerts) ? concerts : [] };
    } catch (error) {
      console.error('Error fetching concerts:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getArtistConcerts: async (artistId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts/artist/${artistId}`);
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching artist concerts:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getFavoriteArtistsConcerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts/user/favorites`, {
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching favorite concerts:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getConcertsNearUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts/user/near`, {
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching nearby concerts:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getConcertDetails: async (concertId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/concerts/details/${concertId}`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching concert details:', error);
      return { ok: false, error: error.message };
    }
  }
};

// Notification Service
export const notificationService = {
  getNotifications: async (limit = 50, unread = false) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications?limit=${limit}&unread=${unread}`,
        { headers: getHeaders(true) }
      );
      const data = await response.json();
      return { ok: response.ok, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        { method: 'PUT', headers: getHeaders(true) }
      );
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { ok: false, error: error.message };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { ok: false, error: error.message };
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getHeaders(true)
      });
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { ok: false, error: error.message };
    }
  }
};

// NEW: Album Service (Stage 2)
export const albumService = {
  getAlbum: async (albumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums/${albumId}`);
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching album:', error);
      return { ok: false, error: error.message };
    }
  },

  getArtistAlbums: async (artistId, types = 'album,single', limit = 50) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/artists/${artistId}/albums?types=${types}&limit=${limit}`
      );
      const data = await response.json();
      return { ok: response.ok, data: data.albums || [] };
    } catch (error) {
      console.error('Error fetching artist albums:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  getLatestReleases: async (artistId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/artists/${artistId}/latest-releases`
      );
      const data = await response.json();
      return { ok: response.ok, data: data.releases || [] };
    } catch (error) {
      console.error('Error fetching latest releases:', error);
      return { ok: false, data: [], error: error.message };
    }
  },

  resolveArtist: async (artistName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/artists/resolve?name=${encodeURIComponent(artistName)}`
      );
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error resolving artist:', error);
      return { ok: false, error: error.message };
    }
  },

  getArtistMetadata: async (artistId, type = 'spotify') => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/artists/${artistId}/metadata?type=${type}`
      );
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error('Error fetching artist metadata:', error);
      return { ok: false, error: error.message };
    }
  }
};

