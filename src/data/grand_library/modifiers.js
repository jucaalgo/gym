/**
 * THE GRAND LIBRARY - MODIFIERS
 * Variants that expand base moves into thousands of specific exercises.
 */

// 1. EQUIPMENT MODIFIERS
export const EQUIPMENT = {
    BARBELL: { id: 'barbell', label: 'con Barra', difficultyMod: 1, type: 'free_weight' },
    DUMBBELL: { id: 'dumbbell', label: 'con Mancuernas', difficultyMod: 0, type: 'free_weight' },
    KETTLEBELL: { id: 'kettlebell', label: 'con Kettlebell', difficultyMod: 1, type: 'free_weight' },
    CABLE: { id: 'cable', label: 'en Polea', difficultyMod: -1, type: 'machine' },
    MACHINE: { id: 'machine', label: 'en Máquina', difficultyMod: -2, type: 'machine' },
    SMITH: { id: 'smith', label: 'en Multipower', difficultyMod: -1, type: 'machine' },
    BODYWEIGHT: { id: 'bodyweight', label: '', difficultyMod: 0, type: 'calisthenics' },
    BAND: { id: 'band', label: 'con Banda', difficultyMod: -1, type: 'resistance' },
};

// 2. ANGLE/POSITION MODIFIERS
export const ANGLES = {
    FLAT: { id: 'flat', label: '', focus: 'general' },
    INCLINE: { id: 'incline', label: 'Inclinado', focus: 'upper' },
    DECLINE: { id: 'decline', label: 'Declinado', focus: 'lower' },
    SEATED: { id: 'seated', label: 'Sentado', focus: 'isolation' },
    STANDING: { id: 'standing', label: 'de Pie', focus: 'stability' },
    LYING: { id: 'lying', label: 'Tumbado', focus: 'isolation' },
    KNEELING: { id: 'kneeling', label: 'Arrodillado', focus: 'core_stability' },
    SUPPORTED: { id: 'supported', label: 'con Apoyo', focus: 'strict_isolation' },
    HANGING: { id: 'hanging', label: 'Colgado', focus: 'bodyweight' },
};

// 3. GRIP/STANCE MODIFIERS
export const VARIANTS = {
    STANDARD: { id: 'standard', label: '', mod: 0 },
    WIDE: { id: 'wide', label: 'Agarre Ancho', mod: 0.5 },
    CLOSE: { id: 'close', label: 'Agarre Estrecho', mod: 0.5 },
    REVERSE: { id: 'reverse', label: 'Agarre Inverso', mod: 1 },
    NEUTRAL: { id: 'neutral', label: 'Agarre Neutro', mod: 0 },
    HAMMER: { id: 'hammer', label: 'Agarre Martillo', mod: 0 },
    PRONE: { id: 'prone', label: 'Agarre Prono', mod: 0 },
    SUPINE: { id: 'supine', label: 'Agarre Supino', mod: 0 },
    SUMO: { id: 'sumo', label: 'Sumo', mod: 0 },
    STIFF_LEG: { id: 'stiff_leg', label: 'Piernas Rígidas', mod: 1 },
    SINGLE_ARM: { id: 'single_arm', label: 'a Una Mano', mod: 2 },
    SINGLE_LEG: { id: 'single_leg', label: 'a Una Pierna', mod: 2 },
    WALKING: { id: 'walking', label: 'Caminando', mod: 1 },
    PAUSE: { id: 'pause', label: 'con Pausa', mod: 1 },
    TEMPO: { id: 'tempo', label: 'Tempo 3-0-3', mod: 2 },
    EXPLOSIVE: { id: 'explosive', label: 'Explosivo', mod: 1 },
    DEFICIT: { id: 'deficit', label: 'en Déficit', mod: 1 },
};

// 4. GENDER TARGETING LOGIC
// Defines which variations are popularly targeted or biomechanically emphasized for specific genders
// (Though exercises are unisex, marketing/goals differ)
export const GENDER_TAGS = {
    // Men tend to focus more on upper body width/thickness
    MALE_FOCUS: ['chest', 'shoulders', 'biceps', 'upper_back'],
    // Women tend to focus more on glutes/legs/toning
    FEMALE_FOCUS: ['glutes', 'quads', 'abs', 'triceps'],
};

