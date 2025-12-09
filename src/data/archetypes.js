/**
 * ANTIGRAVITY - Archetype Logic Profiles
 * Based on: Real Steel, Modest Muscle, Ulrik On Hands, GymVirtual, Empowerhouse
 */

export const ARCHETYPES = {
    ESCULTOR: {
        id: 'escultor',
        name: 'Escultor Estético',
        icon: '✨',
        description: 'Prioriza la conexión mente-músculo. Énfasis en glúteos, forma y estética.',
        sources: ['Modest Muscle', 'Program 10'],
        color: 'from-pink-500 to-purple-600',
        protocol: {
            repRange: [12, 20],
            sets: [3, 4],
            restSeconds: [45, 60],
            tempoEmphasis: 'time-under-tension',
            frequency: 3, // sessions per week for target muscle
            preferredPatterns: ['isolation', 'hip-dominant', 'unilateral'],
        },
        defaultExerciseTypes: ['glute-bridge', 'hip-thrust', 'romanian-deadlift', 'abduction'],
    },

    GUERRERO: {
        id: 'guerrero',
        name: 'Guerrero de Hierro',
        icon: '⚔️',
        description: 'Sobrecarga progresiva lineal. El peso DEBE subir cada semana.',
        sources: ['Real Steel Fitness', 'Atopedegym'],
        color: 'from-red-500 to-orange-600',
        protocol: {
            repRange: [5, 8],
            sets: [4, 5],
            restSeconds: [180, 240], // 3-4 minutes
            tempoEmphasis: 'explosive-concentric',
            frequency: 2,
            preferredPatterns: ['compound', 'bilateral', 'barbell'],
        },
        defaultExerciseTypes: ['squat', 'bench-press', 'deadlift', 'overhead-press', 'row'],
    },

    FLOW: {
        id: 'flow',
        name: 'Flow y Habilidad',
        icon: '🤸',
        description: 'Gamifica la habilidad. No es "hacer hombro", es desbloquear el Pino.',
        sources: ['Ulrik On Hands', 'Fitness Revolucionario'],
        color: 'from-cyan-500 to-blue-600',
        protocol: {
            repRange: [3, 8], // skill work is lower reps, higher quality
            sets: [5, 8],
            restSeconds: [90, 120],
            tempoEmphasis: 'controlled',
            frequency: 4, // skill requires high frequency
            preferredPatterns: ['skill', 'bodyweight', 'isometric', 'planche', 'handstand'],
        },
        defaultExerciseTypes: ['handstand', 'l-sit', 'muscle-up', 'planche-lean', 'front-lever'],
        skillTree: {
            handstand: ['wall-support', 'kick-up', 'freestanding-5s', 'freestanding-30s'],
            planche: ['lean', 'tuck', 'straddle', 'full'],
        },
    },

    SIN_EXCUSAS: {
        id: 'sin-excusas',
        name: 'Sin Excusas',
        icon: '🔥',
        description: 'Elimina la fricción. Rutinas de 12-20 min, alta densidad, sin material.',
        sources: ['GymVirtual', 'Timberwolf Fitness'],
        color: 'from-yellow-500 to-green-500',
        protocol: {
            repRange: [15, 30],
            sets: [2, 3],
            restSeconds: [15, 30],
            tempoEmphasis: 'metabolic',
            frequency: 5,
            preferredPatterns: ['bodyweight', 'cardio', 'hiit', 'circuit'],
        },
        defaultExerciseTypes: ['burpee', 'mountain-climber', 'jump-squat', 'high-knees', 'plank'],
        maxDuration: 20, // minutes
    },
};

// Empowerhouse Logic - Stress Response Protocol
export const STRESS_PROTOCOLS = {
    HIGH_STRESS: {
        threshold: 8, // If stress > 8
        action: 'SWAP_TO_RECOVERY',
        message: 'Tu nivel de estrés es muy alto. Hoy activamos protocolo de recuperación.',
        replacementType: 'yoga-mobility',
    },
    INJURY_KNEE: {
        condition: 'knee-pain',
        action: 'ELIMINATE_IMPACT',
        message: 'Protegiendo tu rodilla. Sin impacto ni sentadillas profundas.',
        bannedPatterns: ['jump', 'deep-squat', 'lunge'],
        alternatives: ['glute-bridge', 'leg-extension', 'seated-leg-curl'],
    },
    PLATEAU: {
        weeksStagnant: 2,
        action: 'CHANGE_STIMULUS',
        message: 'Tu progreso se ha estancado. Activando semana de variación.',
        variation: 'deload-or-intensity-change',
    },
};

// Time-based fallback (GymVirtual Protocol)
export const FRICTIONLESS_MODE = {
    maxMinutes: 20,
    forcedArchetype: 'SIN_EXCUSAS',
    message: '¿Poco tiempo? Te activo el modo "Sin Excusas" de 15 minutos.',
};

export const getArchetypeById = (id) => {
    return Object.values(ARCHETYPES).find(a => a.id === id) || ARCHETYPES.SIN_EXCUSAS;
};

export const checkStressOverride = (stressLevel) => {
    if (stressLevel >= STRESS_PROTOCOLS.HIGH_STRESS.threshold) {
        return STRESS_PROTOCOLS.HIGH_STRESS;
    }
    return null;
};

export const checkTimeOverride = (availableMinutes) => {
    if (availableMinutes < FRICTIONLESS_MODE.maxMinutes) {
        return FRICTIONLESS_MODE;
    }
    return null;
};
