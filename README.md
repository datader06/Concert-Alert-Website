# Spotify Clone - Complete Setup Guide

This is a complete Spotify-like web application with concert alert features. The system includes a React frontend, Node.js/Express backend, and SQLite local database.

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- Windows Command Prompt or PowerShell

## 🚀 Quick Start

### 1. Initialize the Database

First, create and set up the SQLite database:

```bash
cd backend
node db/initDb.js
```

You should see:
```
Initializing database...
✅ Database initialization complete!
📁 Database file created at: ...
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Set up Backend Environment Variables

Edit `backend/.env` with your API keys:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DATABASE_PATH=./db/spotify_clone.db
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# You can get free API keys from:
# Last.fm: https://www.last.fm/api/account/create
# Ticketmaster: https://developer.ticketmaster.com/
LASTFM_API_KEY=your_api_key
TICKETMASTER_API_KEY=your_api_key
```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

Expected output:
```
╔══════════════════════════════════════════╗
║     🎵 SPOTIFY CLONE BACKEND 🎵         ║
╠══════════════════════════════════════════╣
║ Server running on port: 5000             ║
║ Environment: development                 ║
║ Database: SQLite (local)                 ║
╚══════════════════════════════════════════╝

⏰ Cron jobs initialized
   - Concert alert check: Every 6 hours
   - Cache cleanup: Every day at 2 AM
```

### 5. Install Frontend Dependencies (in a new terminal)

```bash
cd frontend
npm install
```

### 6. Start the Frontend Application

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
spotify-clone/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, error handling
│   │   ├── utils/            # External API calls
│   │   ├── cron/             # Background jobs
│   │   └── server.js         # Express app entry
│   ├── db/
│   │   ├── initDb.js         # Database initialization
│   │   └── spotify_clone.db  # SQLite database (generated)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Full pages
│   │   ├── services/         # API client
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── docs/
    └── API_DOCUMENTATION.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/trending` - Get trending artists
- `GET /api/artists/search?query=name` - Search artists
- `GET /api/artists/:id` - Get artist details
- `GET /api/artists/user/favorites` - Get user's favorite artists (Protected)
- `POST /api/artists/:artistId/favorite` - Add to favorites (Protected)
- `DELETE /api/artists/:artistId/favorite` - Remove from favorites (Protected)

### Concerts
- `GET /api/concerts` - Get upcoming concerts
- `GET /api/concerts/artist/:artistId` - Get specific artist's concerts
- `GET /api/concerts/user/favorites` - Get concerts for favorite artists (Protected)
- `GET /api/concerts/user/near` - Get concerts near user location (Protected)
- `GET /api/concerts/details/:concertId` - Get concert details

### Notifications
- `GET /api/notifications` - Get user notifications (Protected)
- `PUT /api/notifications/:notificationId/read` - Mark notification as read (Protected)
- `PUT /api/notifications/mark-all-read` - Mark all as read (Protected)
- `DELETE /api/notifications/:notificationId` - Delete notification (Protected)

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id - Primary key
  email - User email (unique)
  password - Hashed password
  username - User username (unique)
  city - User's city
  country - User's country
  profile_image - Profile picture URL
  created_at - Account creation timestamp
)
```

### Artists Table
```sql
CREATE TABLE artists (
  id - Primary key
  lastfm_id - Last.fm API ID
  name - Artist name
  genre - Music genre
  bio - Artist biography
  image_url - Artist image
  listener_count - Total listeners
  play_count - Total plays
)
```

### User-Artists Relationship
```sql
CREATE TABLE user_artists (
  id - Primary key
  user_id - Foreign key to users
  artist_id - Foreign key to artists
  followed_at - When artist was followed
)
```

### Listening History
```sql
CREATE TABLE listening_history (
  id - Primary key
  user_id - Foreign key to users
  artist_id - Foreign key to artists
  track_name - Song name
  album_name - Album name
  listened_at - When it was played
)
```

### Concerts Table
```sql
CREATE TABLE concerts (
  id - Primary key
  external_id - External API ID (Ticketmaster/etc)
  artist_id - Foreign key to artists
  event_name - Concert name
  venue_name - Venue name
  city - City
  country - Country
  latitude - Venue latitude
  longitude - Venue longitude
  event_date - Concert date/time
  ticket_url - Ticket booking URL
  source - API source (ticketmaster, songkick)
)
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id - Primary key
  user_id - Foreign key to users
  concert_id - Foreign key to concerts
  type - Notification type
  message - Notification message
  is_read - Read status
  created_at - Creation timestamp
)
```

