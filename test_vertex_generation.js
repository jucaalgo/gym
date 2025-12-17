import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

console.log('🎨 Testing Vertex AI Image Generation\n');

async function testGeneration() {
    // Get OAuth token
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    console.log('✅ Got OAuth token');
    console.log(`Token: ${token.substring(0, 50)}...\n`);

    // Test prompt
    const PROMPT = `A wide horizontal sprite sheet showing a sequence of 5 distinct steps of a fitness model performing a Barbell Bench Press. 
    Step 1: Start position. 
    Step 2: Moving down. 
    Step 3: Bottom position (perfect form, barbell touching chest properly). 
    Step 4: Moving up. 
    Step 5: End position. 
    
    Constraints: Same character, exact same lighting, fixed camera angle (side view), photorealistic 8k, cinematic lighting, futuristic gym app style, white background. 
    The weights are solid and respect physics, no clipping through body.`;

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    console.log(`📡 Calling Vertex AI...`);
    console.log(`URL: ${url}\n`);

    const data = JSON.stringify({
        instances: [{
            prompt: PROMPT
        }],
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
                console.log(`\n📊 Response Status: ${res.statusCode}`);

                if (res.statusCode !== 200) {
                    console.log(`❌ Error Response:`);
                    console.log(body.substring(0, 500));
                    resolve(false);
                    return;
                }

                try {
                    const json = JSON.parse(body);
                    console.log(`✅ Response received!`);
                    console.log(`Response keys:`, Object.keys(json));

                    if (json.predictions && json.predictions.length > 0) {
                        const pred = json.predictions[0];
                        console.log(`Prediction keys:`, Object.keys(pred));

                        const b64 = pred.bytesBase64Encoded || pred.b64 || pred.image?.b64;
                        if (b64) {
                            fs.writeFileSync('test_vertex_output.png', Buffer.from(b64, 'base64'));
                            console.log(`\n🎉 SUCCESS! Image saved to test_vertex_output.png`);
                            resolve(true);
                        } else {
                            console.log(`⚠️ No base64 data found in response`);
                            console.log(JSON.stringify(pred).substring(0, 200));
                            resolve(false);
                        }
                    } else {
                        console.log(`⚠️ No predictions in response`);
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

testGeneration();
