/**
 * MUSCLEWIKI ROUTINES - SPLIT TRAINING SYSTEM
 * Gender-optimized workout templates
 * 
 * Split Logic: 2 Muscle Groups per Day
 * Women: 80% Lower Body (Glutes/Legs) + 20% Upper Maintenance
 * Men: Balanced Split with Upper Body Priority
 */

import {
    ALL_EXERCISES,
    MUSCLE_GROUPS,
    EQUIPMENT_TYPES,
    getExercisesByMuscle,
    getExercisesByGender
} from './musclewiki_exercises.js';

// WOMEN'S SPLIT ROUTINES (Glutes & Legs Focus)
export const WOMENS_ROUTINES = [
    {
        id: 'women-glutes-hamstrings-vol1',
        name: 'Glute Builder Vol. 1',
        description: 'Maximum glute activation with compound movements',
        targetGender: 'female',
        difficulty: 'intermediate',
        duration: '60-75 min',
        focusMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
        exercises: [
            { exerciseId: 'barbell-hip-thrust-001', sets: 4, reps: '10-12', rest: 90 },
            { exerciseId: 'romanian-deadlift-005', sets: 4, reps: '8-10', rest: 90 },
            { exerciseId: 'leg-press-high-feet-004', sets: 3, reps: '12-15', rest: 60 },
            { exerciseId: 'cable-kickback-003', sets: 3, reps: '15 each', rest: 45 },
            { exerciseId: 'smith-machine-hip-thrust-002', sets: 3, reps: '12-15', rest: 60 },
            { exerciseId: 'bulgarian-split-squat-003', sets: 3, reps: '10 each', rest: 60 }
        ],
        tags: ['glutes', 'hypertrophy', 'female', 'lower-body'],
        weeklyFrequency: 2
    },
    {
        id: 'women-quads-calves-vol1',
        name: 'Quad Sculptor Vol. 1',
        description: 'Leg definition and strength',
        targetGender: 'female',
        difficulty: 'beginner',
        duration: '50-60 min',
        focusMuscles: [MUSCLE_GROUPS.QUADRICEPS, MUSCLE_GROUPS.CALVES],
        exercises: [
            { exerciseId: 'barbell-squat-001', sets: 4, reps: '8-10', rest: 120 },
            { exerciseId: 'leg-extension-002', sets: 3, reps: '12-15', rest: 60 },
            { exerciseId: 'bulgarian-split-squat-003', sets: 3, reps: '12 each', rest: 60 },
            { exerciseId: 'leg-press-high-feet-004', sets: 3, reps: '10-12', rest: 75 }
        ],
        tags: ['quads', 'legs', 'female'],
        weeklyFrequency: 1
    },
    {
        id: 'women-upper-maintenance-vol1',
        name: 'Upper Body Toning',
        description: 'Light upper body work for balance',
        targetGender: 'female',
        difficulty: 'beginner',
        duration: '40-50 min',
        focusMuscles: [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.BACK],
        exercises: [
            { exerciseId: 'lat-pulldown-001', sets: 3, reps: '12-15', rest: 60 },
            { exerciseId: 'dumbbell-shoulder-press-001', sets: 3, reps: '10-12', rest: 60 },
            { exerciseId: 'lateral-raise-002', sets: 3, reps: '12-15', rest: 45 },
            { exerciseId: 'cable-row-003', sets: 3, reps: '12-15', rest: 60 }
        ],
        tags: ['upper-body', 'toning', 'female'],
        weeklyFrequency: 1
    },
    {
        id: 'women-glutes-core-vol2',
        name: 'Glute & Core Combo',
        description: 'Sculpted glutes with core stability',
        targetGender: 'female',
        difficulty: 'intermediate',
        duration: '55-65 min',
        focusMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.ABS],
        exercises: [
            { exerciseId: 'smith-machine-hip-thrust-002', sets: 4, reps: '12-15', rest: 75 },
            { exerciseId: 'cable-kickback-003', sets: 3, reps: '15 each', rest: 45 },
            { exerciseId: 'romanian-deadlift-005', sets: 3, reps: '10-12', rest: 90 },
            { exerciseId: 'leg-press-high-feet-004', sets: 3, reps: '12-15', rest: 60 }
        ],
        tags: ['glutes', 'core', 'female', 'sculpting'],
        weeklyFrequency: 2
    }
];

