/**
 * Bandsintown API Service
 * Docs: https://www.bandsintown.com/api/overview
 * 
 * Note: Replace BANDSINTOWN_APP_ID in .env with your actual app ID
 */

const axios = require('axios');
const { bandsintownLimiter, withRateLimit } = require('../utils/rateLimiter');
const { concertCache } = require('../utils/cache');

const BANDSINTOWN_BASE_URL = 'https://rest.bandsintown.com';
const APP_ID = process.env.BANDSINTOWN_APP_ID || 'spotify_clone'; // Placeholder

/**
 * Make a request to Bandsintown API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} API response data
 */
async function bandsintownRequest(endpoint) {
    const url = `${BANDSINTOWN_BASE_URL}${endpoint}`;

    try {
        const response = await axios.get(url, {
            params: {
                app_id: APP_ID
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('[Bandsintown] API Error:', error.response.status, error.response.data);
            throw new Error(`Bandsintown API error: ${error.response.status}`);
        }
        throw error;
    }
}

/**
 * Search for an artist on Bandsintown
 * @param {string} artistName - Artist name to search
 * @returns {Promise<Object>} Artist data
 */
async function searchArtist(artistName) {
    const cacheKey = `bandsintown:artist:${artistName.toLowerCase()}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // Bandsintown uses artist name directly in the URL
        const encodedName = encodeURIComponent(artistName);
        const artist = await withRateLimit(
            bandsintownLimiter,
            () => bandsintownRequest(`/artists/${encodedName}`)
        );

        const artistData = {
            id: artist.id,
            name: artist.name,
            url: artist.url,
            imageUrl: artist.image_url,
            thumbUrl: artist.thumb_url,
            facebookPageUrl: artist.facebook_page_url,
            trackerCount: artist.tracker_count,
            upcomingEventCount: artist.upcoming_event_count
        };

        concertCache.set(cacheKey, artistData);
        return artistData;

    } catch (error) {
        console.error('[Bandsintown] Artist search error:', error.message);
        throw error;
    }
}

/**
 * Get upcoming events for an artist
 * @param {string} artistName - Artist name
 * @param {string} dateRange - Date range (e.g., 'upcoming', 'all', or 'YYYY-MM-DD,YYYY-MM-DD')
 * @returns {Promise<Array>} Array of events
 */
async function getArtistEvents(artistName, dateRange = 'upcoming') {
    const cacheKey = `bandsintown:events:${artistName.toLowerCase()}:${dateRange}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const encodedName = encodeURIComponent(artistName);
        const events = await withRateLimit(
            bandsintownLimiter,
            () => bandsintownRequest(`/artists/${encodedName}/events?date=${dateRange}`)
        );

        const formattedEvents = events.map(event => ({
            id: event.id,
            artistName: artistName,
            eventName: event.title || `${artistName} Live`,
            venue: {
                name: event.venue.name,
                city: event.venue.city,
                region: event.venue.region,
                country: event.venue.country,
                latitude: parseFloat(event.venue.latitude),
                longitude: parseFloat(event.venue.longitude)
            },
            datetime: event.datetime,
            description: event.description,
            lineup: event.lineup,
            offers: event.offers,
            url: event.url,
            onSaleDateTime: event.on_sale_datetime,
            source: 'bandsintown'
        }));

        // Cache for 6 hours
        concertCache.set(cacheKey, formattedEvents);
        return formattedEvents;

    } catch (error) {
        console.error('[Bandsintown] Get events error:', error.message);
        throw error;
    }
}

/**
 * Get events by location
 * @param {string} location - Location string (e.g., 'New York, NY' or 'lat,lon')
 * @param {number} radius - Search radius in miles (default: 25)
 * @param {string} dateRange - Date range
 * @returns {Promise<Array>} Array of events
 */
async function getEventsByLocation(location, radius = 25, dateRange = 'upcoming') {
    const cacheKey = `bandsintown:location:${location}:${radius}:${dateRange}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const events = await withRateLimit(
            bandsintownLimiter,
            () => bandsintownRequest(`/events/search?location=${encodeURIComponent(location)}&radius=${radius}&date=${dateRange}`)
        );

        const formattedEvents = events.map(event => ({
            id: event.id,
            artistName: event.lineup[0] || 'Unknown Artist',
            eventName: event.title,
            venue: {
                name: event.venue.name,
                city: event.venue.city,
                region: event.venue.region,
                country: event.venue.country,
                latitude: parseFloat(event.venue.latitude),
                longitude: parseFloat(event.venue.longitude)
            },
            datetime: event.datetime,
            description: event.description,
            lineup: event.lineup,
            offers: event.offers,
            url: event.url,
            source: 'bandsintown'
        }));

        concertCache.set(cacheKey, formattedEvents);
        return formattedEvents;

    } catch (error) {
        console.error('[Bandsintown] Location search error:', error.message);
        throw error;
    }
}

module.exports = {
    searchArtist,
    getArtistEvents,
    getEventsByLocation
};
