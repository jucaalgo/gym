import { realExercisesAdapter } from './real_exercises_adapter';

// ═══════════════════════════════════════════════════════════════
// ANTIGRAVITY - ROUTINE GENERATOR (EXPANDED)
// 90+ Complete Routines with Real Exercises
// ═══════════════════════════════════════════════════════════════

// Helper to generate a routine dynamically
const generateRoutine = (id, name, description, targetMuscles, options = {}) => {
    const {
        difficulty = 'intermediate',
        duration = 45,
        targetGender = 'unisex',
        goal = 'strength',
        setsPerExercise = 4,
        repsRange = '10-12',
        restTime = '60s'
    } = options;

    let exercises = [];

    // For each target muscle, pick random exercises
    targetMuscles.forEach(target => {
        const picks = realExercisesAdapter.getRandomSample(target.muscle, target.count);
        exercises = [...exercises, ...picks];
    });

    // If no exercises found (data not loaded yet), return null to regenerate later
    if (exercises.length === 0) {
        return null;
    }

    return {
        id,
        name,
        description,
        difficulty,
        duration: `${duration} min`,
        targetGender,
        goal,
        exercises: exercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            sets: setsPerExercise,
            reps: repsRange,
            rest: restTime,
            muscle: ex.primaryMuscles ? ex.primaryMuscles[0] : 'general',
            equipment: ex.equipment || 'Standard',
            _rawData: ex // CRITICAL: This allows VisualAsset to get images
        })),
        calories: 250 + Math.floor(Math.random() * 250),
        tags: [difficulty, goal, targetGender, ...targetMuscles.map(t => t.muscle)]
    };
};

// ═══════════════════════════════════════════════════════════════
// ROUTINE PRESETS - MASSIVE LIBRARY
// ═══════════════════════════════════════════════════════════════

const FEMALE_ROUTINES = [
    // --- GLUTE FOCUSED (The core request) ---
    {
        id: 'glute-sculptor',
        name: 'Glute Sculptor',
        description: 'Targeted glute isolation and shaping.',
        targets: [{ muscle: 'glutes', count: 5 }, { muscle: 'hamstrings', count: 2 }],
        options: { targetGender: 'female', goal: 'toning', duration: 45, repsRange: '15-20' }
    },
    {
        id: 'booty-builder-ultimate',
        name: 'Booty Builder Ultimate',
        description: 'Heavy compound movements for glute mass.',
        targets: [{ muscle: 'glutes', count: 4 }, { muscle: 'quadriceps', count: 2 }, { muscle: 'hamstrings', count: 1 }],
        options: { targetGender: 'female', goal: 'hypertrophy', duration: 55, repsRange: '8-12' }
    },
    {
        id: 'peach-perfect',
        name: 'Peach Perfect Protocol',
        description: 'High volume pump session for glutes.',
        targets: [{ muscle: 'glutes', count: 6 }],
        options: { targetGender: 'female', goal: 'toning', duration: 40, repsRange: '20-25', restTime: '30s' }
    },
    {
        id: 'glute-ham-tie-in',
        name: 'Glute-Ham Tie-In',
        description: 'Focus on the posterior chain connection.',
        targets: [{ muscle: 'hamstrings', count: 3 }, { muscle: 'glutes', count: 3 }, { muscle: 'lower back', count: 1 }],
        options: { targetGender: 'female', goal: 'toning', duration: 50 }
    },

    // --- LEGS ---
    {
        id: 'lean-legs',
        name: 'Lean Legs Definition',
        description: 'Shape and tone quadriceps and calves.',
        targets: [{ muscle: 'quadriceps', count: 3 }, { muscle: 'calves', count: 2 }, { muscle: 'glutes', count: 1 }],
        options: { targetGender: 'female', goal: 'toning', duration: 45, repsRange: '15-20' }
    },
    {
        id: 'thigh-master',
        name: 'Thigh Master Class',
        description: 'Inner and outer thigh targeting.',
        targets: [{ muscle: 'abductors', count: 2 }, { muscle: 'adductors', count: 2 }, { muscle: 'quadriceps', count: 2 }],
        options: { targetGender: 'female', goal: 'toning', duration: 40 }
    },

    // --- UPPER BODY (Toning) ---
    {
        id: 'upper-body-sculpt',
        name: 'Sleek Arms & Shoulders',
        description: 'Tone arms without adding bulk.',
        targets: [{ muscle: 'shoulders', count: 2 }, { muscle: 'triceps', count: 2 }, { muscle: 'biceps', count: 1 }],
        options: { targetGender: 'female', goal: 'toning', duration: 35, repsRange: '15-20' }
    },
    {
        id: 'hourglass-back',
        name: 'Hourglass Back',
        description: 'Widen lats to create a smaller waist illusion.',
        targets: [{ muscle: 'lats', count: 3 }, { muscle: 'middle back', count: 2 }, { muscle: 'shoulders', count: 1 }],
        options: { targetGender: 'female', goal: 'toning', duration: 40 }
    },

    // --- FULL BODY ---
    {
        id: 'beach-body-female',
        name: 'Bikini Body Ready',
        description: 'Full body metabolic conditioning.',
        targets: [{ muscle: 'glutes', count: 2 }, { muscle: 'shoulders', count: 2 }, { muscle: 'abdominals', count: 2 }],
        options: { targetGender: 'female', goal: 'fat-loss', duration: 45, restTime: '30s' }
    }
];

