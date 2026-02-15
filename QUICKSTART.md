# Spotify Clone - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Initialize Database (1 minute)
```bash
cd backend
node db/initDb.js
```

### Step 2: Install & Start Backend (2 minutes)
```bash
npm install
npm start
```

Expected output:
```
🎵 SPOTIFY CLONE BACKEND
Server running on port: 5000
⏰ Cron jobs initialized
```

### Step 3: Install & Start Frontend (2 minutes)
```bash
cd frontend
npm install
npm start
```

App opens at: http://localhost:3000

---

## 🎯 Key Features

✅ **User Authentication**
- Sign up with email/password
- Set location (city/country)
- Login with JWT tokens

✅ **Artist Discovery**
- Browse trending artists
- Search for artists
- View artist profiles

✅ **Concert Alerts** (Main Feature)
- Follow your favorite artists
- Automatic concert notifications
- Get alerts 6-hourly for new events
- Filter concerts by location

✅ **User Dashboard**
- View favorite artists
- Manage notifications
- Update profile

---

## 🗂️ Project Structure

```
spotify-clone/
├── backend/           # Express.js server
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database queries
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, errors
│   │   ├── utils/         # External APIs
│   │   ├── cron/          # Background jobs
│   │   └── server.js      # Entry point
│   ├── db/
│   │   └── initDb.js      # DB initialization
│   └── package.json
│
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Full pages
│   │   ├── services/      # API calls
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # CSS
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── docs/              # Documentation
    ├── ARCHITECTURE.md
    └── API_DOCUMENTATION.md
```

---

## 🔌 API Endpoints Summary

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Artists
- `GET /api/artists` - All artists
- `GET /api/artists/trending` - Trending
- `GET /api/artists/search?query=name` - Search
- `GET /api/artists/:id` - Details
- `POST /api/artists/:id/favorite` - Add favorite
- `DELETE /api/artists/:id/favorite` - Remove favorite
- `GET /api/artists/user/favorites` - My favorites

### Concerts
- `GET /api/concerts` - All concerts
- `GET /api/concerts/artist/:id` - Artist's concerts
- `GET /api/concerts/user/favorites` - Favorite artists' concerts
- `GET /api/concerts/user/near` - Nearby concerts

### Notifications
- `GET /api/notifications` - Get alerts
- `PUT /api/notifications/:id/read` - Mark read
- `DELETE /api/notifications/:id` - Delete

---

## 🎨 Frontend Pages

| Page | Purpose | Auth |
|------|---------|------|
| Login | Authentication | No |
| Signup | Create account | No |
| Home | Trending artists | Yes |
| Discover | Search artists | Yes |
| Concerts | Browse all concerts | Yes |
| Favorites | Your favorite artists | Yes |
| Concerts Alerts | Concert notifications | Yes |
| Profile | User profile settings | Yes |

---

## 🔄 Concert Alert System

**How It Works:**
1. You follow an artist
2. Backend cron job runs every 6 hours
3. System checks for new concerts
4. Creates notification if concert found
5. You get alert in notifications page

**Key Files:**
- `backend/src/cron/concertAlerts.js` - Alert logic
- `backend/src/utils/ticketmasterService.js` - API integration
- `backend/src/models/Notification.js` - Alert storage

---

## 🗄️ Database

**Type:** SQLite (local file)
**Location:** `backend/db/spotify_clone.db`
**Tables:**
- users (login info)
- artists (artist data)
- user_artists (favorites)
- concerts (events)
- notifications (alerts)
- listening_history (tracks)
- concert_cache (prevent duplicates)

**Init Script:** `backend/db/initDb.js`

---

## 🔐 Security

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication (7-day expiry)
- ✅ CORS enabled
- ✅ SQL injection prevention
- ✅ Protected routes
- ⚠️ HTTPS needed for production

---

## 🚀 Production Setup

### Deploy Backend (Example: Heroku)
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create
git push heroku main
```

### Deploy Frontend (Example: Vercel)
```bash
npm install -g vercel
vercel
```

### Use PostgreSQL Instead of SQLite
```bash
npm install pg
# Update config/database.js to use pg
```

---

## 📊 Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios (HTTP client)
- CSS3 (Spotify-like design)

**Backend:**
- Node.js + Express
- Better-SQLite3 (local database)
- JWT (authentication)
- node-cron (scheduled jobs)
- Axios (API calls)

**External APIs:**
- Last.fm (artist metadata)
- Ticketmaster (concert data)

---

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Change it in backend/.env
PORT=5001
```

### "Cannot find module 'better-sqlite3'"
```bash
cd backend
npm install
npm rebuild
```

### "API key not working"
Get free keys:
- Last.fm: https://www.last.fm/api
- Ticketmaster: https://developer.ticketmaster.com

Add to `backend/.env`

### Database locked error
```bash
# Delete and reinitialize
rm backend/db/spotify_clone.db
node backend/db/initDb.js
```

---

## 📈 Next Steps

1. **Get API Keys**
   - Last.fm: https://www.last.fm/api/account/create
   - Ticketmaster: https://developer.ticketmaster.com/

2. **Customize**
   - Update colors in `frontend/src/styles/index.css`
   - Add your branding
   - Modify notification messages

3. **Extend Features**
   - Add email notifications
   - Implement push notifications
   - Add user reviews
   - Create playlists
   - Add social features

4. **Scale Up**
   - Use PostgreSQL
   - Add Redis cache
   - Deploy to cloud
   - Set up monitoring

---

## 📚 Full Documentation

- **Architecture**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Details**: See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
- **Setup**: See [README.md](README.md)

---

## 💡 Pro Tips

### Development
```bash
# Backend with auto-reload
npm run dev

# Frontend in another terminal
npm start
```

### Testing Alerts
- Add artist to favorites
- Check database: sqlite3 backend/db/spotify_clone.db
- Manual cron: Run concertAlerts.js
- View notifications in frontend

### Data Inspection
```bash
# View database
sqlite3 backend/db/spotify_clone.db

# See tables
.tables

# Query users
SELECT * FROM users;

# Exit
.quit
```

---

## 🎓 Learn More

This project teaches:
- ✅ Full-stack web development
- ✅ React state management
- ✅ Express.js REST APIs
- ✅ SQLite databases
- ✅ JWT authentication
- ✅ Scheduled jobs (cron)
- ✅ External API integration
- ✅ Responsive design

---

## 🤝 Contributing

Feel free to:
- Fork the project
- Add new features
- Fix bugs
- Improve documentation
- Submit pull requests

---

## 📞 Need Help?

Check the documentation files:
1. [README.md](README.md) - Full setup guide
2. [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
3. [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - API reference

---

**Happy Coding! 🎵**
