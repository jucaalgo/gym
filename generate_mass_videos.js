import https from 'https';
import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
const MODEL = 'veo-2.0-generate-001';
const OUTPUT_DIR = 'public/videos';
const MANIFEST_FILE = 'public/video_manifest.json';
const CATALOG_FILE = 'public/free_exercise_catalog.json';

// --- UTILS ---
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// --- MAIN ---
async function main() {
    console.log(`🎥 MASS VIDEO GENERATOR (${MODEL})`);
    console.log(`-----------------------------------`);

    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Load Catalog
    const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
    let manifest = [];
    if (fs.existsSync(MANIFEST_FILE)) {
        try { manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')); } catch (e) { }
    }

    // Loop
    for (let i = 0; i < catalog.length; i++) {
        const exercise = catalog[i];
        const slug = slugify(exercise.name);
        const filename = `${slug}.mp4`;
        const filepath = path.join(OUTPUT_DIR, filename);

        console.log(`\n[${i + 1}/${catalog.length}] ${exercise.name}`);

        if (fs.existsSync(filepath)) {
            console.log(`   ⏭️  Skipping (Exists)`);
            if (!manifest.includes(slug)) manifest.push(slug);
            continue;
        }

        // GENERATE WITH RETRY
        let success = false;
        while (!success) {
            try {
                success = await generateVideoTask(exercise, filepath);
                if (success) {
                    console.log(`   ✅ Video Saved!`);
                    manifest.push(slug);
                    fs.writeFileSync(MANIFEST_FILE, JSON.stringify([...new Set(manifest)], null, 2));
                    // 60s cooldown between successful videos to play nice
                    console.log(`   ⏳ Cooling down 60s...`);
                    await sleep(60000);
                } else {
                    // Non-quota error, maybe skip?
                    console.log(`   ❌ Fatal Error for this exercise. Skipping.`);
                    break;
                }
            } catch (err) {
                if (err.message.includes('429')) {
                    console.log(`   🛑 QUOTA HIT. Sleeping 5 minutes...`);
                    await sleep(300000); // 5 minutes
                    console.log(`   🔄 Resuming...`);
                } else {
                    console.log(`   ⚠️ Error: ${err.message}`);
                    break; // Unknown error, skip
                }
            }
        }
    }
}

async function generateVideoTask(exercise, filepath) {
    // PROMPT ENGINEERING FOR PHYSICS FIX
    const muscles = exercise.primaryMuscles.join(', ');
    const PROMPT = `Medical 3D animation of a ${exercise.name}. 
    Style: X-ray vision, transparent skin, red highlights on ${muscles}.
    CRITICAL PHYSICS: The equipment must interact realistically with the body. NO CLIPPING. 
    Barbells/Dumbbells must be held firmly in hands and NOT pass through the chest/neck.
    Perfect form execution. White background. 4k resolution.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${API_KEY}`;
    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: { sampleCount: 1, aspectRatio: "16:9", durationSeconds: 5 }
    });

    const options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

    // 1. START
    const initialRes = await makeRequest(url, options, data);
    if (initialRes.status === 429) throw new Error('429');
    if (initialRes.status !== 200) {
        console.log(`   ⚠️ Start Failed: ${initialRes.status}`);
        return false;
    }

    const opName = JSON.parse(initialRes.body).name;
    console.log(`   ⏳ Processing: ${opName}`);

    // 2. POLL
    while (true) {
        await sleep(5000);
        process.stdout.write('.');

        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${API_KEY}`;
        const pollRes = await makeRequest(pollUrl, { method: 'GET' });

        if (pollRes.status === 429) throw new Error('429'); // Quota hit during polling

        const pollJson = JSON.parse(pollRes.body);
        if (pollJson.done) {
            console.log('\n   ✅ Done!');
            // console.log(JSON.stringify(pollJson, null, 2));

            const result = pollJson.response.result || pollJson.response;

            // Handle various Veo/Imagen response shapes
            const video = result.videos?.[0]
                || result.video
                || result.generatedSamples?.[0]?.video
                || result.generateVideoResponse?.generatedSamples?.[0]?.video;

            if (video && video.uri) {
                await download(video.uri, filepath);
                return true;
            } else {
                console.log('   ❓ No URI in response (Check structure)');
                console.log('   Dump:', JSON.stringify(result).substring(0, 300));
                return false;
            }
        }
    }

    // Low-level helpers (same as before)
    const makeRequest = (u, o, d) => new Promise((resolve) => {
        const req = https.request(u, o, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ status: res.statusCode, body }));
        });
        if (d) req.write(d);
        req.end();
    });

    const download = (url, dest) => new Promise((resolve, reject) => {
        const finalUrl = url.includes('key=') ? url : `${url}&key=${API_KEY}`;
        https.get(finalUrl, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400) {
                download(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            res.pipe(fs.createWriteStream(dest)).on('finish', resolve).on('error', reject);
        });
    });

    main();
