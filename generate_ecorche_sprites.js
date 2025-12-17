import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// VERTEX AI IMAGEN - ECORCHÉ STYLE SPRITE GENERATOR
// Technical Anatomical Animations for Mobile App
// ═══════════════════════════════════════════════════════════════

// --- VERTEX AI CONFIG ---
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006'; // Vertex AI Imagen
const OUTPUT_DIR = 'public/ecorche-sprites'; // Distinct folder for new style
const CATALOG_FILE = 'public/free_exercise_catalog.json';

// OPTIMIZED COOLDOWN
// 12 seconds is safe, but we can try 10s. If we hit limits, we retry.
const COOLDOWN_MS = 10000;

// OAuth Token Cache
let cachedToken = null;
let tokenExpiry = 0;

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// --- OAUTH TOKEN MANAGEMENT ---
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && tokenExpiry > now + 300000) {
        return cachedToken;
    }

    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    cachedToken = tokenResponse.token;
    tokenExpiry = now + 3600000;

    return cachedToken;
}

// --- PROGRESS BAR ---
function drawProgressBar(current, total, exerciseName, startTime) {
    const percentage = Math.floor((current / total) * 100);
    const barLength = 50;
    const filledLength = Math.floor((current / total) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    const elapsed = Date.now() - startTime;
    const rate = current / elapsed;
    const remaining = total - current;
    const eta = remaining / rate;
    const etaMinutes = Math.floor(eta / 60000);
    const etaHours = Math.floor(etaMinutes / 60);
    const etaMins = etaMinutes % 60;
    const etaStr = etaHours > 0 ? `${etaHours}h ${etaMins}m` : `${etaMins}m`;

    console.log(`\n[${bar}] ${percentage}%`);
    console.log(`Progress: ${current}/${total} | ETA: ${etaStr}`);
    console.log(`Current: ${exerciseName.substring(0, 50)}`);
}

// --- MAIN GENERATION FUNCTION ---
async function generateSpriteSheet(exercise, filepath) {
    // PREPARE VARIABLES
    const EXERCISE_NAME = exercise.name;
    const TARGET_MUSCLE = exercise.primaryMuscles[0]
        ? exercise.primaryMuscles[0].charAt(0).toUpperCase() + exercise.primaryMuscles[0].slice(1)
        : 'Major Muscle Groups';

    let EQUIPMENT_TEXT = exercise.equipment || 'Gym Equipment';
    if (EQUIPMENT_TEXT.toLowerCase() === 'body only' || EQUIPMENT_TEXT.toLowerCase() === 'none') {
        EQUIPMENT_TEXT = 'No equipment (Bodyweight exercise)';
    } else {
        EQUIPMENT_TEXT = `${EQUIPMENT_TEXT} rendered as solid, realistic material respecting physics (NO clipping)`;
    }

    // USER'S ECORCHÉ PROMPT
    const PROMPT = `A technical source image specifically designed to be sliced into a smooth animated GIF sequence for a premium mobile fitness app. It is a wide panoramic sprite sheet containing exactly 5 sequential frames arranged side-by-side of a professional 3D anatomical 'Ecorché' figure performing: ${EXERCISE_NAME}.

VISUAL STYLE & MOBILE OPTIMIZATION:
- Purpose: The output must be perfectly consistent across frames for smooth animation playback on mobile devices.
- Subject: High-end medical illustration style. Detailed Ecorché anatomy visualizing muscle fibers. Transparent anatomical study. Bold silhouettes for small screen clarity.
- Active Muscle Highlight: The ${TARGET_MUSCLE} features a high-contrast, neon-style thermal glow (orange/gold) that pulses in intensity with movement, ensuring instant readability on phones.
- Equipment: ${EQUIPMENT_TEXT}.
- Background: Pure clean white (#FFFFFF).

ANIMATION SEQUENCE FLOW (Left to Right):
- Frame 1 (Start Loop): Static starting position.
- Frame 2 (Concentric Action): Movement begins smoothly.
- Frame 3 (Peak Contraction): Maximum effort point. Muscle glow is brightest.
- Frame 4 (Eccentric Action): Controlled return movement.
- Frame 5 (End Loop): Returns exactly to the Frame 1 position to ensure a seamless, non-jarring looping animation.

TECHNICAL CONSTRAINTS FOR ANIMATION:
- CRITICAL: The camera angle (fixed lateral profile), lighting, and character model proportions MUST be pixel-perfect identical across all 5 frames so the final animation does not jitter or morph.
- Output Quality: 8k resolution source file, sharp focus, Unreal Engine 5 render style.`;

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;
    const token = await getAccessToken();

    // REQUEST BODY - Using 16:9 aspect ratio as requested in previous turn (likely safest for "wide panoramic")
    // Or maybe 21:9 if we really want wide? The prompt says "A wide panoramic sprite sheet... containing exactly 5 frames". 
    // 16:9 is standard supported aspectRatio.
    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9"
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
                    try {
                        const errJson = JSON.parse(body);
                        if (errJson.error && errJson.error.code === 429) {
                            console.log(`\n⚠️ Rate limit hit (429), will retry...`);
                            resolve({ success: false, retry: true });
                            return;
                        }
                    } catch (e) { }
                    console.log(`\n❌ Error ${res.statusCode}: ${body.substring(0, 200)}`);
                    resolve({ success: false, retry: false });
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    const predictions = json.predictions;
                    if (predictions && predictions.length > 0) {
                        const b64 = predictions[0].bytesBase64Encoded || predictions[0].b64;
                        if (b64) {
                            fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                            resolve({ success: true });
                        } else {
                            resolve({ success: false, retry: false });
                        }
                    } else {
                        resolve({ success: false, retry: false });
                    }
                } catch (e) {
                    resolve({ success: false, retry: false });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// --- MAIN LOOP ---
async function main() {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  VERTEX AI IMAGEN - ECORCHÉ SPRITE GENERATOR`);
    console.log(`  Style: Medical Ecorché, Thermal Muscle Highlight, Seamless Loop`);
    console.log(`${'═'.repeat(70)}\n`);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (!fs.existsSync(CATALOG_FILE)) {
        console.error(`❌ Catalog not found: ${CATALOG_FILE}`);
        return;
    }

    const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
    console.log(`✅ Loaded ${catalog.length} exercises from catalog\n`);

    const startTime = Date.now();
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < catalog.length; i++) {
        const exercise = catalog[i];
        const slug = slugify(exercise.name);
        const filename = `${slug}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        if (i % 5 === 0 || i === catalog.length - 1) {
            drawProgressBar(i, catalog.length, exercise.name, startTime);
        }

        if (fs.existsSync(filepath)) {
            skippedCount++;
            continue;
        }

        try {
            const result = await generateSpriteSheet(exercise, filepath);

            if (result.success) {
                processedCount++;
                console.log(`✅ Generated: ${filename}`);
                await sleep(COOLDOWN_MS);
            } else if (result.retry) {
                console.log(`⏳ Waiting 60s cooldown...`);
                await sleep(60000);
                i--;
            } else {
                errorCount++;
                console.log(`⚠️ Failed: ${exercise.name}`);
            }
        } catch (err) {
            errorCount++;
            console.log(`❌ Error: ${err.message}`);
        }
    }
}

main().catch(console.error);
