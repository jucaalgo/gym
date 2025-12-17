import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

// STRATEGY: 
// 1. Generate SINGLE IMAGES (not 5-frame strips) to maximize resolution and quality.
// 2. Prove that the model CAN make high-quality humans if we simplify the request.

const STYLES = [
    {
        name: "HERO_A_CLEAN_STUDIO",
        prompt: `COMMERCIAL FITNESS PHOTOGRAPHY. A single full-body wide shot of a fit male athlete performing a Barbell Squat.
        Style: Apple Fitness+ / Nike Training Club aesthetic.
        Lighting: Bright, even, high-key studio lighting. Soft shadows. 
        Background: Pure Clean White Infinity Wall.
        Detail: 8k resolution, razor sharp focus on the athlete. Perfect skin texture, natural sweat.
        Subject: Realistic human, athletic build, wearing modern black compression shorts.`
    },
    {
        name: "HERO_B_CINEMATIC_DARK",
        prompt: `CINEMATIC GYM PORTRAIT. A single full-body wide shot of a fit male athlete performing a Barbell Squat.
        Style: High-end sports commercial (Adidas/Under Armour).
        Lighting: Dramatic rim lighting, volumentric fog, dark moody atmosphere.
        Background: Minimalist dark concrete gym.
        Detail: Hyper-realistic, 8k resolution, cinematic color grading (teal/orange subtle).
        Subject: Realistic human, intense focus, visible vascularity.`
    }
];

async function generateHeroShots() {
    console.log("📸 Generating Single Hero Shots (Quality Proof)...");

    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    for (const style of STYLES) {
        console.log(`\n🎨 Shooting: ${style.name}`);

        const data = JSON.stringify({
            instances: [{ prompt: style.prompt }],
            // Aspect ratio 1:1 or 4:3 is better for single subjects than wide strip
            parameters: { sampleCount: 1, aspectRatio: "4:3" }
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        await new Promise((resolve) => {
            const req = https.request(`https://${REGION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${REGION}/publishers/google/models/${MODEL}:predict`, options, (res) => {
                let body = '';
                res.on('data', c => body += c);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const json = JSON.parse(body);
                            const b64 = json.predictions[0].bytesBase64Encoded || json.predictions[0].b64;
                            fs.writeFileSync(`public/hero_test_${style.name}.png`, Buffer.from(b64, 'base64'));
                            console.log(`✅ Saved: public/hero_test_${style.name}.png`);
                        } catch (e) { console.log("Error parsing"); }
                    } else {
                        console.log(`❌ Error: ${res.statusCode}`);
                    }
                    resolve();
                });
            });
            req.write(data);
            req.end();
        });
    }
}

generateHeroShots();
