import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || '';
const MODEL = 'imagen-4.0-generate-001'; // WOW

console.log(`🎨 Generating with ${MODEL}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const PROMPT = "Professional fitness illustration of a male athlete performing a Barbell Squat. Minimalist modern gym background, high contrast lighting, scientific anatomical art style, 8k resolution, white background, detailed muscle definition, side view.";

// Construct payload for Imagen on Vertex/Agile API
const data = JSON.stringify({
    instances: [
        { prompt: PROMPT }
    ],
    parameters: {
        sampleCount: 1,
        aspectRatio: "16:9"
    }
});

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(url, options, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(body);
                // Check common prediction response structures
                const predictions = json.predictions;
                if (predictions && predictions.length > 0) {
                    // It might be bytesBase64Encoded or similar
                    const b64 = predictions[0].bytesBase64Encoded || predictions[0].b64 || predictions[0].image?.b64;

                    if (b64) {
                        const buffer = Buffer.from(b64, 'base64');
                        fs.writeFileSync('public/test_imagen4_squat.png', buffer);
                        console.log('✅ SUCCESS: Image saved to public/test_imagen4_squat.png');
                    } else {
                        console.log('❌ Image data not found in prediction:', JSON.stringify(predictions[0]).substring(0, 100));
                    }
                } else {
                    console.log('❌ No predictions found:', body.substring(0, 200));
                }
            } catch (e) {
                console.log('❌ JSON Error:', e.message);
            }
        } else {
            console.log('❌ API Error:', body.substring(0, 300));
        }
    });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
