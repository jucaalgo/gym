import https from 'https';
import fs from 'fs';
import path from 'path';

// ===========================
// CONFIGURATION
// ===========================
const API_KEY = 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
const MODEL = 'imagen-4.0-fast-generate-001';
const OUTPUT_DIR = './public/exercises';
const CSV_PATH = './public/exercises/NEW_EXERCISES_MASTER.csv';

// ===========================
// PARSE CSV AND BUILD EXERCISE LIST
// ===========================
function parseCSV() {
    console.log('📊 Parsing NEW_EXERCISES_MASTER.csv...');
    const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvData.split('\n');
    const exercises = [];

    // Skip header (line 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by semicolon
        const parts = line.split(';');
        if (parts.length < 5) continue;

        const [name, muscle, equipment, biomech, prompt] = parts;

        if (name && prompt) {
            // Create slug from exercise name
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

            exercises.push({
                name: name.trim(),
                slug: slug,
                muscle: muscle ? muscle.trim() : '',
                equipment: equipment ? equipment.trim() : '',
                biomech: biomech ? biomech.trim() : '',
                prompt: prompt.trim()
            });
        }
    }

    console.log(`✅ Parsed ${exercises.length} exercises from CSV`);
    return exercises;
}

const TARGET_EXERCISES = parseCSV();

// ===========================
// AI IMAGE GENERATION
// ===========================
async function generateImage(exercise) {
    const filename = `${exercise.slug}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
        console.log(`⏩ Skipping ${exercise.name} (already exists)`);
        return;
    }

    console.log(`🎨 Generating: ${exercise.name}...`);

    // Use the CSV's own prompt
    const FULL_PROMPT = `
        Create a Motion Sequence Sheet (5 horizontal keyframes) for the exercise: ${exercise.name}
        
        ${exercise.prompt}
        
        CRITICAL REQUIREMENTS:
        - 5 frames arranged HORIZONTALLY (left to right)
        - Sequence Phases: Start Position → Eccentric → Inflection Point → Concentric → End Position
        - Camera FIXED (does not move between frames)
        - NO clipping: weights must NOT pass through body/clothes
        - Consistent lighting, skin tone, clothing across all 5 frames
        - Style: Unreal Engine 5, Octane Render, 8k, Hyper-realistic
        
        AVOID: clipping, morphing, distortion, extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face, text, watermark, bad hands
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    const data = JSON.stringify({
        instances: [{ prompt: FULL_PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9", // Wide for 5-frame sequence
        }
    });

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        const predictions = json.predictions;
                        if (predictions && predictions.length > 0) {
                            const b64 = predictions[0].bytesBase64Encoded || predictions[0].b64 || predictions[0].image?.b64;
                            if (b64) {
                                fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                                console.log(`✅ Saved: ${filename}`);
                                resolve(true);
                            } else {
                                console.log(`❌ Missing B64 data for ${exercise.name}`);
                                resolve(false);
                            }
                        } else {
                            console.log(`❌ No prediction for ${exercise.name}`);
                            resolve(false);
                        }
                    } catch (e) {
                        console.log(`❌ JSON Error for ${exercise.name}: ${e.message}`);
                        resolve(false);
                    }
                } else {
                    console.log(`❌ API Error (${res.statusCode}) for ${exercise.name}: ${body.substring(0, 200)}`);
                    resolve(false);
                }
            });
        });
        req.on('error', (e) => {
            console.error(`❌ Network Error: ${e.message}`);
            resolve(false);
        });
        req.write(data);
        req.end();
    });
}

// ===========================
// BATCH RUNNER
// ===========================
async function runBatch() {
    console.log(`\n🚀 Starting CSV-Based Batch Image Generation`);
    console.log(`📁 Output Directory: ${OUTPUT_DIR}`);
    console.log(`🎯 Total Exercises: ${TARGET_EXERCISES.length}\n`);

    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < TARGET_EXERCISES.length; i++) {
        const exercise = TARGET_EXERCISES[i];
        console.log(`\n[${i + 1}/${TARGET_EXERCISES.length}] ${exercise.name}`);

        const result = await generateImage(exercise);

        if (result === true) {
            success++;
        } else if (result === false) {
            failed++;
        } else {
            skipped++;
        }

        // Rate limiting: 1 second delay between calls
        if (i < TARGET_EXERCISES.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log(`\n\n✨ BATCH COMPLETE ✨`);
    console.log(`✅ Success: ${success}`);
    console.log(`⏩ Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${TARGET_EXERCISES.length}`);
}

// ===========================
// START
// ===========================
runBatch();
