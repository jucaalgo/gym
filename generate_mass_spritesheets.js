import Link from 'https';
import fs from 'fs';
import path from 'path';
import https from 'https';

// --- CONFIG ---
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
// Using the latest available Imagen model. 
// If 4.0 fails, we might need to fallback, but let's try to stick to high quality.
const MODEL = 'imagen-4.0-generate-001';
const OUTPUT_DIR = 'public/spritesheets';
const CATALOG_FILE = 'public/free_exercise_catalog.json';

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Progress bar function
function drawProgressBar(current, total, startTime) {
    const percentage = Math.floor((current / total) * 100);
    const barLength = 40;
    const filledLength = Math.floor((current / total) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    // Calculate ETA
    const elapsed = Date.now() - startTime;
    const rate = current / elapsed; // items per ms
    const remaining = total - current;
    const eta = remaining / rate;
    const etaMinutes = Math.floor(eta / 60000);
    const etaHours = Math.floor(etaMinutes / 60);
    const etaMins = etaMinutes % 60;

    const etaStr = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;

    process.stdout.write(`\r[${bar}] ${percentage}% (${current}/${total}) | ETA: ${etaStr}   `);
}

// --- MAIN ---
async function main() {
    console.log(`🎨 MASS SPRITESHEET GENERATOR (${MODEL})`);
    console.log(`-----------------------------------\n`);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Load Catalog
    if (!fs.existsSync(CATALOG_FILE)) {
        console.error(`❌ Catalog file not found: ${CATALOG_FILE}`);
        return;
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));

    const startTime = Date.now();
    let processedCount = 0;
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

            console.log(`[${bar}] ${percentage}% (${i}/${catalog.length}) | ETA: ${etaStr} | Current: ${exercise.name.substring(0, 30)}`);
            lastUpdate = i;
        }

        if (fs.existsSync(filepath)) {
            continue;
        }

        // GENERATE
        let success = false;
        try {
            success = await generateSpriteSheet(exercise, filepath);
            if (success) {
                processedCount++;
                // Cooldown to avoid rate limits
                await sleep(20000);
            }
        } catch (err) {
            if (err.message.includes('429')) {
                console.log(`\n🛑 QUOTA HIT. Sleeping 2 minutes...`);
                await sleep(120000);
            }
        }
    }

    // Final progress bar
    drawProgressBar(catalog.length, catalog.length, startTime);
    console.log(`\n\n✨ Complete! Generated ${processedCount} new spritesheets.`);
}

async function generateSpriteSheet(exercise, filepath) {
    // MODIFIED PROMPT BASED ON USER REQUEST
    const PROMPT = `A wide horizontal sprite sheet showing a sequence of 5 distinct steps of a fitness model performing a ${exercise.name}. 
    Step 1: Start position. 
    Step 2: Moving down. 
    Step 3: Bottom position (perfect form, object touching chest/floor properly). 
    Step 4: Moving up. 
    Step 5: End position. 
    
    Constraints: Same character, exact same lighting, fixed camera angle (side view), photorealistic 8k, cinematic lighting, futuristic gym app style, white background. 
    The weights are solid and respect physics, no clipping through body. 
    
    Negative constraints: No clipping, no morphing, no distortion, no extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face.`;

    // Note: Imagen API typically uses 16:9 as maximum wide aspect ratio for standard generation.
    // We request 1 image.
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
                    console.log(`   API Error (${res.statusCode}): ${body.substring(0, 150)}`);
                    resolve(false);
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    const predictions = json.predictions;
                    if (predictions && predictions.length > 0) {
                        // Check for various response formats
                        const b64 = predictions[0].bytesBase64Encoded || predictions[0].b64 || predictions[0].image?.b64;
                        if (b64) {
                            fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                            resolve(true);
                        } else {
                            console.log(`   ❌ Missing B64 data in response`);
                            resolve(false);
                        }
                    } else {
                        console.log(`   ❌ No predictions returned`);
                        resolve(false);
                    }
                } catch (e) {
                    console.log(`   ❌ JSON Parse Error: ${e.message}`);
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
