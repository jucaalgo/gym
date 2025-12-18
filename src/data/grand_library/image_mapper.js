/**
 * THE GRAND LIBRARY: INTELLIGENT IMAGE MAPPER
 * Auto-loads catalog and matches exercises with smart fallback
 */

// Exercise catalog from free-exercise-db (873 exercises)
let EXERCISE_CATALOG = null;
let AI_MANIFEST = []; // List of slugs that have AI images generated

// Load catalog on first use
export const initializeCatalog = async () => {
    if (EXERCISE_CATALOG) return true;

    try {
        // Load Catalog
        const catRes = await fetch('/free_exercise_catalog.json');
        if (catRes.ok) {
            EXERCISE_CATALOG = await catRes.json();
            console.log(`[Engine] Loaded ${EXERCISE_CATALOG.length} exercises from catalog`);
        } else {
            console.error('[Engine] Failed to load catalog');
            EXERCISE_CATALOG = [];
        }

        // Load AI Manifest (Don't fail if missing)
        try {
            const manRes = await fetch('/ai_manifest.json');
            if (manRes.ok) {
                AI_MANIFEST = await manRes.json();
                console.log(`[Engine] Loaded ${AI_MANIFEST.length} AI generated images`);
            }
        } catch (e) {
            console.warn('[Engine] No AI manifest found (offline mode matches only)');
        }

        return true;
    } catch (error) {
        console.error('[Engine] Initialization error:', error);
        EXERCISE_CATALOG = [];
        return false;
    }
};

// Normalize exercise name for matching
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/\(.*?\)/g, '') // Remove (variations)
        .replace(/[^a-z0-9\s]/g, '') // Only alphanumeric
        .replace(/\s+/g, '') // Remove spaces
        .trim();
};

// Find best match with 6-tier strategy
export const findExerciseMatch = (exerciseName, equipment = null, targetMuscle = null) => {
    if (!EXERCISE_CATALOG || EXERCISE_CATALOG.length === 0) {
        console.warn('[Engine] Catalog not loaded yet');
        return null;
    }

    const normalized = normalizeName(exerciseName);
    const words = exerciseName.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // TIER 1: Exact name match
    let match = EXERCISE_CATALOG.find(ex => normalizeName(ex.name) === normalized);
    if (match) return { match, tier: 1 };

    // TIER 2: Exact ID match
    match = EXERCISE_CATALOG.find(ex => normalizeName(ex.id) === normalized);
    if (match) return { match, tier: 2 };

    // TIER 3: All keywords present (variations like "Pause Squat" → "Squat")
    match = EXERCISE_CATALOG.find(ex => {
        const exNorm = normalizeName(ex.name);
        return words.every(word => exNorm.includes(word.replace(/[^a-z0-9]/g, '')));
    });
    if (match) return { match, tier: 3 };

    // TIER 4: Equipment + base movement
    if (equipment) {
        const baseMovement = exerciseName.toLowerCase().replace(equipment.toLowerCase(), '').trim();
        match = EXERCISE_CATALOG.find(ex => {
            const matchesEquip = ex.equipment?.toLowerCase() === equipment.toLowerCase();
            const matchesMove = normalizeName(ex.name).includes(normalizeName(baseMovement));
            return matchesEquip && matchesMove;
        });
        if (match) return { match, tier: 4 };
    }

    // TIER 5: Primary muscle + any keyword
    if (targetMuscle) {
        match = EXERCISE_CATALOG.find(ex => {
            const matchesMuscle = ex.primaryMuscles?.some(m =>
                m.toLowerCase().includes(targetMuscle.toLowerCase())
            );
            const anyKeyword = words.some(word =>
                normalizeName(ex.name).includes(word.replace(/[^a-z0-9]/g, ''))
            );
            return matchesMuscle && anyKeyword;
        });
        if (match) return { match, tier: 5 };
    }

    // TIER 6: Generic fallback (equipment + muscle)
    if (equipment && targetMuscle) {
        match = EXERCISE_CATALOG.find(ex =>
            ex.equipment?.toLowerCase() === equipment.toLowerCase() &&
            ex.primaryMuscles?.some(m => m.toLowerCase().includes(targetMuscle.toLowerCase()))
        );
        if (match) return { match, tier: 6 };
    }

    return null; // No match found
};

// Generate image URL from matched exercise
export const getImageUrl = (exerciseName, equipment, targetMuscle) => {
    // 1. CHECK LOCAL AI OVERRIDE FIRST (Highest Priority)
    const slug = exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if in manifest (Dynamic check)
    // Also keep the hardcoded list for the ones we just made manually if manifest isn't loaded yet
    const MANUAL_OVERRIDES = ['barbell-squat', 'barbell-bench-press', 'barbell-deadlift', 'dumbbell-lunge', 'plank', 'lateral-raise'];

    // Check manifest exact match or substring match
    const manifestMatch = AI_MANIFEST.find(s => slug === s || slug.includes(s));
    const manualMatch = MANUAL_OVERRIDES.find(s => slug === s || slug.includes(s));

    const bestSlug = manifestMatch || manualMatch;

    if (bestSlug) {
        return `/exercises/${bestSlug}.png`;
    }

    // 2. Fallback to Catalog Matching
    const result = findExerciseMatch(exerciseName, equipment, targetMuscle);

    if (result && result.match && result.match.images && result.match.images.length > 0) {
        // Return first image from yuhonas DB
        return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${result.match.images[0]}`;
    }

    // 3. Fallback to default
    return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg`;
};

// Export the catalog for direct access if needed
export const getCatalog = () => EXERCISE_CATALOG;
