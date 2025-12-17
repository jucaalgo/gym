import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

// ═══════════════════════════════════════════════════════════════
// HEAD-TO-HEAD CONFIG
// ═══════════════════════════════════════════════════════════════
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';

const TEST_EXERCISE = "Barbell Squat";
// Using the "Production" prompt templates for maximum fairness
const TEST_PROMPT_VIDEO = `
PROFESSIONAL FITNESS DEMONSTRATION. Cinematic 4K video of a male fitness model performing: ${TEST_EXERCISE}.
VISUALS:
- Subject: REAL MALE ATHLETE. World-class physique, perfect anatomy.
- Action: Deep squat position, thighs parallel to floor.
- Equipment: Olympic Barbell on upper back. Must be solid, visible, and interact physically. NO CLIPPING.
- Setting: White Infinity Studio. High-key professional lighting.
- Style: Slow-motion smooth movement. Biomechanically accurate.
CRITICAL PHYSICS: Gravity must be respected. Equipment must NOT pass through the body.
`;

const TEST_PROMPT_IMAGE = `
AWARD WINNING COMMERCIAL FITNESS PHOTOGRAPHY. A single full-body SIDE PROFILE shot of a stunning male fitness model performing: ${TEST_EXERCISE}.
VISUAL STYLE (APPLE FITNESS+ / VOGUE SPORT):
- Subject: REAL HUMAN ATHLETE (Male). World-class beauty, fit, aesthetic physique. Perfect anatomy.
- Action: Deep squat position.
- Equipment: Olympic Barbell. Must be clearly visible and interact realistically.
- Angle: STRICT SIDE PROFILE (90 degrees). NO LOW ANGLES.
- Lighting: Bright, even, high-key studio lighting.
- Background: Pure Clean White Infinity Wall (#FFFFFF).
- Detail: 8k resolution, razor sharp focus. Masterpiece.
`;

const CANDIDATES = [
    // { type: 'video', name: 'Veo 3.1 Preview', id: 'veo-3.1-generate-preview', prompt: TEST_PROMPT_VIDEO, ext: 'mp4' },
    { type: 'image', name: 'Imagen 4.0 Ultra', id: 'imagen-4.0-ultra-generate-preview-06-06', prompt: TEST_PROMPT_IMAGE, ext: 'png' }
];

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
    console.log(`🥊 HEAD-TO-HEAD: Veo 3.1 vs Imagen 4.0 Ultra`);
    console.log(`----------------------------------------`);

    const auth = new GoogleAuth({ keyFile: SERVICE_ACCOUNT_PATH, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    let token = (await client.getAccessToken()).token;

    for (const candidate of CANDIDATES) {
        console.log(`\n🤺 Generating: ${candidate.name}...`);
        try {
            const filename = `comparison_${candidate.type}_${TEST_EXERCISE.replace(/ /g, '_')}.${candidate.ext}`;
            await generateWithRetry(token, candidate, filename);
        } catch (e) {
            console.log(`   ❌ FATAL ERROR: ${e.message}`);
        }
    }

    console.log(`\n🏁 Comparison Finished. Check the 'comparison_*' files.`);
}

// ═══════════════════════════════════════════════════════════════
// HELPERS w/ RETRY
// ═══════════════════════════════════════════════════════════════
async function generateWithRetry(token, candidate, filename) {
    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${candidate.id}:predict`;

    const requestBody = {
        instances: [{ prompt: candidate.prompt }],
        parameters: { sampleCount: 1, aspectRatio: candidate.type === 'video' ? "16:9" : "4:3" }
    };

    // Add specific params for video/image if needed
    if (candidate.type === 'video') {
        // Veo specific params if any
    } else {
        // Imagen specific params
        requestBody.parameters.mode = "upscale"; // Try to force high quality if supported, or just default
    }

    const data = JSON.stringify(requestBody);

    let attempts = 0;
    while (attempts < 5) {
        try {
            await makeRequest(url, token, data, filename, candidate.type === 'video');
            return; // Success
        } catch (error) {
            if (error.message.includes('429')) {
                console.log(`   ⚠️ Quota Hit (429). Waiting 60s...`);
                await new Promise(r => setTimeout(r, 60000));
                attempts++;
            } else {
                throw error; // Rethrow non-quota errors
            }
        }
    }
    throw new Error("Max retries exceeded for Quota.");
}

async function makeRequest(url, token, data, filename, isVideo) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`API ${res.statusCode}: ${body}`));
                    return;
                }

                try {
                    const json = JSON.parse(body);

                    if (isVideo) {
                        // For Veo, we might get a base64 or an operation. 
                        // Check for direct bytes first (Veo 2 sometimes does this for short videos)
                        const vData = json.predictions?.[0]?.bytesBase64Encoded;
                        if (vData) {
                            fs.writeFileSync(filename, Buffer.from(vData, 'base64'));
                            console.log(`   ✅ Video Saved: ${filename}`);
                            resolve();
                        } else {
                            console.log(`   ℹ️ Video API returned JSON (check manual download if URI):`, JSON.stringify(json).substring(0, 200));
                            // If it returns a URI we are good for now for the test
                            resolve();
                        }
                    } else {
                        // Imagen
                        const b64 = json.predictions?.[0]?.bytesBase64Encoded || json.predictions?.[0]?.b64;
                        if (b64) {
                            fs.writeFileSync(filename, Buffer.from(b64, 'base64'));
                            console.log(`   ✅ Image Saved: ${filename}`);
                            resolve();
                        } else {
                            reject(new Error("No image data in response"));
                        }
                    }

                } catch (e) { reject(e); }
            });
        });
        req.write(data);
        req.end();
    });
}

main();
