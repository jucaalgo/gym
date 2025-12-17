import { GoogleAuth } from 'google-auth-library';
import https from 'https';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './vertex-service-account.json';
const PROJECT_ID = 'gen-lang-client-0910887821';
const REGION = 'us-central1';
const MODEL = 'imagegeneration@006';

// 3 VARIANTES DE ESTILO PARA RECUPERAR CALIDAD
const STYLES = [
    //    {
    //        name: "STYLE_A_OLYMPIC_REALISM",
    //        prompt: `EXTREME HYPER-REALISM. A raw, unedited sports photograph of a professional male athlete performing a Barbell Squat. 
    //        Captured with a Sony A7R IV, 85mm f/1.2 lens. 
    //        Visible skin pores, realistic sweat droplets, intense vascularity, authentic gym lighting with harsh shadows. 
    //        Background: dark luxury gym environment, out of focus (bokeh). 
    //        The image must be indistinguishable from a real photograph. NO CGI look. 8k resolution, RAW format.`
    //    },
    //    {
    //        name: "STYLE_B_GOLD_CYBER",
    //        prompt: `PHOTOREALISTIC 3D RENDER. A conceptual fitness sculpture of a male bodybuilder performing a Barbell Squat. 
    //        Material: Matte black volcanic stone skin with CRACKS revealing SOLID LIQUID GOLD muscle fibers underneath. 
    //        Lighting: Studio rim lighting highlighting the gold reflection. 
    //        Render engine: Octane Render, Path Tracing, 8k, Ultra-sharp focus. 
    //        Physical accuracy: 100%. Gravity and weight physics must be perfect. White background.`
    //    },
    {
        name: "STYLE_C_GLASS_ANATOMY",
        prompt: `MEDICAL SCIENCE VISUALIZATION. A pristine 3D educational render of a human male performing a Barbell Squat. 
        Material: The skin is 'Frosted Glass' (semi-transparent), revealing the internal muscle structure in clean, scientific detail. 
        Style: High-end medical illustration, 8k resolution, subsurface scattering. 
        Lighting: Clinical white studio. 
        Aesthetic: Clean, modern, similar to Apple Health visuals. No gore, purely educational.`
    }
];

async function generateTestImages() {
    console.log("🧪 Generating Quality Recovery Tests...");

    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_PATH,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    for (const style of STYLES) {
        console.log(`\n🎨 Testing: ${style.name}`);

        const data = JSON.stringify({
            instances: [{ prompt: style.prompt }],
            parameters: { sampleCount: 1, aspectRatio: "16:9" }
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
                            fs.writeFileSync(`public/quality_test_${style.name}.png`, Buffer.from(b64, 'base64'));
                            console.log(`✅ Saved: public/quality_test_${style.name}.png`);
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

generateTestImages();
