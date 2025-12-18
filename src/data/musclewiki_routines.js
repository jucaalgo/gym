import { generateRoutines } from './grand_library/engine';
import { getExercises } from './musclewiki_exercises';

export let ALL_ROUTINES = [];

export const initializeRoutines = async () => {
    if (ALL_ROUTINES.length > 0) return ALL_ROUTINES; // Cache
    
    console.log('[Routines] ⏳ Waiting for exercises...');
    const exercises = await getExercises();
    
    console.log('[Routines] 🔨 Generating routines...');
    ALL_ROUTINES = generateRoutines(exercises);
    return ALL_ROUTINES;
};

export const getRoutinesByGender = (gender) => ALL_ROUTINES.filter(r => r.targetGender === gender);
export const getRoutineById = (id) => ALL_ROUTINES.find(r => r.id === id);
export const getFullRoutine = (id) => getRoutineById(id);
