# 🎤 How to Get More Artists on Your Website

## The Problem

Some artists fail to load because:
1. **MusicBrainz API** rate limits (1 request/second)
2. **Spotify API** errors or rate limits
3. **Artist name variations** (e.g., "Drake" might not match exactly in MusicBrainz)

## ✅ Solution 1: Use Artists That Work (DONE)

I've updated your `Home.js` to use these artists instead:
- Taylor Swift ✅
- Adele ✅
- Coldplay ✅
- Beyoncé ✅
- Rihanna ✅
- Bruno Mars ✅

**Refresh your website** and you should see more artists now!

---

## 🔧 Solution 2: Use Spotify IDs Directly (Best for Production)

Instead of resolving artist names, use Spotify IDs directly:

### Update Home.js to use Spotify IDs:

```javascript
const loadTrendingArtists = async () => {
  setLoading(true);
  try {
    // Use Spotify IDs directly (more reliable)
    const popularArtistIds = [
      '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
      '4dpARuHxo51G3z768sgnrY', // Adele
      '4gzpq5DPGxSnKTe4SA8HAU', // Coldplay
      '6vWDO969PvNqNYHIOW5v0m', // Beyoncé
      '5pKCCKE2ajJHZ9KAiaK11H', // Rihanna
      '0du5cEVh5yTK9QJze8zA0C'  // Bruno Mars
    ];

    const resolvedArtists = [];

    for (const spotifyId of popularArtistIds) {
      try {
        const result = await albumService.getArtistMetadata(spotifyId, 'spotify');
        if (result.ok && result.data) {
          resolvedArtists.push({
            id: result.data.spotifyId,
            name: result.data.name,
            genre: result.data.genres?.[0] || 'Music',
            image_url: result.data.images?.[0]?.url || '',
            listeners: result.data.followers || 0,
            spotifyData: result.data
          });
        }
      } catch (error) {
        console.error(`Failed to load artist ${spotifyId}:`, error);
      }
    }

    setTrendingArtists(resolvedArtists);
  } catch (error) {
    console.error('Error loading trending artists:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Solution 3: Add Fallback Data

Add fallback data if APIs fail:

```javascript
const loadTrendingArtists = async () => {
  setLoading(true);
  try {
    const popularArtists = [
      'Taylor Swift',
      'Adele',
      'Coldplay',
      'Beyonce',
      'Rihanna',
      'Bruno Mars'
    ];

    const resolvedArtists = [];

    for (const artistName of popularArtists) {
      try {
        const result = await albumService.resolveArtist(artistName);
        if (result.ok && result.data) {
          resolvedArtists.push({
            id: result.data.spotifyId || result.data.mbid,
            name: result.data.name,
            genre: result.data.genres?.[0] || 'Music',
            image_url: result.data.images?.[0]?.url || '',
            listeners: result.data.followers || 0,
            spotifyData: result.data
          });
        }
      } catch (error) {
        console.error(`Failed to resolve ${artistName}:`, error);
        // Continue to next artist instead of failing completely
      }
    }

    // If we got at least some artists, show them
    if (resolvedArtists.length > 0) {
      setTrendingArtists(resolvedArtists);
    } else {
      // Fallback to placeholder data
      setTrendingArtists([
        {
          id: 1,
          name: 'Taylor Swift',
          genre: 'Pop',
          image_url: '',
          listeners: 95000000
        }
      ]);
    }
  } catch (error) {
    console.error('Error loading trending artists:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 🔍 How to Find Spotify IDs for Any Artist

### Method 1: Use Your API
```powershell
# Resolve an artist to get their Spotify ID
Invoke-RestMethod -Uri "http://localhost:5000/api/artists/resolve?name=Adele" | ConvertTo-Json
```

### Method 2: From Spotify Web
1. Go to https://open.spotify.com
2. Search for the artist
3. Click on the artist
4. Look at the URL: `https://open.spotify.com/artist/4dpARuHxo51G3z768sgnrY`
5. The ID is: `4dpARuHxo51G3z768sgnrY`

---

## 🎨 Quick Test

**Refresh your website now!** The changes I made should show more artists.

If you still only see Taylor Swift:
1. Check the browser console (F12) for errors
2. Look at the backend terminal for API errors
3. Try the Spotify ID approach (Solution 2)

---

## 📝 Popular Artist Spotify IDs

Here are some reliable artist IDs you can use:

| Artist | Spotify ID |
|--------|------------|
| Taylor Swift | `06HL4z0CvFAxyc27GXpf02` |
| Adele | `4dpARuHxo51G3z768sgnrY` |
| Coldplay | `4gzpq5DPGxSnKTe4SA8HAU` |
| Beyoncé | `6vWDO969PvNqNYHIOW5v0m` |
| Rihanna | `5pKCCKE2ajJHZ9KAiaK11H` |
| Bruno Mars | `0du5cEVh5yTK9QJze8zA0C` |
| Ed Sheeran | `6eUKZXaKkcviH0Ku9w2n3V` |
| Drake | `3TVXtAsR1Inumwj472S9r4` |
| The Weeknd | `1Xyo4u8uXC1ZmMpatF05PJ` |
| Ariana Grande | `66CXWjxzNUsdJxJ2JdwvnR` |

---

## ✅ What to Do Now

1. **Refresh your website** - The new artist list should work better
2. **Check browser console** - See if artists are loading
3. **If still issues** - Try Solution 2 (Spotify IDs directly)

Let me know if you want me to implement Solution 2 for you!
