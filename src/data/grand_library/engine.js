/**
 * THE GRAND LIBRARY: GENERATION ENGINE V4 (Unified Catalog)
 * Unifies Local AI Assets with Full Catalog
 */
// ══════════════════════════════════════════════════════════════════
// EXERCISE GENERATOR (CATALOG DRIVEN)
// ══════════════════════════════════════════════════════════════════
import { getImageUrl, initializeCatalog, getCatalog } from './image_mapper.js';

export const generateExercises = async () => {
    console.log('[Engine] 🏋️ Starting UNIFIED exercise generation...');

    // 1. Ensure Image Mapper is Initialized (Loads Catalog + AI Manifest)
    const isReady = await initializeCatalog();

    if (!isReady) {
        console.error('[Engine] ❌ Failed to initialize image mapper');
        return [];
    }

    // Get the authoritative catalog from the mapper
    const catalog = getCatalog();
    console.log(`[Engine] ✅ Master Catalog Ready: ${catalog.length} entries`);

    /* DEPRECATED MANUAL FETCH
    let catalog = [];
    try {
        const [catalogRes] = await Promise.all([
            fetch('/free_exercise_catalog.json'),
        ]);

        if (catalogRes.ok) {
            catalog = await catalogRes.json();
            console.log(`[Engine] ✅ Loaded Master Catalog: ${catalog.length} entries`);
        } else {
            console.error('[Engine] ❌ Failed to load catalog');
            return [];
        }
    } catch (e) {
        console.error('[Engine] ❌ Network error loading catalog:', e);
        return [];
    }
    */

    const exercises = [];

    // 2. Iterate the FULL Catalog
    catalog.forEach(item => {
        // Generate consistent id for URL routing (can keep kebab-case for URL cleanliness)
        const id = item.name.toLowerCase()
            .replace(/\//g, '-')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Determine Image Source (Deterministic Map via Image Mapper)
        // const filename = imageMap[item.name];
        // let imageUrl = null;

        const imageUrl = getImageUrl(item.name, item.equipment, item.primaryMuscles?.[0]);

        // if (filename) {
        //     imageUrl = `/exercises/${filename}`;
        // } else {
        //     // Fallback (Should be 0 based on our audit)
        //     // console.warn(`[Engine] Missing image for: ${item.name}`);
        // }

        // Improve Gender/Muscle Metadata mapping
        const primaryMuscle = item.primaryMuscles[0] || 'Full Body';
        const formattedMuscle = primaryMuscle.charAt(0).toUpperCase() + primaryMuscle.slice(1);

        exercises.push({
            id: id,
            name: item.name,
            equipment: [item.equipment || 'Bodyweight'],
            primaryMuscle: formattedMuscle,
            primaryMuscles: item.primaryMuscles || [], // Ensure array exists
            secondaryMuscles: item.secondaryMuscles || [],
            targetGender: 'unisex',
            category: item.category || 'Strength',
            difficulty: item.level || 'Intermediate',

            videoUrl: imageUrl,
            thumbnailUrl: imageUrl,
            images: imageUrl ? [imageUrl] : [], // For consistency
            instructions: item.instructions || ['Perform with good form.'],
            tags: [formattedMuscle.toLowerCase(), item.equipment?.toLowerCase() || ''],
            sets: 3,
            reps: '10-12'
        });
    });

    // 3. Alphabetical Sort (Crucial for UserSanity™)
    exercises.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`[Engine] 🚀 Serving ${exercises.length} Exercises (Sorted)`);
    return exercises;
};


// ══════════════════════════════════════════════════════════════════
// ROUTINE GENERATOR (Preserved)
// ══════════════════════════════════════════════════════════════════

import { MUSCLES } from './modifiers.js';

export const generateRoutines = (allExercises) => {
    console.log('[Engine] 🎯 Starting routine generation...');

    const SPLITS = [
        { name: 'Glute Focus', targetMuscles: 'Glutes', gender: 'female' }, // Approx mapping
        { name: 'Lower Body Sculpt', targetMuscles: 'Quadriceps', gender: 'female' },
        { name: 'Upper Body Toning', targetMuscles: 'Chest', gender: 'female' },
        { name: 'Full Body Burn', targetMuscles: 'Full Body', gender: 'female' },
        { name: 'Chest & Triceps', targetMuscles: 'Chest', gender: 'male' },
        { name: 'Back & Biceps', targetMuscles: 'Lats', gender: 'male' },
        { name: 'Legs & Shoulders', targetMuscles: 'Quadriceps', gender: 'male' },
        { name: 'Push Day', targetMuscles: 'Chest', gender: 'male' },
        { name: 'Pull Day', targetMuscles: 'Middle Back', gender: 'male' },
        { name: 'Core Strength', targetMuscles: 'Abdominals', gender: 'unisex' }
    ];

    const routines = [];

    SPLITS.forEach(split => {
        // Loose matching for routines since we changed the data shape
        let validPool = allExercises.filter(ex =>
            ex.primaryMuscle.includes(split.targetMuscles) ||
            ex.tags.includes(split.targetMuscles.toLowerCase())
        );

        if (validPool.length < 8) validPool = [...allExercises]; // Fallback

        const shuffled = validPool.sort(() => Math.random() - 0.5);
        const selectedExercises = shuffled.slice(0, 8);

        const routineExercises = selectedExercises.map(selected => ({
            id: selected.id,
            name: selected.name,
            muscleGroup: selected.primaryMuscle,
            sets: 3,
            reps: '10-12',
            rest: 60,
            source: 'MuscleWiki',
            _rawData: selected, // Keep full reference for VisualAsset
            thumbnailUrl: selected.thumbnailUrl || selected.gifUrl || selected.videoUrl, // Explicitly pass image
            videoUrl: selected.videoUrl,
            gifUrl: selected.gifUrl
        }));

        routines.push({
            id: split.name.toLowerCase().replace(/\s+/g, '-'),
            name: split.name,
            description: `Targeted ${split.name.toLowerCase()} workout`,
            difficulty: 'Intermediate',
            duration: 45,
            exercises: routineExercises,
            targetMuscles: [split.targetMuscles],
            targetGender: split.gender,
            estimatedDuration: 45,
            estimatedCalories: 300,
            phase: 'Hypertrophy',
            split: split.name,
            createdAt: new Date().toISOString()
        });
    });

    console.log(`[Engine] ✅ Generated ${routines.length} routines`);
    return routines;
};

// No longer need helper matchers as we are mapping 1:1
function findBestExerciseMatch() { return null; }
