import { BASE_MOVEMENTS } from './src/data/grand_library/base_movements.js';
import { generateExercises } from './src/data/grand_library/engine.js';

console.log('----------------------------------------');
console.log('VERIFICATION RESULTS');
console.log('----------------------------------------');

try {
    console.log(`[PASS] Base Movements Found: ${BASE_MOVEMENTS.length}`);
} catch (e) {
    console.error('[FAIL] Could not read BASE_MOVEMENTS');
}

try {
    const exercises = generateExercises();
    console.log(`[PASS] Total Generated Exercises: ${exercises.length}`);

    if (exercises.length > 500) {
        console.log('[SUCCESS] Goal of 500+ exercises met!');
    } else {
        console.log(`[WARNING] Only ${exercises.length} exercises (Goal: 500)`);
    }
} catch (e) {
    console.error('[FAIL] Engine generation failed:', e);
}
console.log('----------------------------------------');
