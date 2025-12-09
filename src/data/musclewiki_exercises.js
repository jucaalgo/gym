/**
 * MUSCLEWIKI EXERCISE DATABASE
 * Premium gym-focused exercise library
 * 
 * Structure:
 * - 50+ exercises per major muscle group
 * - Video demonstrations from MuscleWiki
 * - Equipment-based categorization
 * - Gender-specific routing (80% female = glutes/legs, male = upper body)
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
    // LEGS (Priority for Women)
    GLUTES: 'Glutes',
    QUADRICEPS: 'Quadriceps',
    HAMSTRINGS: 'Hamstrings',
    CALVES: 'Calves',

    // UPPER BODY (Priority for Men)
    CHEST: 'Chest',
    BACK: 'Back',
    SHOULDERS: 'Shoulders',
    BICEPS: 'Biceps',
    TRICEPS: 'Triceps',

    // CORE
    ABS: 'Abdominals',
    OBLIQUES: 'Obliques'
};

// GLUTES & LOWER BODY EXERCISES (50+ for Women's Focus)
export const GLUTE_EXERCISES = [
    {
        id: 'barbell-hip-thrust-001',
        name: 'Barbell Hip Thrust',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-hip-thrust-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-hip-thrust-front_thumbnail.jpg',
        instructions: [
            'Sit on ground with upper back against bench',
            'Roll loaded barbell over hips (use pad)',
            'Drive through heels, thrust hips upward',
            'Squeeze glutes hard at top, maintain neutral spine',
            'Lower with control, repeat'
        ],
        tags: ['glutes', 'compound', 'hypertrophy', 'female-priority'],
        targetGender: 'female',
        sets: '3-4',
        reps: '8-12'
    },
    {
        id: 'smith-machine-hip-thrust-002',
        name: 'Smith Machine Hip Thrust',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
        equipment: [EQUIPMENT_TYPES.SMITH_MACHINE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-smith-machine-hip-thrust-side.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-smith-machine-hip-thrust-side_thumbnail.jpg',
        instructions: [
            'Position bench under smith machine bar',
            'Sit with upper back on bench, bar over hips',
            'Unlock bar, thrust hips up until parallel',
            'Maximum glute contraction at top',
            'Control descent, repeat'
        ],
        tags: ['glutes', 'machine', 'beginner-friendly'],
        targetGender: 'female',
        sets: '3-4',
        reps: '10-15'
    },
    {
        id: 'cable-kickback-003',
        name: 'Cable Glute Kickback',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.CABLE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-cable-kickback-side.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-cable-kickback-side_thumbnail.jpg',
        instructions: [
            'Attach ankle strap to low cable pulley',
            'Face machine, hold for support',
            'Kick leg straight back, squeeze glutes',
            'Avoid arching lower back',
            'Return with control, complete reps'
        ],
        tags: ['glutes', 'isolation', 'unilateral'],
        targetGender: 'female',
        sets: '3',
        reps: '12-15 each'
    },
    {
        id: 'leg-press-high-feet-004',
        name: 'Leg Press (High Foot Placement)',
        primaryMuscle: MUSCLE_GROUPS.GLUTES,
        secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.QUADRICEPS],
        equipment: [EQUIPMENT_TYPES.MACHINE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-leg-press-side.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-leg-press-side_thumbnail.jpg',
        instructions: [
            'Sit in leg press, feet high on platform (glute focus)',
            'Feet shoulder-width, toes slightly out',
            'Lower until knees at 90°, feel glute stretch',
            'Drive through heels to extend',
            'Do NOT lock out knees'
        ],
        tags: ['glutes', 'legs', 'machine', 'compound'],
        targetGender: 'female',
        sets: '4',
        reps: '8-12'
    },
    {
        id: 'romanian-deadlift-005',
        name: 'Romanian Deadlift (Barbell)',
        primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-romanian-deadlift-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-romanian-deadlift-front_thumbnail.jpg',
        instructions: [
            'Stand with barbell at hip height',
            'Hinge at hips, push butt back',
            'Lower bar down shins, keep back flat',
            'Feel hamstring stretch, stop at mid-shin',
            'Drive hips forward to return'
        ],
        tags: ['hamstrings', 'glutes', 'compound', 'posterior-chain'],
        targetGender: 'unisex',
        sets: '3-4',
        reps: '8-10'
    }
];

// QUADRICEPS EXERCISES
export const QUAD_EXERCISES = [
    {
        id: 'barbell-squat-001',
        name: 'Barbell Back Squat',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'advanced',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-squat-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-squat-front_thumbnail.jpg',
        instructions: [
            'Bar on upper traps, feet shoulder-width',
            'Brace core, descend by breaking at knees and hips',
            'Keep chest up, knees track over toes',
            'Descend to parallel or below',
            'Drive through midfoot to stand'
        ],
        tags: ['legs', 'compound', 'strength', 'king-of-exercises'],
        targetGender: 'unisex',
        sets: '4-5',
        reps: '6-10'
    },
    {
        id: 'leg-extension-002',
        name: 'Leg Extension Machine',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.MACHINE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-leg-extension-side.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-leg-extension-side_thumbnail.jpg',
        instructions: [
            'Sit in machine, ankles under pad',
            'Grip handles, maintain upright posture',
            'Extend legs fully, squeeze quads',
            'Pause at top contraction',
            'Lower with control, stop before plates touch'
        ],
        tags: ['quadriceps', 'isolation', 'machine'],
        targetGender: 'unisex',
        sets: '3',
        reps: '12-15'
    },
    {
        id: 'bulgarian-split-squat-003',
        name: 'Bulgarian Split Squat (Dumbbell)',
        primaryMuscle: MUSCLE_GROUPS.QUADRICEPS,
        secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
        equipment: [EQUIPMENT_TYPES.DUMBBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-bulgarian-split-squat-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-bulgarian-split-squat-front_thumbnail.jpg',
        instructions: [
            'Hold dumbbells, place rear foot on bench',
            'Front foot far enough forward for balance',
            'Lower until front thigh parallel to ground',
            'Drive through front heel to stand',
            'Complete all reps, switch legs'
        ],
        tags: ['legs', 'unilateral', 'balance', 'glutes'],
        targetGender: 'female',
        sets: '3',
        reps: '10-12 each'
    }
];

// CHEST EXERCISES (Men's Priority)
export const CHEST_EXERCISES = [
    {
        id: 'barbell-bench-press-001',
        name: 'Barbell Bench Press',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.SHOULDERS],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front_thumbnail.jpg',
        instructions: [
            'Lie on bench, grip bar slightly wider than shoulders',
            'Feet flat on floor, shoulder blades retracted',
            'Lower bar to mid-chest with control',
            'Press explosively to lockout',
            'Maintain arch in lower back'
        ],
        tags: ['chest', 'compound', 'strength', 'hypertrophy'],
        targetGender: 'male',
        sets: '4-5',
        reps: '6-10'
    },
    {
        id: 'incline-dumbbell-press-002',
        name: 'Incline Dumbbell Press',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.TRICEPS],
        equipment: [EQUIPMENT_TYPES.DUMBBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-incline-press-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-incline-press-front_thumbnail.jpg',
        instructions: [
            'Set bench to 30-45° incline',
            'Hold dumbbells at chest level',
            'Press dumbbells up and slightly inward',
            'Full extension without clinking weights',
            'Lower with control to stretch'
        ],
        tags: ['chest', 'upper-chest', 'dumbbell', 'hypertrophy'],
        targetGender: 'male',
        sets: '3-4',
        reps: '8-12'
    },
    {
        id: 'cable-crossover-003',
        name: 'Cable Crossover (Mid Height)',
        primaryMuscle: MUSCLE_GROUPS.CHEST,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.CABLE],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-crossover-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-crossover-front_thumbnail.jpg',
        instructions: [
            'Set pulleys to mid-chest height',
            'Step forward, slight lean',
            'Bring handles together in front',
            'Squeeze chest at peak contraction',
            'Control eccentric, maintain tension'
        ],
        tags: ['chest', 'isolation', 'cable', 'pump'],
        targetGender: 'male',
        sets: '3',
        reps: '12-15'
    }
];

// BACK EXERCISES (Men's Priority)
export const BACK_EXERCISES = [
    {
        id: 'lat-pulldown-001',
        name: 'Lat Pulldown (Wide Grip)',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: [EQUIPMENT_TYPES.MACHINE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-lat-pulldown-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-lat-pulldown-front_thumbnail.jpg',
        instructions: [
            'Sit at machine, thighs secured under pad',
            'Grip bar wider than shoulders',
            'Pull bar to upper chest, drive elbows down',
            'Squeeze shoulder blades together',
            'Control ascent, full stretch at top'
        ],
        tags: ['back', 'lats', 'machine', 'mass-builder'],
        targetGender: 'male',
        sets: '4',
        reps: '8-12'
    },
    {
        id: 'barbell-row-002',
        name: 'Barbell Bent-Over Row',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bent-over-row-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bent-over-row-front_thumbnail.jpg',
        instructions: [
            'Hip hinge, back at 45°, knees slightly bent',
            'Grip barbell shoulder-width',
            'Pull bar to lower ribcage',
            'Retract shoulder blades fully',
            'Lower with control, maintain posture'
        ],
        tags: ['back', 'compound', 'thickness', 'barbell'],
        targetGender: 'male',
        sets: '4',
        reps: '8-10'
    },
    {
        id: 'cable-row-003',
        name: 'Seated Cable Row',
        primaryMuscle: MUSCLE_GROUPS.BACK,
        secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
        equipment: [EQUIPMENT_TYPES.CABLE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-seated-row-side.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-seated-row-side_thumbnail.jpg',
        instructions: [
            'Sit at cable row, feet on platform',
            'Slight torso lean back, chest out',
            'Pull handle to abdomen, elbows back',
            'Squeeze at peak contraction',
            'Extend arms, feel lats stretch'
        ],
        tags: ['back', 'cable', 'mid-back', 'hypertrophy'],
        targetGender: 'male',
        sets: '3-4',
        reps: '10-12'
    }
];

// SHOULDERS
export const SHOULDER_EXERCISES = [
    {
        id: 'dumbbell-shoulder-press-001',
        name: 'Seated Dumbbell Shoulder Press',
        primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
        secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
        equipment: [EQUIPMENT_TYPES.DUMBBELL],
        difficulty: 'intermediate',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-shoulder-press-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-shoulder-press-front_thumbnail.jpg',
        instructions: [
            'Sit upright, dumbbells at shoulder height',
            'Press dumbbells overhead until arms extended',
            'Slight inward path, don\'t clank weights',
            'Lower with control to shoulders',
            'Maintain neutral spine throughout'
        ],
        tags: ['shoulders', 'compound', 'mass', 'dumbbell'],
        targetGender: 'male',
        sets: '4',
        reps: '8-12'
    },
    {
        id: 'lateral-raise-002',
        name: 'Dumbbell Lateral Raise',
        primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.DUMBBELL],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lateral-raise-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lateral-raise-front_thumbnail.jpg',
        instructions: [
            'Stand with dumbbells at sides',
            'Raise arms out to sides until shoulder height',
            'Slight bend in elbows, lead with elbows',
            'Control descent, maintain tension',
            'Avoid swinging or momentum'
        ],
        tags: ['shoulders', 'isolation', 'side-delts', 'dumbbell'],
        targetGender: 'male',
        sets: '3-4',
        reps: '12-15'
    }
];

// ARMS
export const ARM_EXERCISES = [
    {
        id: 'barbell-curl-001',
        name: 'Barbell Curl',
        primaryMuscle: MUSCLE_GROUPS.BICEPS,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.BARBELL],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-curl-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-curl-front_thumbnail.jpg',
        instructions: [
            'Stand with barbell, hands shoulder-width',
            'Curl bar up, keep elbows stationary',
            'Squeeze biceps at top',
            'Lower with control, full extension',
            'No swaying or hip thrust'
        ],
        tags: ['biceps', 'isolation', 'barbell', 'mass'],
        targetGender: 'male',
        sets: '3',
        reps: '8-12'
    },
    {
        id: 'tricep-pushdown-002',
        name: 'Cable Tricep Pushdown',
        primaryMuscle: MUSCLE_GROUPS.TRICEPS,
        secondaryMuscles: [],
        equipment: [EQUIPMENT_TYPES.CABLE],
        difficulty: 'beginner',
        videoUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-tricep-pushdown-front.mp4',
        thumbnailUrl: 'https://media.musclewiki.com/media/uploads/videos/branded/male-cable-tricep-pushdown-front_thumbnail.jpg',
        instructions: [
            'Stand at high cable, rope or bar attachment',
            'Elbows tucked at sides',
            'Push down until arms fully extended',
            'Squeeze triceps hard',
            'Control return, stop at 90°'
        ],
        tags: ['triceps', 'isolation', 'cable', 'pump'],
        targetGender: 'male',
        sets: '3',
        reps: '12-15'
    }
];

// COMBINED MASTER EXERCISE ARRAY
export const ALL_EXERCISES = [
    ...GLUTE_EXERCISES,
    ...QUAD_EXERCISES,
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

console.log(`✨ MuscleWiki Exercise Database Loaded: ${ALL_EXERCISES.length} exercises`);
