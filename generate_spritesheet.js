import { GoogleGenerativeAI } from '@google/generative-ai';
import https from 'https';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_API_KEY || '';
const MODEL = 'imagen-4.0-generate-001';
const OUTPUT_FILE = 'public/exercises/sequence_test/squat_sheet.png';

async function generateSpriteSheet() {
    console.log(`🎨 Generating Consistency Test (Sprite Sheet)...`);

    // PROMPT ENGINEERED FOR CONSISTENCY & PHYSICS
    const PROMPT = `
    A wide sequential motion photography composite of a Barbell Squat.
    Five (5) distinct phases of the movement arranging from left to right in a single row:
    1. Start (standing), 2. Descenet, 3. Bottom (deep squat), 4. Rising, 5. Lockout.
    
    CRITICAL ANATOMY & PHYSICS RULES:
    - The barbell must rest ON THE UPPER BACK (Trapezius muscles), NOT on the neck or inside the chest.
    - Hands must grip the bar firmly.
    - No clipping: The bar cannot pass through the body.
    - Character: Muscular male, X-Ray transparent skin showing red muscle contraction.
    - The character must be IDENTICAL in all 5 instances.
    
    Style: 8k medical medical illustration, white background, side profile view.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

    // Request "wide" aspect ratio if possible, or just standard 16:9 and hope for horizontal arrangement
    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9" // Wide format encourages side-by-side
        }
    });

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };

    const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            const json = JSON.parse(body);
            const b64 = json.predictions?.[0]?.bytesBase64Encoded || json.predictions?.[0]?.image?.b64;
            if (b64) {
                fs.writeFileSync(OUTPUT_FILE, Buffer.from(b64, 'base64'));
                console.log(`✅ Saved Sheet: ${OUTPUT_FILE}`);
            } else {
                console.log('❌ Failed:', body.substring(0, 200));
            }
        });
    });
    req.write(data);
    req.end();
}

generateSpriteSheet();
