# Stage 1: Artist Resolution - Setup Guide

## 🔑 Required API Keys

### 1. Spotify Web API

**Get Your Credentials:**
1. Go to: https://developer.spotify.com/dashboard
2. Log in with your Spotify account (or create one)
3. Click **"Create app"**
4. Fill in the form:
   - **App name**: Spotify Clone Concert Alert
   - **App description**: Music discovery and concert alerts
   - **Redirect URIs**: http://localhost:3000
   - **APIs used**: Web API
5. Click **"Save"**
6. You'll see your **Client ID**
7. Click **"View client secret"** to get your **Client Secret**

**Add to .env:**
```env
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
```

---

### 2. Concert APIs (OPTIONAL - Skip for Stage 1!)

**You DON'T need this for Stage 1!** Concert APIs are only required for Stage 3 (Concert Aggregation).

**For now**: Just use your existing **Ticketmaster API** (already configured). ✅

**Alternative options for Stage 3:**
- **Songkick** (recommended): https://www.songkick.com/api_key_requests/new
- **Setlist.fm**: https://api.setlist.fm/docs/1.0/index.html  
- **SeatGeek**: https://seatgeek.com/account/develop
- **Or stick with Ticketmaster only** (easiest)

You can decide on this later when we get to Stage 3!

---

### 3. MusicBrainz (No API Key Required!)

MusicBrainz doesn't require an API key, just a User-Agent header.

**Add to .env:**
```env
MUSICBRAINZ_USER_AGENT=SpotifyClone/1.0 (your@email.com)
```

Replace `your@email.com` with your actual email.

---

## 📝 Testing Stage 1

Once you have the API keys, test the new endpoints:

### Test Artist Resolution
```bash
curl "http://localhost:5000/api/artists/resolve?name=Taylor Swift"
```

**Expected Response:**
```json
{
  "mbid": "20244d07-534f-4eff-b4d4-930878889970",
  "spotifyId": "06HL4z0CvFAxyc27GXpf02",
  "name": "Taylor Swift",
  "genres": ["pop", "country"],
  "images": [...],
  "confidence": 100
}
```

### Test Artist Metadata
```bash
curl "http://localhost:5000/api/artists/06HL4z0CvFAxyc27GXpf02/metadata?type=spotify"
```

### Test Artist Albums
```bash
curl "http://localhost:5000/api/artists/06HL4z0CvFAxyc27GXpf02/albums?types=album&limit=10"
```

---

## ✅ What's Working

After Stage 1 completion, you'll have:

- ✅ Artist resolution (name → MBID + Spotify ID)
- ✅ Unified artist metadata (MusicBrainz + Spotify)
- ✅ Album fetching from Spotify
- ✅ Caching system (reduces API calls)
- ✅ Rate limiting (prevents API throttling)
- ✅ Confidence scoring for matches

---

## 🐛 Troubleshooting

**"Spotify API credentials not configured"**
→ Make sure you added SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env

**"Rate limit exceeded"**
→ The cache and rate limiter should prevent this. If it happens, wait 1 minute.

**"Artist not found"**
→ Try a different artist name spelling or check if the artist exists on MusicBrainz/Spotify

---

## 🎯 Next: Stage 2

Once Stage 1 is tested and working:
- Albums will be displayed on artist pages
-  Latest releases feed
- Enhanced artist detail page in frontend

Let me know when you have the API keys and we'll test Stage 1! 🚀
