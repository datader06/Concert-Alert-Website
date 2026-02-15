/**
 * Concert Aggregation Service
 * Uses Ticketmaster for concert data
 * (Simplified version - single source)
 */

const ticketmasterService = require('../utils/ticketmasterService');

/**
 * Normalize Ticketmaster event data to common format
 * @param {Object} event - Event from Ticketmaster
 * @returns {Object} Normalized event
 */
function normalizeEvent(event) {
    // Ticketmaster service already returns normalized format
    return event;
}

/**
 * Get concerts for an artist
 * @param {string} artistName - Artist name
 * @returns {Promise<Array>} Array of events
 */
async function getArtistConcerts(artistName) {
    try {
        const events = await ticketmasterService.getArtistEvents(artistName);
        console.log(`[Aggregation] Found ${events.length} events from Ticketmaster`);
        return events;
    } catch (error) {
        console.error('[Aggregation] Ticketmaster failed:', error.message);
        return [];
    }
}

/**
 * Get concerts by location
 * @param {string} city - City name
 * @param {string} country - Country name
 * @returns {Promise<Array>} Array of events
 */
async function getConcertsByLocation(city, country) {
    try {
        // Use getArtistEvents with location parameter
        const location = `${city}, ${country}`;
        const events = await ticketmasterService.getArtistEvents('', location);
        console.log(`[Aggregation] Found ${events.length} events from Ticketmaster`);
        return events;
    } catch (error) {
        console.error('[Aggregation] Ticketmaster location search failed:', error.message);
        return [];
    }
}

module.exports = {
    getArtistConcerts,
    getConcertsByLocation,
    normalizeEvent
};
