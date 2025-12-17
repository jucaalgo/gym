import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_API_KEY || '';
const MODEL = 'imagen-4.0-generate-001';
const EXERCISE = 'Barbell Squat';
const SLUG = 'barbell-squat';
const OUTPUT_DIR = 'public/exercises/sequence_test';

// The 5 Phases of a Squat
const PHASES = [
    { id: 1, name: 'Start Position', desc: 'standing upright, bar on upper back, feet shoulder width apart' },
    { id: 2, name: 'Descent Phase', desc: 'hips descending, knees bending, back straight, half way down' },
    { id: 3, name: 'Bottom Position', desc: 'deep squat position, thighs below parallel, chest up' },
    { id: 4, name: 'Ascent Phase', desc: 'pushing up from bottom, legs extending, muscles contracted' },
    { id: 5, name: 'Lockout', desc: 'returned to standing position, glutes contracted, legs straight' }
];

// Ensure dir
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function generatePhase(phase) {
    console.log(`   🎨 Generating Phase ${phase.id}: ${phase.name}...`);

    // Consistent Seed/Prompt structure is key for continuity
    const PROMPT = `Medical illustration of a male athlete performing a ${EXERCISE} - ${phase.name}. 
    Exact visual style: anatomical X-ray vision, transparent skin, red highlights on heavy muscle engagement (quadriceps/glutes). white background, 8k resolution, photorealistic 3D render.
    Action details: ${phase.desc}.
    Camera angle: Side profile view. 
    Maintain consistent character, lighting, and scale across images.`;

    const filepath = path.join(OUTPUT_DIR, `${SLUG}_${phase.id}.png`);

    // Reuse the REST generation function
    await generateImageRest(PROMPT, filepath);
}

async function generateImageRest(prompt, filepath) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;
    const data = JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
    });
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };

    return new Promise((resolve) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        const b64 = json.predictions?.[0]?.bytesBase64Encoded;
                        if (b64) {
                            fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                            console.log(`   ✅ Saved Phase ${filepath}`);
                            resolve(true);
                        } else resolve(false);
                    } catch (e) { resolve(false); }
                } else console.error(`   ❌ API Error ${res.statusCode}`); resolve(false);
            });
        });
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log(`🎬 Generating 5-Frame Sequence for ${EXERCISE}...`);
    for (const phase of PHASES) {
        await generatePhase(phase);
        // Small delay
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log('🎉 Sequence Complete.');
}

run();
