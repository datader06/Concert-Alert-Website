const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concertController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', concertController.getUpcomingConcerts);
router.get('/artist/:artistId', concertController.getArtistConcerts);
router.get('/details/:concertId', concertController.getConcertDetails);

// Protected routes
router.get('/user/near', authMiddleware, concertController.getConcertsNearUser);
router.get('/user/favorites', authMiddleware, concertController.getFavoriteArtistsConcerts);

module.exports = router;