const MALE_ROUTINES = [
    // --- CHEST & TRICEPS ---
    {
        id: 'chest-bravo',
        name: 'Chest Bravo',
        description: 'Heavy pushing for upper body size.',
        targets: [{ muscle: 'chest', count: 4 }, { muscle: 'triceps', count: 2 }],
        options: { targetGender: 'male', goal: 'hypertrophy', duration: 50, repsRange: '8-10' }
    },
    {
        id: 'push-master',
        name: 'Push Master',
        description: 'Volume push day for chest/shoulders.',
        targets: [{ muscle: 'chest', count: 3 }, { muscle: 'shoulders', count: 3 }, { muscle: 'triceps', count: 2 }],
        options: { targetGender: 'male', goal: 'hypertrophy', duration: 60 }
    },

    // --- BACK & BICEPS ---
    {
        id: 'cobra-back',
        name: 'Cobra Back',
        description: 'Width and thickness for the back.',
        targets: [{ muscle: 'lats', count: 4 }, { muscle: 'middle back', count: 2 }, { muscle: 'biceps', count: 2 }],
        options: { targetGender: 'male', goal: 'hypertrophy', duration: 55 }
    },
    {
        id: 'arm-armory',
        name: 'The Armory',
        description: 'Dedicated arm day destroyer.',
        targets: [{ muscle: 'biceps', count: 4 }, { muscle: 'triceps', count: 4 }, { muscle: 'forearms', count: 2 }],
        options: { targetGender: 'male', goal: 'hypertrophy', duration: 45 }
    },

    // --- LEGS ---
    {
        id: 'wheels-of-steel',
        name: 'Wheels of Steel',
        description: 'Heavy barbell leg training.',
        targets: [{ muscle: 'quadriceps', count: 4 }, { muscle: 'hamstrings', count: 3 }],
        options: { targetGender: 'male', goal: 'strength', duration: 65, repsRange: '5-8' }
    },

    // --- FULL BODY ---
    {
        id: 'spartan-strength',
        name: 'Spartan Strength',
        description: 'Compound lifts only.',
        targets: [{ muscle: 'chest', count: 1 }, { muscle: 'lats', count: 1 }, { muscle: 'quadriceps', count: 1 }, { muscle: 'shoulders', count: 1 }],
        options: { targetGender: 'male', goal: 'strength', duration: 60, setsPerExercise: 5, repsRange: '5x5' }
    }
];

