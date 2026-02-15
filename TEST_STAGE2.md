# 🧪 How to Test Stage 2: Albums Service

## Quick Test (5 minutes)

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd d:\spotify-clone\spotify-clone\backend
npm start
```

Wait for this message:
```
╔══════════════════════════════════════════╗
║     🎵 SPOTIFY CLONE BACKEND 🎵         ║
║ Server running on port: 5000            ║
╚══════════════════════════════════════════╝
```

### Step 2: Run the Test Script

Open a **NEW terminal** (keep the first one running) and run:

```bash
cd d:\spotify-clone\spotify-clone\backend
node test-stage2.js
```

### Expected Output:

```
🧪 Testing Stage 2: Albums Service Endpoints

============================================================

1️⃣ Testing Artist Resolution
GET /api/artists/resolve?name=Taylor Swift
✅ Status: 200
   Artist: Taylor Swift
   Spotify ID: 06HL4z0CvFAxyc27GXpf02
   MBID: 20244d07-534f-4eff-b4d4-930878889970

2️⃣ Testing Artist Albums
GET /api/artists/06HL4z0CvFAxyc27GXpf02/albums?types=album&limit=5
✅ Status: 200
   Total Albums: 5
   First Album: Midnights
   Release Date: 2022-10-21

3️⃣ Testing Latest Releases
GET /api/artists/06HL4z0CvFAxyc27GXpf02/latest-releases
✅ Status: 200
   Recent Releases: 3
   Latest: Midnights
   Date: 2022-10-21

4️⃣ Testing Album Search
GET /api/albums/search?q=1989&limit=5
✅ Status: 200
   Results Found: 5
   First Result: 1989
   Artist: Taylor Swift

5️⃣ Testing New Releases
GET /api/albums/new-releases?limit=5
✅ Status: 200
   New Releases: 5
   Latest: [Album Name]
   Artist: [Artist Name]

6️⃣ Testing Album Details
GET /api/albums/[albumId]
✅ Status: 200
   Album: 1989
   Tracks: 13
   Label: Big Machine Records

============================================================
✅ All Stage 2 endpoints working correctly!
============================================================

✨ Stage 2 Implementation Complete!
```

---

## Manual Testing (Using Browser or Postman)

If the test script doesn't work, you can test manually:

### 1. Test in Browser

With the backend running, open these URLs in your browser:

**Artist Resolution:**
```
http://localhost:5000/api/artists/resolve?name=Taylor%20Swift
```

**Album Search:**
```
http://localhost:5000/api/albums/search?q=1989&limit=5
```

**New Releases:**
```
http://localhost:5000/api/albums/new-releases?limit=5
```

### 2. Test with PowerShell

```powershell
# Test Album Search
Invoke-RestMethod -Uri "http://localhost:5000/api/albums/search?q=1989&limit=5" | ConvertTo-Json

# Test New Releases
Invoke-RestMethod -Uri "http://localhost:5000/api/albums/new-releases?limit=5" | ConvertTo-Json

# Test Artist Resolution
Invoke-RestMethod -Uri "http://localhost:5000/api/artists/resolve?name=Taylor Swift" | ConvertTo-Json
```

---

## ✅ Success Criteria

Stage 2 is complete if:

- [x] All 6 test endpoints return status 200
- [x] Album search returns real Spotify data
- [x] New releases shows current albums
- [x] Artist albums endpoint works
- [x] Latest releases filters correctly
- [x] No error messages in console

---

## ❌ Troubleshooting

**Problem: "Unable to connect to server"**
- Make sure backend is running on port 5000
- Check if another app is using port 5000

**Problem: "Spotify API error"**
- Verify your `.env` file has valid Spotify credentials
- Check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

**Problem: "Test script not found"**
- Make sure you're in the `backend` directory
- The file is at: `d:\spotify-clone\spotify-clone\backend\test-stage2.js`

---

## 🎯 Quick Verification Checklist

Run these commands one by one:

```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# 2. Test album search
curl "http://localhost:5000/api/albums/search?q=test&limit=1"

# 3. Test new releases
curl "http://localhost:5000/api/albums/new-releases?limit=1"
```

If all three return JSON data (not errors), **Stage 2 is working!** ✅
