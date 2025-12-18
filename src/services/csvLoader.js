/**
 * CSV Loader Service
 * Parses the 3 core CSV files for Workout OS:
 * 1. NEW_EXERCISES_MASTER.csv - 455 exercises with detailed prompts
 * 2. GENERATED_ROUTINES_300.csv - 300 gender-specific routines
 * 3. VISION_AI_EQUIPMENT_MAPPING.csv - 27 equipment types for AR detection
 */

// Helper to normalize paths with Base URL (for GitHub Pages: /gym/)
const getAssetPath = (path) => {
    // import.meta.env.BASE_URL is '/' in dev and '/gym/' in prod (if configured in vite.config.js)
    const base = import.meta.env.BASE_URL;
    // Remove leading slash from path if base already has trailing slash to avoid //
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
};

/**
 * Parse NEW_EXERCISES_MASTER.csv
 * Format: Exercise Name;Target Muscle;Equipment Used;Biomechanical Explanation;Prompt
 */
export async function loadExercises() {
    try {
        const response = await fetch(getAssetPath('exercises/NEW_EXERCISES_MASTER.csv'));
        const text = await response.text();
        const lines = text.split('\n');

        const exercises = [];

        // Skip header (line 0)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(';');
            if (parts.length < 5) continue;

            const [name, muscle, equipment, biomech, prompt] = parts;

            if (name && prompt) {
                const slug = name
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '_');

                exercises.push({
                    id: slug,
                    name: name.trim(),
                    slug: slug,
                    targetMuscle: muscle ? muscle.trim() : '',
                    equipment: equipment ? equipment.trim() : '',
                    biomechanics: biomech ? biomech.trim() : '',
                    aiPrompt: prompt.trim(),
                    // PREPEND BASE URL TO IMAGE PATH for <img> src tags
                    imagePath: getAssetPath(`exercises/${slug}.png`)
                });
            }
        }

        console.log(`✅ Loaded ${exercises.length} exercises`);
        return exercises;
    } catch (error) {
        console.error('❌ Error loading exercises:', error);
        return [];
    }
}

// Helper to hydrate exercise with image data
function hydrateExerciseData(exerciseName, catalog) {
    if (!catalog || !catalog.length) return {};
    const match = findBestExerciseMatch(catalog, exerciseName);
    if (match) {
        return {
            imagePath: match.imagePath || match.thumbnailUrl || match.gifUrl,
            thumbnailUrl: match.thumbnailUrl || match.imagePath,
            videoUrl: match.videoUrl,
            catalogMatch: true
        };
    }
    return {};
}

/**
 * Parse GENERATED_ROUTINES_300.csv
 */
export async function loadRoutines(exerciseCatalog = []) {
    try {
        const response = await fetch(getAssetPath('exercises/GENERATED_ROUTINES_300.csv'));
        const text = await response.text();
        const lines = text.split('\n');

        const routinesMap = new Map();

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(';');
            if (parts.length < 8) continue;

            const [id, target, order, exercise, sets, reps, rest, rpe] = parts;

            if (!id || !exercise) continue;

            const gender = (id.startsWith('W-') || id.startsWith('F-')) ? 'female' : id.startsWith('M-') ? 'male' : 'unisex';

            if (!routinesMap.has(id)) {
                routinesMap.set(id, {
                    id: id,
                    gender: gender,
                    target: target ? target.trim() : '',
                    exercises: []
                });
            }

            const cleanName = exercise.trim();
            const visualData = hydrateExerciseData(cleanName, exerciseCatalog);

            routinesMap.get(id).exercises.push({
                order: parseInt(order) || 0,
                name: cleanName,
                sets: parseInt(sets) || 3,
                reps: parseInt(reps) || 10,
                rest: parseInt(rest) || 60,
                targetRPE: rpe ? rpe.trim() : '7',
                ...visualData
            });
        }

        const routines = Array.from(routinesMap.values()).map(routine => ({
            ...routine,
            exercises: routine.exercises.sort((a, b) => a.order - b.order)
        }));

        console.log(`✅ Loaded ${routines.length} routines (Hydrated: ${exerciseCatalog.length > 0})`);
        return routines;
    } catch (error) {
        console.error('❌ Error loading routines:', error);
        return [];
    }
}

