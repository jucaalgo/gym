import fs from 'fs';

// Load catalog
const catalogRaw = fs.readFileSync('public/free_exercise_catalog.json', 'utf8');
const EXERCISE_CATALOG = JSON.parse(catalogRaw);

console.log(`Loaded ${EXERCISE_CATALOG.length} exercises.`);

// Mock Image Mapper Logic
const normalizeName = (name) => {
    return name.toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '')
        .trim();
};

const findExerciseMatch = (exerciseName, equipment, targetMuscle) => {
    const normalized = normalizeName(exerciseName);
    const words = exerciseName.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // TIER 1
    let match = EXERCISE_CATALOG.find(ex => normalizeName(ex.name) === normalized);
    if (match) return { match, tier: 1 };

    // TIER 2
    match = EXERCISE_CATALOG.find(ex => normalizeName(ex.id) === normalized);
    if (match) return { match, tier: 2 };

    return null;
};

const getImageUrl = (name, eq, target) => {
    const result = findExerciseMatch(name, eq, target);
    if (result && result.match && result.match.images.length > 0) {
        return `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${result.match.images[0]}`;
    }
    return 'FALLBACK';
};

// Test Cases from Screenshot
const TEST_CASES = [
    { name: 'Barbell Hip Thrust', eq: 'barbell', target: 'glutes' },
    { name: 'Smith Machine Hip Thrust', eq: 'smith machine', target: 'glutes' },
    { name: 'Dumbbell Hip Thrust', eq: 'dumbbell', target: 'glutes' },
    { name: 'Barbell Squat', eq: 'barbell', target: 'quadriceps' }
];

console.log('--- TESTING MAPPING ---');
TEST_CASES.forEach(tc => {
    const url = getImageUrl(tc.name, tc.eq, tc.target);
    console.log(`[${tc.name}] => ${url}`);
});
