/**
 * Artist Resolver Service
 * 
 * Combines MusicBrainz and Spotify to create a unified artist identity
 * Flow: Artist Name → MusicBrainz MBID → Spotify Metadata → Unified Object
 */

const musicbrainzService = require('./musicbrainzService');
const spotifyService = require('./spotifyService');
const { artistCache } = require('../utils/cache');

/**
 * Resolve an artist from name to unified object
 * This is the main entry point for artist resolution
 * 
 * @param {string} artistName - Artist name to resolve
 * @returns {Promise<Object>} Unified artist object
 */
async function resolveArtist(artistName) {
    const cacheKey = `resolved:${artistName.toLowerCase()}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // STEP 1: Get MusicBrainz ID (canonical artist identity)
        console.log(`[ArtistResolver] Resolving: ${artistName}`);
        const mbMatch = await musicbrainzService.findBestMatch(artistName);

        if (!mbMatch) {
            console.warn(`[ArtistResolver] No MusicBrainz match for: ${artistName}`);
            // Try Spotify only
            return await resolveFromSpotifyOnly(artistName);
        }

        // STEP 2: Get Spotify data for richer metadata
        const spotifyMatches = await spotifyService.searchArtist(mbMatch.name, 5);

        let spotifyData = null;
        if (spotifyMatches.length > 0) {
            // Find best Spotify match (by name similarity)
            spotifyData = spotifyMatches.find(s =>
                s.name.toLowerCase() === mbMatch.name.toLowerCase()
            ) || spotifyMatches[0];
        }

        // STEP 3: Combine into unified object
        const resolvedArtist = {
            // Canonical identifiers
            mbid: mbMatch.mbid,
            spotifyId: spotifyData?.id || null,

            // Names
            name: mbMatch.name,
            sortName: mbMatch.sortName,
            aliases: mbMatch.aliases || [],

            // Metadata (prefer Spotify when available)
            genres: spotifyData?.genres || [],
            popularity: spotifyData?.popularity || null,
            followers: spotifyData?.followers || null,
            images: spotifyData?.images || [],

            // MusicBrainz specific
            type: mbMatch.type,
            country: mbMatch.country,
            disambiguation: mbMatch.disambiguation,

            // External links
            spotifyUrl: spotifyData?.spotifyUrl || null,

            // Resolution metadata
            confidence: mbMatch.score,
            sources: {
                musicbrainz: true,
                spotify: !!spotifyData
            },
            resolvedAt: new Date().toISOString()
        };

        // Cache for 1 hour
        artistCache.set(cacheKey, resolvedArtist);

        console.log(`[ArtistResolver] ✓ Resolved: ${artistName} → ${resolvedArtist.name} (MBID: ${resolvedArtist.mbid})`);
        return resolvedArtist;

    } catch (error) {
        console.error(`[ArtistResolver] Error resolving ${artistName}:`, error.message);

        // Fallback: Try Spotify only
        try {
            return await resolveFromSpotifyOnly(artistName);
        } catch (fallbackError) {
            throw new Error(`Failed to resolve artist: ${artistName}`);
        }
    }
}

/**
 * Fallback: Resolve using only Spotify (when MusicBrainz fails)
 */
async function resolveFromSpotifyOnly(artistName) {
    const spotifyMatches = await spotifyService.searchArtist(artistName, 1);

    if (spotifyMatches.length === 0) {
        throw new Error(`Artist not found: ${artistName}`);
    }

    const spotify = spotifyMatches[0];

    return {
        mbid: null,
        spotifyId: spotify.id,
        name: spotify.name,
        sortName: spotify.name,
        aliases: [],
        genres: spotify.genres,
        popularity: spotify.popularity,
        followers: spotify.followers,
        images: spotify.images,
        type: null,
        country: null,
        disambiguation: null,
        spotifyUrl: spotify.spotifyUrl,
        confidence: 50, // Lower confidence (no MBID verification)
        sources: {
            musicbrainz: false,
            spotify: true
        },
        resolvedAt: new Date().toISOString()
    };
}

/**
 * Resolve multiple artists in batch
 * @param {Array<string>} artistNames - Array of artist names
 * @returns {Promise<Array>} Array of resolved artists
 */
async function resolveArtists(artistNames) {
    const results = [];

    for (const name of artistNames) {
        try {
            const resolved = await resolveArtist(name);
            results.push(resolved);
        } catch (error) {
            console.error(`[ArtistResolver] Failed: ${name}`, error.message);
            results.push({
                name,
                error: error.message,
                resolved: false
            });
        }
    }

    return results;
}

/**
 * Get artist metadata by ID (MBID or Spotify ID)
 * @param {string} artistId - MBID or Spotify ID
 * @param {string} idType - 'mbid' or 'spotify'
 * @returns {Promise<Object>} Artist metadata
 */
async function getArtistMetadata(artistId, idType = 'spotify') {
    const cacheKey = `metadata:${idType}:${artistId}`;
    const cached = artistCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    let metadata = {};

    try {
        if (idType === 'mbid') {
            const mbData = await musicbrainzService.getArtistByMBID(artistId);

            // Try to get Spotify data too
            let spotifyData = null;
            try {
                const spotifyMatches = await spotifyService.searchArtist(mbData.name, 1);
                spotifyData = spotifyMatches[0] || null;
            } catch (e) {
                console.warn('[ArtistResolver] Could not fetch Spotify data for MBID lookup');
            }

            metadata = {
                mbid: mbData.mbid,
                spotifyId: spotifyData?.id || null,
                name: mbData.name,
                sortName: mbData.sortName,
                type: mbData.type,
                country: mbData.country,
                genres: spotifyData?.genres || mbData.genres || [],
                images: spotifyData?.images || [],
                popularity: spotifyData?.popularity || null,
                followers: spotifyData?.followers || null,
                spotifyUrl: spotifyData?.spotifyUrl || null,
                tags: mbData.tags || [],
                lifeSpan: mbData.lifeSpan
            };

        } else if (idType === 'spotify') {
            const spotifyData = await spotifyService.getArtist(artistId);

            metadata = {
                mbid: null,
                spotifyId: spotifyData.id,
                name: spotifyData.name,
                genres: spotifyData.genres,
                popularity: spotifyData.popularity,
                followers: spotifyData.followers,
                images: spotifyData.images,
                spotifyUrl: spotifyData.spotifyUrl
            };
        }

        artistCache.set(cacheKey, metadata);
        return metadata;

    } catch (error) {
        console.error(`[ArtistResolver] Get metadata error (${idType}:${artistId}):`, error.message);
        throw error;
    }
}

module.exports = {
    resolveArtist,
    resolveArtists,
    getArtistMetadata
};
