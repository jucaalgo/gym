/**
 * MUSCLEWIKI ROUTINES DATABASE
 * Now powered by CSV data with Encyclopedia image alignment
 */
import { loadAllData, findExerciseByName, findBestExerciseMatch } from '../services/csvLoader';

export let ALL_ROUTINES = [];
let isInitialized = false;

const hydrateRoutineExercises = (routine, exerciseDatabase) => {
    // Match each exercise in the routine with the Encyclopedia database
    // Match each exercise in the routine with the Encyclopedia database
    const hydratedExercises = routine.exercises.map(routineEx => {
        // Use FUZZY MATCHING to find the best image candidate
        const fullExercise = findBestExerciseMatch(exerciseDatabase, routineEx.name);

        if (fullExercise) {
            return {
                ...routineEx,
                id: fullExercise.id,
                slug: fullExercise.slug,
                imagePath: fullExercise.imagePath, // HIGH-QUALITY AI IMAGE
                thumbnailUrl: fullExercise.imagePath,
                videoUrl: fullExercise.imagePath,
                targetMuscle: fullExercise.targetMuscle,
                equipment: fullExercise.equipment,
                biomechanics: fullExercise.biomechanics,
                _rawData: fullExercise // Full reference for VisualAsset
            };
        }

        // Fallback if exercise not found
        console.warn(`[Routines] Exercise not found in Encyclopedia: ${routineEx.name}`);
        return routineEx;
    });

    return {
        ...routine,
        exercises: hydratedExercises
    };
};

export const initializeRoutines = async () => {
    if (isInitialized) return ALL_ROUTINES;

    console.log('[Routines] 🔄 Loading routines from CSV...');
    const { routines, exercises } = await loadAllData();

    console.log('[Routines] 💧 Hydrating exercises with Encyclopedia data...');
    ALL_ROUTINES = routines.map(routine => hydrateRoutineExercises(routine, exercises));

    isInitialized = true;
    console.log(`[Routines] ✅ ${ALL_ROUTINES.length} routines ready with high-quality images`);

    return ALL_ROUTINES;
};

// Start initialization immediately
const initPromise = initializeRoutines();

// Async getter
export const getRoutines = async () => {
    await initPromise;
    return ALL_ROUTINES;
};

export const getRoutinesByGender = (gender) => ALL_ROUTINES.filter(r => r.gender === gender);
export const getRoutineById = (id) => ALL_ROUTINES.find(r => r.id === id);
export const getFullRoutine = (id) => getRoutineById(id);
