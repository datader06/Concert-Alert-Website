# 🚀 Quick Start Guide - Enhanced Spotify Concert Alert Website

## Prerequisites

Before running the app, ensure you have:
- ✅ Node.js (v14 or higher) installed
- ✅ npm (comes with Node.js)

Check by running:
```bash
node --version
npm --version
```

---

## 🔑 Step 1: Get Free API Keys

### Last.fm API Key
1. Visit: https://www.last.fm/api/account/create
2. Create an account or login
3. Fill out the API form (name: "Spotify Clone", description: "Music app")
4. Copy your **API Key**

### Ticketmaster API Key
1. Visit: https://developer.ticketmaster.com/
2. Create a free account
3. Go to "My Apps" → "Create New App"
4. Copy your **Consumer Key** (this is your API key)

---

## ⚙️ Step 2: Configure Backend

1. Open the backend `.env` file:
   ```
   d:\spotify-clone\spotify-clone\backend\.env
   ```

2. Replace the placeholder values:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   DATABASE_PATH=./db/spotify_clone.db
   API_BASE_URL=http://localhost:5000

   # Replace these with your actual keys:
   LASTFM_API_KEY=YOUR_LASTFM_KEY_HERE
   LASTFM_API_URL=http://ws.audioscrobbler.com/2.0/

   TICKETMASTER_API_KEY=YOUR_TICKETMASTER_KEY_HERE
   TICKETMASTER_API_URL=https://app.ticketmaster.com/discovery/v2

   SONGKICK_API_URL=https://api.songkick.com/api/3.0
   GEONAMES_USERNAME=demo
   ```

3. Save the file

---

## 💾 Step 3: Initialize Database

Open a terminal/command prompt and run:

```bash
cd d:\spotify-clone\spotify-clone\backend
node db/initDb.js
```

You should see:
```
✅ Database initialization complete!
📁 Database file created at: ...
```

---

## 🖥️ Step 4: Start Backend Server

In the same terminal:

```bash
cd d:\spotify-clone\spotify-clone\backend
npm install
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

**Keep this terminal window open!**

---

## 🎨 Step 5: Start Frontend Application

Open a **NEW** terminal window and run:

```bash
cd d:\spotify-clone\spotify-clone\frontend
npm install
npm start
```

The React app will automatically open in your browser at:
```
http://localhost:3000
```

---

## 🎯 Step 6: Test the Application

### 1. Sign Up
- Go to http://localhost:3000 (should redirect to login if not authenticated)
- Click "Sign Up"
- Fill in:
  - Email: `test@example.com`
  - Password: `password123`
  - Username: `musiclover`
  - City: `New York`
  - Country: `USA`
- Click "Sign Up"

### 2. Explore Features

**Home Page:**
- View trending artists
- Notice the smooth card hover animations ✨
- See the glassmorphic navbar

**Discover:**
- Search for artists (e.g., "Taylor Swift", "Drake")
- Add artists to favorites (heart icon)

**Concerts:**
- Browse upcoming concerts
- Filter by favorite artists
- Click "Get Tickets" to visit Ticketmaster

**Notifications:**
- Check for concert alerts (notification bell icon in navbar)
- Badge shows unread count
- Auto-updates every 30 seconds

**Profile:**
- Update your location
- Edit city/country for better concert matching

### 3. Check New Components

**Loading States:**
- Refresh any page and see the animated spinner
- Much better than "Loading..."!

**Empty States:**
- Go to Favorites without adding any artists
- See teh floating icon animation

**Notification Badge:**
- Wait for the cron job to run (every 6 hours)
- Or add favorite artists and check back later
- Red pulsing badge appears when you have alerts

---

## 🎨 What's New - Visual Enhancements

### Hover Over Artist/Concert Cards
- **Lift effect:** Cards rise 12px
- **Scale:** Subtle 1.02x zoom
- **Shadow:** Green-tinted glow
- **Gradient overlay:** Fades in on hover
- **Smooth curve:** Cubic bezier easing

### Navbar
- **Glass effect:** Blurred background
- **Notification bell:** Real-time badge with pulse animation
- **Logo click:** Returns to home page

### Typography
- **Inter font:** Modern, clean Google Font
- Replaces system fonts for professional appearance

---

## 🐛 Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port 5000 already in use"
- Another app is using port 5000
- Change `PORT=5001` in `backend/.env`
- Update frontend proxy if needed

### "Cannot connect to server"
- Make sure backend is running on port 5000
- Check backend terminal for errors
- Verify `.env` file is configured

### "No artists showing up"
- API keys might be missing or invalid
- Check backend terminal for API errors
- Verify Last.fm API key is correct

### "No concerts showing up"
- Ticketmaster API key might be invalid
- Cron job runs every 6 hours (wait or trigger manually)
- Check backend logs for errors

---

## 📱 Test Responsive Design

### Desktop
- Resize browser window
- Cards should reflow smoothly

### Tablet (768px)
- Open DevTools (F12)
- Click device toolbar
- Select iPad
- Check sidebar adapts

### Mobile (375px)
- Select iPhone in DevTools
- Verify cards stack vertically
- Toast notifications span full width
- All text is readable

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can sign up and login
- [ ] Artists load on home page
- [ ] Card hover effects work
- [ ] Navbar is glassmorphic
- [ ] Notification bell appears (when logged in)
- [ ] Can search for artists
- [ ] Can add favorites
- [ ] LoadingSpinner appears when loading
- [ ] EmptyState shows when no data
- [ ] All animations are smooth

---

## 🚀 Next Steps

Once everything is working:

1. **Add Real Artists:**
   - Search for your favorite musicians
   - Add them to favorites

2. **Wait for Alerts:**
   - Cron job runs every 6 hours
   - Check notifications page for concert alerts

3. **Customize:**
   - Adjust colors in `index.css`
   - Change animation timings
   - Add more features

4. **Deploy:**
   - Consider deploying to Vercel (frontend) + Railway (backend)
   - Switch to PostgreSQL for production
   - Add environment variables on hosting platform

---

## 📞 Need Help?

**Common Issues:**
- Database file location: `backend/db/spotify_clone.db`
- Environment file: `backend/.env`
- Frontend port: 3000
- Backend port: 5000

**Check Logs:**
- Backend terminal shows API requests
- Frontend console shows React errors (F12 → Console tab)

---

**Enjoy your premium concert alert website! 🎵✨**
