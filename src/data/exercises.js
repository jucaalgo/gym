import GRAND_LIBRARY from './grand_library/index';

/**
 * ANTIGRAVITY - Atoms of Movement Database
 * Now powered by the GRAND LIBRARY procedural engine.
 */

// Core curated exercises (Manually defined for specific archetypes to ensure specific logic interactions)
const curated_exercises = [
    // ════════ GUERRERO DE HIERRO (Manual Overrides) ════════
    {
        id: 'squat-barbell-master',
        name: 'Sentadilla con Barra (Master)',
        muscleGroup: 'Piernas',
        type: 'compound',
        pattern: 'bilateral',
        equipment: ['barra', 'rack'],
        source: 'Real Steel',
        visualLevel: 2, // 4K Video
        archetypes: ['guerrero'],
        difficulty: 7,
        videoUrl: "https://videos.pexels.com/video-files/5319759/5319759-sd_640_360_25fps.mp4",
    },
    {
        id: 'deadlift-conventional-master',
        name: 'Peso Muerto Convencional (Master)',
        muscleGroup: 'Espalda',
        type: 'compound',
        pattern: 'hip-dominant',
        equipment: ['barra'],
        source: 'Real Steel',
        visualLevel: 2,
        archetypes: ['guerrero'],
        difficulty: 8,
        videoUrl: "https://videos.pexels.com/video-files/5319098/5319098-sd_640_360_25fps.mp4",
    },
    {
        id: 'bench-press-master',
        name: 'Press de Banca (Master)',
        muscleGroup: 'Pecho',
        type: 'compound',
        pattern: 'push-horizontal',
        equipment: ['barra', 'banco'],
        source: 'Real Steel',
        visualLevel: 1, // 3D Atom
        archetypes: ['guerrero'],
        difficulty: 6,
    },

    // ════════ SIN EXCUSAS (Manual Special) ════════
    {
        id: 'burpee-master',
        name: 'Burpee (Metabolic)',
        muscleGroup: 'Full Body',
        type: 'metabolic',
        pattern: 'cardio',
        equipment: ['ninguno'],
        source: 'GymVirtual',
        visualLevel: 2,
        archetypes: ['sin-excusas'],
        difficulty: 6,
        videoUrl: "https://videos.pexels.com/video-files/4259059/4259059-sd_640_360_25fps.mp4",
    },
];

// Merge Grand Library with Curated
// We map the generated items to match the app's expected schema
const processed_library = GRAND_LIBRARY.map(item => {
    // Determine Archetypes dynamically based on physics and difficulty
    let archs = ['guerrero', 'escultor', 'sin-excusas']; // Default availability

    if (item.difficulty > 8) archs = ['guerrero']; // Hardcore only
    else if (item.mechanics === 'isolation') archs = ['escultor']; // Aesthetics only
    else if (item.equipment.includes('calisthenics')) archs = ['sin-excusas', 'flow']; // Bodyweight

    return {
        ...item,
        source: 'Grand Library', // Tag for UI
        archetypes: archs
    };
});

// Export combined list
export const exercises = [...curated_exercises, ...processed_library];

// Helper functions
export const getExercisesByArchetype = (archetypeId) => exercises.filter(ex => ex.archetypes.includes(archetypeId));
export const getExercisesByMuscle = (muscleGroup) => exercises.filter(ex => ex.muscleGroup.toLowerCase() === muscleGroup.toLowerCase());
export const getRecoveryExercises = () => exercises.filter(ex => ex.archetypes.includes('recovery'));

// Randomizer
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