## 🔐 Authentication Flow

1. User signs up with email/password/username/location
2. Backend hashes password with bcryptjs
3. JWT token returned on login
4. Token stored in browser localStorage
5. Protected routes require Authorization header: `Bearer <token>`
6. Token expires in 7 days

## 🎯 Concert Alert System (Cron Jobs)

### How It Works

1. **Every 6 Hours**: The system checks for new concerts
   - Gets all users with favorite artists
   - Queries Ticketmaster API for upcoming events
   - Creates notifications for matching concerts
   - Avoids duplicate alerts using cache table

2. **Every Day at 2 AM**: Cleanup job runs
   - Removes past concert records
   - Cleans up old cache entries

### Notification Prevention

- `concert_cache` table tracks which concerts users have been notified about
- When a new concert is found, system checks if user already notified
- If not notified, creates notification and adds to cache
- Prevents spam and duplicate alerts

## 🎨 Frontend Features

### Pages
- **Home**: Trending artists and featured artists
- **Discover**: Search and explore artists
- **Concerts**: Browse upcoming concerts worldwide
- **Favorites**: View and manage favorite artists
- **Notifications**: Concert alerts for favorite artists
- **Profile**: User profile and preferences
- **Login/Signup**: Authentication

### UI Elements
- Spotify-like dark theme (dark green accent #1db954)
- Responsive grid layouts
- Artist cards with images and details
- Concert cards with venue and date info
- Notification list with read/unread states
- Search functionality
- Mobile responsive (768px breakpoint)

## 🔧 Development Notes

### Adding a New Page

1. Create file in `frontend/src/pages/NewPage.js`
2. Add route in `frontend/src/App.js`
3. Add navigation link in `components/Sidebar.js`
4. Import and install any new dependencies

### Connecting to External APIs

Backend utilities already created for:
- **Last.fm**: `src/utils/lastfmService.js`
- **Ticketmaster**: `src/utils/ticketmasterService.js`

To add more:
```javascript
// In src/utils/newService.js
const axios = require('axios');

async function fetchData(query) {
  try {
    const response = await axios.get('API_URL', {
      params: { /* your params */ }
    });
    return response.data;
  } catch (error) {
    console.error('API error:', error.message);
    return null;
  }
}

module.exports = { fetchData };
```

## 📊 Sample Data Flow

```
User Actions:
1. User signs up → Data saved to users table
2. User follows artist → Record added to user_artists table
3. User plays songs → Records added to listening_history table
4. Cron job runs → Queries Ticketmaster for concerts
5. New concert found → Notification created in notifications table
6. User receives alert → Frontend displays in notification center
```

## 🚨 Common Issues & Solutions

### Database Already Exists
```bash
# Delete old database and reinitialize
rm backend/db/spotify_clone.db
node backend/db/initDb.js
```

### Port Already in Use
```bash
# Change PORT in backend/.env to different port (e.g., 5001)
# Then update frontend proxy and API url
```

### API Keys Not Working
- Get free Last.fm API key: https://www.last.fm/api
- Get free Ticketmaster API key: https://developer.ticketmaster.com/
- Add to `backend/.env` file

### CORS Errors
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Backend already configured with CORS middleware

## 📈 Scaling Considerations

### Current Setup (Development)
- ✅ SQLite local database (single user)
- ✅ In-memory cron jobs
- ✅ No external cache layer

### For Production
- 🔄 Use PostgreSQL or MongoDB
- 🔄 Add Redis for caching API responses
- 🔄 Use external job queue (Bull, RabbitMQ)
- 🔄 Implement rate limiting
- 🔄 Add logging system (Winston, Morgan)
- 🔄 Use environment-based configuration
- 🔄 Add SSL/TLS certificates

## 📝 Next Steps / Future Features

### MVP Complete ✅
- User authentication
- Artist browsing
- Concert discovery
- Concert alerts (cron job)
- Notification system

### Future Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] AI recommendations based on listening history
- [ ] Email notifications
- [ ] Push notifications (PWA)
- [ ] Social sharing
- [ ] User reviews and ratings
- [ ] Playlist creation
- [ ] Integration with more APIs
- [ ] Mobile app (React Native)
- [ ] Admin dashboard

## 📞 Support & Documentation

For more details:
- Backend API docs: See API endpoints section above
- Frontend components: Check `frontend/src/components/`
- Database queries: See models in `backend/src/models/`

## 📄 License

This is an open-source educational project. Free to use and modify.

---

**Happy Coding! 🚀**
