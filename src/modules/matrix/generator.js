/**
 * ANTIGRAVITY - THE MATRIX: Routine Generator Engine
 * Implements: Archetype Logic, Stress Override, Time Fallback
 */

import {
    ARCHETYPES,
    STRESS_PROTOCOLS,
    getArchetypeById,
    checkStressOverride,
    checkTimeOverride
} from '../../data/archetypes';

import {
    exercises,
    getExercisesByArchetype,
    getRecoveryExercises,
    shuffleArray
} from '../../data/exercises';

import { SUGGESTED_ROUTINES, getRoutineById } from '../../data/routines';
import { realExercisesAdapter } from '../../data/real_exercises_adapter';

// Helper: Map archetype to preferred muscles with Gender Bias
const getPreferredMuscles = (archetypeId, gender = 'female') => {
    // 60% of routines (Female/Glute focus) vs 40% (Male/Full Body)
    if (gender === 'female') {
        const femaleMap = {
            'ESCULTOR': ['glutes', 'hamstrings', 'shoulders', 'abs', 'quadriceps'], // Hypertrophy but Glute focused
            'GUERRERO': ['quadriceps', 'glutes', 'hamstrings', 'calves', 'lower back'], // Strong Legs
            'FLOW': ['abs', 'glutes', 'shoulders', 'triceps'], // Toning
            'SIN_EXCUSAS': ['glutes', 'quadriceps', 'abs', 'chest'] // Full body but glute biased
        };
        return femaleMap[archetypeId] || ['glutes', 'quadriceps', 'abs'];
    }

    // Male / General Focus (Upper Body Bias / Full Body Strength)
    const maleMap = {
        'ESCULTOR': ['chest', 'shoulders', 'lats', 'biceps', 'triceps'], // Classic Bodybuilding
        'GUERRERO': ['quadriceps', 'hamstrings', 'chest', 'back', 'shoulders'], // Power
        'FLOW': ['abs', 'shoulders', 'lats', 'chest'], // Calisthenics style
        'SIN_EXCUSAS': ['chest', 'quadriceps', 'lats', 'abs']
    };
    return maleMap[archetypeId] || ['chest', 'quadriceps', 'lats'];
};

/**
 * Load a specific suggested routine by ID
 * Updated to work with new routine format
 */
export const loadSuggestedRoutine = (routineId, user) => {
    const routine = getRoutineById(routineId);
    if (!routine) return generateRoutine(user);

    // The new format already has exercises populated
    return {
        exercises: routine.exercises.map((ex, idx) => ({
            ...ex,
            order: idx + 1,
            visualLevel: 2, // Default visual level
            rest: parseInt(ex.rest) || 60
        })),
        archetype: {
            id: routine.id,
            name: routine.name,
            icon: '💪',
            color: 'from-primary to-accent'
        },
        override: null,
        metadata: {
            estimatedDuration: parseInt(routine.duration) || 45,
            estimatedCalories: routine.calories || 350,
            difficulty: routine.difficulty || 'intermediate',
            sets: routine.exercises[0]?.sets || 4,
            reps: routine.exercises[0]?.reps || '10-12',
            restSeconds: parseInt(routine.exercises[0]?.rest) || 60
        },
        message: `Starting: ${routine.name} - ${routine.description}`
    };
};

/**
 * Main Routine Generation Function
 * @param {Object} user - User context object
 * @returns {Object} Generated routine with exercises, metadata, and any overrides
 */
