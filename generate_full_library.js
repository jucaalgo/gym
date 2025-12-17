import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const API_KEY = process.env.GOOGLE_API_KEY || '';
const MODEL = 'imagen-4.0-generate-001'; // or 'imagen-3.0-generate-001'
const OUTPUT_DIR = 'public/exercises';
const MANIFEST_FILE = 'public/ai_manifest.json';
const CATALOG_FILE = 'public/free_exercise_catalog.json';
const DELAY_MS = 4000; // 4 seconds delay to be safe

// --- UTILS ---
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log(`🏭 AI GRAND LIBRARY GENERATOR`);
    console.log(`--------------------------------`);

    // 1. Load Catalog
    if (!fs.existsSync(CATALOG_FILE)) {
        console.error('❌ Catalog file not found!');
        return;
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
    console.log(`📚 Catalog Loaded: ${catalog.length} exercises`);

    // 2. Ensure Output Dir
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // 3. Load or Init Manifest
    let manifest = [];
    if (fs.existsSync(MANIFEST_FILE)) {
        try {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
        } catch (e) {
            console.warn('⚠️ Manifest corrupted, starting fresh.');
        }
    }

    // 4. Processing Loop
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (let i = 0; i < catalog.length; i++) {
        const exercise = catalog[i];
        const slug = slugify(exercise.name);
        const filename = `${slug}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        console.log(`\n[${i + 1}/${catalog.length}] ${exercise.name} (${slug})`);

        // Check if exists
        if (fs.existsSync(filepath)) {
            console.log(`   ⏭️  Skipping (Already exists)`);
            if (!manifest.includes(slug)) manifest.push(slug); // Ensure it's in manifest
            skipCount++;
            continue;
        }

        // Generate
        console.log(`   🎨 Generating...`);
        const muscles = exercise.primaryMuscles.join(', ');
        const equipment = exercise.equipment || 'gym equipment';

        // Dynamic Prompt
        const gender = (i % 2 === 0) ? 'male' : 'female'; // Alternate genders for variety
        const PROMPT = `Professional fitness illustration of a ${gender} athlete performing a ${exercise.name} (${equipment}). 
        Minimalist modern gym background, high contrast lighting, scientific anatomical art style, 
        8k resolution, white background, detailed muscle definition emphasizing ${muscles}, side view, comprehensive movement demonstration.`;

        const success = await generateImageRest(PROMPT, filepath);

        if (success) {
            console.log(`   ✅ Saved!`);
            manifest.push(slug);
            successCount++;
            // Update manifest on disk periodically
            fs.writeFileSync(MANIFEST_FILE, JSON.stringify([...new Set(manifest)], null, 2));
        } else {
            console.log(`   ❌ Failed.`);
            failCount++;
        }

        // Delay
        console.log(`   ⏳ Cooling down ${DELAY_MS}ms...`);
        await sleep(DELAY_MS);
    }

    // Final Save
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify([...new Set(manifest)], null, 2));

    console.log(`\n--------------------------------`);
    console.log(`🎉 GENERATION COMPLETE`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`⏭️ Skipped: ${skipCount}`);
    console.log(`❌ Failed:  ${failCount}`);
    console.log(`--------------------------------`);
}

async function generateImageRest(prompt, filepath) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    const data = JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
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
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(false);
                        }
                    } catch (e) {
                        resolve(false);
                    }
                } else {
                    console.error(`   ⚠️ API Error: ${res.statusCode} - ${body.substring(0, 100)}...`);
                    resolve(false);
                }
            });
        });
        req.on('error', (e) => {
            console.error(`   ⚠️ Net Error: ${e.message}`);
            resolve(false);
        });
        req.write(data);
        req.end();
    });
}

main();
