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

/**
 * Parse GENERATED_ROUTINES_300.csv
 */
export async function loadRoutines() {
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

            routinesMap.get(id).exercises.push({
                order: parseInt(order) || 0,
                name: exercise.trim(),
                sets: parseInt(sets) || 3,
                reps: parseInt(reps) || 10,
                rest: rest ? rest.trim() : '60s',
                targetRPE: rpe ? rpe.trim() : '7'
            });
        }

        const routines = Array.from(routinesMap.values()).map(routine => ({
            ...routine,
            exercises: routine.exercises.sort((a, b) => a.order - b.order)
        }));

        console.log(`✅ Loaded ${routines.length} routines`);
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
    const [exercises, routines, equipment] = await Promise.all([
        loadExercises(),
        loadRoutines(),
        loadEquipmentMapping()
    ]);

    return {
        exercises,
        routines,
        equipment
    };
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
