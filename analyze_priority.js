import fs from 'fs';

const CATALOG_FILE = 'public/free_exercise_catalog.json';
const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));

console.log(`📊 Analyzing ${catalog.length} exercises...\n`);

// Priority scoring system
function scoreExercise(exercise) {
    let score = 0;

    // 1. Equipment priority (compound exercises > isolation)
    const equipmentScore = {
        'barbell': 10,
        'dumbbell': 9,
        'body only': 8,
        'cable': 7,
        'kettlebell': 6,
        'machine': 5,
        'bands': 4,
        'medicine ball': 3
    };

    const equip = exercise.equipment?.toLowerCase() || '';
    for (const [key, value] of Object.entries(equipmentScore)) {
        if (equip.includes(key)) {
            score += value;
            break;
        }
    }

    // 2. Muscle group priority (major muscle groups > minor)
    const muscleScore = {
        'chest': 10,
        'quadriceps': 10,
        'hamstrings': 9,
        'glutes': 9,
        'lats': 9,
        'middle back': 8,
        'shoulders': 8,
        'triceps': 7,
        'biceps': 7,
        'abdominals': 7,
        'calves': 5,
        'forearms': 4
    };

    const muscles = [...(exercise.primaryMuscles || []), ...(exercise.secondaryMuscles || [])];
    for (const muscle of muscles) {
        const m = muscle.toLowerCase();
        for (const [key, value] of Object.entries(muscleScore)) {
            if (m.includes(key)) {
                score += value;
                break;
            }
        }
    }

    // 3. Name popularity (common exercise names)
    const popularNames = [
        'bench press', 'squat', 'deadlift', 'pull', 'row', 'press',
        'curl', 'lunge', 'dip', 'push-up', 'plank', 'crunch',
        'raise', 'fly', 'extension', 'leg press'
    ];

    const name = exercise.name.toLowerCase();
    for (const keyword of popularNames) {
        if (name.includes(keyword)) {
            score += 5;
            break;
        }
    }

    return score;
}

// Score all exercises
const scoredExercises = catalog.map(ex => ({
    ...ex,
    priority_score: scoreExercise(ex)
}));

// Sort by score (highest first)
scoredExercises.sort((a, b) => b.priority_score - a.priority_score);

// Take top 200
const topExercises = scoredExercises.slice(0, 200);

console.log(`✅ Selected top 200 exercises:\n`);
console.log(`Top 10:`);
topExercises.slice(0, 10).forEach((ex, i) => {
    console.log(`  ${i + 1}. ${ex.name} (score: ${ex.priority_score})`);
});

console.log(`\n...`);
console.log(`\n190-200:`);
topExercises.slice(190, 200).forEach((ex, i) => {
    console.log(`  ${190 + i + 1}. ${ex.name} (score: ${ex.priority_score})`);
});

// Save to file
fs.writeFileSync('priority_exercises.json', JSON.stringify(topExercises, null, 2));
console.log(`\n💾 Saved to priority_exercises.json`);
