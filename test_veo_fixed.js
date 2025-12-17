import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'veo-2.0-generate-001';

console.log('🎬 Testing Veo 2.0 with FIXED Polling\n');

async function testVideoGeneration() {
    // Get OAuth token
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    console.log('✅ Got OAuth token\n');

    const PROMPT = `Professional fitness demonstration video showing proper form for a Barbell Bench Press.
    
    The video shows:
    - Athletic male with defined musculature performing the exercise
    - Complete movement: start position → controlled descent → chest touch → powerful ascent → lockout
    - Perfect form with proper bar path and body mechanics
    - Side view angle (90 degrees) for biomechanics clarity
    - White studio background with dramatic rim lighting
    - Cinematic quality, smooth motion
    
    CRITICAL PHYSICS:
    - Barbell must rest ON the hands, NOT pass through chest or arms
    - Natural, fluid movement respecting gravity
    - NO clipping, morphing, or distortion
    - Equipment stays solid throughout`;

    // Initial request to start generation
    const startUrl = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    console.log(`📡 Starting video generation...`);

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
        const req = https.request(startUrl, options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', async () => {
                console.log(`📊 Initial Response Status: ${res.statusCode}\n`);

                if (res.statusCode !== 200) {
                    console.log(`❌ Error Response:`);
                    console.log(body.substring(0, 500));
                    resolve(false);
                    return;
                }

                try {
                    const json = JSON.parse(body);

                    // Check if it's a long-running operation
                    if (json.name) {
                        console.log(`✅ Video generation started!`);
                        console.log(`Operation: ${json.name}\n`);
                        console.log(`⏳ Polling for completion...\n`);

                        const success = await pollOperation(json.name, token);
                        resolve(success);
                    } else if (json.predictions) {
                        // Immediate response (unlikely for video)
                        console.log(`✅ Got immediate response (unusual for video)`);
                        resolve(true);
                    } else {
                        console.log(`⚠️ Unexpected response format`);
                        console.log(JSON.stringify(json).substring(0, 300));
                        resolve(false);
                    }

                } catch (e) {
                    console.log(`❌ JSON Parse Error: ${e.message}`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Network Error: ${e.message}`);
            reject(e);
        });

        req.write(data);
        req.end();
    });
}

async function pollOperation(operationName, token) {
    // The operationName already includes the full path like:
    // "projects/PROJECT_ID/locations/LOCATION/operations/OPERATION_ID"
    // We just need to prepend the API endpoint
    const pollUrl = `https://${REGION}-aiplatform.googleapis.com/v1/${operationName}`;

    console.log(`Polling URL: ${pollUrl}\n`);

    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max (5s intervals)

    while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
        attempts++;

        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const result = await new Promise((resolve) => {
            const req = https.get(pollUrl, options, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const json = JSON.parse(body);

                            if (json.done) {
                                resolve({ done: true, data: json });
                            } else {
                                // Still processing
                                process.stdout.write('.');
                                resolve({ done: false });
                            }
                        } catch (e) {
                            console.log(`\n⚠️ Parse error: ${e.message}`);
                            resolve({ done: false, error: true });
                        }
                    } else {
                        console.log(`\n⚠️ Status ${res.statusCode}: ${body.substring(0, 200)}`);
                        resolve({ done: false, error: true });
                    }
                });
            });

            req.on('error', (e) => {
                console.log(`\n⚠️ Request error: ${e.message}`);
                resolve({ done: false, error: true });
            });
        });

        if (result.done) {
            console.log(`\n\n✅ Video generation complete! (${attempts * 5}s)\n`);

            const response = result.data.response || result.data;

            console.log('Response structure:');
            console.log(JSON.stringify(response, null, 2).substring(0, 1000));

            // Try multiple possible paths for video data
            const videoData = response.predictions?.[0]?.bytesBase64Encoded
                || response.predictions?.[0]?.video?.bytesBase64Encoded
                || response.result?.video?.bytesBase64Encoded
                || response.video?.bytesBase64Encoded;

            const videoUri = response.predictions?.[0]?.videoUri
                || response.predictions?.[0]?.video?.uri
                || response.result?.video?.uri
                || response.video?.uri;

            if (videoData) {
                console.log(`\n💾 Saving video from base64 data...`);
                fs.writeFileSync('test_veo_output.mp4', Buffer.from(videoData, 'base64'));
                console.log(`🎉 SUCCESS! Video saved to test_veo_output.mp4`);
                return true;
            } else if (videoUri) {
                console.log(`\n📹 Video URI: ${videoUri}`);
                console.log(`🎉 SUCCESS! Video generated (URI provided)`);
                // Note: downloading from GCS URI requires additional handling
                return true;
            } else {
                console.log(`\n⚠️ Video generated but no data/URI found in response`);
                return false;
            }
        }

        if (result.error && attempts >= 3) {
            console.log(`\n\n❌ Too many polling errors`);
            return false;
        }
    }

    console.log(`\n\n⏱️ Timeout after ${maxAttempts * 5}s`);
    return false;
}

testVideoGeneration();
