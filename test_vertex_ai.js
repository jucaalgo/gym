import https from 'https';

// CONFIGURATION - Based on the credential provided
const VERTEX_TOKEN = 'AQ.Ab8RN6JQQGQYPAto8nCPrVbUsl0GbcS1m96-HwWVL6ZwQA6fOw';

// Try common project/region combinations
// User will need to provide if these don't work
const PROJECT_ID = process.env.VERTEX_PROJECT_ID || 'YOUR_PROJECT_ID';
const REGION = process.env.VERTEX_REGION || 'us-central1';
const MODEL = 'imagegeneration@006'; // Latest Imagen model on Vertex AI

console.log(`🔍 Testing Vertex AI Imagen Configuration`);
console.log(`Project: ${PROJECT_ID}`);
console.log(`Region: ${REGION}`);
console.log(`Model: ${MODEL}\n`);

async function testVertexAI() {
    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

    const testPrompt = {
        instances: [{
            prompt: "A professional fitness photo of a male athlete performing a bench press exercise, side view, white background, 8k"
        }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9"
        }
    };

    const data = JSON.stringify(testPrompt);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VERTEX_TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`\n📡 Response Status: ${res.statusCode}`);
                console.log(`📄 Response Headers:`, res.headers);

                if (res.statusCode === 200) {
                    console.log(`✅ SUCCESS! Vertex AI is working!`);
                    try {
                        const json = JSON.parse(body);
                        console.log(`\n📦 Response structure:`, Object.keys(json));
                        resolve(true);
                    } catch (e) {
                        console.log(`⚠️ Response body:`, body.substring(0, 500));
                        resolve(false);
                    }
                } else {
                    console.log(`❌ ERROR Response:`);
                    console.log(body.substring(0, 1000));

                    // Provide helpful error messages
                    if (res.statusCode === 401 || res.statusCode === 403) {
                        console.log(`\n💡 This looks like an authentication error.`);
                        console.log(`Please verify:`);
                        console.log(`1. The token is valid and not expired`);
                        console.log(`2. The project ID is correct`);
                        console.log(`3. Vertex AI API is enabled in your project`);
                        console.log(`4. You have the 'Vertex AI User' role`);
                    } else if (res.statusCode === 404) {
                        console.log(`\n💡 Resource not found. Please check:`);
                        console.log(`1. Project ID: ${PROJECT_ID}`);
                        console.log(`2. Region: ${REGION}`);
                        console.log(`3. Model name: ${MODEL}`);
                    }

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

testVertexAI();
