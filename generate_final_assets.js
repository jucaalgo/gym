import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagen-4.0-ultra-generate-preview-06-06';
const CATALOG_PATH = './public/free_exercise_catalog.json';
const OUTPUT_DIR = './public/exercises';
const CONCURRENCY = 1; // Keep it safe to avoid rate limits

// ═══════════════════════════════════════════════════════════════
// PROMPT TEMPLATE
// ═══════════════════════════════════════════════════════════════
const PROMPT_TEMPLATE = `
A single, highly detailed professional studio photograph of a **{GENDER}** fitness athlete performing the exercise: {EXERCISE_NAME}.

MOMENT & BIOMECHANICS:
- The photo captures the exact **moment of peak contraction** or maximum depth of the movement.
- The athlete exhibits **PERFECT form**. Spine is neutral, joints aligned correctly, gaze focused. A textbook example of biomechanical accuracy.

SUBJECT & AESTHETIC (The "Antigravity" Look):
- Model: An athletic **{GENDER}** with a physique that is lean, strong, and natural. Hyper-realistic skin texture with a slight sweat sheen showing effort.
- Attire: Minimalist, high-end black technical sportswear appropriate for a **{GENDER}** athlete (e.g., compression gear, sports top). No loud logos.
- Muscle Focus: The {TARGET_MUSCLE} is the visual focal point, showing tension and definition highlighted by the lighting.

ENVIRONMENT & LIGHTING:
- Background: Pure Infinity White (#FFFFFF). Seamless commercial studio.
- Lighting: Dramatic, high-contrast commercial studio lighting. A crucial **"Rim Light"** outlines the figure, separating them from the background. Sharp contact shadows on the floor.
- Camera Angle: **Cinematic 3/4 View**.

EQUIPMENT:
- Props: {EQUIPMENT_PHRASE}
`;

// ═══════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════
function capitalize(str) {
    if (!str) return '';
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getEquipmentPhrase(eq) {
    if (!eq || eq === 'body only') return "None (Bodyweight movement).";
    return `${capitalize(eq)} rendered with photorealistic materials (solid iron, steel, rubber).`;
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════
function updateProgress(current, total, lastItemName) {
    const width = 30;
    const percentage = Math.round((current / total) * 100);
    const filled = Math.round((width * current) / total);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`[${bar}] ${percentage}% | ${current}/${total} | 📸 ${lastItemName.substring(0, 20)}...`);
}

// ═══════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════
async function generateImage(token, prompt, outputPath) {
    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    const data = JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "4:3",
            mode: "upscale" // Request highest quality
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
                    // Start parsing error for 429 logic upstream
                    reject(new Error(`API ${res.statusCode}: ${body}`));
                    return;
                }
                try {
                    const json = JSON.parse(body);
                    const b64 = json.predictions?.[0]?.bytesBase64Encoded || json.predictions?.[0]?.b64;

                    if (b64) {
                        fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
                        resolve();
                    } else {
                        reject(new Error("No image data in response."));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

// ═══════════════════════════════════════════════════════════════
// MAIN LOOP
// ═══════════════════════════════════════════════════════════════
async function main() {
    console.clear();
    console.log("🚀 STARTING MASS PRODUCTION: IMAGEN 4.0 ULTRA");
    console.log("---------------------------------------------");

    // 1. Auth
    const auth = new GoogleAuth({ keyFile: './vertex-service-account.json', scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    let token = (await client.getAccessToken()).token;

    // 2. Load Catalog
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    const total = catalog.length;
    console.log(`📚 Catalog Loaded: ${total} exercises.`);

    // 3. Clean Output (Reset)
    if (fs.existsSync(OUTPUT_DIR)) {
        console.log("🧹 Cleaning old files...");
        // fs.rmSync(OUTPUT_DIR, { recursive: true, force: true }); // Careful, maybe just overwrite?
        // User asked to "borra lo que habias hecho". 
        // Let's delete the content but keep the dir structure safer.
        const files = fs.readdirSync(OUTPUT_DIR);
        for (const file of files) {
            if (file.endsWith('.png') || file.endsWith('.mp4')) {
                fs.unlinkSync(path.join(OUTPUT_DIR, file));
            }
        }
    } else {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    console.log("✨ Workspace Cleaned.\n");

    // 4. Processing
    let completed = 0;

    for (let i = 0; i < total; i++) {
        const exercise = catalog[i];
        const safeName = exercise.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeName}.png`;
        const filePath = path.join(OUTPUT_DIR, filename);

        // Prep Prompt Variables
        const gender = (i % 2 === 0) ? 'Male' : 'Female'; // Alternate genders
        const muscle = capitalize(exercise.primaryMuscles[0] || 'Body');
        const equipment = exercise.equipment || 'body only';
        const equipmentPhrase = getEquipmentPhrase(equipment);

        const prompt = PROMPT_TEMPLATE
            .replace(/{GENDER}/g, gender)
            .replace(/{EXERCISE_NAME}/g, exercise.name)
            .replace(/{TARGET_MUSCLE}/g, muscle)
            .replace(/{EQUIPMENT_PHRASE}/g, equipmentPhrase)
            .replace(/{EQUIPMENT}/g, capitalize(equipment));

        // Retry Loop
        let attempts = 0;
        let success = false;

        while (attempts < 5 && !success) {
            try {
                await generateImage(token, prompt, filePath);
                success = true;
            } catch (err) {
                attempts++;
                if (err.message.includes('429')) {
                    // Rate Limit - Wait 60s
                    // Update header to show status
                    process.stdout.clearLine(0);
                    process.stdout.cursorTo(0);
                    process.stdout.write(`⚠️ Rate Limit (429). Pausing 60s... (${attempts}/5)`);
                    await delay(60000);
                } else if (err.message.includes('401') || err.message.includes('UNAUTHENTICATED')) {
                    // Token refresh
                    token = (await client.getAccessToken()).token;
                    attempts--; // Don't count this attempt
                } else {
                    // Other error
                    process.stdout.write(`\n❌ Error on ${exercise.name}: ${err.message}\n`);
                    await delay(2000);
                }
            }
        }

        if (success) {
            completed++;
            updateProgress(completed, total, exercise.name);
        } else {
            console.log(`\n💀 Failed permanently: ${exercise.name}`);
            fs.appendFileSync('failures.json', `${exercise.name}\n`);
            // Continue nevertheless
        }

        // Small cadence delay to avoid instant rate limiting if speedy
        await delay(1000);
    }

    console.log("\n\n✅ JOB COMPLETE!");
}

main();
