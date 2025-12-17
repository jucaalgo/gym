/**
 * EXERCISEDB SERVICE
 * Intelligent API client with caching for RapidAPI ExerciseDB
 * Provides 1300+ animated exercise GIFs
 */

const API_BASE = 'https://exercisedb.p.rapidapi.com';
const CACHE_PREFIX = 'exercisedb_';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Import local dataset (Offline Strategy)
import localExercises from '../data/exercisedb_exercises.json';

class ExerciseDBService {
    constructor() {
        // TEMPORARY: Hardcoded API key for testing (.env not loading)
        this.apiKey = 'OFFLINE_MODE';
        this.host = 'exercisedb.p.rapidapi.com';
        this.requestCount = 0;
        this.cacheHits = 0;
        // Load local data immediately
        this.allExercises = localExercises;

        console.log('[ExerciseDB] Offline Service initialized');
        console.log(`[ExerciseDB] Loaded ${this.allExercises.length} local exercises`);

        // Force clear cache once to fix potential bad state
        // this.clearCache(); // Uncomment if needed during hard debug
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return true; // Always true in offline mode
    }

    /**
     * Get from cache (Not needed in offline mode but kept for interface compatibility)
     */
    getFromCache(key) {
        return this.allExercises;
    }

    /**
     * Save to cache
     */
    saveToCache(key, data) {
        try {
            localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('[ExerciseDB] Cache write error:', error);
        }
    }

    /**
     * Make API request
     */
    async request(endpoint) {
        if (!this.isConfigured()) {
            throw new Error('ExerciseDB API key not configured');
        }

        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.host
        };

        try {
            // Attempt 1: Direct connection
            console.log(`[ExerciseDB] 📡 Requesting ${url}...`);
            const response = await fetch(url, { method: 'GET', headers });

            if (response.ok) return await response.json();

            throw new Error(`Direct connection failed: ${response.status}`);
        } catch (directError) {
            console.warn('[ExerciseDB] ⚠️ Direct connection failed, trying proxy...', directError);

            try {
                // Attempt 2: CORS Proxy
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl, { method: 'GET', headers });

                if (response.ok) return await response.json();

                throw new Error(`Proxy connection failed: ${response.status}`);
            } catch (proxyError) {
                console.error('[ExerciseDB] ❌ All connection attempts failed');
                throw proxyError;
            }
        }
    }

    /**
     * Get all exercises (returns local data with reconstructed URLs)
     */
    async getAllExercises() {
        console.log(`[ExerciseDB] 📂 Processing ${this.allExercises.length} local exercises`);

        // Return raw data. Engine will handle fallback to static images since gifUrl is missing.
        return this.allExercises;
    }

    /**
     * Find best matching exercise by name
     */
    async findBestMatch(searchName) {
        const allExercises = await this.getAllExercises();

        const normalized = searchName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        const words = normalized.split(' ').filter(w => w.length > 2);

        // Exact match
        let match = allExercises.find(ex =>
            ex.name.toLowerCase() === normalized
        );
        if (match) return match;

        // All words present
        match = allExercises.find(ex => {
            const exName = ex.name.toLowerCase();
            return words.every(word => exName.includes(word));
        });
        if (match) return match;

        // Any word match
        match = allExercises.find(ex => {
            const exName = ex.name.toLowerCase();
            return words.some(word => exName.includes(word));
        });

        return match || null;
    }

    /**
     * Get GIF URL for an exercise name
     */
    async getGifUrl(exerciseName) {
        const match = await this.findBestMatch(exerciseName);
        return match ? match.gifUrl : null;
    }

    /**
     * Get stats
     */
    getStats() {
        return {
            requestCount: this.requestCount,
            cacheHits: this.cacheHits,
            configured: this.isConfigured(),
            cacheSize: Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).length
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(CACHE_PREFIX))
            .forEach(k => localStorage.removeItem(k));

        this.allExercises = null;
        console.log('[ExerciseDB] Cache cleared');
    }
}

export default new ExerciseDBService();
