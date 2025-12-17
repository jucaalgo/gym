/**
 * TEST: Intelligent Image Mapper
 * Verifies that exercises can be matched to catalog
 */
import fs from 'fs';

// Load catalog
const catalog = JSON.parse(fs.readFileSync('free_exercise_catalog.json', 'utf-8'));

console.log(`Loaded ${catalog.length} exercises from catalog\n`);

// Normalize function (same as in mapper)
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '')
        .trim();
};

// Test cases from generated exercises
const testCases = [
    { name: 'Barbell Hip Thrust', equipment: 'Barbell', muscle: 'glutes' },
    { name: 'Barbell Squat', equipment: 'Barbell', muscle: 'quadriceps' },
    { name: 'Barbell Bench Press', equipment: 'Barbell', muscle: 'chest' },
    { name: 'Barbell Deadlift', equipment: 'Barbell', muscle: 'hamstrings' },
    { name: 'Dumbbell Curl', equipment: 'Dumbbell', muscle: 'biceps' },
    { name: 'Barbell Hip Thrust (Pause)', equipment: 'Barbell', muscle: 'glutes' }, // Variation test
    { name: 'Dumbbell Bench Press (Unilateral)', equipment: 'Dumbbell', muscle: 'chest' }, // Variation test
    { name: 'Smith Machine Squat', equipment: 'Machine', muscle: 'quadriceps' },
];

console.log('=== TESTING INTELLIGENT MATCHER ===\n');

testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: "${test.name}"`);
    console.log(`  Equipment: ${test.equipment}, Muscle: ${test.muscle}`);

    const normalized = normalizeName(test.name);
    const words = test.name.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    // Try exact match
    let match = catalog.find(ex => normalizeName(ex.name) === normalized);
    if (match) {
        console.log(`  ✅ TIER 1 (Exact): ${match.name}`);
        console.log(`     Image: ${match.images[0]}\n`);
        return;
    }

    // Try all keywords
    match = catalog.find(ex => {
        const exNorm = normalizeName(ex.name);
        return words.every(word => exNorm.includes(word.replace(/[^a-z0-9]/g, '')));
    });
    if (match) {
        console.log(`  ✅ TIER 3 (Keywords): ${match.name}`);
        console.log(`     Image: ${match.images[0]}\n`);
        return;
    }

    // Try equipment + base movement
    const baseMovement = test.name.toLowerCase().replace(test.equipment.toLowerCase(), '').trim();
    match = catalog.find(ex => {
        const matchesEquip = ex.equipment?.toLowerCase() === test.equipment.toLowerCase();
        const matchesMove = normalizeName(ex.name).includes(normalizeName(baseMovement));
        return matchesEquip && matchesMove;
    });
    if (match) {
        console.log(`  ✅ TIER 4 (Equipment+Movement): ${match.name}`);
        console.log(`     Image: ${match.images[0]}\n`);
        return;
    }

    // Try muscle + any keyword
    match = catalog.find(ex => {
        const matchesMuscle = ex.primaryMuscles?.some(m =>
            m.toLowerCase().includes(test.muscle.toLowerCase())
        );
        const anyKeyword = words.some(word =>
            normalizeName(ex.name).includes(word.replace(/[^a-z0-9]/g, ''))
        );
        return matchesMuscle && anyKeyword;
    });
    if (match) {
        console.log(`  ✅ TIER 5 (Muscle+Keyword): ${match.name}`);
        console.log(`     Image: ${match.images[0]}\n`);
        return;
    }

    console.log(`  ❌ NO MATCH FOUND\n`);
});

// Count matches by equipment
console.log('\n=== COVERAGE BY EQUIPMENT ===');
const byEquipment = {};
catalog.forEach(ex => {
    const eq = ex.equipment || 'none';
    byEquipment[eq] = (byEquipment[eq] || 0) + 1;
});

Object.entries(byEquipment)
    .sort((a, b) => b[1] - a[1])
    .forEach(([eq, count]) => {
        console.log(`${eq}: ${count} exercises`);
    });

console.log('\n✅ Mapper testing complete');
