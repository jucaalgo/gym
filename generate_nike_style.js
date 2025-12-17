import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

// Prompt engineered for "Nike Commercial" Quality - High End Sports Photography
const PROMPT = `
    SEQUENCE: A seamless 5-frame sprite sheet of a professional athlete performing a Barbell Bench Press.
    
    VISUAL STYLE (NIKE COMMERCIAL):
    - Subject: REAL HUMAN ATHLETE (Male). Peak physical condition.
    - Aesthetic: Dark, Moody, High-Contrast Cinematic Lighting. "Nike Ad" look.
    - Lighting: Strong RIM LIGHTING (Edge light) to separate subject from background. Volumetric atmosphere.
    - Detail: Hyper-realistic skin texture, visible sweat, vascularity, intense focus.
    - Clothing: Premium matte black sportswear (Shorts/Compression gear). Minimalist.
    - Background: Deep Dark Grey / Black Studio (Infinity wall). 
    - Photography: Shot on Sony A7R V, 85mm f/1.2 GM. Sharp focus on muscles.
    
    ANIMATION SEQUENCE (Left to Right):
    1. Start Position (Arms locked out)
    2. Eccentric (Lowering weight)
    3. Bottom Position (Chest touch)
    4. Concentric (Pressing up)
    5. End Position (Lock out)
    
    FORMAT:
    - Side profile (90 degrees).
    - Wide aspect ratio for the strip.
    - Perfect consistency between frames (same character, same lighting).
`;

async function generateNikeStyle() {
    console.log("👟 Generating 'Nike Commercial' Style Test...");

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
                    fs.writeFileSync('public/nike_style_test.png', Buffer.from(b64, 'base64'));
                    console.log('✅ Generated: public/nike_style_test.png');
                } catch (e) { console.error(e); }
            } else {
                console.error(`❌ Error: ${res.statusCode} ${body}`);
            }
        });
    });

    req.write(data);
    req.end();
}

generateNikeStyle();
