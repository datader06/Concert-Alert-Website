/**
 * Simple In-Memory Cache
 * 
 * Provides basic caching functionality with TTL (Time To Live)
 * Future: Migrate to Redis for production scalability
 */

class SimpleCache {
    constructor(ttl = 3600000) { // Default: 1 hour
        this.cache = new Map();
        this.ttl = ttl;
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0
        };
    }

    /**
     * Set a value in cache
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} customTtl - Optional custom TTL for this item
     */
    set(key, value, customTtl = null) {
        const ttl = customTtl || this.ttl;
        this.cache.set(key, {
            value,
            expires: Date.now() + ttl
        });
        this.stats.sets++;
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {any|null} Cached value or null if not found/expired
     */
    get(key) {
        const item = this.cache.get(key);

        if (!item) {
            this.stats.misses++;
            return null;
        }

        // Check if expired
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return item.value;
    }

    /**
     * Check if key exists and is not expired
     */
    has(key) {
        return this.get(key) !== null;
    }

    /**
     * Delete a specific key
     */
    delete(key) {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, sets: 0 };
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
        };
    }

    /**
     * Clean up expired entries (call periodically)
     */
    cleanup() {
        const now = Date.now();
        let removed = 0;

        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key);
                removed++;
            }
        }

        return removed;
    }
}

// Create singleton cache instances for different data types
const artistCache = new SimpleCache(3600000); // 1 hour
const albumCache = new SimpleCache(43200000); // 12 hours
const concertCache = new SimpleCache(21600000); // 6 hours
const spotifyTokenCache = new SimpleCache(3300000); // 55 minutes (Spotify tokens last 1 hour)

// Run cleanup every 15 minutes
setInterval(() => {
    artistCache.cleanup();
    albumCache.cleanup();
    concertCache.cleanup();
    spotifyTokenCache.cleanup();
}, 900000);

module.exports = {
    SimpleCache,
    artistCache,
    albumCache,
    concertCache,
    spotifyTokenCache
};
