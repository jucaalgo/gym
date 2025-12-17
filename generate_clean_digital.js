import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

// Prompt engineered for "Clean Digital 3D" - avoiding "Raw Meat/Resin" look
const PROMPT = `
    SEQUENCE: A seamless 5-frame sprite sheet of a 3D medical illustration performing a Barbell Bench Press.
    
    VISUAL STYLE (STRICT):
    - Subject: A digital 3D model of the human muscular system (Ecorché).
    - Aesthetic: CLEAN, MATTE, SYNTHETIC. Looks like a high-end medical app or ZBrush digital render.
    - Texture: Smooth, defined musculature. NOT shiny, NOT slimy, NOT wet.
    - Colors: Medical Red (muscles) and Clean White (tendons/bones).
    - Lighting: Even, flat global illumination (Ambience Occlusion). No harsh shadows.
    - Background: Pure White (#FFFFFF).
    
    ANIMATION SEQUENCE (Left to Right):
    1. Start Position
    2. Descending
    3. Bottom Position
    4. Ascending
    5. End Position
    
    FORMAT:
    - Side profile.
    - High resolution 8k.
    - Sharp edges.
`;

async function generateCleanDigital() {
    console.log("🧬 Generating Clean Digital 3D Test...");

    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const req = https.request(`https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`, options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(body);
                    const b64 = json.predictions[0].bytesBase64Encoded || json.predictions[0].b64;
                    fs.writeFileSync('public/clean_digital_test.png', Buffer.from(b64, 'base64'));
                    console.log('✅ Generated: public/clean_digital_test.png');
                } catch (e) { console.error(e); }
            } else {
                console.error(`❌ Error: ${res.statusCode} ${body}`);
            }
        });
    });

    req.write(data);
    req.end();
}

generateCleanDigital();