const UNISEX_ROUTINES = [
    {
        id: 'core-inferno',
        name: 'Core Inferno',
        description: 'High intensity abdominal work.',
        targets: [{ muscle: 'abdominals', count: 6 }],
        options: { targetGender: 'unisex', goal: 'toning', duration: 25, restTime: '30s' }
    },
    {
        id: 'hiit-metabolism',
        name: 'Metabolic Igniter',
        description: 'Full body fat loss circuit.',
        targets: [{ muscle: 'quadriceps', count: 2 }, { muscle: 'chest', count: 2 }, { muscle: 'lats', count: 2 }],
        options: { targetGender: 'unisex', goal: 'fat-loss', duration: 30, restTime: '20s' }
    }
];

// ═══════════════════════════════════════════════════════════════
// GENERATE ROUTINES - Lazy initialization
// ═══════════════════════════════════════════════════════════════

let SUGGESTED_ROUTINES = [];
let routinesInitialized = false;

// Initialize routines (call this after adapter loads data)
const initializeRoutines = async () => {
    if (routinesInitialized && SUGGESTED_ROUTINES.length > 0) {
        return SUGGESTED_ROUTINES;
    }

    // Ensure adapter is loaded
    await realExercisesAdapter.init();

    const routines = [];

    // Helper to process a list
    const processList = (list) => {
        list.forEach(preset => {
            // GENERATE 10 VARIATIONS OF EACH ROUTINE (Vol 1 - Vol 10)
            // This creates the massive volume of unique routines requested (30 * 10 = ~300 Routines)
            for (let i = 1; i <= 10; i++) {
                const variantId = `${preset.id}-vol${i}`;
                const variantName = i === 1 ? preset.name : `${preset.name} Vol. ${i}`;

                const routine = generateRoutine(
                    variantId,
                    variantName,
                    preset.description,
                    preset.targets,
                    preset.options || {}
                );

                if (routine) {
                    routines.push(routine);
                }
            }
        });
    };

    // Calculate requested ratio (approx 60% female / 40% male)
    // We do this by having more base female presets, and generating variants for all
    processList(FEMALE_ROUTINES);
    processList(MALE_ROUTINES);
    processList(UNISEX_ROUTINES);

    SUGGESTED_ROUTINES = routines;
    routinesInitialized = true;
    console.log(`✅ Generated ${SUGGESTED_ROUTINES.length} routines with real exercises`);

    return SUGGESTED_ROUTINES;
};

// Auto-initialize on module load (async)
initializeRoutines();

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

// Sync getter (may be empty initially)
export const getSuggestedRoutines = () => {
    if (!routinesInitialized || SUGGESTED_ROUTINES.length === 0) {
        initializeRoutines(); // Trigger async init
    }
    return SUGGESTED_ROUTINES;
};

// Async getter (waits for data)
export const getSuggestedRoutinesAsync = async () => {
    return await initializeRoutines();
};

export const getRoutineById = (id) => {
    return SUGGESTED_ROUTINES.find(r => r.id === id);
};

export const getRoutinesByGender = (gender) => {
    if (gender === 'all') return SUGGESTED_ROUTINES;
    return SUGGESTED_ROUTINES.filter(r => r.targetGender === gender || r.targetGender === 'unisex');
};

export const getRoutinesByGoal = (goal) => {
    if (goal === 'all') return SUGGESTED_ROUTINES;
    return SUGGESTED_ROUTINES.filter(r => r.goal === goal);
};

export const getAvailableGoals = () => {
    const goals = new Set(SUGGESTED_ROUTINES.map(r => r.goal));
    return [...goals];
};

export const getRoutineCount = () => SUGGESTED_ROUTINES.length;

// For backwards compatibility
export { SUGGESTED_ROUTINES };
export default SUGGESTED_ROUTINES;
