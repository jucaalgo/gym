/**
 * MUSCLEWIKI ROUTINE DATABASE (GENERATED)
 * Powered by Grand Library Engine
 */
import { generateRoutines } from './grand_library/engine';
import { ALL_EXERCISES } from './musclewiki_exercises';

export const ALL_ROUTINES = generateRoutines(ALL_EXERCISES);
// export const ALL_ROUTINES = []; // DEBUG MODE: Empty array

export const getRoutinesByGender = (gender) => ALL_ROUTINES.filter(r => r.targetGender === gender);
export const getRoutineById = (id) => ALL_ROUTINES.find(r => r.id === id);
export const getFullRoutine = (id) => getRoutineById(id);
