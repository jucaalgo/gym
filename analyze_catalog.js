/**
 * Analyze free-exercise-db catalog and create intelligent mapping
 */
import fs from 'fs';

// Load the catalog
const catalog = JSON.parse(fs.readFileSync('free_exercise_catalog.json', 'utf-8'));

console.log(`Total exercises in free-exercise-db: ${catalog.length}`);

// Group by primary muscle
const byMuscle = {};
catalog.forEach(ex => {
    const muscle = ex.primaryMuscles?.[0] || 'unknown';
    if (!byMuscle[muscle]) byMuscle[muscle] = [];
    byMuscle[muscle].push(ex);
});

console.log('\n=== Exercises by Primary Muscle ===');
Object.entries(byMuscle)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([muscle, exercises]) => {
        console.log(`${muscle}: ${exercises.length} exercises`);
    });

// Group by equipment
const byEquipment = {};
catalog.forEach(ex => {
    const equipment = ex.equipment || 'none';
    if (!byEquipment[equipment]) byEquipment[equipment] = [];
    byEquipment[equipment].push(ex);
});

console.log('\n=== Exercises by Equipment ===');
Object.entries(byEquipment)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([equipment, exercises]) => {
        console.log(`${equipment}: ${exercises.length} exercises`);
    });

// Create searchable index by name variations
console.log('\n=== Creating searchable index ===');
const searchIndex = {};

catalog.forEach(ex => {
    // Add original name
    const originalKey = ex.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    searchIndex[originalKey] = ex;

    // Add ID
    const idKey = ex.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    searchIndex[idKey] = ex;

    // Add simplified variants
    const simplified = ex.name
        .toLowerCase()
        .replace(/\(.*?\)/g, '') // Remove parentheses
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '');

    searchIndex[simplified] = ex;
});

console.log(`Search index created with ${Object.keys(searchIndex).length} entries`);

// Test some common exercises
console.log('\n=== Testing Search ===');
const testCases = [
    'barbell hip thrust',
    'squat',
    'bench press',
    'deadlift',
    'pull-up',
    'bicep curl'
];

testCases.forEach(test => {
    const key = test.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = searchIndex[key];
    console.log(`"${test}" -> ${found ? found.name : 'NOT FOUND'}`);
});

// Export for use
const output = {
    totalExercises: catalog.length,
    byMuscle,
    byEquipment,
    searchIndex: Object.keys(searchIndex),
    catalog: catalog.slice(0, 10) // Sample
};

fs.writeFileSync('catalog_analysis.json', JSON.stringify(output, null, 2));
console.log('\n✅ Analysis saved to catalog_analysis.json');
