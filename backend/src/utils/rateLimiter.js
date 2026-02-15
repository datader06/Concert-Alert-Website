/**
 * Rate Limiter & Retry Utility
 * 
 * Handles API rate limiting with exponential backoff
 */

/**
 * Sleep utility
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute function with rate limit handling and retry logic
 * 
 * @param {string} apiName - Name of the API (for logging)
 * @param {Function} fn - Async function to execute
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in ms for exponential backoff
 * @returns {Promise<any>} Result of the function
 */
async function withRateLimit(apiName, fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Check if it's a rate limit error (429)
            if (error.response?.status === 429) {
                const retryAfter = error.response.headers?.['retry-after'];
                const delay = retryAfter
                    ? parseInt(retryAfter) * 1000
                    : baseDelay * Math.pow(2, attempt); // Exponential backoff

                console.warn(`[${apiName}] Rate limited. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                await sleep(delay);
                continue;
            }

            // Check for network/timeout errors
            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                const delay = baseDelay * Math.pow(2, attempt);
                console.warn(`[${apiName}] Network error. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
                await sleep(delay);
                continue;
            }

            // For other errors, don't retry
            throw error;
        }
    }

    // All retries exhausted
    console.error(`[${apiName}] Failed after ${maxRetries} attempts`);
    throw lastError;
}

/**
 * Simple token bucket rate limiter
 * Useful for APIs with request-per-second limits
 */
class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity; // Max tokens
        this.tokens = capacity; // Current tokens
        this.refillRate = refillRate; // Tokens per second
        this.lastRefill = Date.now();
    }

    async consume(tokens = 1) {
        this.refill();

        if (this.tokens >= tokens) {
            this.tokens -= tokens;
            return true;
        }

        // Wait until we have enough tokens
        const waitTime = ((tokens - this.tokens) / this.refillRate) * 1000;
        await sleep(waitTime);
        this.refill();
        this.tokens -= tokens;
        return true;
    }

    refill() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000; // seconds
        const tokensToAdd = timePassed * this.refillRate;

        this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}

// Create rate limiters for different APIs
const musicBrainzLimiter = new TokenBucket(1, 1); // 1 request per second (MusicBrainz requirement)
const spotifyLimiter = new TokenBucket(180, 3); // ~180 per minute = 3 per second
const bandsintownLimiter = new TokenBucket(100, 5); // Generous limit

module.exports = {
    withRateLimit,
    TokenBucket,
    musicBrainzLimiter,
    spotifyLimiter,
    bandsintownLimiter,
    sleep
};
