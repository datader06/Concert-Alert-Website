/**
 * MusicBrainz API Service
 * 
 * Provides artist resolution using MusicBrainz database
 * Rate limit: 1 request per second (enforced by rate limiter)
 */

const axios = require('axios');
const { artistCache } = require('../utils/cache');
const { withRateLimit, musicBrainzLimiter } = require('../utils/rateLimiter');

const MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2';
const USER_AGENT = process.env.MUSICBRAINZ_USER_AGENT || 'SpotifyClone/1.0 (contact@example.com)';

/**
 * Search for an artist by name in MusicBrainz
 * @param {string} artistName - Artist name to search
 * @param {number} limit - Max results to return
 * @returns {Promise<Array>} Array of artist matches with MBID
 */
async function searchArtist(artistName, limit = 5) {
    const cacheKey = `mb:search:${artistName.toLowerCase()}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    await musicBrainzLimiter.consume(); // Rate limit: 1 req/sec

    try {
        const result = await withRateLimit('MusicBrainz', async () => {
            const response = await axios.get(`${MUSICBRAINZ_API_URL}/artist`, {
                params: {
                    query: `artist:"${artistName}"`,
                    fmt: 'json',
                    limit
                },
                headers: {
                    'User-Agent': USER_AGENT
                },
                timeout: 5000
            });
            return response.data;
        });

        const artists = result.artists || [];
        const matches = artists.map(artist => ({
            mbid: artist.id,
            name: artist.name,
            sortName: artist['sort-name'],
            type: artist.type,
            country: artist.country,
            disambiguation: artist.disambiguation,
            score: artist.score, // Match confidence (0-100)
            aliases: artist.aliases?.map(a => a.name) || []
        }));

        // Cache for 1 hour
        artistCache.set(cacheKey, matches);

        return matches;
    } catch (error) {
        console.error('[MusicBrainz] Search error:', error.message);
        throw new Error(`MusicBrainz search failed: ${error.message}`);
    }
}

/**
 * Get artist details by MBID
 * @param {string} mbid - MusicBrainz ID
 * @returns {Promise<Object>} Artist details
 */
async function getArtistByMBID(mbid) {
    const cacheKey = `mb:artist:${mbid}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    await musicBrainzLimiter.consume();

    try {
        const result = await withRateLimit('MusicBrainz', async () => {
            const response = await axios.get(`${MUSICBRAINZ_API_URL}/artist/${mbid}`, {
                params: {
                    fmt: 'json',
                    inc: 'aliases+tags+ratings+genres'
                },
                headers: {
                    'User-Agent': USER_AGENT
                },
                timeout: 5000
            });
            return response.data;
        });

        const artistDetails = {
            mbid: result.id,
            name: result.name,
            sortName: result['sort-name'],
            type: result.type,
            country: result.country,
            lifeSpan: result['life-span'],
            disambiguation: result.disambiguation,
            aliases: result.aliases?.map(a => a.name) || [],
            tags: result.tags?.map(t => t.name) || [],
            genres: result.genres?.map(g => g.name) || []
        };

        artistCache.set(cacheKey, artistDetails);
        return artistDetails;
    } catch (error) {
        console.error('[MusicBrainz] Get artist error:', error.message);
        throw new Error(`Failed to get artist from MusicBrainz: ${error.message}`);
    }
}

/**
 * Find best matching artist with confidence scoring
 * @param {string} artistName - Artist name to match
 * @returns {Promise<Object|null>} Best match or null
 */
async function findBestMatch(artistName) {
    try {
        const matches = await searchArtist(artistName, 5);

        if (matches.length === 0) {
            return null;
        }

        // Sort by score (higher = better match)
        matches.sort((a, b) => b.score - a.score);

        // Return highest scoring match with confidence >= 80
        const bestMatch = matches[0];
        if (bestMatch.score >= 80) {
            return bestMatch;
        }

        // If score is lower, try exact name match
        const exactMatch = matches.find(m =>
            m.name.toLowerCase() === artistName.toLowerCase()
        );

        return exactMatch || bestMatch;
    } catch (error) {
        console.error('[MusicBrainz] Best match error:', error.message);
        return null;
    }
}

module.exports = {
    searchArtist,
    getArtistByMBID,
    findBestMatch
};
