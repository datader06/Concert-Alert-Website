/**
 * Album Controller
 * Handles album-related endpoints using Spotify API
 */

const spotifyService = require('../services/spotifyService');

/**
 * GET /api/albums/:id
 * Get detailed album information
 */
const getAlbum = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Album ID is required' });
        }

        const album = await spotifyService.getAlbum(id);
        res.json(album);

    } catch (error) {
        console.error('Error in getAlbum:', error);
        res.status(500).json({
            error: 'Failed to fetch album details',
            message: error.message
        });
    }
};

/**
 * GET /api/albums/new-releases
 * Get new releases globally from Spotify
 * 
 * Query params:
 * - limit: Max results (default: 20, max: 50)
 * - offset: Pagination offset (default: 0)
 * - country: Country code (default: US)
 * 
 * Example: /api/albums/new-releases?limit=20&country=US
 */
const getNewReleases = async (req, res) => {
    try {
        const { limit = 20, offset = 0, country = 'US' } = req.query;

        // Validate limit
        const parsedLimit = Math.min(parseInt(limit), 50);
        const parsedOffset = parseInt(offset);

        const releases = await spotifyService.getNewReleases(
            parsedLimit,
            parsedOffset,
            country
        );

        res.json({
            total: releases.length,
            limit: parsedLimit,
            offset: parsedOffset,
            country,
            releases
        });

    } catch (error) {
        console.error('Error in getNewReleases:', error);
        res.status(500).json({
            error: 'Failed to fetch new releases',
            message: error.message
        });
    }
};

/**
 * GET /api/albums/search
 * Search for albums by name using Spotify
 * 
 * Query params:
 * - q: Search query (required)
 * - limit: Max results (default: 20)
 * 
 * Example: /api/albums/search?q=1989&limit=10
 */
const searchAlbums = async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({
                error: 'Query parameter "q" is required',
                example: '/api/albums/search?q=1989'
            });
        }

        const parsedLimit = Math.min(parseInt(limit), 50);
        const albums = await spotifyService.searchAlbums(q, parsedLimit);

        res.json({
            query: q,
            total: albums.length,
            albums
        });

    } catch (error) {
        console.error('Error in searchAlbums:', error);
        res.status(500).json({
            error: 'Failed to search albums',
            message: error.message
        });
    }
};

module.exports = {
    getAlbum,
    getNewReleases,
    searchAlbums
};
