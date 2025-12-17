import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';
import path from 'path';

// --- VERTEX AI CONFIG ---
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006'; // Vertex AI Imagen model
const OUTPUT_DIR = 'public/spritesheets';
const PRIORITY_FILE = 'priority_exercises.json';

// REDUCED COOLDOWN - Vertex AI has better limits!
const COOLDOWN_MS = 10000; // 10 seconds (vs 35s with old API)

// OAuth Token Cache
let cachedToken = null;
let tokenExpiry = 0;

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// 429 Error Counter
let consecutive429Errors = 0;
const MAX_429_BEFORE_STOP = 5; // Stop if we get 5 consecutive 429 errors

// --- MAIN ---
async function main() {
    console.log(`🎨 PRIORITY SPRITESHEET GENERATOR (${MODEL})`);
    console.log(`⏱️  Cooldown: ${COOLDOWN_MS / 1000}s between requests`);
    console.log(`🛑 Auto-stop after ${MAX_429_BEFORE_STOP} consecutive 429 errors`);
    console.log(`-----------------------------------\n`);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Load Priority Exercises
    if (!fs.existsSync(PRIORITY_FILE)) {
        console.error(`❌ Priority file not found: ${PRIORITY_FILE}`);
        console.log(`Run 'node analyze_priority.js' first.`);
        return;
    }
    const catalog = JSON.parse(fs.readFileSync(PRIORITY_FILE, 'utf8'));

    console.log(`📋 Loaded ${catalog.length} priority exercises\n`);

    const startTime = Date.now();
    let processedCount = 0;
    let skippedCount = 0;
    let lastUpdate = 0;

    // Loop
    for (let i = 0; i < catalog.length; i++) {
        const exercise = catalog[i];
        const slug = slugify(exercise.name);
        const filename = `${slug}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Update progress bar every 5 items or on first/last
        if (i === 0 || i === catalog.length - 1 || (i - lastUpdate) >= 5) {
            const percentage = Math.floor((i / catalog.length) * 100);
            const barLength = 40;
            const filledLength = Math.floor((i / catalog.length) * barLength);
            const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

            const elapsed = Date.now() - startTime;
            const rate = i / elapsed;
            const remaining = catalog.length - i;
            const eta = remaining / rate;
            const etaMinutes = Math.floor(eta / 60000);
            const etaHours = Math.floor(etaMinutes / 60);
            const etaMins = etaMinutes % 60;
            const etaStr = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;

            console.log(`[${bar}] ${percentage}% (${i}/${catalog.length}) | ETA: ${etaStr} | ${exercise.name.substring(0, 30)}`);
            lastUpdate = i;
        }

        if (fs.existsSync(filepath)) {
            skippedCount++;
            continue;
        }

        // GENERATE
        let success = false;
        try {
            success = await generateSpriteSheet(exercise, filepath);
            if (success) {
                processedCount++;
                consecutive429Errors = 0; // Reset error counter on success
                // Increased cooldown
                await sleep(COOLDOWN_MS);
            } else {
                // Non-429 error, continue with next
                continue;
            }
        } catch (err) {
            if (err.message.includes('429')) {
                consecutive429Errors++;
                console.log(`\n⚠️ 429 Error #${consecutive429Errors}/${MAX_429_BEFORE_STOP}`);

                if (consecutive429Errors >= MAX_429_BEFORE_STOP) {
                    console.log(`\n🛑 STOPPING: Too many consecutive 429 errors.`);
                    console.log(`Processed: ${processedCount} new | Skipped: ${skippedCount} existing`);
                    console.log(`Resume later by running this script again.`);
                    break;
                }

                console.log(`Sleeping 3 minutes before retry...`);
                await sleep(180000); // 3 minutes
                // Retry this exercise
                i--;
            }
        }
    }

    // Final progress bar
    const barFinal = '█'.repeat(40);
    console.log(`[${barFinal}] 100% (${catalog.length}/${catalog.length})`);
    console.log(`\n✨ Complete!`);
    console.log(`Generated: ${processedCount} new spritesheets`);
    console.log(`Skipped: ${skippedCount} existing`);
}

async function generateSpriteSheet(exercise, filepath) {
    // PROMPT FROM USER REQUEST
    const PROMPT = `A wide horizontal sprite sheet showing a sequence of 5 distinct steps of a fitness model performing a ${exercise.name}. 
    Step 1: Start position. 
    Step 2: Moving down. 
    Step 3: Bottom position (perfect form, object touching chest/floor properly). 
    Step 4: Moving up. 
    Step 5: End position. 
    
    Constraints: Same character, exact same lighting, fixed camera angle (side view), photorealistic 8k, cinematic lighting, futuristic gym app style, white background. 
    The weights are solid and respect physics, no clipping through body. 
    
    Negative constraints: No clipping, no morphing, no distortion, no extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9"
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
                if (res.statusCode !== 200) {
                    // Try to parse error
                    try {
                        const errJson = JSON.parse(body);
                        if (errJson.error && errJson.error.code === 429) {
                            reject(new Error('429'));
                            return;
                        }
                    } catch (e) { }
                    resolve(false);
                    return;
                }

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
            });
        });

        req.on('error', (e) => {
            reject(new Error(`Network error: ${e.message}`));
        });

        req.write(data);
        req.end();
    });
}

main();
