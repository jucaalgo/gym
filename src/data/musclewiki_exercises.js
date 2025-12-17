/**
 * MUSCLEWIKI EXERCISE DATABASE
 * Now powered by ExerciseDB API with 1300+ animated GIFs
 */
import { generateExercises } from './grand_library/engine_v2';

// Generate exercises (now async to load ExerciseDB)
let ALL_EXERCISES = [];
let isInitialized = false;

const initialize = async () => {
    if (isInitialized) return ALL_EXERCISES;

    console.log('[MuscleWiki] 🔄 Initializing exercise system...');

    // Generate exercises (will load ExerciseDB inside)
    ALL_EXERCISES = await generateExercises();
    isInitialized = true;

    console.log(`[MuscleWiki] ✅ ${ALL_EXERCISES.length} exercises ready`);
    return ALL_EXERCISES;
};

// Start initialization immediately
const initPromise = initialize();

// Synchronous export (will be populated after init)
export { ALL_EXERCISES };

// Async getter
export const getExercises = async () => {
    await initPromise;
    return ALL_EXERCISES;
};

// Helper functions
export const getExercisesByMuscle = (muscle) => ALL_EXERCISES.filter(e => e.primaryMuscle === muscle || e.secondaryMuscles?.includes(muscle));
export const getExercisesByGender = (gender) => ALL_EXERCISES.filter(e => e.targetGender === gender);
export const getExerciseById = (id) => ALL_EXERCISES.find(e => e.id === id);
