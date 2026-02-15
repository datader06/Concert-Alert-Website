const Concert = require('../models/Concert');
const Artist = require('../models/Artist');
const User = require('../models/User');
const concertAggregation = require('../services/concertAggregationService');

// Get all upcoming concerts
exports.getUpcomingConcerts = (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const concerts = Concert.getUpcomingConcerts(parseInt(limit));
    res.json({ concerts, count: concerts.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get concerts for a specific artist (with aggregation)
exports.getArtistConcerts = async (req, res) => {
  try {
    const { artistId } = req.params;
    const { artistName } = req.query;

    // If artist name provided, use aggregation service
    if (artistName) {
      const aggregatedConcerts = await concertAggregation.getArtistConcerts(artistName);
      return res.json({
        concerts: aggregatedConcerts,
        count: aggregatedConcerts.length,
        sources: ['bandsintown', 'ticketmaster']
      });
    }

    // Otherwise, fall back to database
    const artist = Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const concerts = Concert.getConcertsByArtist(artistId);
    res.json({ concerts, count: concerts.length, sources: ['database'] });
  } catch (error) {
    console.error('Error in getArtistConcerts:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get concerts near user (by location/country)
exports.getConcertsNearUser = (req, res) => {
  try {
    const user = User.findById(req.userId);

    if (!user || !user.country) {
      return res.status(400).json({ error: 'User location not set' });
    }

    // Get concerts by country (simple approach without geolocation)
    const allConcerts = Concert.getUpcomingConcerts(200);
    const nearConcerts = allConcerts.filter(c => c.country === user.country);

    res.json(nearConcerts.slice(0, 50));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get concerts for user's favorite artists
exports.getFavoriteArtistsConcerts = (req, res) => {
  try {
    const favorites = User.getFavoriteArtists(req.userId);

    if (favorites.length === 0) {
      return res.json([]);
    }

    const concerts = [];
    for (const artist of favorites) {
      const artistConcerts = Concert.getConcertsByArtist(artist.id);
      concerts.push(...artistConcerts);
    }

    // Sort by date
    concerts.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    res.json(concerts.slice(0, 50));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get concert details
exports.getConcertDetails = (req, res) => {
  try {
    const { concertId } = req.params;

    const concert = Concert.findById(concertId);

    if (!concert) {
      return res.status(404).json({ error: 'Concert not found' });
    }

    const artist = Artist.findById(concert.artist_id);

    res.json({
      ...concert,
      artist: artist?.name || 'Unknown'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
