const axios = require('axios');

// Ticketmaster API helper
const ticketmasterApi = axios.create({
  baseURL: process.env.TICKETMASTER_API_URL,
  params: {
    apikey: process.env.TICKETMASTER_API_KEY
  }
});

// Get events for an artist
async function getArtistEvents(artistName, location = null) {
  try {
    const params = {
      keyword: artistName,
      size: 50,
      sort: 'date,asc'
    };

    if (location) {
      params.city = location;
    }

    const response = await ticketmasterApi.get('/events/v2', { params });
    
    if (!response.data._embedded?.events) {
      return [];
    }

    return response.data._embedded.events.map(event => ({
      externalId: `ticketmaster_${event.id}`,
      eventName: event.name,
      venueName: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
      city: event._embedded?.venues?.[0]?.city?.name || '',
      country: event._embedded?.venues?.[0]?.country?.name || '',
      latitude: parseFloat(event._embedded?.venues?.[0]?.location?.latitude) || null,
      longitude: parseFloat(event._embedded?.venues?.[0]?.location?.longitude) || null,
      eventDate: new Date(event.dates?.start?.dateTime).toISOString(),
      ticketUrl: event.url,
      source: 'ticketmaster'
    })) || [];
  } catch (error) {
    console.error('Ticketmaster API error:', error.message);
    return [];
  }
}

module.exports = {
  getArtistEvents
};
