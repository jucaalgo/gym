import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'veo-2.0-generate-001'; // Latest Veo model

console.log('🎬 Testing Vertex AI Video Generation (Veo 2.0)\n');

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

    // Enhanced prompt for video
    const PROMPT = `Medical 3D animation showing proper form for a Barbell Bench Press exercise.
    
    The video should show:
    - Professional athlete with transparent skin showing red muscle highlights (chest, triceps, shoulders)
    - Complete movement cycle: starting position → descent → chest touch → ascent → lockout
    - Perfect form with controlled motion
    - Side view angle for biomechanics clarity
    - White studio background with dramatic rim lighting
    - 4k quality, smooth 60fps motion
    
    CRITICAL PHYSICS:
    - Barbell must rest ON the hands, NOT pass through chest or arms
    - Natural, fluid movement
    - Proper weight physics and gravity
    - NO clipping or morphing`;

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predictLongRunning?key=${token}`;

    console.log(`📡 Starting video generation...`);
    console.log(`Model: ${MODEL}\n`);

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            durationSeconds: 5
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
            res.on('end', async () => {
                console.log(`📊 Initial Response Status: ${res.statusCode}`);

                if (res.statusCode !== 200) {
                    console.log(`❌ Error Response:`);
                    console.log(body.substring(0, 500));
                    resolve(false);
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    const operationName = json.name;

                    if (!operationName) {
                        console.log(`⚠️ No operation name received`);
                        console.log(JSON.stringify(json).substring(0, 300));
                        resolve(false);
                        return;
                    }

                    console.log(`✅ Video generation started!`);
                    console.log(`Operation: ${operationName}`);
                    console.log(`\n⏳ Polling for completion (this takes ~1-2 minutes)...\n`);

                    // Poll for completion
                    const success = await pollOperation(operationName, token);
                    resolve(success);

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
    // The operation name is like: "projects/.../operations/xxx"
    // We need to add the full API endpoint
    const pollUrl = `https://${REGION}-aiplatform.googleapis.com/v1/${operationName}`;

    console.log(`Polling URL: ${pollUrl}\n`);

    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
        attempts++;

        process.stdout.write('.');

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
                    console.log(`\n[Poll #${attempts}] Status: ${res.statusCode}`);

                    if (res.statusCode === 200) {
                        try {
                            const json = JSON.parse(body);
                            if (json.done) {
                                resolve({ done: true, data: json });
                            } else {
                                console.log('Still processing...');
                                resolve({ done: false });
                            }
                        } catch (e) {
                            console.log('Parse error:', e.message);
                            resolve({ done: false });
                        }
                    } else {
                        console.log('Error response:', body.substring(0, 300));
                        resolve({ done: false, error: true, body });
                    }
                });
            });

            req.on('error', (e) => {
                console.log('\nRequest error:', e.message);
                resolve({ done: false, error: true });
            });
        });

        if (result.done) {
            console.log('\n\n✅ Video generation complete!');

            const response = result.data.response || result.data;
            console.log('Response keys:', Object.keys(response));
            console.log('Full response:', JSON.stringify(response, null, 2).substring(0, 1000));

            // Try to find video URL
            const videoUri = response.result?.videos?.[0]?.uri
                || response.generatedSamples?.[0]?.video?.uri
                || response.video?.uri;

            if (videoUri) {
                console.log(`\n📹 Video URL: ${videoUri}`);
                console.log(`\n🎉 SUCCESS! Veo 2.0 is working!`);
                return true;
            } else {
                console.log(`\n⚠️ Video generated but no URI found`);
                return false;
            }
        }

        if (result.error) {
            console.log('\n\nℹ️  Last error details:', result.body);
            // Don't immediately fail - might be temporary
            if (attempts >= 3) {
                console.log('\n❌ Too many polling errors');
                return false;
            }
        }
    }

    console.log('\n\n⏱️ Timeout waiting for video generation');
    return false;
}

testVideoGeneration();
