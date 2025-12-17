/**
 * THE GRAND LIBRARY: MODIFIERS & CONSTANTS
 * Defines the atomic building blocks for procedural exercise generation.
 */

export const EQUIPMENT = {
    BARBELL: 'Barbell',
    DUMBBELL: 'Dumbbell',
    CABLE: 'Cable',
    MACHINE: 'Machine',
    SMITH: 'Smith Machine',
    BODYWEIGHT: 'Bodyweight',
    KETTLEBELL: 'Kettlebell',
    BAND: 'Band',
    PLATE: 'Plate',
    BULGARIAN_BAG: 'Bulgarian Bag',
    T_BAR: 'T-Bar',
    EZ_BAR: 'EZ Bar',
    TRAP_BAR: 'Trap Bar',
    ROPE: 'Jump Rope',
    MEDICINE_BALL: 'Medicine Ball'
};

export const MUSCLES = {
    // LOWER BODY (Female Priority)
    GLUTES: 'Glutes',
    QUADS: 'Quadriceps',
    HAMS: 'Hamstrings',
    CALVES: 'Calves',
    ADDUCTORS: 'Adductors',
    ABDUCTORS: 'Abductors',
    HIP_FLEXORS: 'Hip Flexors',

    // UPPER BODY (Male Priority)
    CHEST: 'Chest',
    BACK: 'Back',
    SHOULDERS: 'Shoulders',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',
    TRAPS: 'Traps',
    FOREARMS: 'Forearms',

    // CORE & OTHER
    ABS: 'Abdominals',
    OBLIQUES: 'Obliques',
    LOWER_BACK: 'Lower Back',
    FULL_BODY: 'Full Body',
    CARDIO: 'Cardio'
};

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export const MOVEMENT_PATTERNS = {
    SQUAT: 'Squat',
    HINGE: 'Hinge',
    LUNGE: 'Lunge',
    PUSH_HORIZONTAL: 'Horizontal Push',
    PUSH_VERTICAL: 'Vertical Push',
    PULL_HORIZONTAL: 'Horizontal Pull',
    PULL_VERTICAL: 'Vertical Pull',
    ISOLATION: 'Isolation',
    CARRY: 'Carry'
};
