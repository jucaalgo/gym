/**
 * THE GRAND LIBRARY: GENERATION ENGINE
 * Procedurally generates 900+ exercises and 300+ routines.
 */
import { EQUIPMENT, MUSCLES } from './modifiers.js';
import { BASE_MOVEMENTS } from './base_movements.js';

// 1. URL HELPER - Using free-exercise-db for exercise images
// GitHub-hosted, 800+ exercises with images, completely free (no API key needed)
const generateVideoUrl = (equipment, slug, gender) => {
    // Create a search-friendly exercise name from slug
    const exerciseName = slug.replace(/-/g, ' ').toLowerCase();

    // Map common exercise names to ExerciseDB IDs (approximation)
    // ExerciseDB uses format: https://api.exercisedb.io/image/{exerciseId}
    // For now, we'll construct a generic query-based approach

    // Convert our slug to a format that might match ExerciseDB naming
    const searchTerm = exerciseName.replace(/\s+/g, '%20');

    // ExerciseDB V1 provides free access to GIFs via direct image URLs
    // Pattern: We'll use a static mapping for common exercises
    // Comprehensive mapping of exercise slugs to ExerciseDB IDs
    // Covers the most common gym exercises from BASE_MOVEMENTS
    const exerciseIdMap = {
        // ═══ GLUTES & LEGS ═══
        'hip-thrust': 'Barbell_Hip_Thrust/0.jpg',
        'barbell-hip-thrust': 'Barbell_Hip_Thrust/0.jpg',
        'smith-machine-hip-thrust': 'Barbell_Hip_Thrust/0.jpg',
        'squat': 'Barbell_Full_Squat/0.jpg',
        'barbell-squat': 'Barbell_Full_Squat/0.jpg',
        'back-squat': 'Barbell_Full_Squat/0.jpg',
        'front-squat': 'Barbell_Front_Squat/0.jpg',
        'goblet-squat': 'Dumbbell_Goblet_Squat/0.jpg',
        'deadlift': 'Barbell_Deadlift/0.jpg',
        'romanian-deadlift': 'Barbell_Romanian_Deadlift/0.jpg',
        'sumo-deadlift': 'Barbell_Sumo_Deadlift/0.jpg',
        'lunge': 'Dumbbell_Lunge/0.jpg',
        'walking-lunge': 'Dumbbell_Walking_Lunge/0.jpg',
        'reverse-lunge': 'Dumbbell_Lunge/0.jpg',
        'split-squat': 'Dumbbell_Split_Squat/0.jpg',
        'bulgarian-split-squat': 'Dumbbell_Bulgarian_Split_Squat/0.jpg',
        'leg-extension': 'Lever_Leg_Extension/0.jpg',
        'leg-curl': 'Lever_Lying_Leg_Curl/0.jpg',
        'leg-press': 'Sled_45_Degree_Leg_Press/0.jpg',
        'calf-raise': 'Standing_Calf_Raise/0.jpg',
        'glute-kickback': 'Kickback/0.jpg',
        'cable-kickback': 'Kickback/0.jpg',

        // ═══ CHEST ═══
        'bench-press': 'Barbell_Bench_Press/0.jpg',
        'barbell-bench-press': 'Barbell_Bench_Press/0.jpg',
        'incline-bench-press': 'Barbell_Incline_Bench_Press/0.jpg',
        'decline-bench-press': 'Barbell_Decline_Bench_Press/0.jpg',
        'dumbbell-press': 'Dumbbell_Bench_Press/0.jpg',
        'incline-dumbbell-press': 'Dumbbell_Incline_Bench_Press/0.jpg',
        'chest-fly': 'Dumbbell_Fly/0.jpg',
        'cable-fly': 'Cable_Cross-over_Variation/0.jpg',
        'cable-crossover': 'Cable_Cross-over_Variation/0.jpg',
        'dumbbell-fly': 'Dumbbell_Fly/0.jpg',
        'pec-deck': 'Lever_Pec_Deck_Fly/0.jpg',
        'push-up': 'Push-up/0.jpg',
        'dip': 'Chest_Dip/0.jpg',

        // ═══ BACK ═══
        'pull-up': 'Pull-up/0.jpg',
        'chin-up': 'Pull-up/0.jpg',
        'lat-pulldown': 'Cable_Lat_Pulldown/0.jpg',
        'wide-grip-pulldown': 'Cable_Lat_Pulldown/0.jpg',
        'seated-row': 'Cable_Seated_Row/0.jpg',
        'cable-row': 'Cable_Seated_Row/0.jpg',
        'bent-over-row': 'Barbell_Bent_Over_Row/0.jpg',
        'barbell-row': 'Barbell_Bent_Over_Row/0.jpg',
        'dumbbell-row': 'Dumbbell_Row/0.jpg',
        't-bar-row': 'Barbell_Rear_Delt_Row/0.jpg',
        'face-pull': 'Cable_Face_Pull/0.jpg',

        // ═══ SHOULDERS ═══
        'shoulder-press': 'Barbell_Seated_Overhead_Press/0.jpg',
        'military-press': 'Barbell_Seated_Overhead_Press/0.jpg',
        'overhead-press': 'Barbell_Seated_Overhead_Press/0.jpg',
        'dumbbell-shoulder-press': 'Dumbbell_Seated_Shoulder_Press/0.jpg',
        'arnold-press': 'Dumbbell_Arnold_Press/0.jpg',
        'lateral-raise': 'Dumbbell_Lateral_Raise/0.jpg',
        'front-raise': 'Dumbbell_Front_Raise/0.jpg',
        'rear-delt-fly': 'Dumbbell_Rear_Delt_Fly/0.jpg',
        'upright-row': 'Barbell_Upright_Row/0.jpg',

        // ═══ BICEPS ═══
        'bicep-curl': 'Barbell_Curl/0.jpg',
        'barbell-curl': 'Barbell_Curl/0.jpg',
        'dumbbell-curl': 'Dumbbell_Bicep_Curl/0.jpg',
        'hammer-curl': 'Dumbbell_Hammer_Curl/0.jpg',
        'concentration-curl': 'Dumbbell_Concentration_Curl/0.jpg',
        'cable-curl': 'Cable_Curl/0.jpg',
        'preacher-curl': 'Barbell_Preacher_Curl/0.jpg',

        // ═══ TRICEPS ═══
        'tricep-extension': 'Dumbbell_Overhead_Triceps_Extension/0.jpg',
        'overhead-extension': 'Dumbbell_Overhead_Triceps_Extension/0.jpg',
        'skull-crusher': 'Barbell_Lying_Triceps_Extension_Skull_Crusher/0.jpg',
        'cable-pushdown': 'Cable_Pushdown/0.jpg',
        'tricep-pushdown': 'Cable_Pushdown/0.jpg',
        'close-grip-bench-press': 'Barbell_Close-Grip_Bench_Press/0.jpg',
        'tricep-dip': 'Tricep_Dips/0.jpg',

        // ═══ CORE/ABS ═══
        'crunch': 'Crunch/0.jpg',
        'sit-up': '3_4_Sit-Up/0.jpg',
        'plank': 'Front_Plank/0.jpg',
        'russian-twist': 'Weighted_Russian_Twist/0.jpg',
        'leg-raise': 'Hanging_Leg_Raise/0.jpg',
        'hanging-leg-raise': 'Hanging_Leg_Raise/0.jpg',
        'bicycle-crunch': 'Bicycle_Crunch/0.jpg',
        'ab-wheel': 'Wheel_Rollout/0.jpg'
    };

    // Try to get mapped image path, otherwise use default
    const imagePath = exerciseIdMap[slug] || 'Barbell_Hip_Thrust/0.jpg';

    // Return GitHub CDN URL (always works, no auth needed)
    return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`;
};

// 2. EXERCISE GENERATOR
export const generateExercises = () => {
    console.log('[Engine] Starting generateExercises...');
    let exercises = [];
    let count = 0;

    if (!BASE_MOVEMENTS) {
        console.error('[Engine] CRITICAL: BASE_MOVEMENTS is undefined!');
        return [];
    }
    console.log(`[Engine] Found ${BASE_MOVEMENTS.length} base movements.`);


    BASE_MOVEMENTS.forEach(move => {
        move.validEquipment.forEach(eq => {
            // Variant Multipliers (Grip, Stance, Angle)
            const variants = ['Standard'];

            // Add procedural variants to explode the count
            if (move.name.includes('Press') || move.name.includes('Row')) {
                variants.push('Wide Grip', 'Close Grip');
            }
            if (move.name.includes('Squat') || move.name.includes('Deadlift')) {
                variants.push('Sumo Stance', 'Pause');
            }
            if (eq === EQUIPMENT.DUMBBELL) {
                variants.push('Unilateral', 'Alternating');
            }
            if (move.name.includes('Curl')) { // Biceps
                variants.push('Hammer', 'Preacher');
            }

            variants.forEach(variant => {
                const isStandard = variant === 'Standard';
                const finalName = isStandard ? `${eq} ${move.name}` : `${eq} ${move.name} (${variant})`;
                const outputGender = move.genderBias === 'female' ? 'female' : 'male'; // Default video gender

                exercises.push({
                    id: `${move.name.toLowerCase().replace(/ /g, '-')}-${eq.toLowerCase()}-${variant.toLowerCase()}-${count++}`,
                    name: finalName,
                    primaryMuscle: move.primary,
                    secondaryMuscles: move.secondary,
                    equipment: [eq],
                    difficulty: 'Intermediate',
                    videoUrl: generateVideoUrl(eq, move.videoSlug, outputGender),
                    thumbnailUrl: generateVideoUrl(eq, move.videoSlug, outputGender).replace('.mp4', '_thumbnail.jpg'),
                    instructions: [
                        `Set up for ${move.name} using ${eq}`,
                        `Maintain stable core and neutral spine`,
                        `Perform ${variant === 'Standard' ? 'standard movement' : variant + ' variation'}`,
                        `Control the eccentric phase`,
                        `Full range of motion`
                    ],
                    tags: [move.primary.toLowerCase(), move.pattern.toLowerCase(), eq.toLowerCase()],
                    targetGender: move.genderBias === 'female' ? 'female' : 'male', // For routine logic
                    sets: move.primary === MUSCLES.GLUTES || move.primary === MUSCLES.QUADS ? 4 : 3,
                    reps: move.primary === MUSCLES.ABS ? '15-20' : '8-12'
                });
            });
        });
    });

    console.log(`[GrandLibrary] Generated ${exercises.length} Exercises.`);
    return exercises;
};

// 3. ROUTINE GENERATOR
export const generateRoutines = (allExercises) => {
    const routines = [];
    const GENDER_MODES = ['female', 'male'];
    const PHASES = ['Hypertrophy', 'Strength', 'Endurance', 'Fat Loss'];
    const SPLITS_FEMALE = ['Glutes & Hamstrings', 'Quads & Calves', 'Full Body Glute Focus', 'Upper Body Toning'];
    const SPLITS_MALE = ['Chest & Triceps', 'Back & Biceps', 'Legs (Quad Focus)', 'Shoulders & Arms', 'Arnold Split'];

    // Generate 300 routines
    // 200 Female
    // 100 Male

    for (let i = 0; i < 300; i++) {
        const isFemale = i < 200;
        const gender = isFemale ? 'female' : 'male';
        const splitPool = isFemale ? SPLITS_FEMALE : SPLITS_MALE;
        const split = splitPool[Math.floor(Math.random() * splitPool.length)];
        const phase = PHASES[i % PHASES.length]; // Rotate phases

        // Logic to pick exercises based on the split
        let routineExercises = [];
        let primaryTarget = '';

        // Map splits to muscle groups
        if (split.includes('Glutes')) primaryTarget = MUSCLES.GLUTES;
        else if (split.includes('Chest')) primaryTarget = MUSCLES.CHEST;
        else if (split.includes('Back')) primaryTarget = MUSCLES.BACK;
        else if (split.includes('Quads') || split.includes('Legs')) primaryTarget = MUSCLES.QUADS;
        else if (split.includes('Shoulders')) primaryTarget = MUSCLES.SHOULDERS;
        else if (split.includes('Arms')) primaryTarget = MUSCLES.BICEPS;
        else if (split.includes('Arnold')) primaryTarget = MUSCLES.CHEST;
        else if (split.includes('Upper Body')) primaryTarget = MUSCLES.CHEST; // Default for upper body

        // ULTRA-AGGRESSIVE FILTERING: Try multiple strategies
        let validPool = [];

        // Strategy 1: Strict filter by split
        validPool = allExercises.filter(ex => {
            const genderMatch = ex.targetGender === gender || ex.targetGender === 'unisex';

            if (split.includes('Full Body')) return genderMatch;
            if (split.includes('Upper Body') || split.includes('Toning')) {
                return genderMatch && (
                    ex.primaryMuscle === MUSCLES.CHEST ||
                    ex.primaryMuscle === MUSCLES.BACK ||
                    ex.primaryMuscle === MUSCLES.SHOULDERS ||
                    ex.primaryMuscle === MUSCLES.BICEPS ||
                    ex.primaryMuscle === MUSCLES.TRICEPS
                );
            }
            if (split.includes('Arms')) {
                return genderMatch && (ex.primaryMuscle === MUSCLES.BICEPS || ex.primaryMuscle === MUSCLES.TRICEPS);
            }
            if (split.includes('Arnold')) {
                return genderMatch && (
                    ex.primaryMuscle === MUSCLES.CHEST ||
                    ex.primaryMuscle === MUSCLES.BACK ||
                    ex.primaryMuscle === MUSCLES.SHOULDERS
                );
            }

            return genderMatch && ex.primaryMuscle === primaryTarget;
        });

        // Strategy 2: If pool too small, broaden to gender-only
        if (validPool.length < 8) {
            console.warn(`[Generator] "${split}" for ${gender} has only ${validPool.length} exercises. Using gender-based fallback.`);
            validPool = allExercises.filter(ex => ex.targetGender === gender || ex.targetGender === 'unisex');
        }

        // Strategy 3: Nuclear option - use ALL exercises if still  too small
        if (validPool.length < 6) {
            console.error(`[Generator] CRITICAL: "${split}" for ${gender} still only has ${validPool.length}. Using ALL exercises.`);
            validPool = [...allExercises];
        }

        // Select 6-8 exercises
        const exerciseCount = Math.min(6 + Math.floor(Math.random() * 3), validPool.length);
        const shuffled = [...validPool].sort(() => 0.5 - Math.random());
        routineExercises = shuffled.slice(0, exerciseCount).map(ex => ({
            ...ex,
            sets: 4,
            reps: phase === 'Strength' ? '5-8' : (phase === 'Endurance' ? '15-20' : '8-12')
        }));

        // FINAL SAFETY CHECK
        if (routineExercises.length === 0) {
            console.error(`[Generator] EMERGENCY: Routine #${i} has 0 exercises after all fallbacks! This should never happen.`);
            // Use first 6 exercises from allExercises as absolute last resort
            routineExercises = allExercises.slice(0, 6).map(ex => ({
                ...ex,
                sets: 4,
                reps: '8-12'
            }));
        }

        routines.push({
            id: `auto-routine-${i}`,
            name: `${phase} - ${split} Protocol ${i + 1}`,
            description: `A ${phase.toLowerCase()} focused session targeting ${split}. Optimized for ${gender}.`,
            difficulty: i % 3 === 0 ? 'advanced' : (i % 2 === 0 ? 'intermediate' : 'beginner'),
            estimatedDuration: 45 + (routineExercises.length * 5),
            estimatedCalories: 300 + (routineExercises.length * 30),
            targetGender: gender,
            goal: phase.toLowerCase(),
            duration: `${45 + Math.floor(Math.random() * 30)} min`,
            equipment: ['Gym Full'],
            exercises: routineExercises,
            tags: [phase, split, gender],
            weeklyFrequency: 3 + (i % 3),
            phase,
            split,
            createdAt: new Date().toISOString()
        });
    }

    console.log(`[GrandLibrary] Generated ${routines.length} Routines.`);
    return routines;
};
