/**
 * Exercise Engine V2
 * Loads and processes the new exercise catalog with biomechanical data
 */

export const generateExercises = async () => {
    console.log('[Engine V2] 🏋️ Loading NEW exercise system with biomechanics...');

    try {
        const [catalogRes, mapRes] = await Promise.all([
            fetch('/exercise_catalog_v2.json'),
            fetch('/exercise_image_map_v2.json')
        ]);

        if (!catalogRes.ok || !mapRes.ok) {
            console.error('[Engine V2] ❌ Failed to load new catalog');
            console.warn('[Engine V2] Attempting fallback to old system...');

            // Fallback to old system
            const oldCatalog = await fetch('/free_exercise_catalog.json');
            if (oldCatalog.ok) {
                return await import('./engine.js').then(m => m.generateExercises());
            }
            return [];
        }

        const catalog = await catalogRes.json();
        const imageMap = await mapRes.json();

        console.log(`[Engine V2] ✅ Loaded ${catalog.length} exercises with biomechanical data`);
        console.log(`[Engine V2] 📋 Image map contains ${Object.keys(imageMap).length} entries`);

        // Process exercises
        const exercises = catalog.map(exercise => {
            // Ensure image URLs are correct
            const imageName = imageMap[exercise.name] || (exercise.images && exercise.images[0]);
            const hasImage = imageName && imageName.trim() !== '';

            return {
                ...exercise,
                // Ensure arrays exist
                primaryMuscles: exercise.primaryMuscles || [],
                secondaryMuscles: exercise.secondaryMuscles || [],
                equipment: exercise.equipment || ['Bodyweight'],
                instructions: exercise.instructions || [],
                tags: [
                    ...(exercise.primaryMuscles || []).map(m => m.toLowerCase()),
                    ...(exercise.equipment || []).map(e => e.toLowerCase())
                ],
                // Image handling with fallback
                images: hasImage ? [imageName] : [],
                videoUrl: hasImage ? `/exercises/${imageName}` : null,
                thumbnailUrl: hasImage ? `/exercises/${imageName}` : null,
                // Ensure bio mechanics fields exist
                biomechanics: exercise.biomechanics || {
                    mechanism: '',
                    forceVector: '',
                    primaryMuscle: '',
                    fullExplanation: ''
                },
                // Format display fields
                primaryMuscle: exercise.primaryMuscles && exercise.primaryMuscles[0] ?
                    exercise.primaryMuscles[0].charAt(0).toUpperCase() + exercise.primaryMuscles[0].slice(1) :
                    'Full Body',
                targetGender: 'unisex',
                category: exercise.category || 'Strength',
                difficulty: exercise.difficulty || 'Intermediate',
                sets: exercise.sets || 3,
                reps: exercise.reps || '10-12'
            };
        });

        // Sort alphabetically
        exercises.sort((a, b) => a.name.localeCompare(b.name));

        console.log(`[Engine V2] 🚀 Serving ${exercises.length} Exercises (Alphabetically Sorted)`);
        console.log(`[Engine V2] 📊 Categories: ${[...new Set(exercises.map(e => e.category))].join(', ')}`);

        return exercises;

    } catch (e) {
        console.error('[Engine V2] ❌ Critical error:', e);
        console.warn('[Engine V2] Attempting fallback to old system...');

        // Ultimate fallback
        try {
            const oldEngine = await import('./engine.js');
            return await oldEngine.generateExercises();
        } catch (fallbackError) {
            console.error('[Engine V2] ❌ Fallback also failed:', fallbackError);
            return [];
        }
    }
};

// Get exercises (alias for compatibility)
export const getExercises = generateExercises;
