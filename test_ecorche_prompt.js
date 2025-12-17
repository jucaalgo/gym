import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

async function testPrompt() {
    console.log("🧪 Testing Ecorché Prompt...");

    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    const EXERCISE_NAME = "Barbell Squat";
    const TARGET_MUSCLE = "Quadriceps";
    const EQUIPMENT_TEXT = "Barbell rendered as solid, realistic material";

    const PROMPT = `A technical source image specifically designed to be sliced into a smooth animated GIF sequence for a premium mobile fitness app. It is a wide panoramic sprite sheet containing exactly 5 sequential frames arranged side-by-side of a professional 3D anatomical 'Ecorché' figure performing: ${EXERCISE_NAME}.

VISUAL STYLE & MOBILE OPTIMIZATION:
- Purpose: The output must be perfectly consistent across frames for smooth animation playback on mobile devices.
- Subject: High-end medical illustration style. Detailed Ecorché anatomy visualizing muscle fibers. Transparent anatomical study. Bold silhouettes for small screen clarity.
- Active Muscle Highlight: The ${TARGET_MUSCLE} features a high-contrast, neon-style thermal glow (orange/gold) that pulses in intensity with movement, ensuring instant readability on phones.
- Equipment: ${EQUIPMENT_TEXT}.
- Background: Pure clean white (#FFFFFF).

ANIMATION SEQUENCE FLOW (Left to Right):
- Frame 1 (Start Loop): Static starting position.
- Frame 2 (Concentric Action): Movement begins smoothly.
- Frame 3 (Peak Contraction): Maximum effort point. Muscle glow is brightest.
- Frame 4 (Eccentric Action): Controlled return movement.
- Frame 5 (End Loop): Returns exactly to the Frame 1 position to ensure a seamless, non-jarring looping animation.

TECHNICAL CONSTRAINTS FOR ANIMATION:
- CRITICAL: The camera angle (fixed lateral profile), lighting, and character model proportions MUST be pixel-perfect identical across all 5 frames so the final animation does not jitter or morph.
- Output Quality: 8k resolution source file, sharp focus, Unreal Engine 5 render style.`;

    const url = `https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`;

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

    const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log("Response Body (Preview):");
            console.log(body.substring(0, 2000));
        });
    });

    req.write(data);
    req.end();
}

testPrompt();
