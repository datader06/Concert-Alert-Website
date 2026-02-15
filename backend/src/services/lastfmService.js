/**
 * Last.fm API Service
 * Provides album data as fallback when Spotify returns empty results
 */

const axios = require('axios');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_URL = process.env.LASTFM_API_URL || 'http://ws.audioscrobbler.com/2.0/';

/**
 * Get top albums for an artist from Last.fm
 * @param {string} artistName - Artist name
 * @param {number} limit - Number of albums to fetch (default: 10)
 * @returns {Promise<Array>} Array of album objects
 */
async function getArtistTopAlbums(artistName, limit = 10) {
    if (!LASTFM_API_KEY) {
        throw new Error('Last.fm API key not configured');
    }

    try {
        const response = await axios.get(LASTFM_API_URL, {
            params: {
                method: 'artist.gettopalbums',
                artist: artistName,
                api_key: LASTFM_API_KEY,
                format: 'json',
                limit: limit
            },
            timeout: 10000
        });

        if (!response.data || !response.data.topalbums || !response.data.topalbums.album) {
            console.log(`[Last.fm] No albums found for ${artistName}`);
            return [];
        }

        const albums = response.data.topalbums.album;

        // Transform Last.fm format to our standard format
        return albums.map(album => ({
            id: album.mbid || `lastfm-${album.name.replace(/\s+/g, '-').toLowerCase()}`,
            spotify_id: null,
            name: album.name,
            artist_name: album.artist?.name || artistName,
            release_date: null, // Last.fm doesn't provide release date in topalbums
            image_url: album.image?.find(img => img.size === 'extralarge')?.['#text'] ||
                album.image?.find(img => img.size === 'large')?.['#text'] || '',
            total_tracks: null,
            source: 'lastfm'
        }));

    } catch (error) {
        console.error(`[Last.fm] Error fetching albums for ${artistName}:`, error.message);
        return [];
    }
}

/**
 * Get album info from Last.fm
 * @param {string} artistName - Artist name
 * @param {string} albumName - Album name
 * @returns {Promise<Object>} Album details
 */
async function getAlbumInfo(artistName, albumName) {
    if (!LASTFM_API_KEY) {
        throw new Error('Last.fm API key not configured');
    }

    try {
        const response = await axios.get(LASTFM_API_URL, {
            params: {
                method: 'album.getinfo',
                artist: artistName,
                album: albumName,
                api_key: LASTFM_API_KEY,
                format: 'json'
            },
            timeout: 10000
        });

        if (!response.data || !response.data.album) {
            return null;
        }

        const album = response.data.album;

        return {
            id: album.mbid || `lastfm-${albumName.replace(/\s+/g, '-').toLowerCase()}`,
            name: album.name,
            artist_name: album.artist,
            release_date: album.wiki?.published || null,
            image_url: album.image?.find(img => img.size === 'extralarge')?.['#text'] || '',
            total_tracks: album.tracks?.track?.length || null,
            source: 'lastfm'
        };

    } catch (error) {
        console.error(`[Last.fm] Error fetching album info:`, error.message);
        return null;
    }
}

module.exports = {
    getArtistTopAlbums,
    getAlbumInfo
};
