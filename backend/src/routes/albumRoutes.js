const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

// Public routes
router.get('/new-releases', albumController.getNewReleases); // Must be before /:id
router.get('/search', albumController.searchAlbums);
router.get('/:id', albumController.getAlbum); // Album details by Spotify ID

module.exports = router;
