import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006'; // Latest Imagen model on Vertex AI
const OUTPUT_DIR = 'public/spritesheets';
const CATALOG_FILE = 'public/free_exercise_catalog.json';

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// OAuth Token Manager
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
    // Return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    // Generate new token
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    cachedToken = tokenResponse.token;
    // Tokens typically expire in 1 hour, we'll refresh 5 min before
    tokenExpiry = Date.now() + (55 * 60 * 1000);

    return cachedToken;
}

// --- MAIN ---
async function main() {
    console.log(`🎨 VERTEX AI MASS SPRITESHEET GENERATOR`);
    console.log(`Project: ${PROJECT_ID}`);
    console.log(`Region: ${REGION}`);
    console.log(`Model: ${MODEL}`);
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
                // Much shorter cooldown since Vertex AI has better limits
                await sleep(5000); // 5 seconds instead of 20
            }
        } catch (err) {
            console.log(`\n⚠️ Error for ${exercise.name}: ${err.message}`);
            if (err.message.includes('429') || err.message.includes('quota')) {
                console.log(`🛑 QUOTA HIT. Sleeping 2 minutes...`);
                await sleep(120000);
            }
        }
    }

    // Final progress bar
    const barFinal = '█'.repeat(40);
    console.log(`[${barFinal}] 100% (${catalog.length}/${catalog.length}) | Complete!`);
    console.log(`\n✨ Complete! Generated ${processedCount} new spritesheets.`);
}

async function generateSpriteSheet(exercise, filepath) {
    // Get fresh OAuth token
    const token = await getAccessToken();

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

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    const data = JSON.stringify({
        instances: [{
            prompt: PROMPT
        }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            // Vertex AI specific parameters
            negativePrompt: "clipping, morphing, distortion, extra limbs, bad anatomy, floating objects",
            seed: Math.floor(Math.random() * 1000000) // Random seed for variety
        }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
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
                        if (errJson.error && (errJson.error.code === 429 || errJson.error.status === 'RESOURCE_EXHAUSTED')) {
                            reject(new Error('429'));
                            return;
                        }
                    } catch (e) { }
                    console.log(`\n   API Error (${res.statusCode}): ${body.substring(0, 150)}`);
                    resolve(false);
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    const predictions = json.predictions;
                    if (predictions && predictions.length > 0) {
                        // Vertex AI returns images in bytesBase64Encoded format
                        const b64 = predictions[0].bytesBase64Encoded || predictions[0].b64 || predictions[0].image?.b64;
                        if (b64) {
                            fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                            resolve(true);
                        } else {
                            console.log(`\n   ❌ Missing B64 data in response`);
                            resolve(false);
                        }
                    } else {
                        console.log(`\n   ❌ No predictions returned`);
                        resolve(false);
                    }
                } catch (e) {
                    console.log(`\n   ❌ JSON Parse Error: ${e.message}`);
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