export const generateRoutine = (user) => {
    const result = {
        exercises: [],
        archetype: null,
        override: null,
        metadata: {
            estimatedDuration: 0,
            estimatedCalories: 0,
            difficulty: 0,
            sets: 0,
            reps: '',
            restSeconds: 0,
        },
        message: '',
    };

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: Check for Stress Override (Empowerhouse Logic)
    // ═══════════════════════════════════════════════════════════════
    const stressOverride = checkStressOverride(user.stressLevel);
    if (stressOverride) {
        result.override = stressOverride;
        result.message = stressOverride.message;
        result.archetype = {
            id: 'recovery',
            name: 'Active Recovery',
            icon: '🧘',
            color: 'from-emerald-500 to-teal-600',
        };

        // Get recovery exercises
        const recoveryExercises = getRecoveryExercises();
        result.exercises = shuffleArray(recoveryExercises).slice(0, 5).map((ex, idx) => ({
            ...ex,
            order: idx + 1,
            sets: 1,
            reps: '60 seconds',
            rest: 30,
        }));

        result.metadata = {
            estimatedDuration: 15,
            estimatedCalories: 80,
            difficulty: 2,
            sets: 1,
            reps: '60s hold',
            restSeconds: 30,
        };

        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Check for Time Override (GymVirtual Protocol)
    // ═══════════════════════════════════════════════════════════════
    const timeOverride = checkTimeOverride(user.timeAvailable);
    let activeArchetype;

    if (timeOverride) {
        result.override = timeOverride;
        result.message = timeOverride.message;
        activeArchetype = ARCHETYPES.SIN_EXCUSAS;
    } else {
        // Use user's selected archetype
        activeArchetype = getArchetypeById(user.archetype);
    }

    result.archetype = activeArchetype;

    // ═══════════════════════════════════════════════════════════════
    // STEP 3: Generate Routine Based on Archetype Protocol
    // ═══════════════════════════════════════════════════════════════
    const archetypeExercises = getExercisesByArchetype(activeArchetype.id);
    const protocol = activeArchetype.protocol;

    // Determine exercise count based on time available
    let exerciseCount = 6;
    if (user.timeAvailable < 20) {
        exerciseCount = 4;
    } else if (user.timeAvailable < 30) {
        exerciseCount = 5;
    } else if (user.timeAvailable > 60) {
        exerciseCount = 8;
    }

    // Filter by user's injuries if any
    let filteredExercises = [];

    // Get real exercises from adapter based on archetype preferences
    // UPDATED: Pass user gender to influence muscle selection
    const preferredMuscles = getPreferredMuscles(activeArchetype.id, user.gender);
    preferredMuscles.forEach(muscle => {
        const muscleExercises = realExercisesAdapter.getByMuscle(muscle);
        filteredExercises = [...filteredExercises, ...muscleExercises];
    });

    // If no exercises found, get random from adapter
    if (filteredExercises.length === 0) {
        filteredExercises = realExercisesAdapter.getRandomSample('chest', 10)
            .concat(realExercisesAdapter.getRandomSample('quadriceps', 10))
            .concat(realExercisesAdapter.getRandomSample('lats', 10));
    }

    // Shuffle and select exercises
    const selectedExercises = shuffleArray(filteredExercises).slice(0, exerciseCount);

    // Apply archetype protocol to each exercise
    result.exercises = selectedExercises.map((ex, idx) => {
        const minReps = protocol.repRange[0];
        const maxReps = protocol.repRange[1];
        const reps = Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;

        const minSets = protocol.sets[0];
        const maxSets = protocol.sets[1];
        const sets = Math.floor(Math.random() * (maxSets - minSets + 1)) + minSets;

        const minRest = protocol.restSeconds[0];
        const maxRest = protocol.restSeconds[1];
        const rest = Math.floor(Math.random() * (maxRest - minRest + 1)) + minRest;

        return {
            id: ex.id,
            name: ex.name,
            order: idx + 1,
            sets,
            reps: `${reps}`,
            rest,
            muscle: ex.primaryMuscles ? ex.primaryMuscles[0] : 'general',
            equipment: ex.equipment || 'various',
            _rawData: ex // CRITICAL: Include full exercise data for VisualAsset
        };
    });

    // Calculate metadata
    const avgRest = (protocol.restSeconds[0] + protocol.restSeconds[1]) / 2;
    const avgSets = (protocol.sets[0] + protocol.sets[1]) / 2;
    const exerciseTime = 45; // seconds per exercise
    const totalSeconds = result.exercises.length * avgSets * (exerciseTime + avgRest);

    result.metadata = {
        estimatedDuration: Math.round(totalSeconds / 60),
        estimatedCalories: Math.round(result.exercises.length * avgSets * 8), // ~8 cal per set
        difficulty: Math.round(result.exercises.reduce((acc, ex) => acc + (ex.difficulty || 5), 0) / result.exercises.length),
        sets: `${protocol.sets[0]}-${protocol.sets[1]}`,
        reps: `${protocol.repRange[0]}-${protocol.repRange[1]}`,
        restSeconds: avgRest,
    };

    // Set success message
    if (!result.message) {
        result.message = `${activeArchetype.name} protocol generated. ${result.exercises.length} exercises, ~${result.metadata.estimatedDuration} minutes.`;
    }

    return result;
};

/**
 * Calculate XP earned from workout
 */
export const calculateWorkoutXP = (routine, completedExercises, durationMinutes) => {
    const baseXP = durationMinutes * 10;
    const exerciseCount = routine.exercises ? routine.exercises.length : 1;
    const completionBonus = (completedExercises / exerciseCount) * 50;
    const difficultyBonus = (routine.metadata?.difficulty || 5) * 5;

    return Math.round(baseXP + completionBonus + difficultyBonus);
};

/**
 * Generate warm-up based on routine focus
 */
export const generateWarmup = (routine) => {
    const warmupExercises = [
        { name: 'Shoulder Rotations', duration: '30s', icon: '🔄' },
        { name: 'Hip Circles', duration: '30s', icon: '⭕' },
        { name: 'Bodyweight Squats', duration: '10 reps', icon: '🦵' },
        { name: 'Jumping Jacks', duration: '30s', icon: '⭐' },
    ];

    // Add specific warm-up based on archetype
    if (routine.archetype?.id === 'guerrero') {
        warmupExercises.push({ name: 'Unweighted Deadlift', duration: '10 reps', icon: '🏋️' });
    } else if (routine.archetype?.id === 'escultor') {
        warmupExercises.push({ name: 'Clamshell', duration: '10 each side', icon: '🐚' });
    } else if (routine.archetype?.id === 'flow') {
        warmupExercises.push({ name: 'Wrist Mobility', duration: '30s', icon: '🤲' });
    }

    return warmupExercises;
};

/**
 * Generate cooldown
 */
export const generateCooldown = () => {
    return [
        { name: 'Deep Breathing', duration: '60s', icon: '🧘' },
        { name: 'Hamstring Stretch', duration: '30s each side', icon: '🦵' },
        { name: 'Chest Stretch', duration: '30s', icon: '💪' },
        { name: 'Child\'s Pose', duration: '60s', icon: '🙏' },
    ];
};
