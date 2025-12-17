import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';
import fs from 'fs';
import path from 'path';

// CONFIGURATION
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
const MODEL = 'imagen-4.0-fast-generate-001';
const OUTPUT_DIR = 'public/exercises';


import { BASE_MOVEMENTS } from './src/data/grand_library/base_movements.js';
import { EQUIPMENT } from './src/data/grand_library/modifiers.js';

// GENERATE FULL EXERCISE LIST
function generateExerciseList() {
    console.log('🔄 Building Exercise List from Grand Library...');
    const exercises = [];

    BASE_MOVEMENTS.forEach(move => {
        move.validEquipment.forEach(eq => {
            // Generate variants
            const variants = ['Standard'];

            if (move.name.includes('Press') || move.name.includes('Row')) {
                variants.push('Wide Grip', 'Close Grip');
            }
            if (move.name.includes('Squat') || move.name.includes('Deadlift')) {
                variants.push('Sumo Stance', 'Pause');
            }
            if (eq === EQUIPMENT.DUMBBELL) {
                variants.push('Unilateral', 'Alternating');
            }
            if (move.name.includes('Curl')) {
                variants.push('Hammer', 'Preacher');
            }

            variants.forEach(variant => {
                const isStandard = variant === 'Standard';
                const finalName = isStandard ? `${eq} ${move.name}` : `${eq} ${move.name} (${variant})`;
                const slug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                exercises.push({ 
                    name: finalName, 
                    slug: slug, 
                    gender: move.genderBias || 'unisex', 
                    muscle: move.primary 
                });
            });
        });
    });

    console.log(`✅ Ready to generate ${exercises.length} exercises.`);
    return exercises;
}

const TARGET_EXERCISES = generateExerciseList();

console.log(`🏭 AI EXERCISE FACTORY ONLINE`);
console.log(`🚀 Model: ${MODEL}`);
console.log(`📂 Output: ${OUTPUT_DIR}\n`);

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generateImage(exercise) {
    const filename = `${exercise.slug}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
        console.log(`⏩ Skipping ${exercise.name} (already exists)`);
        return;
    }


    console.log(`🎨 Generating Sequence: ${exercise.name}...`);

    // Constructed from User's "Director of Art" Prompt
    const PROMPT = `
        Role: Technical Art Director & Biomechanics Expert.
        Task: Create a Motion Sequence Sheet (5 horizontal keyframes) for the exercise: ${exercise.name}.
        
        Sequence Phases (Left to Right):
        1. Start Position: Static preparation.
        2. Eccentric Phase: Halfway down.
        3. Inflection Point: Max extension/contraction (solid contact, NO clipping).
        4. Concentric Phase: Return effort.
        5. End Position: Lockout/Finish.

        Visual Specs:
        - Subject: ${exercise.gender} athlete, aesthetic natural physique, minimalist tech sportwear (black/grey).
        - Environment: "Infinity White" studio, dramatic rim lighting, no background distractions.
        - Camera: Fixed Side Profile (or 3/4) view. IDENTICAL across all 5 frames. Camera does not move.
        - Style: Unreal Engine 5, Octane Render, 8k, Hyper-realistic, Anatomically correct.
        
        Physics Rules:
        - Solid Objects: Dumbbells/bars must NOT clip through clothes/body. Realistic surface contact.
        - Consistency: Lighting, skin tone, layout must be pixel-perfect across frames.

        NEGATIVE PROMPT (AVOID): clipping, morphing, distortion, extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face, text, watermark, bad hands
    `;

    const NEGATIVE_PROMPT = "clipping, morphing, distortion, extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face, text, watermark, bad hands";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9", // Wide aspect for the sequence
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
                    console.log(`❌ API Error (${res.statusCode}) for ${exercise.name}: ${body.substring(0, 100)}`);
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

async function runBatch() {
    for (const ex of TARGET_EXERCISES) {
        await generateImage(ex);
        // Small delay to be nice to API
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\n✨ Batch Complete! Check the app.');
}

runBatch();
