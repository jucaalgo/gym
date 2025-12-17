/**
 * THE GRAND LIBRARY: BASE MOVEMENTS
 * Defines the core mechanics that can be modified by equipment.
 */
import { EQUIPMENT, MUSCLES, MOVEMENT_PATTERNS } from './modifiers.js';

export const BASE_MOVEMENTS = [
    // ═══════════════════════════════════════════════════════════════
    // GLUTES & LEGS (Priority)
    // ═══════════════════════════════════════════════════════════════
    {
        name: 'Hip Thrust',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.GLUTES,
        secondary: [MUSCLES.HAMS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.SMITH, EQUIPMENT.DUMBBELL, EQUIPMENT.MACHINE, EQUIPMENT.BAND],
        videoSlug: 'hip-thrust', // used for URL generation
        genderBias: 'female'
    },
    {
        name: 'Squat',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.LOWER_BACK],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.BODYWEIGHT, EQUIPMENT.MACHINE, EQUIPMENT.KETTLEBELL],
        videoSlug: 'squat',
        genderBias: 'unisex'
    },
    {
        name: 'Deadlift',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.GLUTES, MUSCLES.BACK],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.SMITH],
        videoSlug: 'deadlift',
        genderBias: 'unisex'
    },
    {
        name: 'Lunge',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.GLUTES,
        secondary: [MUSCLES.QUADS, MUSCLES.HAMS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.BODYWEIGHT, EQUIPMENT.SMITH],
        videoSlug: 'lunge',
        genderBias: 'female'
    },
    {
        name: 'Split Squat',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.SMITH, EQUIPMENT.BODYWEIGHT],
        videoSlug: 'split-squat',
        genderBias: 'female'
    },
    {
        name: 'Leg Press',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.MACHINE],
        videoSlug: 'leg-press',
        genderBias: 'unisex'
    },
    {
        name: 'Kickback',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.GLUTES,
        secondary: [],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.MACHINE, EQUIPMENT.BAND],
        videoSlug: 'kickback',
        genderBias: 'female'
    },
    {
        name: 'Abduction',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABDUCTORS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.CABLE, EQUIPMENT.BAND],
        videoSlug: 'abduction',
        genderBias: 'female'
    },

    // ═══════════════════════════════════════════════════════════════
    // UPPER BODY PUSH (Chest/Shoulders/Triceps)
    // ═══════════════════════════════════════════════════════════════
    {
        name: 'Bench Press',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.TRICEPS, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.MACHINE],
        videoSlug: 'bench-press',
        genderBias: 'male'
    },
    {
        name: 'Overhead Press',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.MACHINE, EQUIPMENT.KETTLEBELL],
        videoSlug: 'overhead-press',
        genderBias: 'male'
    },
    {
        name: 'Lateral Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.SHOULDERS,
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'lateral-raise',
        genderBias: 'male'
    },
    {
        name: 'Tricep Extension',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.TRICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.MACHINE],
        videoSlug: 'tricep-extension',
        genderBias: 'male'
    },
    {
        name: 'Fly',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.CHEST,
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'fly',
        genderBias: 'male'
    },

    // ═══════════════════════════════════════════════════════════════
    // UPPER BODY PULL (Back/Biceps)
    // ═══════════════════════════════════════════════════════════════
    {
        name: 'Row',
        pattern: MOVEMENT_PATTERNS.PULL_HORIZONTAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE, EQUIPMENT.T_BAR],
        videoSlug: 'row',
        genderBias: 'male'
    },
    {
        name: 'Pulldown',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'pulldown',
        genderBias: 'male'
    },
    {
        name: 'Pull Up',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.MACHINE], // Machine implies assisted
        videoSlug: 'pull-up',
        genderBias: 'male'
    },
    {
        name: 'Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE, EQUIPMENT.EZ_BAR],
        videoSlug: 'curl',
        genderBias: 'male'
    },
    {
        name: 'Hammer Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [MUSCLES.FOREARMS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.BAND],
        videoSlug: 'hammer-curl',
        genderBias: 'male'
    },
    {
        name: 'Preacher Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.EZ_BAR, EQUIPMENT.DUMBBELL, EQUIPMENT.MACHINE, EQUIPMENT.BARBELL],
        videoSlug: 'preacher-curl',
        genderBias: 'male'
    },
    {
        name: 'Dip',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.TRICEPS,
        secondary: [MUSCLES.CHEST, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.MACHINE, EQUIPMENT.BAND], // Machine = Assisted Dip
        videoSlug: 'dip',
        genderBias: 'male'
    },
    {
        name: 'Incline Bench Press',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.MACHINE],
        videoSlug: 'incline-bench-press',
        genderBias: 'male'
    },
    {
        name: 'Decline Bench Press',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.MACHINE],
        videoSlug: 'decline-bench-press',
        genderBias: 'male'
    },
    {
        name: 'Front Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.SHOULDERS,
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.PLATE, EQUIPMENT.CABLE],
        videoSlug: 'front-raise',
        genderBias: 'male'
    },
    {
        name: 'Face Pull',
        pattern: MOVEMENT_PATTERNS.PULL_HORIZONTAL,
        primary: MUSCLES.SHOULDERS, // Rear Delt
        secondary: [MUSCLES.TRAPS, MUSCLES.BACK],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.BAND],
        videoSlug: 'face-pull',
        genderBias: 'male'
    },
    {
        name: 'Shrug',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.TRAPS,
        secondary: [],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.CABLE, EQUIPMENT.TRAP_BAR],
        videoSlug: 'shrug',
        genderBias: 'male'
    },
    {
        name: 'Romanian Deadlift',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.GLUTES, MUSCLES.LOWER_BACK],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.SMITH],
        videoSlug: 'romanian-deadlift',
        genderBias: 'female'
    },
    {
        name: 'Good Morning',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.LOWER_BACK, MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.SMITH, EQUIPMENT.BAND],
        videoSlug: 'good-morning',
        genderBias: 'female'
    },
    {
        name: 'Calf Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.CALVES,
        secondary: [],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH, EQUIPMENT.BODYWEIGHT],
        videoSlug: 'calf-raise',
        genderBias: 'unisex'
    },
    {
        name: 'Step Up',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.BODYWEIGHT],
        videoSlug: 'step-up',
        genderBias: 'female'
    },
    {
        name: 'Glute Bridge',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.GLUTES,
        secondary: [MUSCLES.HAMS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.BARBELL, EQUIPMENT.BAND],
        videoSlug: 'glute-bridge',
        genderBias: 'female'
    },
    {
        name: 'Lat Pullover',
        pattern: MOVEMENT_PATTERNS.ISOLATION, // Sort of
        primary: MUSCLES.BACK, // Lats
        secondary: [MUSCLES.CHEST, MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE],
        videoSlug: 'pullover',
        genderBias: 'male'
    },
    {
        name: 'Push Up',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.TRICEPS, MUSCLES.ABS],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'push-up',
        genderBias: 'male'
    },
    {
        name: 'Plank',
        pattern: MOVEMENT_PATTERNS.ISOLATION, // Static
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'plank',
        genderBias: 'unisex'
    },
    {
        name: 'Crunch',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABS,
        secondary: [],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.MACHINE, EQUIPMENT.CABLE],
        videoSlug: 'crunch',
        genderBias: 'unisex'
    },
    {
        name: 'Leg Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABS, // Lower abs
        secondary: [MUSCLES.HIP_FLEXORS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.MACHINE], // Captains chair
        videoSlug: 'leg-raise',
        genderBias: 'unisex'
    },
    {
        name: 'Russian Twist',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.OBLIQUES,
        secondary: [MUSCLES.ABS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.PLATE],
        videoSlug: 'russian-twist',
        genderBias: 'unisex'
    },
    {
        name: 'Burpee',
        pattern: MOVEMENT_PATTERNS.SQUAT, // Complex
        primary: MUSCLES.FULL_BODY,
        secondary: [MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'burpee',
        genderBias: 'unisex'
    },
    {
        name: 'Mountain Climber',
        pattern: MOVEMENT_PATTERNS.ISOLATION, // Core/Cardio
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.CARDIO, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'mountain-climber',
        genderBias: 'unisex'
    },
    {
        name: 'Jump Rope',
        pattern: MOVEMENT_PATTERNS.SQUAT, // Cardio
        primary: MUSCLES.CALVES,
        secondary: [MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.ROPE],
        videoSlug: 'jump-rope',
        genderBias: 'unisex'
    },
    {
        name: 'Split Squat',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.BODYWEIGHT, EQUIPMENT.BULGARIAN_BAG, EQUIPMENT.SMITH],
        videoSlug: 'split-squat',
        genderBias: 'female'
    },
    {
        name: 'Hack Squat',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.BARBELL], // Landmine Hack Squat
        videoSlug: 'hack-squat',
        genderBias: 'male'
    },
    {
        name: 'Nordic Curl',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'nordic-curl',
        genderBias: 'male'
    },
    {
        name: 'Hip Adduction',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ADDUCTORS,
        secondary: [],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.CABLE, EQUIPMENT.BAND],
        videoSlug: 'hip-adduction',
        genderBias: 'female'
    },
    {
        name: 'Hip Abduction',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABDUCTORS, // Glute Medius
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.CABLE, EQUIPMENT.BAND],
        videoSlug: 'hip-abduction',
        genderBias: 'female'
    },
    {
        name: 'Lat Pulldown',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK, // Lats
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'lat-pulldown',
        genderBias: 'male'
    },
    {
        name: 'Seated Row',
        pattern: MOVEMENT_PATTERNS.PULL_HORIZONTAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS, MUSCLES.TRAPS],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'seated-row',
        genderBias: 'male'
    },
    {
        name: 'Chin Up',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS], // Heavy Biceps
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.BAND], // Assist
        videoSlug: 'chin-up',
        genderBias: 'male'
    },
    {
        name: 'Pull Up',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.BAND],
        videoSlug: 'pull-up',
        genderBias: 'male'
    },
    {
        name: 'Fly',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE], // Pec Deck
        videoSlug: 'fly',
        genderBias: 'male'
    },
    {
        name: 'Reverse Fly',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.SHOULDERS, // Rear Delt
        secondary: [MUSCLES.TRAPS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE], // Reverse Pec Deck
        videoSlug: 'reverse-fly',
        genderBias: 'male'
    },
    {
        name: 'Lateral Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.SHOULDERS, // Side Delt
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.MACHINE],
        videoSlug: 'lateral-raise',
        genderBias: 'male'
    },
    {
        name: 'Upright Row',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.TRAPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.EZ_BAR, EQUIPMENT.SMITH],
        videoSlug: 'upright-row',
        genderBias: 'male'
    },
    {
        name: 'Skullcrusher',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.TRICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.EZ_BAR, EQUIPMENT.DUMBBELL],
        videoSlug: 'skullcrusher',
        genderBias: 'male'
    },
    {
        name: 'Tricep Extension',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.TRICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.CABLE, EQUIPMENT.ROPE], // Overhead usually
        videoSlug: 'tricep-extension',
        genderBias: 'male'
    },
    {
        name: 'Concentration Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.DUMBBELL],
        videoSlug: 'concentration-curl',
        genderBias: 'male'
    },
    {
        name: 'Spider Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.EZ_BAR],
        videoSlug: 'spider-curl',
        genderBias: 'male'
    },
    {
        name: 'Bicycle Crunch',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.OBLIQUES],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'bicycle-crunch',
        genderBias: 'unisex'
    },
    {
        name: 'Hanging Leg Raise',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.HIP_FLEXORS],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'hanging-leg-raise',
        genderBias: 'unisex'
    },
    {
        name: 'Ab Rollout',
        pattern: MOVEMENT_PATTERNS.ISOLATION, // Anti-Extension
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.LATS],
        validEquipment: [EQUIPMENT.BODYWEIGHT], // Using wheel or barbell
        videoSlug: 'ab-rollout',
        genderBias: 'male'
    },
    {
        name: 'High Knees',
        pattern: MOVEMENT_PATTERNS.SQUAT, // Cardio
        primary: MUSCLES.CARDIO,
        secondary: [MUSCLES.QUADS, MUSCLES.CALVES],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'high-knees',
        genderBias: 'unisex'
    },
    {
        name: 'Jumping Jacks',
        pattern: MOVEMENT_PATTERNS.SQUAT, // Cardio
        primary: MUSCLES.CARDIO,
        secondary: [MUSCLES.CALVES, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'jumping-jacks',
        genderBias: 'unisex'
    },
    {
        name: 'Leg Extension',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.QUADS,
        secondary: [],
        validEquipment: [EQUIPMENT.MACHINE],
        videoSlug: 'leg-extension',
        genderBias: 'unisex'
    },
    {
        name: 'Leg Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.HAMS,
        secondary: [],
        validEquipment: [EQUIPMENT.MACHINE],
        videoSlug: 'leg-curl',
        genderBias: 'unisex'
    },
    {
        name: 'Chest Press',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.CHEST,
        secondary: [MUSCLES.TRICEPS, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.MACHINE],
        videoSlug: 'chest-press',
        genderBias: 'male'
    },
    {
        name: 'Shoulder Press',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.MACHINE, EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.SMITH],
        videoSlug: 'shoulder-press',
        genderBias: 'male'
    },
    {
        name: 'Cable Crossover',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.CHEST,
        secondary: [],
        validEquipment: [EQUIPMENT.CABLE],
        videoSlug: 'cable-crossover',
        genderBias: 'male'
    },
    {
        name: 'Tricep Pushdown',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.TRICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.CABLE],
        videoSlug: 'tricep-pushdown',
        genderBias: 'male'
    },
    {
        name: 'Cable Curl',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.BICEPS,
        secondary: [],
        validEquipment: [EQUIPMENT.CABLE],
        videoSlug: 'cable-curl',
        genderBias: 'male'
    },
    {
        name: 'Overhead Press',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.TRICEPS, MUSCLES.TRAPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'overhead-press',
        genderBias: 'male'
    },
    {
        name: 'Arnold Press',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.DUMBBELL],
        videoSlug: 'arnold-press',
        genderBias: 'male'
    },
    {
        name: 'Landmine Press',
        pattern: MOVEMENT_PATTERNS.PUSH_VERTICAL,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.CHEST, MUSCLES.TRICEPS],
        validEquipment: [EQUIPMENT.BARBELL],
        videoSlug: 'landmine-press',
        genderBias: 'male'
    },
    {
        name: 'Farmers Walk',
        pattern: MOVEMENT_PATTERNS.CARRY,
        primary: MUSCLES.FOREARMS,
        secondary: [MUSCLES.TRAPS, MUSCLES.ABS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.TRAP_BAR],
        videoSlug: 'farmers-walk',
        genderBias: 'male'
    },
    {
        name: 'Goblet Squat',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.ABS],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'goblet-squat',
        genderBias: 'female'
    },
    {
        name: 'Sumo Deadlift',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.GLUTES,
        secondary: [MUSCLES.QUADS, MUSCLES.HAMS, MUSCLES.LOWER_BACK],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.TRAP_BAR],
        videoSlug: 'sumo-deadlift',
        genderBias: 'female'
    },
    {
        name: 'Front Squat',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.ABS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.SMITH],
        videoSlug: 'front-squat',
        genderBias: 'male'
    },
    {
        name: 'Zercher Squat',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.ABS, MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.BARBELL],
        videoSlug: 'zercher-squat',
        genderBias: 'male'
    },
    {
        name: 'Box Jump',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.CALVES, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.BODYWEIGHT],
        videoSlug: 'box-jump',
        genderBias: 'unisex'
    },
    {
        name: 'Sled Push',
        pattern: MOVEMENT_PATTERNS.PUSH_HORIZONTAL,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.CALVES, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.MACHINE], // Sled
        videoSlug: 'sled-push',
        genderBias: 'male'
    },
    {
        name: 'Sled Pull',
        pattern: MOVEMENT_PATTERNS.PULL_HORIZONTAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.HAMS, MUSCLES.GLUTES, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.MACHINE],
        videoSlug: 'sled-pull',
        genderBias: 'male'
    },
    {
        name: 'Battle Rope',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.SHOULDERS,
        secondary: [MUSCLES.ABS, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.ROPE],
        videoSlug: 'battle-rope',
        genderBias: 'unisex'
    },
    {
        name: 'Kettlebell Swing',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.GLUTES,
        secondary: [MUSCLES.HAMS, MUSCLES.SHOULDERS, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.KETTLEBELL],
        videoSlug: 'kettlebell-swing',
        genderBias: 'female'
    },
    {
        name: 'Turkish Get Up',
        pattern: MOVEMENT_PATTERNS.CARRY,
        primary: MUSCLES.FULL_BODY,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.ABS],
        validEquipment: [EQUIPMENT.KETTLEBELL, EQUIPMENT.DUMBBELL],
        videoSlug: 'turkish-get-up',
        genderBias: 'unisex'
    },
    {
        name: 'Clean',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.FULL_BODY,
        secondary: [MUSCLES.TRAPS, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'clean',
        genderBias: 'male'
    },
    {
        name: 'Snatch',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.FULL_BODY,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.TRAPS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'snatch',
        genderBias: 'male'
    },
    {
        name: 'Thruster',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.FULL_BODY,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.QUADS],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'thruster',
        genderBias: 'unisex'
    },
    {
        name: 'Wall Ball',
        pattern: MOVEMENT_PATTERNS.SQUAT,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.MEDICINE_BALL],
        videoSlug: 'wall-ball',
        genderBias: 'unisex'
    },
    {
        name: 'Medicine Ball Slam',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.ABS,
        secondary: [MUSCLES.SHOULDERS, MUSCLES.CARDIO],
        validEquipment: [EQUIPMENT.MEDICINE_BALL],
        videoSlug: 'medicine-ball-slam',
        genderBias: 'unisex'
    },
    {
        name: 'Pulldown',
        pattern: MOVEMENT_PATTERNS.PULL_VERTICAL,
        primary: MUSCLES.BACK,
        secondary: [MUSCLES.BICEPS],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.MACHINE, EQUIPMENT.BAND],
        videoSlug: 'pulldown',
        genderBias: 'male'
    },
    {
        name: 'Wood Chop',
        pattern: MOVEMENT_PATTERNS.ISOLATION,
        primary: MUSCLES.OBLIQUES,
        secondary: [MUSCLES.ABS, MUSCLES.SHOULDERS],
        validEquipment: [EQUIPMENT.CABLE, EQUIPMENT.DUMBBELL, EQUIPMENT.MEDICINE_BALL],
        videoSlug: 'wood-chop',
        genderBias: 'unisex'
    },
    {
        name: 'Reverse Lunge',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES, MUSCLES.HAMS],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.SMITH],
        videoSlug: 'reverse-lunge',
        genderBias: 'female'
    },
    {
        name: 'Walking Lunge',
        pattern: MOVEMENT_PATTERNS.LUNGE,
        primary: MUSCLES.QUADS,
        secondary: [MUSCLES.GLUTES],
        validEquipment: [EQUIPMENT.BODYWEIGHT, EQUIPMENT.DUMBBELL, EQUIPMENT.BARBELL, EQUIPMENT.KETTLEBELL],
        videoSlug: 'walking-lunge',
        genderBias: 'female'
    },
    {
        name: 'Deficit Deadlift',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.GLUTES, MUSCLES.LOWER_BACK],
        validEquipment: [EQUIPMENT.BARBELL, EQUIPMENT.TRAP_BAR],
        videoSlug: 'deficit-deadlift',
        genderBias: 'male'
    },
    {
        name: 'Single Leg RDL',
        pattern: MOVEMENT_PATTERNS.HINGE,
        primary: MUSCLES.HAMS,
        secondary: [MUSCLES.GLUTES, MUSCLES.LOWER_BACK],
        validEquipment: [EQUIPMENT.DUMBBELL, EQUIPMENT.KETTLEBELL, EQUIPMENT.BODYWEIGHT],
        videoSlug: 'single-leg-rdl',
        genderBias: 'female'
    }
];
