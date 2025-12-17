import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
// URI from previous step output
const FILE_URI = 'https://generativelanguage.googleapis.com/v1beta/files/d31rsgpypyo8:download?alt=media';
const OUTPUT_FILE = 'public/test_squat.mp4';

console.log('⬇️ Downloading Video (with redirect support)...');

function download(url, dest) {
    return new Promise((resolve, reject) => {
        // Append Key if it's the API URL (redirects likely won't need it or will have it in signed query)
        const finalUrl = url.includes('googleapis.com') && !url.includes('key=')
            ? `${url}&key=${API_KEY}`
            : url;

        https.get(finalUrl, (res) => {
            // Handle Redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                console.log(`   🔀 Redirecting to: ${res.headers.location.substring(0, 50)}...`);
                download(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (res.statusCode === 200) {
                const file = fs.createWriteStream(dest);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`   ✅ Video saved to ${dest}`);
                    resolve();
                });
            } else {
                console.error(`   ❌ Failed: Status ${res.statusCode}`);
                console.error(`   Header:`, res.headers);
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
            }
        }).on('error', (e) => {
            console.error(`   ❌ Network Error: ${e.message}`);
            reject(e);
        });
    });
}

download(FILE_URI, OUTPUT_FILE);
