/**
 * Artist Controller
 * Enhanced with artist resolution capabilities
 */

const artistService = require('../services/artistService');
const artistResolverService = require('../services/artistService');
const spotifyService = require('../services/spotifyService');

/**
 * GET /api/artists/trending
 * Get trending artists (existing functionality)
 */
const getTrendingArtists = async (req, res) => {
  try {
    const artists = await artistService.getTrendingArtists(req.query.limit || 20);
    res.json(artists);
  } catch (error) {
    console.error('Error in getTrendingArtists:', error);
    res.status(500).json({ error: 'Failed to fetch trending artists' });
  }
};

/**
 * GET /api/artists/search
 * Search for artists (existing functionality)
 */
const searchArtists = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const artists = await artistService.searchArtists(q);
    res.json(artists);
  } catch (error) {
    console.error('Error in searchArtists:', error);
    res.status(500).json({ error: 'Failed to search artists' });
  }
};

/**
 * NEW: GET /api/artists/resolve
 * Resolve artist to unified identity (MusicBrainz + Spotify)
 * 
 * Query params:
 * - name: Artist name to resolve
 * 
 * Example: /api/artists/resolve?name=Taylor Swift
 */
const resolveArtist = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        error: 'Query parameter "name" is required',
        example: '/api/artists/resolve?name=Taylor Swift'
      });
    }

    const resolved = await artistResolverService.resolveArtist(name);
    res.json(resolved);

  } catch (error) {
    console.error('Error in resolveArtist:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * NEW: POST /api/artists/resolve/batch
 * Resolve multiple artists in batch
 * 
 * Body: { "artists": ["Artist 1", "Artist 2", ...] }
 */
const resolveArtistsBatch = async (req, res) => {
  try {
    const { artists } = req.body;

    if (!Array.isArray(artists) || artists.length === 0) {
      return res.status(400).json({
        error: 'Body must contain "artists" array',
        example: { artists: ["Taylor Swift", "Drake"] }
      });
    }

    if (artists.length > 50) {
      return res.status(400).json({
        error: 'Maximum 50 artists per batch request'
      });
    }

    const resolved = await artistResolverService.resolveArtists(artists);
    res.json({
      total: artists.length,
      resolved: resolved.filter(r => !r.error).length,
      failed: resolved.filter(r => r.error).length,
      artists: resolved
    });

  } catch (error) {
    console.error('Error in resolveArtistsBatch:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * NEW: GET /api/artists/:id/metadata
 * Get comprehensive artist metadata
 * 
 * Query params:
 * - type: 'spotify' or 'mbid' (default: spotify)
 * 
 * Example: /api/artists/06HL4z0CvFAxyc27GXpf02?type=spotify
 */
const getArtistMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'spotify' } = req.query;

    if (!['spotify', 'mbid'].includes(type)) {
      return res.status(400).json({
        error: 'Type must be "spotify" or "mbid"'
      });
    }

    const metadata = await artistResolverService.getArtistMetadata(id, type);
    res.json(metadata);

  } catch (error) {
    console.error('Error in getArtistMetadata:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * NEW: GET /api/artists/:id/albums
 * Get artist's albums from Spotify
 * 
 * Query params:
 * - types: Comma-separated album types (album,single,compilation) - default: album,single
 * - limit: Max results (default: 50)
 * 
 * Example: /api/artists/06HL4z0CvFAxyc27GXpf02/albums?types=album&limit=20
 */
const getArtistAlbums = async (req, res) => {
  try {
    const { id } = req.params;
    const { types = 'album,single', limit = 50 } = req.query;

    const albums = await spotifyService.getArtistAlbums(id, types, parseInt(limit));

    res.json({
      artistId: id,
      total: albums.length,
      albums
    });

  } catch (error) {
    console.error('Error in getArtistAlbums:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * NEW: GET /api/artists/:id/latest-releases
 * Get artist's recent releases (last 6 months)
 */
const getLatestReleases = async (req, res) => {
  try {
    const { id } = req.params;

    const albums = await spotifyService.getArtistAlbums(id, 'album,single', 50);

    // Filter to last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentReleases = albums.filter(album => {
      const releaseDate = new Date(album.releaseDate);
      return releaseDate >= sixMonthsAgo;
    });

    res.json({
      artistId: id,
      total: recentReleases.length,
      releases: recentReleases
    });

  } catch (error) {
    console.error('Error in getLatestReleases:', error);
    res.status(500).json({ error: error.message });
  }
};
const notImplemented = (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
};

// Missing handlers (temporary)
const getAllArtists = notImplemented;
const getArtist = notImplemented;
const addFavoriteArtist = notImplemented;
const removeFavoriteArtist = notImplemented;
const getUserFavorites = notImplemented;

module.exports = {
  getAllArtists,
  getTrendingArtists,
  searchArtists,
  resolveArtist,
  resolveArtistsBatch,
  getArtistMetadata,
  getArtistAlbums,
  getLatestReleases,
  getArtist,
  addFavoriteArtist,
  removeFavoriteArtist,
  getUserFavorites
};
