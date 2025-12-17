// Real Exercises Adapter - Full 800+ exercises from yuhonas/free-exercise-db
// Using dynamic import to avoid Vite crash with large JSON

// Base URL for the images in the repo
const BASE_IMAGE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Data cache
let rawExercises = null;
let exercisesMap = null;
let exercisesByMuscle = null;
let exercisesByCategory = null;
let isLoaded = false;
let loadPromise = null;

// Generate algorithmic variants to expand library
const generateVariants = (exercises) => {
    const variants = [];

    exercises.forEach(ex => {
        // Variant 1: Pause Reps
        const pauseVariant = {
            ...ex,
            id: `${ex.id}-pause`,
            name: `Pause ${ex.name}`,
            instructions: [`[TECHNIQUE] Perform a 2-second pause at the bottom of the movement.`, ...ex.instructions],
            category: ex.category || 'strength' // Ensure valid category
        };

        // Variant 2: Slow Eccentric
        const slowVariant = {
            ...ex,
            id: `${ex.id}-slow`,
            name: `Slow Eccentric ${ex.name}`,
            instructions: [`[TECHNIQUE] Lower the weight slowly for 3-4 seconds.`, ...ex.instructions],
            category: ex.category || 'strength'
        };

        variants.push(pauseVariant, slowVariant);
    });

    console.log(`✨ Generated ${variants.length} exercise variants`);
    return [...exercises, ...variants];
};

// Load data dynamically from Public Catalog
const loadExercises = async () => {
    if (isLoaded) return rawExercises;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        try {
            // Updated to fetch from public directory
            const response = await fetch('/free_exercise_catalog.json');
            if (!response.ok) throw new Error('Failed to fetch catalog');

            let baseExercises = await response.json();
            console.log(`📦 Loaded ${baseExercises.length} base exercises from Catalog`);

            // Expand library
            rawExercises = generateVariants(baseExercises);

            initializeCaches();
            isLoaded = true;
            console.log(`✅ Total Library Size: ${rawExercises.length} exercises`);
            return rawExercises;
        } catch (error) {
            console.error('Failed to load exercises:', error);
            rawExercises = [];
            isLoaded = true;
            return rawExercises;
        }
    })();

    return loadPromise;
};

// Initialize caches after load
const initializeCaches = () => {
    if (!rawExercises) return;

    exercisesMap = new Map();
    exercisesByMuscle = {};
    exercisesByCategory = {};

    rawExercises.forEach(ex => {
        exercisesMap.set(ex.id, ex);

        // Group by primary muscles (Normalize to lowercase)
        if (ex.primaryMuscles) {
            ex.primaryMuscles.forEach(muscle => {
                const key = muscle.toLowerCase();
                if (!exercisesByMuscle[key]) {
                    exercisesByMuscle[key] = [];
                }
                exercisesByMuscle[key].push(ex);
            });
        }

        // Group by category
        if (ex.category) {
            if (!exercisesByCategory[ex.category]) {
                exercisesByCategory[ex.category] = [];
            }
            exercisesByCategory[ex.category].push(ex);
        }
    });
};

// Ensure data is loaded before operations
const ensureLoaded = async () => {
    if (!isLoaded) {
        await loadExercises();
    }
};

// Sync version for cached access (returns empty if not loaded)
const getExercisesSync = () => {
    return rawExercises || [];
};

export const realExercisesAdapter = {
    // Initialize - call this early in app startup
    init: loadExercises,

    // Get all exercises (async)
    getAllAsync: async () => {
        await ensureLoaded();
        return rawExercises;
    },

    // Get all exercises (sync - for compatibility, may be empty initially)
    getAll: () => {
        if (!isLoaded) loadExercises(); // Trigger load
        return getExercisesSync();
    },

    // Get total count
    getCount: () => {
        return rawExercises ? rawExercises.length : 0;
    },

    // Get specific exercise by ID
    getById: (id) => {
        if (!exercisesMap) {
            loadExercises();
            return null;
        }
        return exercisesMap.get(id);
    },

    // Get exercises by target muscle (e.g., "biceps", "chest")
    getByMuscle: (muscle) => {
        if (!exercisesByMuscle) {
            loadExercises();
            return [];
        }
        return exercisesByMuscle[muscle] || [];
    },

    // Get all available muscles
    getAvailableMuscles: () => {
        if (!exercisesByMuscle) return [];
        return Object.keys(exercisesByMuscle).sort();
    },

    // Get exercises by Category (e.g., "strength", "cardio")
    getByCategory: (category) => {
        if (!exercisesByCategory) {
            loadExercises();
            return [];
        }
        return exercisesByCategory[category] || [];
    },

    // Get all categories
    getAvailableCategories: () => {
        if (!exercisesByCategory) return [];
        return Object.keys(exercisesByCategory).sort();
    },

    // Get full image URLs for an exercise
    getImageUrls: (exercise) => {
        if (!exercise || !exercise.images) return [];
        return exercise.images.map(imgRelPath => `${BASE_IMAGE_URL}/${imgRelPath}`);
    },

    // Get a random sample of N exercises for a specific muscle
    getRandomSample: (muscle, count = 3) => {
        if (!exercisesByMuscle) {
            loadExercises();
            return [];
        }
        const candidates = exercisesByMuscle[muscle] || [];
        if (candidates.length === 0) return [];

        // Shuffle and slice
        const shuffled = [...candidates].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // Search exercises by name
    searchByName: (query) => {
        if (!rawExercises) return [];
        const lower = query.toLowerCase();
        return rawExercises.filter(ex =>
            ex.name.toLowerCase().includes(lower)
        ).slice(0, 50); // Limit results
    },

    // Get exercises by equipment
    getByEquipment: (equipment) => {
        if (!rawExercises) return [];
        return rawExercises.filter(ex => ex.equipment === equipment);
    },

    // Get all available equipment types
    getAvailableEquipment: () => {
        if (!rawExercises) return [];
        const equipment = new Set(rawExercises.map(ex => ex.equipment).filter(Boolean));
        return [...equipment].sort();
    }
};

// Auto-initialize on module load
loadExercises();

export default realExercisesAdapter;
