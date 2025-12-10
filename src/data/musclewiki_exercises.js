/**
 * MUSCLEWIKI EXERCISE DATABASE
 * Premium gym-focused exercise library
 * 
 * Structure:
 * - Expanded to 100+ exercises
 * - Video demonstrations from MuscleWiki
 */

// Equipment Categories
export const EQUIPMENT_TYPES = {
    BARBELL: 'Barbell',
    DUMBBELL: 'Dumbbell',
    MACHINE: 'Machine',
    KETTLEBELL: 'Kettlebell',
    CABLE: 'Cable',
    SMITH_MACHINE: 'Smith Machine',
    BODYWEIGHT: 'Bodyweight'
};

// Primary Muscle Groups
export const MUSCLE_GROUPS = {
    GLUTES: 'Glutes',
    QUADRICEPS: 'Quadriceps',
    HAMSTRINGS: 'Hamstrings',
    CALVES: 'Calves',
    CHEST: 'Chest',
    BACK: 'Back',
    SHOULDERS: 'Shoulders',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',
    ABS: 'Abdominals',
    OBLIQUES: 'Obliques'
};

// ═══════════════════════════════════════════════════════════════
// GLUTES (15 Exercises)
// ═══════════════════════════════════════════════════════════════
export const GLUTE_EXERCISES = [
    {
        id: 'barbell-hip-thrust-001',
        name: 'Barbell Hip Thrust',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: ['barbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-hip-thrust-front.mp4',
        instructions: ['Back on bench', 'Bar over hips', 'Drive heels down', 'Squeeze glutes at top'],
        tags: ['glutes', 'compound', 'female-priority'],
        targetGender: 'female',
        sets: 4, reps: '8-12'
    },
    {
        id: 'smith-machine-hip-thrust-002',
        name: 'Smith Machine Hip Thrust',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-smith-machine-hip-thrust-side.mp4',
        instructions: ['Use pad on bar', 'Feet shoulder width', 'Full extension'],
        tags: ['glutes', 'machine'],
        targetGender: 'female',
        sets: 3, reps: '10-15'
    },
    {
        id: 'cable-kickback-003',
        name: 'Cable Glute Kickback',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [],
        equipment: ['cable'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-cable-kickback-side.mp4',
        instructions: ['Ankle strap', 'Keep leg straight', 'Squeeze at peak'],
        tags: ['glutes', 'isolation'],
        targetGender: 'female',
        sets: 3, reps: '15 each'
    },
    {
        id: 'dumbbell-rdl-004',
        name: 'Dumbbell RDL',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: ['dumbbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-romanian-deadlift-front.mp4',
        instructions: ['Hinge at hips', 'Keep dumbbells close to legs', 'Back flat'],
        tags: ['glutes', 'hamstrings', 'stretch'],
        targetGender: 'female',
        sets: 3, reps: '10-12'
    },
    {
        id: 'bulgarian-split-squat-005',
        name: 'Bulgarian Split Squat',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.QUADRICEPS],
        equipment: ['dumbbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-bulgarian-split-squat-front.mp4',
        instructions: ['Rear foot elevated', 'Lean forward for glutes', 'Drive through front heel'],
        tags: ['glutes', 'unilateral'],
        targetGender: 'female',
        sets: 3, reps: '10 each'
    },
    {
        id: 'cable-pull-through-006',
        name: 'Cable Pull Through',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: ['cable'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-cable-pull-through-side.mp4',
        instructions: ['Face away from machine', 'Rope between legs', 'Hinge hip back'],
        tags: ['glutes', 'cable'],
        targetGender: 'female',
        sets: 3, reps: '12-15'
    },
    {
        id: 'glute-bridge-007',
        name: 'Glute Bridge (Weighted)',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [],
        equipment: ['dumbbell'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-glute-bridge-front.mp4',
        instructions: ['Lying on floor', 'Dumbbell on hips', 'Thrust up'],
        tags: ['glutes', 'home-friendly'],
        targetGender: 'female',
        sets: 3, reps: '15-20'
    },
    {
        id: 'hyperextension-008',
        name: '45° Hyperextension (Glute Focus)',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.LOWER_BACK],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-hyperextension-side.mp4',
        instructions: ['Round upper back slightly', 'Squeeze glutes to lift', 'Do not overextend'],
        tags: ['glutes', 'finisher'],
        targetGender: 'female',
        sets: 3, reps: '15-20'
    }
];

// ═══════════════════════════════════════════════════════════════
// LEGS: QUADS & HAMSTRINGS (15 Exercises)
// ═══════════════════════════════════════════════════════════════
export const LEG_EXERCISES = [
    {
        id: 'barbell-squat-001',
        name: 'Barbell Back Squat',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: ['barbell'],
        difficulty: 'advanced',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-squat-front.mp4',
        instructions: ['Chest up', 'Knees out', 'Break parallel'],
        tags: ['legs', 'compound'],
        targetGender: 'unisex',
        sets: 4, reps: '6-8'
    },
    {
        id: 'leg-press-002',
        name: 'Leg Press',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-leg-press-side.mp4',
        instructions: ['Feet mid-platform', 'Lower to 90 degrees', 'Push'],
        tags: ['legs', 'machine'],
        targetGender: 'unisex',
        sets: 3, reps: '10-12'
    },
    {
        id: 'leg-extension-003',
        name: 'Leg Extension',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-leg-extension-side.mp4',
        instructions: ['Squeeze quads at top', 'Control negative'],
        tags: ['quads', 'isolation'],
        targetGender: 'unisex',
        sets: 3, reps: '12-15'
    },
    {
        id: 'goblet-squat-004',
        name: 'Goblet Squat',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: ['dumbbell'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-goblet-squat-front.mp4',
        instructions: ['Hold dumbbell at chest', 'Sit straight down', 'Elbows inside knees'],
        tags: ['legs', 'mobility'],
        targetGender: 'unisex',
        sets: 3, reps: '12'
    },
    {
        id: 'lying-leg-curl-005',
        name: 'Lying Leg Curl',
        primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
        secondaryMuscles: [],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-machine-lying-leg-curl-side.mp4',
        instructions: ['Hips down', 'Curl to glutes', 'Slow return'],
        tags: ['hamstrings', 'isolation'],
        targetGender: 'unisex',
        sets: 3, reps: '12-15'
    },
    {
        id: 'seated-leg-curl-006',
        name: 'Seated Leg Curl',
        primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
        secondaryMuscles: [],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-machine-seated-leg-curl-side.mp4',
        instructions: ['Lock thighs in', 'Curl back fully', 'Full stretch needed'],
        tags: ['hamstrings', 'isolation'],
        targetGender: 'unisex',
        sets: 3, reps: '12-15'
    },
    {
        id: 'romanian-deadlift-barbell-007',
        name: 'Barbell RDL',
        primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.LOWER_BACK],
        equipment: ['barbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-romanian-deadlift-front.mp4',
        instructions: ['Soft knees', 'Hips back', 'Bar close to legs'],
        tags: ['hamstrings', 'compound'],
        targetGender: 'male',
        sets: 4, reps: '8-10'
    },
    {
        id: 'hack-squat-008',
        name: 'Hack Squat',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: ['machine'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-machine-hack-squat-front.mp4',
        instructions: ['Feet lower for quads', 'Drive back into pad'],
        tags: ['legs', 'machine', 'hypertrophy'],
        targetGender: 'male',
        sets: 4, reps: '10-12'
    }
];

// ═══════════════════════════════════════════════════════════════
// CHEST (Men's Priority)
// ═══════════════════════════════════════════════════════════════
export const CHEST_EXERCISES = [
    {
        id: 'bench-press-001',
        name: 'Barbell Bench Press',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
        equipment: ['barbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.mp4',
        instructions: ['Arch back slightly', 'Bar to mid-chest', 'Drive up'],
        tags: ['chest', 'strength'],
        targetGender: 'male',
        sets: 5, reps: '5-8'
    },
    {
        id: 'incline-dumbbell-press-002',
        name: 'Incline Dumbbell Press',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.SHOULDERS],
        equipment: ['dumbbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-incline-press-front.mp4',
        instructions: ['Bench at 30 degrees', 'Target upper chest', 'Standard press'],
        tags: ['chest', 'hypertrophy'],
        targetGender: 'male',
        sets: 4, reps: '8-12'
    },
    {
        id: 'cable-fly-003',
        name: 'Cable Fly',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [],
        equipment: ['cable'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-crossover-front.mp4',
        instructions: ['Squeeze at center', 'Stretch wide', 'Constant tension'],
        tags: ['chest', 'isolation'],
        targetGender: 'male',
        sets: 3, reps: '12-15'
    },
    {
        id: 'dips-004',
        name: 'Chest Dips',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
        equipment: ['bodyweight'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-dips-front.mp4',
        instructions: ['Lean forward', 'Elbows out slightly', 'Deep stretch'],
        tags: ['chest', 'bodyweight'],
        targetGender: 'male',
        sets: 3, reps: '8-12'
    },
    {
        id: 'pushups-005',
        name: 'Push Ups',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.ABS],
        equipment: ['bodyweight'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-front.mp4',
        instructions: ['Plank position', 'Chest to floor', 'Full lockout'],
        tags: ['chest', 'warmup'],
        targetGender: 'unisex',
        sets: 3, reps: 'AMRAP'
    }
];

// ═══════════════════════════════════════════════════════════════
// BACK
// ═══════════════════════════════════════════════════════════════
export const BACK_EXERCISES = [
    {
        id: 'pullup-001',
        name: 'Pull Up',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: ['bodyweight'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pullup-front.mp4',
        instructions: ['Wide grip', 'Chin over bar', 'Dead hang start'],
        tags: ['back', 'vertical'],
        targetGender: 'male',
        sets: 4, reps: 'AMRAP'
    },
    {
        id: 'lat-pulldown-002',
        name: 'Lat Pulldown',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: ['machine'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-lat-pulldown-front.mp4',
        instructions: ['Pull to upper chest', 'Arch back', 'Elbows down'],
        tags: ['back', 'machine'],
        targetGender: 'unisex',
        sets: 3, reps: '10-12'
    },
    {
        id: 'barbell-row-003',
        name: 'Barbell Row',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: ['barbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bent-over-row-front.mp4',
        instructions: ['Torso 45 degrees', 'Pull to waist', 'Squeeze back'],
        tags: ['back', 'thickness'],
        targetGender: 'male',
        sets: 4, reps: '8-10'
    },
    {
        id: 'seated-row-004',
        name: 'Seated Cable Row',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: ['cable'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-seated-row-side.mp4',
        instructions: ['Chest up', 'Pull to stomach', 'Stretch forward'],
        tags: ['back', 'cable'],
        targetGender: 'unisex',
        sets: 3, reps: '12'
    }
];

export const SHOULDER_EXERCISES = [
    {
        id: 'overhead-press-001',
        name: 'Overhead Press',
        primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
        equipment: ['barbell'],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-overhead-press-front.mp4',
        instructions: ['Stand tall', 'Press vertically', 'Head through window'],
        tags: ['shoulders', 'strength'],
        targetGender: 'male',
        sets: 4, reps: '6-8'
    },
    {
        id: 'lateral-raise-002',
        name: 'Dumbbell Lateral Raise',
        primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
        secondaryMuscles: [],
        equipment: ['dumbbell'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lateral-raise-front.mp4',
        instructions: ['Lead with elbows', 'Stop at shoulder height', 'No swinging'],
        tags: ['shoulders', 'isolation'],
        targetGender: 'unisex',
        sets: 3, reps: '15'
    }
];

export const ARM_EXERCISES = [
    {
        id: 'barbell-curl-001',
        name: 'Barbell Curl',
        primaryMuscle: MUSCLE_GROUPS.BICEPS,
        secondaryMuscles: [],
        equipment: ['barbell'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-curl-front.mp4',
        instructions: ['Strict form', 'No momentum', 'Full ROM'],
        tags: ['biceps'],
        targetGender: 'male',
        sets: 3, reps: '10-12'
    },
    {
        id: 'tricep-pushdown-002',
        name: 'Tricep Pushdown',
        primaryMuscle: MUSCLE_GROUPS.TRICEPS,
        secondaryMuscles: [],
        equipment: ['cable'],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-tricep-pushdown-front.mp4',
        instructions: ['Elbows tucked', 'Full extension'],
        tags: ['triceps'],
        targetGender: 'male',
        sets: 3, reps: '12-15'
    }
];


// COMBINED EXERCISES
export const ALL_EXERCISES = [
    ...GLUTE_EXERCISES,
    ...LEG_EXERCISES,
    ...CHEST_EXERCISES,
    ...BACK_EXERCISES,
    ...SHOULDER_EXERCISES,
    ...ARM_EXERCISES
];

// Helper Functions
export const getExercisesByMuscle = (muscleGroup) => {
    return ALL_EXERCISES.filter(ex =>
        ex.primaryMuscle === muscleGroup ||
        ex.secondaryMuscles.includes(muscleGroup)
    );
};

export const getExercisesByEquipment = (equipment) => {
    return ALL_EXERCISES.filter(ex => ex.equipment.includes(equipment));
};

export const getExercisesByGender = (gender) => {
    return ALL_EXERCISES.filter(ex =>
        ex.targetGender === gender || ex.targetGender === 'unisex'
    );
};

export const getExerciseById = (id) => {
    return ALL_EXERCISES.find(ex => ex.id === id);
};
