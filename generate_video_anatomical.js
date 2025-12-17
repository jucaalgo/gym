import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
const MODEL = 'veo-2.0-generate-001';

console.log(`🎥 Testing ANATOMICAL Video Generation (${MODEL})...`);

async function generateAnatomicalVideo() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${API_KEY}`;

    // HEAVY PROMPT ENGINEERING FOR ANATOMICAL STYLE
    const PROMPT = "Medical 3D animation of a male athlete performing a Barbell Squat. X-ray vision style, transparent skin revealing red muscular anatomy. Highlighting the quadriceps and glutes contracting. Scientific visualization, clean white background, 4k, smooth motion, high educational value.";

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            durationSeconds: 5
        }
    });

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    console.log('🚀 Sending anatomical prompt...');

    // Helper
    const makeRequest = (u, o, d) => new Promise((resolve, reject) => {
        const req = https.request(u, o, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ status: res.statusCode, body: body }));
        });
        if (d) req.write(d);
        req.end();
    });

    const initialRes = await makeRequest(url, options, data);

    if (initialRes.status !== 200) {
        console.log('❌ Start Failed:', initialRes.body);
        return;
    }

    const json = JSON.parse(initialRes.body);
    const opName = json.name;
    console.log(`   ⏳ Started: ${opName}`);

    // Polling
    while (true) {
        await new Promise(r => setTimeout(r, 5000));
        process.stdout.write('.');

        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${API_KEY}`;
        const pollRes = await makeRequest(pollUrl, { method: 'GET' });
        const pollJson = JSON.parse(pollRes.body);

        if (pollJson.done) {
            console.log('\n   ✅ Done!');
            // Log FULL response to debug structure
            console.log('   🔍 FULL RESPONSE:', JSON.stringify(pollJson, null, 2));

            const result = pollJson.response.result || pollJson.response;
            const video = result.videos?.[0] || result.video || result.generatedSamples?.[0]?.video; // Add generatedSamples support

            if (video && video.uri) {
                console.log(`   🔗 URI: ${video.uri}`);
                const dlUrl = `${video.uri}&key=${API_KEY}`;
                download(dlUrl, 'public/test_anatomical.mp4');
            } else {
                console.log('   ❓ No URI found in parsed result');
            }
            break;
        }
    }
}

function download(url, dest) {
    console.log(`   ⬇️ Downloading to ${dest}...`);
    https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            download(res.headers.location, dest);
            return;
        }
        res.pipe(fs.createWriteStream(dest));
    });
}

generateAnatomicalVideo();
