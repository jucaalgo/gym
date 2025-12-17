import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const CSV_PATH = path.join(__dirname, 'public', 'exercises', 'NEW_EXERCISES_MASTER.csv');
const OUTPUT_CATALOG = path.join(__dirname, 'public', 'exercise_catalog_v2.json');
const OUTPUT_IMAGE_MAP = path.join(__dirname, 'public', 'exercise_image_map_v2.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'exercises');

// Helper: Slugify exercise name to create ID
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper: Parse biomechanical explanation
function parseBiomechanics(explanation) {
    const parts = explanation.split('.');
    const mechanism = parts.find(p => p.includes('Mechanism:'))?.replace('Mechanism:', '').trim() || '';
    const forceVector = parts.find(p => p.includes('Force Vector:'))?.replace('Force Vector:', '').trim() || '';
    const primaryMuscle = parts.find(p => p.includes('Primary Muscle:'))?.replace('Primary Muscle:', '').trim() || '';

    return {
        mechanism,
        forceVector,
        primaryMuscle,
        fullExplanation: explanation
    };
}

// Helper: Extract instructions from biomechanics
function generateInstructions(exerciseName, biomechanics) {
    const baseInstructions = [
        `Set up for ${exerciseName}`,
        'Maintain proper form throughout the movement',
        'Focus on the target muscle engagement',
        'Control the tempo as specified',
        'Complete the full range of motion'
    ];

    return baseInstructions;
}

// Helper: Infer category from equipment/muscle
function inferCategory(equipment, targetMuscle) {
    const equipmentLower = equipment.toLowerCase();

    if (equipmentLower.includes('stretch') || equipmentLower.includes('foam roller')) {
        return 'Flexibility';
    }
    if (equipmentLower.includes('plyo') || equipmentLower.includes('jump')) {
        return 'Plyometrics';
    }
    if (equipmentLower.includes('treadmill') || equipmentLower.includes('bike')) {
        return 'Cardio';
    }

    return 'Strength';
}

// Main transformation
async function transformCSV() {
    console.log('🚀 Starting CSV Transformation...\n');

    // Read CSV
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Parse header
    const header = lines[0].split(';').map(h => h.trim());
    console.log(`📋 CSV Columns: ${header.join(', ')}\n`);

    const exercises = [];
    const imageMap = {};
    const missingImages = [];

    // Get all available images
    const availableImages = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.png'))
        .map(f => f.toLowerCase());

    // Process each exercise
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const parts = line.split(';').map(p => p.trim());
        if (parts.length < 4) continue;

        const exerciseName = parts[0];
        const targetMuscle = parts[1];
        const equipmentUsed = parts[2];
        const biomechanicalExplanation = parts[3];

        // Create slug ID
        const id = slugify(exerciseName);

        // Find matching image
        const imageName = `${exerciseName.toLowerCase()}.png`;
        const imageExists = availableImages.includes(imageName.toLowerCase());

        if (!imageExists) {
            missingImages.push(exerciseName);
        }

        // Parse muscles
        const primaryMuscles = targetMuscle.split(',').map(m => m.trim()).filter(m => m);

        // Parse equipment
        const equipment = equipmentUsed.split(',').map(e => e.trim()).filter(e => e);

        // Parse biomechanics
        const biomechanics = parseBiomechanics(biomechanicalExplanation);

        // Create description
        const description = `${biomechanics.mechanism}. ${biomechanics.fullExplanation.split('.').slice(-1)[0]}`.trim();

        // Create exercise object
        const exercise = {
            id,
            name: exerciseName,
            primaryMuscles,
            secondaryMuscles: [],
            equipment,
            category: inferCategory(equipmentUsed, targetMuscle),
            difficulty: 'Intermediate',
            biomechanics,
            description,
            instructions: generateInstructions(exerciseName, biomechanics),
            images: imageExists ? [imageName] : [],
            videoUrl: imageExists ? `/exercises/${imageName}` : null,
            thumbnailUrl: imageExists ? `/exercises/${imageName}` : null,
            sets: 3,
            reps: '8-12'
        };

        exercises.push(exercise);
        imageMap[exerciseName] = imageName;
    }

    // Sort alphabetically
    exercises.sort((a, b) => a.name.localeCompare(b.name));

    // Write outputs
    fs.writeFileSync(OUTPUT_CATALOG, JSON.stringify(exercises, null, 2));
    fs.writeFileSync(OUTPUT_IMAGE_MAP, JSON.stringify(imageMap, null, 2));

    // Report
    console.log('✅ Transformation Complete!\n');
    console.log(`📊 Statistics:`);
    console.log(`   Total Exercises: ${exercises.length}`);
    console.log(`   With Images: ${exercises.length - missingImages.length}`);
    console.log(`   Missing Images: ${missingImages.length}`);
    console.log(`\n📂 Output Files:`);
    console.log(`   - ${OUTPUT_CATALOG}`);
    console.log(`   - ${OUTPUT_IMAGE_MAP}`);

    if (missingImages.length > 0) {
        console.log(`\n⚠️  Missing Images (${missingImages.length}):`);
        missingImages.forEach(name => console.log(`   - ${name}`));

        // Write discrepancies file
        const discrepanciesPath = path.join(__dirname, 'discrepancies.txt');
        fs.writeFileSync(discrepanciesPath, missingImages.join('\n'));
        console.log(`\n📝 Missing images list saved to: discrepancies.txt`);
    }
}

transformCSV().catch(console.error);
