import https from 'https';
import fs from 'fs';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb-api1.p.rapidapi.com';

console.log(`🕵️‍♀️ Testing HOST: ${HOST}`);

const downloadFile = (url, path) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path);
        https.get(url, (res) => {
            console.log(`Download Status for ${url}: ${res.statusCode}`);
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        }).on('error', (err) => {
            fs.unlink(path, () => { });
            reject(err);
        });
    });
};

const options = {
    hostname: HOST,
    port: 443,
    path: '/api/v1/exercises',
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST
    }
};

const req = https.request(options, (res) => {
    let data = '';
    console.log(`API Response Status: ${res.statusCode}`);

    res.on('data', c => data += c);
    res.on('end', async () => {
        try {
            const json = JSON.parse(data);
            // Handle v1 structure: { success: true, data: [...] }
            const list = json.data || json;

            if (Array.isArray(list) && list.length > 0) {
                console.log(`✅ Retrieved ${list.length} exercises!`);
                const first = list[0];
                console.log('Sample Keys:', Object.keys(first).join(', '));

                // Try to find the image/gif URL
                // Check common keys: gifUrl, gif_url, images, image
                const gifUrl = first.gifUrl || first.gif_url ||
                    (first.images && first.images.length > 0 ? first.images[0] : null) ||
                    first.image;

                if (gifUrl) {
                    console.log(`Found GIF URL: ${gifUrl}`);
                    console.log('⬇️ Attempting download to prove access...');

                    const success = await downloadFile(gifUrl, 'proof_of_access.gif');
                    if (success) {
                        console.log('🎉 SUCCESS: GIF Downloaded to proof_of_access.gif');
                        console.log('PROOF CONFIRMED: You can download images with this key.');
                    } else {
                        console.log('❌ FAILED: GIF URL exists but gave non-200 status (likely 403/Forbidden)');
                    }
                } else {
                    console.log('❌ NO GIF URL found in this response object.');
                    console.log('Full object:', JSON.stringify(first, null, 2));
                }
            } else {
                console.log('❌ Unexpected response format or empty:', data.substring(0, 200));
            }
        } catch (e) {
            console.log('❌ Error parsing JSON:', e.message);
            console.log('Raw Data:', data.substring(0, 200));
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e.message);
});

req.end();
