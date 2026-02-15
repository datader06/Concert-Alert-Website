/**
 * Spotify Web API Service
 * 
 * Handles OAuth authentication and API calls to Spotify
 * Uses Client Credentials flow (server-to-server)
 */

const axios = require('axios');
const { spotifyTokenCache, albumCache, artistCache } = require('../utils/cache');
const { withRateLimit, spotifyLimiter } = require('../utils/rateLimiter');

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

/**
 * Get Spotify access token (OAuth Client Credentials)
 * Tokens are cached for 55 minutes (they last 1 hour)
 */
async function getAccessToken() {
    const cacheKey = 'spotify:access_token';
    const cached = spotifyTokenCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('Spotify API credentials not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env');
    }

    try {
        const response = await axios.post(
            SPOTIFY_TOKEN_URL,
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                },
                timeout: 10000
            }
        );

        const token = response.data.access_token;
        spotifyTokenCache.set(cacheKey, token);

        console.log('[Spotify] New access token obtained');
        return token;
    } catch (error) {
        console.error('[Spotify] Token error:', error.response?.data || error.message);
        throw new Error('Failed to get Spotify access token');
    }
}

/**
 * Make authenticated request to Spotify API
 */
async function spotifyRequest(endpoint, params = {}) {
    await spotifyLimiter.consume(); // Rate limiting

    const token = await getAccessToken();

    return await withRateLimit('Spotify', async () => {
        const response = await axios.get(`${SPOTIFY_API_URL}${endpoint}`, {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            timeout: 10000
        });
        return response.data;
    });
}

/**
 * Search for an artist on Spotify
 * @param {string} artistName - Artist name to search
 * @param {number} limit - Max results
 * @returns {Promise<Array>} Array of artist matches
 */
async function searchArtist(artistName, limit = 5) {
    const cacheKey = `spotify:search:${artistName.toLowerCase()}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await spotifyRequest('/search', {
            q: artistName,
            type: 'artist',
            limit
        });

        const artists = data.artists.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            genres: artist.genres,
            popularity: artist.popularity,
            followers: artist.followers.total,
            images: artist.images,
            spotifyUrl: artist.external_urls.spotify,
            uri: artist.uri
        }));

        artistCache.set(cacheKey, artists);
        return artists;
    } catch (error) {
        console.error('[Spotify] Search error:', error.message);
        throw error;
    }
}

/**
 * Get artist details by Spotify ID
 * @param {string} spotifyId - Spotify artist ID
 * @returns {Promise<Object>} Artist details
 */
async function getArtist(spotifyId) {
    const cacheKey = `spotify:artist:${spotifyId}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const artist = await spotifyRequest(`/artists/${spotifyId}`);

        const details = {
            id: artist.id,
            name: artist.name,
            genres: artist.genres || [],
            popularity: artist.popularity || 0,
            followers: artist.followers?.total || 0,
            images: artist.images || [],
            spotifyUrl: artist.external_urls?.spotify || ''
        };

        artistCache.set(cacheKey, details);
        return details;
    } catch (error) {
        console.error('[Spotify] Get artist error:', error.message);
        throw error;
    }
}

/**
 * Get artist's albums from Spotify
 * @param {string} spotifyId - Spotify artist ID
 * @param {string} includeGroups - Album types: "album,single,compilation"
 * @param {number} limit - Max albums
 * @returns {Promise<Array>} Array of albums
 */
async function getArtistAlbums(spotifyId, includeGroups = 'album,single', limit = 50) {
    const cacheKey = `spotify:albums:${spotifyId}:${includeGroups}`;
    const cached = albumCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await spotifyRequest(`/artists/${spotifyId}/albums`, {
            include_groups: includeGroups,
            limit,
            market: 'US' // Can be made dynamic based on user location
        });

        const albums = data.items.map(album => ({
            id: album.id,
            name: album.name,
            type: album.album_type,
            releaseDate: album.release_date,
            releaseDatePrecision: album.release_date_precision,
            totalTracks: album.total_tracks,
            images: album.images,
            spotifyUrl: album.external_urls.spotify,
            artists: album.artists.map(a => ({ id: a.id, name: a.name }))
        }));

        // Sort by release date (newest first)
        albums.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

        albumCache.set(cacheKey, albums);
        return albums;
    } catch (error) {
        console.error('[Spotify] Get albums error:', error.message);
        throw error;
    }
}

/**
 * Get album details
 * @param {string} albumId - Spotify album ID
 * @returns {Promise<Object>} Album details
 */
async function getAlbum(albumId) {
    const cacheKey = `spotify:album:${albumId}`;
    const cached = albumCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const album = await spotifyRequest(`/albums/${albumId}`);

        const details = {
            id: album.id,
            name: album.name,
            type: album.album_type,
            releaseDate: album.release_date,
            totalTracks: album.total_tracks,
            images: album.images,
            label: album.label,
            popularity: album.popularity,
            spotifyUrl: album.external_urls.spotify,
            artists: album.artists,
            tracks: album.tracks.items.map(t => ({
                id: t.id,
                name: t.name,
                trackNumber: t.track_number,
                durationMs: t.duration_ms
            }))
        };

        albumCache.set(cacheKey, details);
        return details;
    } catch (error) {
        console.error('[Spotify] Get album error:', error.message);
        throw error;
    }
}

/**
 * Search for albums on Spotify
 * @param {string} query - Album name to search
 * @param {number} limit - Max results
 * @returns {Promise<Array>} Array of album matches
 */
async function searchAlbums(query, limit = 20) {
    const cacheKey = `spotify:search:albums:${query.toLowerCase()}`;
    const cached = albumCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await spotifyRequest('/search', {
            q: query,
            type: 'album',
            limit
        });

        const albums = data.albums.items.map(album => ({
            id: album.id,
            name: album.name,
            type: album.album_type,
            releaseDate: album.release_date,
            releaseDatePrecision: album.release_date_precision,
            totalTracks: album.total_tracks,
            images: album.images,
            spotifyUrl: album.external_urls.spotify,
            artists: album.artists.map(a => ({ id: a.id, name: a.name }))
        }));

        albumCache.set(cacheKey, albums);
        return albums;
    } catch (error) {
        console.error('[Spotify] Album search error:', error.message);
        throw error;
    }
}

/**
 * Get new album releases globally
 * Uses Spotify's Browse API
 * @param {number} limit - Max results
 * @param {number} offset - Pagination offset
 * @param {string} country - Country code (default: US)
 * @returns {Promise<Array>} Array of new releases
 */
async function getNewReleases(limit = 20, offset = 0, country = 'US') {
    const cacheKey = `spotify:new-releases:${country}:${limit}:${offset}`;
    const cached = albumCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await spotifyRequest('/browse/new-releases', {
            limit,
            offset,
            country
        });

        const albums = data.albums.items.map(album => ({
            id: album.id,
            name: album.name,
            type: album.album_type,
            releaseDate: album.release_date,
            releaseDatePrecision: album.release_date_precision,
            totalTracks: album.total_tracks,
            images: album.images,
            spotifyUrl: album.external_urls.spotify,
            artists: album.artists.map(a => ({ id: a.id, name: a.name }))
        }));

        // Cache for 6 hours (new releases don't change frequently)
        albumCache.set(cacheKey, albums);
        return albums;
    } catch (error) {
        console.error('[Spotify] Get new releases error:', error.message);
        throw error;
    }
}

module.exports = {
    getAccessToken,
    searchArtist,
    getArtist,
    getArtistAlbums,
    getAlbum,
    searchAlbums,
    getNewReleases
};
