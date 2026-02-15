const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { authMiddleware } = require('../middleware/auth');

// Public routes - Existing
router.get('/', artistController.getAllArtists);
router.get('/trending', artistController.getTrendingArtists);
router.get('/search', artistController.searchArtists);

// NEW: Artist Resolution Routes
router.get('/resolve', artistController.resolveArtist); // /api/artists/resolve?name=ArtistName
router.post('/resolve/batch', artistController.resolveArtistsBatch); // Batch resolution

// NEW: Enhanced Artist Data Routes
router.get('/:id/metadata', artistController.getArtistMetadata); // Spotify + MusicBrainz combined
router.get('/:id/albums', artistController.getArtistAlbums); // All albums
router.get('/:id/latest-releases', artistController.getLatestReleases); // Recent releases

// Existing routes
router.get('/:id', artistController.getArtist);

// Protected routes
router.post('/:artistId/favorite', authMiddleware, artistController.addFavoriteArtist);
router.delete('/:artistId/favorite', authMiddleware, artistController.removeFavoriteArtist);
router.get('/user/favorites', authMiddleware, artistController.getUserFavorites);

module.exports = router;

