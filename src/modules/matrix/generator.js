/**
 * ANTIGRAVITY - THE MATRIX: Routine Generator Engine
 * REBUILT for MuscleWiki Data Integration
 */

import {
    ALL_ROUTINES,
    getFullRoutine,
    getRoutinesByGender
} from '../../data/musclewiki_routines';
import { ALL_EXERCISES } from '../../data/musclewiki_exercises';

/**
 * Generate a personalized routine based on user profile
 */
export const generateRoutine = async (user) => {
    // 1. Determine Target Gender
    const gender = user?.gender || 'female'; // Default to female focus if unknown

    // 2. Ensure Routines are Loaded
    // We import the async getter to ensure the promise is resolved
    const { getRoutines } = await import('../../data/musclewiki_routines');
    await getRoutines(); // Wait for initialization

    // 3. Get Routines for Gender
    const availableRoutines = getRoutinesByGender(gender);

    if (!availableRoutines || availableRoutines.length === 0) {
        console.warn('No routines found for gender:', gender);
        return null;
    }

    // 4. Select Routine (Random for now, or based on history)
    // TODO: Implement history tracking to cycle split days
    const randomIndex = Math.floor(Math.random() * availableRoutines.length);
    const selectedRoutine = availableRoutines[randomIndex];

    return getFullRoutine(selectedRoutine.id);
};

export const loadSuggestedRoutine = (routineId) => {
    return getFullRoutine(routineId);
};

export const calculateWorkoutXP = (routine) => {
    if (!routine || !routine.exercises) return 0;

    let xp = 0;
    routine.exercises.forEach(ex => {
        // Base XP per set
        xp += (ex.sets || 3) * 10;

        // Bonus for difficulty
        if (ex.difficulty === 'intermediate') xp += 20;
        if (ex.difficulty === 'advanced') xp += 50;
    });

    // Completion Bonus
    xp += 100;

    return xp;
};

// Placeholder for Warmup/Cooldown - can be expanded later
export const generateWarmup = (routine) => {
    return [
        { name: "Light Cardio", duration: "5 min", type: "cardio" },
        { name: "Dynamic Stretching", duration: "3 min", type: "mobility" }
    ];
};

export const generateCooldown = (routine) => {
    return [
        { name: "Static Stretching", duration: "5 min", type: "flexibility" }
    ];
};