// 5. VALID COMBINATIONS MATRIX
// Prevents generating "Dumbbell Machine Press" (nonsensical)
export const VALID_COMBOS = {
    bench_press: [
        { eq: ['BARBELL', 'DUMBBELL', 'SMITH', 'MACHINE'], angles: ['FLAT', 'INCLINE', 'DECLINE'], vars: ['STANDARD', 'WIDE', 'CLOSE', 'PAUSE', 'TEMPO', 'EXPLOSIVE'] }
    ],
    chest_fly: [
        { eq: ['DUMBBELL', 'CABLE', 'MACHINE'], angles: ['FLAT', 'INCLINE', 'DECLINE'], vars: ['STANDARD', 'PAUSE', 'TEMPO'] }
    ],
    push_up: [
        { eq: ['BODYWEIGHT', 'BAND'], angles: ['FLAT', 'INCLINE', 'DECLINE'], vars: ['STANDARD', 'WIDE', 'CLOSE', 'PAUSE', 'EXPLOSIVE', 'DEFICIT'] }
    ],
    dips: [
        { eq: ['BODYWEIGHT', 'MACHINE'], angles: ['STANDING'], vars: ['STANDARD', 'PAUSE', 'TEMPO'] }
    ],
    pull_up: [
        { eq: ['BODYWEIGHT', 'BAND', 'MACHINE'], angles: ['HANGING'], vars: ['STANDARD', 'WIDE', 'CLOSE', 'NEUTRAL', 'PAUSE'] }
    ],
    lat_pulldown: [
        { eq: ['CABLE', 'MACHINE'], angles: ['SEATED', 'KNEELING'], vars: ['STANDARD', 'WIDE', 'CLOSE', 'REVERSE', 'NEUTRAL', 'SINGLE_ARM'] }
    ],
    squat: [
        { eq: ['BARBELL', 'DUMBBELL', 'KETTLEBELL', 'SMITH', 'BODYWEIGHT'], angles: ['STANDING'], vars: ['STANDARD', 'SUMO', 'PAUSE', 'TEMPO', 'EXPLOSIVE'] },
        { eq: ['BARBELL', 'DUMBBELL'], angles: ['STANDING'], vars: ['SINGLE_LEG', 'DEFICIT'] }
    ],
    lunge: [
        { eq: ['BARBELL', 'DUMBBELL', 'KETTLEBELL', 'BODYWEIGHT', 'SMITH'], angles: ['STANDING'], vars: ['STANDARD', 'REVERSE', 'WALKING', 'PAUSE', 'DEFICIT'] }
    ],
    leg_press: [
        { eq: ['MACHINE'], angles: ['SEATED', 'INCLINE'], vars: ['STANDARD', 'WIDE', 'CLOSE', 'SINGLE_LEG', 'PAUSE'] }
    ],
    leg_extension: [
        { eq: ['MACHINE', 'CABLE'], angles: ['SEATED'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE', 'TEMPO'] }
    ],
    deadlift: [
        { eq: ['BARBELL', 'DUMBBELL', 'KETTLEBELL', 'SMITH'], angles: ['STANDING'], vars: ['STANDARD', 'SUMO', 'STIFF_LEG', 'PAUSE', 'TEMPO', 'DEFICIT'] }
    ],
    hip_thrust: [
        { eq: ['BARBELL', 'DUMBBELL', 'SMITH', 'MACHINE', 'BAND'], angles: ['LYING', 'SUPPORTED'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE', 'TEMPO'] }
    ],
    leg_curl: [
        { eq: ['MACHINE', 'CABLE', 'BAND'], angles: ['LYING', 'SEATED', 'STANDING'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE'] }
    ],
    glute_kickback: [
        { eq: ['CABLE', 'MACHINE', 'BAND'], angles: ['STANDING', 'KNEELING'], vars: ['STANDARD', 'PAUSE'] }
    ],
    abductor: [
        { eq: ['MACHINE', 'CABLE', 'BAND'], angles: ['SEATED', 'STANDING'], vars: ['STANDARD'] }
    ],
    row: [
        { eq: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE'], angles: ['STANDING', 'SEATED', 'SUPPORTED', 'KNEELING'], vars: ['NEUTRAL', 'PRONE', 'SUPINE', 'SINGLE_ARM', 'TEMPO', 'PAUSE'] }
    ],
    pullover: [
        { eq: ['DUMBBELL', 'CABLE', 'MACHINE'], angles: ['LYING', 'INCLINE'], vars: ['STANDARD', 'PAUSE'] }
    ],
    overhead_press: [
        { eq: ['BARBELL', 'DUMBBELL', 'KETTLEBELL', 'SMITH', 'MACHINE'], angles: ['STANDING', 'SEATED', 'KNEELING'], vars: ['STANDARD', 'NEUTRAL', 'SINGLE_ARM', 'PAUSE', 'TEMPO'] }
    ],
    lateral_raise: [
        { eq: ['DUMBBELL', 'CABLE', 'MACHINE'], angles: ['STANDING', 'SEATED', 'KNEELING'], vars: ['STANDARD', 'SINGLE_ARM', 'PAUSE'] }
    ],
    front_raise: [
        { eq: ['DUMBBELL', 'CABLE', 'BARBELL'], angles: ['STANDING', 'SEATED'], vars: ['STANDARD', 'NEUTRAL', 'SINGLE_ARM'] }
    ],
    rear_delt_fly: [
        { eq: ['DUMBBELL', 'CABLE', 'MACHINE'], angles: ['SEATED', 'STANDING', 'SUPPORTED'], vars: ['STANDARD', 'PAUSE'] }
    ],
    bicep_curl: [
        { eq: ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BAND'], angles: ['STANDING', 'SEATED', 'INCLINE', 'KNEELING', 'SUPPORTED'], vars: ['STANDARD', 'HAMMER', 'REVERSE', 'SINGLE_ARM', 'PAUSE'] }
    ],
    tricep_extension: [
        { eq: ['BARBELL', 'DUMBBELL', 'CABLE', 'BAND'], angles: ['STANDING', 'LYING', 'SEATED', 'KNEELING'], vars: ['STANDARD', 'SINGLE_ARM', 'REVERSE', 'PAUSE'] }
    ],
    plank: [
        { eq: ['BODYWEIGHT'], angles: ['LYING'], vars: ['STANDARD', 'SINGLE_ARM', 'SINGLE_LEG'] }
    ],
    crunch: [
        { eq: ['BODYWEIGHT', 'CABLE', 'MACHINE'], angles: ['LYING', 'KNEELING'], vars: ['STANDARD', 'REVERSE', 'PAUSE'] }
    ],
    leg_raise: [
        { eq: ['BODYWEIGHT'], angles: ['LYING', 'HANGING'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE'] }
    ],
    // CALVES
    calf_raise_standing: [
        { eq: ['DUMBBELL', 'SMITH', 'MACHINE', 'BODYWEIGHT', 'BARBELL'], angles: ['STANDING'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE', 'TEMPO'] }
    ],
    calf_raise_seated: [
        { eq: ['MACHINE', 'DUMBBELL'], angles: ['SEATED'], vars: ['STANDARD', 'PAUSE', 'TEMPO'] }
    ],
    // TRAPS
    shrugs: [
        { eq: ['BARBELL', 'DUMBBELL', 'SMITH', 'CABLE'], angles: ['STANDING'], vars: ['STANDARD', 'PAUSE'] }
    ],
    face_pull: [
        { eq: ['CABLE', 'BAND'], angles: ['STANDING', 'SEATED', 'KNEELING'], vars: ['STANDARD', 'PAUSE'] }
    ],
    // FOREARMS
    wrist_curl: [
        { eq: ['DUMBBELL', 'BARBELL', 'CABLE'], angles: ['SEATED', 'SUPPORTED'], vars: ['STANDARD', 'REVERSE'] }
    ],
    farmers_walk: [
        { eq: ['DUMBBELL', 'KETTLEBELL', 'BARBELL'], angles: ['STANDING'], vars: ['STANDARD'] }
    ],
    // CARDIO/METABOLIC
    jump_squat: [
        { eq: ['BODYWEIGHT', 'DUMBBELL'], angles: ['STANDING'], vars: ['STANDARD'] }
    ],
    box_jump: [
        { eq: ['BODYWEIGHT'], angles: ['STANDING'], vars: ['STANDARD'] }
    ],
    battle_ropes: [
        { eq: ['BODYWEIGHT'], angles: ['STANDING', 'KNEELING'], vars: ['STANDARD'] }
    ],
    sled_push: [
        { eq: ['MACHINE'], angles: ['STANDING'], vars: ['STANDARD'] }
    ],
    // Catch-all for simple isolation moves
    GENERIC_ISOLATION: [
        { eq: ['DUMBBELL', 'CABLE', 'MACHINE', 'BAND'], angles: ['STANDING', 'SEATED', 'KNEELING'], vars: ['STANDARD', 'SINGLE_ARM', 'PAUSE', 'TEMPO'] }
    ],
    calves: [
        { eq: ['DUMBBELL', 'SMITH', 'MACHINE', 'BODYWEIGHT'], angles: ['STANDING', 'SEATED'], vars: ['STANDARD', 'SINGLE_LEG', 'PAUSE'] }
    ],
    cardio: [
        { eq: ['BODYWEIGHT'], angles: ['STANDING'], vars: ['STANDARD', 'EXPLOSIVE'] }
    ]
};
