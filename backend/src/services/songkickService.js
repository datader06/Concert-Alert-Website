/**
 * Songkick API Service
 * Docs: https://www.songkick.com/developer
 * 
 * Note: Songkick API requires an API key from https://www.songkick.com/api_key_requests/new
 * For now, we'll try without a key (some endpoints work publicly)
 */

const axios = require('axios');
const { concertCache } = require('../utils/cache');

const SONGKICK_BASE_URL = 'https://api.songkick.com/api/3.0';
const API_KEY = process.env.SONGKICK_API_KEY || 'try_public'; // Placeholder

/**
 * Make a request to Songkick API
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response data
 */
async function songkickRequest(endpoint, params = {}) {
    const url = `${SONGKICK_BASE_URL}${endpoint}`;

    try {
        const response = await axios.get(url, {
            params: {
                apikey: API_KEY,
                ...params
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('[Songkick] API Error:', error.response.status, error.response.data);
            throw new Error(`Songkick API error: ${error.response.status}`);
        }
        throw error;
    }
}

/**
 * Search for an artist on Songkick
 * @param {string} artistName - Artist name to search
 * @returns {Promise<Object>} Artist data
 */
async function searchArtist(artistName) {
    const cacheKey = `songkick:artist:${artistName.toLowerCase()}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const data = await songkickRequest('/search/artists.json', {
            query: artistName
        });

        if (!data.resultsPage?.results?.artist || data.resultsPage.results.artist.length === 0) {
            throw new Error(`Artist not found: ${artistName}`);
        }

        const artist = data.resultsPage.results.artist[0];

        const artistData = {
            id: artist.id,
            name: artist.displayName,
            uri: artist.uri,
            onTourUntil: artist.onTourUntil
        };

        concertCache.set(cacheKey, artistData);
        return artistData;

    } catch (error) {
        console.error('[Songkick] Artist search error:', error.message);
        throw error;
    }
}

/**
 * Get upcoming events for an artist
 * @param {string} artistName - Artist name
 * @returns {Promise<Array>} Array of events
 */
async function getArtistEvents(artistName) {
    const cacheKey = `songkick:events:${artistName.toLowerCase()}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // First, get the artist ID
        const artist = await searchArtist(artistName);

        // Then get their events
        const data = await songkickRequest(`/artists/${artist.id}/calendar.json`);

        if (!data.resultsPage?.results?.event) {
            return [];
        }

        const events = data.resultsPage.results.event.map(event => ({
            id: event.id,
            artistName: artistName,
            eventName: event.displayName,
            venue: {
                name: event.venue.displayName,
                city: event.venue.metroArea?.displayName || event.location?.city || '',
                region: event.venue.metroArea?.state?.displayName || '',
                country: event.venue.metroArea?.country?.displayName || event.location?.country || '',
                latitude: event.venue.lat || null,
                longitude: event.venue.lng || null
            },
            datetime: event.start?.datetime || event.start?.date,
            description: event.type,
            lineup: event.performance?.map(p => p.displayName) || [],
            url: event.uri,
            source: 'songkick'
        }));

        // Cache for 6 hours
        concertCache.set(cacheKey, events);
        return events;

    } catch (error) {
        console.error('[Songkick] Get events error:', error.message);
        throw error;
    }
}

/**
 * Get events by location (metro area)
 * @param {string} location - Location string (e.g., 'New York, NY')
 * @param {number} radius - Not used by Songkick (uses metro areas)
 * @param {string} dateRange - Not used by Songkick
 * @returns {Promise<Array>} Array of events
 */
async function getEventsByLocation(location, radius = 25, dateRange = 'upcoming') {
    const cacheKey = `songkick:location:${location}`;
    const cached = concertCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // Search for metro area first
        const metroData = await songkickRequest('/search/locations.json', {
            query: location
        });

        if (!metroData.resultsPage?.results?.location || metroData.resultsPage.results.location.length === 0) {
            console.warn('[Songkick] Location not found:', location);
            return [];
        }

        const metro = metroData.resultsPage.results.location[0].metroArea;

        // Get events for this metro area
        const eventsData = await songkickRequest(`/metro_areas/${metro.id}/calendar.json`);

        if (!eventsData.resultsPage?.results?.event) {
            return [];
        }

        const events = eventsData.resultsPage.results.event.map(event => ({
            id: event.id,
            artistName: event.performance?.[0]?.displayName || 'Unknown Artist',
            eventName: event.displayName,
            venue: {
                name: event.venue.displayName,
                city: event.venue.metroArea?.displayName || '',
                region: event.venue.metroArea?.state?.displayName || '',
                country: event.venue.metroArea?.country?.displayName || '',
                latitude: event.venue.lat || null,
                longitude: event.venue.lng || null
            },
            datetime: event.start?.datetime || event.start?.date,
            description: event.type,
            lineup: event.performance?.map(p => p.displayName) || [],
            url: event.uri,
            source: 'songkick'
        }));

        concertCache.set(cacheKey, events);
        return events;

    } catch (error) {
        console.error('[Songkick] Location search error:', error.message);
        throw error;
    }
}

module.exports = {
    searchArtist,
    getArtistEvents,
    getEventsByLocation
};