/**
 * Parse VISION_AI_EQUIPMENT_MAPPING.csv
 */
export async function loadEquipmentMapping() {
    try {
        const response = await fetch(getAssetPath('exercises/VISION_AI_EQUIPMENT_MAPPING.csv'));
        const text = await response.text();
        const lines = text.split('\n');

        const equipment = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const parts = line.split(';');
            if (parts.length < 3) continue;

            const [technicalName, visionLabel, category] = parts;

            if (technicalName && visionLabel) {
                equipment.push({
                    id: visionLabel.trim(),
                    technicalName: technicalName.trim(),
                    visionLabel: visionLabel.trim(),
                    category: category ? category.trim() : 'Unknown'
                });
            }
        }

        console.log(`✅ Loaded ${equipment.length} equipment mappings`);
        return equipment;
    } catch (error) {
        console.error('❌ Error loading equipment mapping:', error);
        return [];
    }
}

export async function loadAllData() {
    try {
        // 1. Load Exercises first to serve as catalog for hydration
        const exercises = await loadExercises();

        // 2. Load Equipment concurrently
        const equipmentPromise = loadEquipmentMapping();

        // 3. Load Routines, passing the exercises catalog for hydration
        const routines = await loadRoutines(exercises);

        const equipment = await equipmentPromise;

        return {
            exercises,
            routines,
            equipment
        };
    } catch (error) {
        console.error('Sequential Data Load Failed:', error);
        return { exercises: [], routines: [], equipment: [] };
    }
}

export function findExerciseBySlug(exercises, slug) {
    return exercises.find(ex => ex.slug === slug);
}

export function findExerciseByName(exercises, name) {
    const normalized = name.toLowerCase().trim();
    return exercises.find(ex =>
        ex.name.toLowerCase() === normalized ||
        ex.slug === normalized
    );
}

// NEW: Fuzzy Matcher to fix "Legacy Feed" issues
export function findBestExerciseMatch(exercises, routineExerciseName) {
    if (!routineExerciseName) return null;

    const normalizedInput = routineExerciseName.toLowerCase().trim();

    // 1. Exact Match (Fastest)
    const exactMatch = exercises.find(ex => ex.name.toLowerCase() === normalizedInput || ex.slug === normalizedInput);
    if (exactMatch) return exactMatch;

    // 2. Token Overlap Score (Jaccard-like)
    // "Barbell Squat" (routine) vs "Squat (Barbell)" (encyclopedia)
    const inputTokens = normalizedInput.replace(/[()]/g, '').split(' ').filter(t => t.length > 2);

    let bestMatch = null;
    let maxScore = 0;

    for (const ex of exercises) {
        const exName = ex.name.toLowerCase();

        // Direct inclusion check (High confidence)
        if (exName.includes(normalizedInput) || normalizedInput.includes(exName)) {
            // Favor the one with closer length ratio to avoid "Squat" matching "Split Squat Jump" too easily
            const lengthRatio = Math.min(exName.length, normalizedInput.length) / Math.max(exName.length, normalizedInput.length);
            if (lengthRatio > 0.6) return ex;
        }

        // Token matching
        const exTokens = exName.replace(/[()]/g, '').split(' ').filter(t => t.length > 2);
        let intersection = 0;

        inputTokens.forEach(token => {
            if (exTokens.some(t => t.includes(token) || token.includes(t))) {
                intersection++;
            }
        });

        const score = intersection / (inputTokens.length + exTokens.length - intersection); // Jaccard Index

        if (score > maxScore) {
            maxScore = score;
            bestMatch = ex;
        }
    }

    // Threshold: Only return if at least 30% similarity or decent score
    if (maxScore > 0.3) {
        return bestMatch;
    }

    return null;
}

export function filterRoutinesByGender(routines, gender) {
    if (gender === 'all') return routines;
    return routines.filter(r => r.gender === gender);
}

export function filterRoutinesByEquipment(routines, exercises, equipmentName) {
    return routines.filter(routine => {
        return routine.exercises.some(ex => {
            const exercise = findExerciseByName(exercises, ex.name);
            return exercise && exercise.equipment.toLowerCase().includes(equipmentName.toLowerCase());
        });
    });
}
