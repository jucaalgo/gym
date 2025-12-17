import fs from 'fs';
import https from 'https';
import { GoogleAuth } from 'google-auth-library';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ═══════════════════════════════════════════════════════════════
// PHASE 2: IMAGE-TO-VIDEO ANIMATOR (BIOMECHANICAL FOCUS)
// ═══════════════════════════════════════════════════════════════

const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
// Using Imagen 2 specific model that supports 'live image' or Veo if available. 
// For now, attempting the high-quality image model which serves as the entry point or swapping to specific video model.
// Common endpoint for video: 'recurrent-gemma' or 'veo-001'. Let's try the standard endpoint first.
const MODEL = 'imagegeneration@006';

const INPUT_DIR = './public/exercises';
const OUTPUT_DIR = './public/videos';
const CATALOG_PATH = './public/free_exercise_catalog.json';
const COOLDOWN_MS = 15000; // Slower cadence for video

async function main() {
    console.log("🎥 STARTING BIOMECHANICAL VIDEO PIPELINE...");

    // 1. Setup Auth
    const auth = new GoogleAuth({
        keyFile: './vertex-service-account.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    // 2. Load Catalog
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    console.log(`✅ Loaded catalog for instruction matching.`);

    // 3. Ensure Output
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 4. Watch & Process Loop
    console.log("👀 Watching for new images to animate...");

    while (true) {
        const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));

        for (const file of files) {
            const slug = file.replace('.png', '');
            const videoFilename = `${slug}.mp4`;
            const videoPath = `${OUTPUT_DIR}/${videoFilename}`;
            const imagePath = `${INPUT_DIR}/${file}`;

            if (fs.existsSync(videoPath)) {
                continue; // Already animated
            }

            // Find Exercise Data
            // We need to reverse-engineer the slug match or find by similarity. 
            // Since we generated slugs consistently, we can try to recreate the slug from catalog items.
            const exercise = catalog.find(e => {
                const s = e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return s === slug;
            });

            if (!exercise) {
                console.log(`⚠️ Could not match ${slug} to catalog instructions. Skipping.`);
                continue;
            }

            console.log(`🎬 Animating: ${exercise.name}...`);
            const instructions = exercise.instructions ? exercise.instructions.join(' ') : 'Perform the movement with perfect technique.';

            // BIOMECHANICAL PROMPT
            const prompt = `
                ANIMATE THIS IMAGE.
                ACTION: The subject performs the ${exercise.name}.
                MECHANICS: ${instructions}
                MOVEMENT STYLE: Slow, controlled, professional fitness demonstration. 
                CONSTRAINT: Keep the camera angle LOCKED. Do not morph the face. Only move the limbs according to the instructions.
                High quality, 4k, smooth motion.
            `;

            try {
                // Read Input Image
                const imageBuffer = fs.readFileSync(imagePath);
                const imageBase64 = imageBuffer.toString('base64');

                await generateVideo(token, prompt, imageBase64, videoPath);
                process.stdout.write(`   ✅ Video Created: ${videoFilename}\n`);

                await new Promise(r => setTimeout(r, COOLDOWN_MS));

            } catch (error) {
                process.stdout.write(`   ❌ Video Failed: ${exercise.name} - ${error.message}\n`);
                if (error.message.includes('429') || error.message.includes('Quota')) {
                    process.stdout.write("   ⚠️ Quota Hit. Pausing video generation for 2 minutes...\n");
                    await new Promise(r => setTimeout(r, 120000));
                }
            }
        }

        // Wait before scanning again to avoid busy loop
        await new Promise(r => setTimeout(r, 5000));
    }
}

function generateVideo(token, prompt, imageBase64, outputPath) {
    return new Promise((resolve, reject) => {
        // Vertex AI Video Generation Payload
        // Note: Actual schema depends on the specific model (Veo vs Imagen Live).
        // Using a standard predict schema closer to Imagen 2 "edit" or "generate" with image input.
        const data = JSON.stringify({
            instances: [
                {
                    prompt: prompt,
                    image: {
                        bytesBase64Encoded: imageBase64
                    }
                }
            ],
            parameters: {
                sampleCount: 1,
                // video generation parameters would go here
            }
        });

        const options = {
            method: 'POST',
            // Note: If this model endpoint fails for video, we might need to switch to 'veo-2.0-generate-001'
            path: `/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`,
            hostname: `${REGION}-aiplatform.googleapis.com`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        if (!json.predictions || !json.predictions[0]) {
                            // Some video models return 'bytesBase64Encoded' directly or content uri
                            if (json.predictions && json.predictions[0] && (json.predictions[0].bytesBase64Encoded || json.predictions[0].video)) {
                                const b64 = json.predictions[0].bytesBase64Encoded || json.predictions[0].video;
                                fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
                                resolve();
                                return;
                            }
                            reject(new Error(`No video in response: ${JSON.stringify(json).substring(0, 200)}...`));
                            return;
                        }
                        const b64 = json.predictions[0].bytesBase64Encoded || json.predictions[0].b64;
                        fs.writeFileSync(outputPath, Buffer.from(b64, 'base64'));
                        resolve();
                    } catch (e) { reject(e); }
                } else {
                    reject(new Error(`API Error ${res.statusCode}: ${body.substring(0, 200)}...`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

main();
