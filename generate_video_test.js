import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || '';
const MODEL = 'veo-2.0-generate-001'; // Video generation model

console.log(`🎥 Initializing Video Generation Test with ${MODEL}...`);

async function generateVideo() {
    // 1. Start Operation
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predictLongRunning?key=${API_KEY}`;

    const PROMPT = "Cinematic fitness footage of a male athlete performing a Barbell Squat with perfect form. Side view, gym environment, 4k resolution, smooth motion, 2 seconds duration.";

    const data = JSON.stringify({
        instances: [{ prompt: PROMPT }],
        parameters: {
            sampleCount: 1,
            aspectRatio: "16:9",
            durationSeconds: 5 // Min is 5, Max is 8
        }
    });

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    console.log('🚀 Sending generation request...');

    // Helper for request
    const makeRequest = (u, o, d) => new Promise((resolve, reject) => {
        const req = https.request(u, o, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ status: res.statusCode, body: body, headers: res.headers }));
        });
        if (d) req.write(d);
        req.end();
    });

    const initialRes = await makeRequest(url, options, data);

    console.log(`   Initial Status: ${initialRes.status}`);

    if (initialRes.status !== 200) {
        console.log('❌ Failed to start:', initialRes.body);
        return;
    }

    const json = JSON.parse(initialRes.body);
    const opName = json.name; // "operations/..."
    console.log(`   ⏳ Operation Started: ${opName}`);

    // POLOING LOOP
    console.log('   Polling for completion (this takes time)...');

    while (true) {
        await new Promise(r => setTimeout(r, 5000)); // Wait 5s

        const pollUrl = `https://generativelanguage.googleapis.com/v1beta/${opName}?key=${API_KEY}`;
        const pollRes = await makeRequest(pollUrl, { method: 'GET' });

        const pollJson = JSON.parse(pollRes.body);

        if (pollJson.done) {
            console.log('   ✅ Operation Done!');

            if (pollJson.response) {
                // Success!
                // Structure depends on model, likely a video URI or base64
                // For Veo it often returns a GCS URI or similar
                console.log('   Response Keys:', Object.keys(pollJson.response));

                // Let's inspect specific video fields
                const result = pollJson.response.result || pollJson.response;
                // Assuming standard prediction format
                const video = result.videos?.[0] || result.video;

                if (video) {
                    const b64 = video.bytesBase64Encoded || video.video?.b64; // Check various formats
                    if (video.uri) {
                        console.log(`   🔗 Video URI: ${video.uri} (Need to download)`);
                        // Download code here if URI
                    } else if (b64) {
                        fs.writeFileSync('public/test_squat.mp4', Buffer.from(b64, 'base64'));
                        console.log('   💾 Video saved to public/test_squat.mp4');
                    } else {
                        console.log('   ❓ Video format unknown:', JSON.stringify(video).substring(0, 200));
                    }
                } else {
                    // Sometimes it's directly in predictions?
                    console.log('   Raw Response:', JSON.stringify(pollJson.response).substring(0, 300));
                }
            } else if (pollJson.error) {
                console.log('   ❌ Operation Failed:', pollJson.error);
            }
            break;
        } else {
            console.log('   ... still processing');
        }
    }
}

generateVideo();
