const axios = require('axios');

// Last.fm API helper
const lastFmApi = axios.create({
  baseURL: process.env.LASTFM_API_URL,
  params: {
    api_key: process.env.LASTFM_API_KEY,
    format: 'json'
  }
});

// Get artist info from Last.fm
async function getArtistInfo(artistName) {
  try {
    const response = await lastFmApi.get('/', {
      params: {
        method: 'artist.getinfo',
        artist: artistName
      }
    });
    
    const artist = response.data.artist;
    return {
      lastfmId: artist.mbid,
      name: artist.name,
      bio: artist.bio?.summary?.replace(/<[^>]*>/g, '') || '',
      imageUrl: artist.image?.[3]?.['#text'] || '',
      listeners: parseInt(artist.stats?.listeners) || 0,
      playCount: parseInt(artist.stats?.playcount) || 0,
      genres: artist.tags?.tag?.map(t => t.name)?.slice(0, 3)?.join(', ') || ''
    };
  } catch (error) {
    console.error('Last.fm API error:', error.message);
    return null;
  }
}

// Search artists on Last.fm
async function searchArtists(query) {
  try {
    const response = await lastFmApi.get('/', {
      params: {
        method: 'artist.search',
        artist: query,
        limit: 10
      }
    });
    
    return response.data.results?.artistmatches?.artist?.map(artist => ({
      lastfmId: artist.mbid,
      name: artist.name,
      imageUrl: artist.image?.[2]?.['#text'] || '',
      listeners: parseInt(artist.listeners) || 0
    })) || [];
  } catch (error) {
    console.error('Last.fm search error:', error.message);
    return [];
  }
}

// Get top artists
async function getTopArtists(limit = 50) {
  try {
    const response = await lastFmApi.get('/', {
      params: {
        method: 'chart.gettopartists',
        limit: limit
      }
    });
    
    return response.data.artists?.artist?.map(artist => ({
      lastfmId: artist.mbid,
      name: artist.name,
      imageUrl: artist.image?.[2]?.['#text'] || '',
      listeners: parseInt(artist.listeners) || 0
    })) || [];
  } catch (error) {
    console.error('Last.fm chart error:', error.message);
    return [];
  }
}

module.exports = {
  getArtistInfo,
  searchArtists,
  getTopArtists
};
