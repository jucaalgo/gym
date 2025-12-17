import https from 'https';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';

// CONFIGURATION
const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const LOCATION = 'us-central1';
const MODEL = 'imagen-3.0-fast-generate-001'; // Latest and most advanced model
const OUTPUT_DIR = 'C:/Users/JUAN CARLOS/.gemini/antigravity/brain/4aac8082-aa70-4626-a619-f0f88667258e';
const CSV_FILE = 'C:/Users/JUAN CARLOS/.gemini/antigravity/playground/sonic-aldrin/public/REPORTE_IMPLACABLE_V8.csv';

// Load service account
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

// Helper for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Generate JWT for OAuth2
function generateJWT() {
    const now = Math.floor(Date.now() / 1000);
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };
    const payload = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: serviceAccount.token_uri,
        exp: now + 3600,
        iat: now
    };

    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${base64Header}.${base64Payload}`;

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(serviceAccount.private_key, 'base64url');

    return `${signatureInput}.${signature}`;
}

// Get OAuth2 Access Token
async function getAccessToken() {
    const jwt = generateJWT();

    return new Promise((resolve, reject) => {
        const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

        const options = {
            hostname: 'oauth2.googleapis.com',
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const data = JSON.parse(body);
                    resolve(data.access_token);
                } else {
                    reject(new Error(`OAuth failed: ${res.statusCode} ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function generateImage(filename, prompt, accessToken, retryCount = 0) {
    console.log(`🎨 Generating: ${filename} (Attempt ${retryCount + 1})...`);

    const endpoint = `${LOCATION}-aiplatform.googleapis.com`;
    const url = `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

    const payload = JSON.stringify({
        instances: [
            {
                prompt: prompt
            }
        ],
        parameters: {
            sampleCount: 1,
            aspectRatio: "1:1"
        }
    });

    const options = {
        hostname: endpoint,
        path: url,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', async () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(body);
                        const predictions = json.predictions;
                        if (predictions && predictions.length > 0) {
                            const b64 = predictions[0].bytesBase64Encoded;
                            if (b64) {
                                const filepath = path.join(OUTPUT_DIR, filename);
                                fs.writeFileSync(filepath, Buffer.from(b64, 'base64'));
                                console.log(`✅ Saved: ${filename}`);
                                resolve(true);
                            } else {
                                console.log(`❌ Missing data for ${filename}`);
                                resolve(false);
                            }
                        } else {
                            console.log(`❌ No prediction for ${filename}`);
                            resolve(false);
                        }
                    } catch (e) {
                        console.log(`❌ JSON Error: ${e.message}`);
                        resolve(false);
                    }
                } else if (res.statusCode === 429) {
                    console.log(`⚠️ Rate Limit (429) for ${filename}. Waiting...`);
                    const waitTime = 30000 * (retryCount + 1);
                    console.log(`   Sleeping for ${waitTime / 1000}s`);
                    await delay(waitTime);
                    if (retryCount < 5) {
                        resolve(await generateImage(filename, prompt, accessToken, retryCount + 1));
                    } else {
                        console.log(`❌ Failed after 5 retries for ${filename}`);
                        resolve(false);
                    }
                } else {
                    console.log(`❌ API Error (${res.statusCode}) for ${filename}: ${body}`);
                    resolve(false);
                }
            });
        });
        req.on('error', (e) => {
            console.error(`❌ Network Error: ${e.message}`);
            resolve(false);
        });
        req.write(payload);
        req.end();
    });
}

function processLine(line) {
    if (!line || line.startsWith('Archivo;')) return null;

    const parts = line.split(';');
    if (parts.length < 2) return null;

    const filename = parts[0].trim();
    if (!filename.endsWith('.png')) return null;

    const issue = parts.slice(1).join(';').toLowerCase();

    const exerciseName = filename.replace('.png', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    let prompt = `photorealistic fitness model performing ${exerciseName}. SOLO ATHLETE. SINGLE PERSON ONLY. Perfect form and biomechanics. Pure white studio background. Professional lighting. Athletic physique. High detail. 8k. `;

    if (issue.includes('levitación') || issue.includes('sombra') || issue.includes('flotando')) {
        prompt += 'Feet firmly planted on floor with visible ground contact. Realistic gravity and weight distribution. ';
    }

    if (issue.includes('sujeto incorrecto')) {
        prompt += `Correct ${exerciseName} technique and positioning. `;
    }

    if (exerciseName.includes('Stretch')) {
        prompt += 'Calm controlled stretching posture. ';
    } else {
        prompt += 'Dynamic athletic intensity. ';
    }

    return { filename, prompt };
}

async function run() {
    console.log(`🚀 Starting Vertex AI Mass Generation Pipeline...`);
    console.log(`📂 Source: ${CSV_FILE}`);
    console.log(`📂 Output: ${OUTPUT_DIR}`);
    console.log(`🔐 Authenticating with Vertex AI...`);

    let accessToken;
    try {
        accessToken = await getAccessToken();
        console.log(`✅ Authentication successful`);
    } catch (e) {
        console.error(`❌ Auth failed: ${e.message}`);
        process.exit(1);
    }

    if (!fs.existsSync(CSV_FILE)) {
        console.error(`❌ CSV File not found: ${CSV_FILE}`);
        process.exit(1);
    }

    const fileStream = fs.createReadStream(CSV_FILE);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const queue = [];

    for await (const line of rl) {
        const task = processLine(line);
        if (task) {
            queue.push(task);
        }
    }

    console.log(`📋 Found ${queue.length} images to process.`);

    const startTime = Date.now();
    let completed = 0;

    for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        const success = await generateImage(item.filename, item.prompt, accessToken);

        if (success) completed++;

        // Progress bar
        const percent = Math.floor(((i + 1) / queue.length) * 100);
        const barLength = 40;
        const filledLength = Math.floor((barLength * (i + 1)) / queue.length);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

        const elapsed = (Date.now() - startTime) / 1000;
        const avgTime = elapsed / (i + 1);
        const remaining = Math.floor((queue.length - (i + 1)) * avgTime);
        const eta = `${Math.floor(remaining / 60)}m ${remaining % 60}s`;

        process.stdout.write(`\r[${bar}] ${percent}% | ${i + 1}/${queue.length} | ✅ ${completed} | ETA: ${eta}  `);

        await delay(3000);
    }

    console.log('\n✨ All Done!');
}

run();
