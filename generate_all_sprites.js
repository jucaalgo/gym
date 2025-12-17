import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// VERTEX AI IMAGEN - MASS SPRITE SHEET GENERATOR
// Professional Motion Sequence Sheets for Fitness App
// ═══════════════════════════════════════════════════════════════

// --- VERTEX AI CONFIG ---
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006'; // Vertex AI Imagen
const OUTPUT_DIR = 'public/exercise-videos';
const CATALOG_FILE = 'public/free_exercise_catalog.json';

// OPTIMIZED COOLDOWN - Vertex AI has better limits
const COOLDOWN_MS = 12000; // 12 seconds between requests

// OAuth Token Cache
let cachedToken = null;
let tokenExpiry = 0;

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// --- OAUTH TOKEN MANAGEMENT ---
async function getAccessToken() {
    const now = Date.now();

    // Return cached token if still valid (with 5min buffer)
    if (cachedToken && tokenExpiry > now + 300000) {
        return cachedToken;
    }

    // Get fresh token
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();

    cachedToken = tokenResponse.token;
    tokenExpiry = now + 3600000; // 1 hour

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
    // ENHANCED PROMPT - Director de Arte Técnico + Biomecánica
    const PROMPT = `A wide horizontal sprite sheet showing a sequence of 5 distinct steps of a professional fitness model performing a ${exercise.name}.

SEQUENCE OF 5 PHASES:
Step 1: Initial Position - Static preparation, perfect starting form
Step 2: Eccentric Phase (Descent) - Midpoint of downward movement, controlled motion
Step 3: Inflection Point - Maximum extension/contraction (e.g., bar touching chest but NOT passing through it)
Step 4: Concentric Phase (Ascent) - Return effort, explosive power phase
Step 5: Final Position - Lockout or movement completion

SUBJECT SPECIFICATIONS:
- Athletic ${exercise.gender || 'male'} with aesthetic defined physique (natural, not exaggerated)
- Minimalist technical sportswear (black/grey) to avoid distraction
- Perfect anatomical form throughout movement
- Visible muscle definition highlighting ${exercise.muscle || 'target muscles'}

ENVIRONMENT & LIGHTING:
- Infinity White studio background OR Dark Mode Studio with dramatic rim lighting
- Cinematic edge lighting (Rim Lighting) to emphasize muscular silhouette
- No background distractions, pure focus on movement
- Unreal Engine 5 quality, Octane Render, 8k resolution

CAMERA & ANGLE:
- Perfect side profile view (90° lateral) OR 3/4 angle
- Camera position IDENTICAL across all 5 frames
- Only the athlete moves, camera is LOCKED
- Professional fitness photography composition

CRITICAL PHYSICS & ANTI-CLIPPING RULES:
- Equipment (dumbbells, barbells, machines) are SOLID objects
- NO clipping: weights cannot pass through skin or clothing
- Realistic collision: equipment must make surface contact only
- Proper weight physics and gravity representation
- Natural human biomechanics and joint angles

CONSISTENCY REQUIREMENTS:
- Pixel-perfect lighting across all 5 frames
- Identical skin tone, hairstyle, and clothing
- Same character model throughout
- Smooth progression of movement phases
- Professional motion sequence photography

RENDER STYLE:
- Hyper-realistic, photorealistic 8k quality
- Anatomically correct human form
- Cinematic lighting, futuristic gym app aesthetic
- Medical-grade biomechanics accuracy

NEGATIVE CONSTRAINTS (AVOID):
No clipping, no morphing, no distortion, no extra limbs, bad anatomy, floating objects, weights inside body, changing background, changing clothes, blurry face, inconsistent lighting, camera movement between frames.

Technical specs: 16:9 aspect ratio, professional fitness app quality, suitable for animation sequence.`;

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    const token = await getAccessToken();

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
                    // Check for quota errors
                    try {
                        const errJson = JSON.parse(body);
                        if (errJson.error && errJson.error.code === 429) {
                            console.log(`\n⚠️ Rate limit hit, will retry after cooldown...`);
                            resolve({ success: false, retry: true });
                            return;
                        }
                        console.log(`\n❌ Error ${res.statusCode}: ${errJson.error?.message || 'Unknown error'}`);
                    } catch (e) {
                        console.log(`\n❌ HTTP ${res.statusCode}`);
                    }
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
                            console.log(`\n⚠️ No image data in response`);
                            resolve({ success: false, retry: false });
                        }
                    } else {
                        console.log(`\n⚠️ No predictions in response`);
                        resolve({ success: false, retry: false });
                    }
                } catch (e) {
                    console.log(`\n❌ Parse error: ${e.message}`);
                    resolve({ success: false, retry: false });
                }
            });
        });

        req.on('error', (e) => {
            console.log(`\n❌ Network error: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

// --- MAIN LOOP ---
async function main() {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  VERTEX AI IMAGEN - MASS SPRITE SHEET GENERATOR`);
    console.log(`  Professional Motion Sequence Sheets for Fitness App`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`📋 Model: ${MODEL}`);
    console.log(`⏱️  Cooldown: ${COOLDOWN_MS / 1000}s between requests`);
    console.log(`📁 Output: ${OUTPUT_DIR}/\n`);
    console.log(`${'─'.repeat(70)}\n`);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load catalog
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

    // Process all exercises
    for (let i = 0; i < catalog.length; i++) {
        const exercise = catalog[i];
        const slug = slugify(exercise.name);
        const filename = `${slug}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        // Progress update every 10 items
        if (i % 10 === 0 || i === catalog.length - 1) {
            drawProgressBar(i, catalog.length, exercise.name, startTime);
        }

        // Skip if already exists
        if (fs.existsSync(filepath)) {
            skippedCount++;
            continue;
        }

        // Generate
        try {
            const result = await generateSpriteSheet(exercise, filepath);

            if (result.success) {
                processedCount++;
                console.log(`✅ Generated: ${filename}`);
                // Cooldown between successful generations
                await sleep(COOLDOWN_MS);
            } else if (result.retry) {
                // Rate limit - wait longer and retry
                console.log(`⏳ Waiting 60s before retry...`);
                await sleep(60000);
                i--; // Retry this exercise
            } else {
                errorCount++;
                console.log(`⚠️ Failed: ${exercise.name}`);
            }
        } catch (err) {
            errorCount++;
            console.log(`❌ Error on ${exercise.name}: ${err.message}`);
        }
    }

    // Final summary
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`  GENERATION COMPLETE`);
    console.log(`${'═'.repeat(70)}\n`);
    console.log(`✅ Successfully generated: ${processedCount} sprites`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount} sprites`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}/`);

    const totalTime = Date.now() - startTime;
    const hours = Math.floor(totalTime / 3600000);
    const minutes = Math.floor((totalTime % 3600000) / 60000);
    console.log(`⏱️  Total time: ${hours}h ${minutes}m\n`);
}

main().catch(console.error);
