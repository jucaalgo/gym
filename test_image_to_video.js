import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

// ═══════════════════════════════════════════════════════════════
// IMAGE-TO-VIDEO TEST
// ═══════════════════════════════════════════════════════════════
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
// Using Veo 3.1 for best motion quality
const MODEL = 'veo-3.1-generate-preview';

const INPUT_IMAGE = 'comparison_image_Barbell_Squat.png';
const OUTPUT_VIDEO = 'animated_squat_veo3.mp4';

const PROMPT = `
CINEMATIC SLOW MOTION.
The athlete performs a controlled deep squat.
Hips descend below knees. Back remains straight.
Smooth, professional movement. 
Adhere perfectly to the anatomy in the reference image.
`;

async function main() {
    console.log(`🎬 IMAGE-TO-VIDEO TEST: ${INPUT_IMAGE} -> ${MODEL}`);
    console.log(`----------------------------------------`);

    if (!fs.existsSync(INPUT_IMAGE)) {
        console.error(`❌ Input image not found: ${INPUT_IMAGE}`);
        return;
    }

    const auth = new GoogleAuth({ keyFile: SERVICE_ACCOUNT_PATH, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;

    let attempts = 0;
    while (attempts < 5) {
        try {
            await generateVideo(token, PROMPT, INPUT_IMAGE, OUTPUT_VIDEO);
            console.log(`\n🎉 SUCCESS! Video saved to: ${OUTPUT_VIDEO}`);
            break;
        } catch (e) {
            if (e.message.includes('429')) {
                console.log(`   ⚠️ Quota Hit (429). Waiting 60s...`);
                await new Promise(r => setTimeout(r, 60000));
                attempts++;
            } else {
                console.log(`\n❌ FAILED: ${e.message}`);
                break;
            }
        }
    }
}

async function generateVideo(token, prompt, imagePath, outputPath) {
    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

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
            aspectRatio: "16:9",
            // fps: 24 // Optional
        }
    });

    console.log("   🚀 Sending request to Veo...");

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', async () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`API ${res.statusCode}: ${body.substring(0, 300)}...`));
                    return;
                }

                try {
                    const json = JSON.parse(body);

                    // 1. Direct Video?
                    if (json.predictions?.[0]?.bytesBase64Encoded) {
                        fs.writeFileSync(outputPath, Buffer.from(json.predictions[0].bytesBase64Encoded, 'base64'));
                        resolve();
                        return;
                    }

                    // 2. Long Running Operation?
                    // Veo often returns an LRO name or a resource link
                    // If it is a raw model endpoint it might behave differently.
                    // Let's inspect the response if it's not direct bytes.
                    console.log("   ℹ️ Initial Response (checking for LRO):", JSON.stringify(json).substring(0, 300));

                    // Note: If using the 'predict' method on Veo, it might return LRO format differently.
                    // But typically raw REST API returns { name: "projects/..." } for LRO.
                    // However, 'predict' is usually synchronous for Image Generation but ASYNC for Video.
                    // If this response is an LRO, we need to poll.

                    // Simple Polling implementation if 'name' exists
                    if (json.name) {
                        await pollOperation(token, json.name, outputPath, resolve, reject);
                    } else if (json.predictions?.[0]?.video?.bytesBase64Encoded) {
                        // Some schema variations
                        fs.writeFileSync(outputPath, Buffer.from(json.predictions[0].video.bytesBase64Encoded, 'base64'));
                        resolve();
                    } else {
                        // Fallback: Dump full response to debug
                        reject(new Error(`Unknown response structure: ${JSON.stringify(json).substring(0, 300)}`));
                    }

                } catch (e) { reject(e); }
            });
        });
        req.write(data);
        req.end();
    });
}

async function pollOperation(token, operationName, outputPath, resolve, reject) {
    console.log(`   ⏳ Polling Operation: ${operationName}`);
    // Extract ID if needed or use full name? Usually full name works with operations endpoint.
    // Endpoint: https://us-central1-aiplatform.googleapis.com/v1/projects/.../locations/.../operations/...
    // BUT Verify correct endpoint.
    // Usually: https://{REGION}-aiplatform.googleapis.com/v1/{operationName}

    const pollUrl = `https://${REGION}-aiplatform.googleapis.com/v1/${operationName}`;

    let isDone = false;
    while (!isDone) {
        await new Promise(r => setTimeout(r, 10000)); // 10s poll

        await new Promise((pRes, pRej) => {
            const req = https.request(pollUrl, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        console.log(`   ⚠️ Poll Error ${res.statusCode}`);
                        // don't reject immediately, maybe transient
                        pRes();
                        return;
                    }
                    const json = JSON.parse(body);
                    if (json.done) {
                        isDone = true;
                        if (json.error) {
                            reject(new Error(`Operation Failed: ${json.error.message}`));
                        } else {
                            // Where is the video? 
                            // Usually in response.predictions OR response.result
                            // For Veo it might return a GCS URI in the result.
                            console.log("   ✅ Operation Done. Result:", JSON.stringify(json.response).substring(0, 200));

                            // Handle Veo Result Structure
                            // Often: response: { predictions: [ { bytesBase64Encoded: "..." } ] }
                            const result = json.response;
                            if (result && result.predictions && result.predictions[0].bytesBase64Encoded) {
                                fs.writeFileSync(outputPath, Buffer.from(result.predictions[0].bytesBase64Encoded, 'base64'));
                                resolve();
                            } else {
                                // Check for GCS URI
                                reject(new Error("Video generated but output format handling not implemented yet (check console)."));
                            }
                        }
                    } else {
                        process.stdout.write(".");
                    }
                    pRes();
                });
            });
            req.end();
        });
    }
}

main();