// MEN'S SPLIT ROUTINES (Upper Body Hypertrophy)
export const MENS_ROUTINES = [
    {
        id: 'men-chest-triceps-vol1',
        name: 'Chest & Triceps Blaster',
        description: 'Push day for upper body mass',
        targetGender: 'male',
        difficulty: 'intermediate',
        duration: '70-80 min',
        focusMuscles: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.TRICEPS],
        exercises: [
            { exerciseId: 'barbell-bench-press-001', sets: 5, reps: '6-8', rest: 180 },
            { exerciseId: 'incline-dumbbell-press-002', sets: 4, reps: '8-10', rest: 120 },
            { exerciseId: 'cable-crossover-003', sets: 3, reps: '12-15', rest: 60 },
            { exerciseId: 'tricep-pushdown-002', sets: 3, reps: '12-15', rest: 60 }
        ],
        tags: ['chest', 'triceps', 'hypertrophy', 'male', 'push'],
        weeklyFrequency: 2
    },
    {
        id: 'men-back-biceps-vol1',
        name: 'Back & Biceps Destroyer',
        description: 'Pull day for thickness and width',
        targetGender: 'male',
        difficulty: 'intermediate',
        duration: '70-80 min',
        focusMuscles: [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.BICEPS],
        exercises: [
            { exerciseId: 'barbell-row-002', sets: 4, reps: '8-10', rest: 120 },
            { exerciseId: 'lat-pulldown-001', sets: 4, reps: '10-12', rest: 90 },
            { exerciseId: 'cable-row-003', sets: 3, reps: '12-15', rest: 75 },
            { exerciseId: 'barbell-curl-001', sets: 3, reps: '10-12', rest: 60 }
        ],
        tags: ['back', 'biceps', 'hypertrophy', 'male', 'pull'],
        weeklyFrequency: 2
    },
    {
        id: 'men-shoulders-abs-vol1',
        name: 'Shoulders & Core Power',
        description: 'Boulder shoulders and solid core',
        targetGender: 'male',
        difficulty: 'intermediate',
        duration: '60-70 min',
        focusMuscles: [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.ABS],
        exercises: [
            { exerciseId: 'dumbbell-shoulder-press-001', sets: 4, reps: '8-10', rest: 90 },
            { exerciseId: 'lateral-raise-002', sets: 4, reps: '12-15', rest: 60 }
        ],
        tags: ['shoulders', 'abs', 'male', 'hypertrophy'],
        weeklyFrequency: 1
    },
    {
        id: 'men-legs-full-vol1',
        name: 'Leg Day Annihilation',
        description: 'Complete lower body development',
        targetGender: 'male',
        difficulty: 'advanced',
        duration: '75-90 min',
        focusMuscles: [MUSCLE_GROUPS.QUADRICEPS, MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.GLUTES],
        exercises: [
            { exerciseId: 'barbell-squat-001', sets: 5, reps: '6-8', rest: 180 },
            { exerciseId: 'romanian-deadlift-005', sets: 4, reps: '8-10', rest: 120 },
            { exerciseId: 'leg-press-high-feet-004', sets: 3, reps: '10-12', rest: 90 },
            { exerciseId: 'leg-extension-002', sets: 3, reps: '12-15', rest: 60 }
        ],
        tags: ['legs', 'compound', 'male', 'strength'],
        weeklyFrequency: 1
    }
];

// COMBINED ROUTINES
export const ALL_ROUTINES = [
    ...WOMENS_ROUTINES,
    ...MENS_ROUTINES
];

// Helper Functions
export const getRoutinesByGender = (gender) => {
    return ALL_ROUTINES.filter(r => r.targetGender === gender);
};

export const getRoutinesByDifficulty = (difficulty) => {
    return ALL_ROUTINES.filter(r => r.difficulty === difficulty);
};

export const getRoutineById = (id) => {
    return ALL_ROUTINES.find(r => r.id === id);
};

// Populate exercises with full data
export const getFullRoutine = (routineId) => {
    const routine = getRoutineById(routineId);
    if (!routine) return null;

    return {
        ...routine,
        exercises: routine.exercises.map(ex => {
            const exerciseData = ALL_EXERCISES.find(e => e.id === ex.exerciseId);
            return {
                ...exerciseData,
                sets: ex.sets,
                reps: ex.reps,
                rest: ex.rest
            };
        })
    };
};

console.log(`✨ MuscleWiki Routines Loaded: ${ALL_ROUTINES.length} split programs`);
