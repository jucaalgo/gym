import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
// URI extracted MANUALLY from the previous log
const FILE_URI = 'https://generativelanguage.googleapis.com/v1beta/files/3zaif4pusr05:download?alt=media';
const OUTPUT_FILE = 'public/test_anatomical.mp4';

console.log('⬇️ Downloading Anatomical Video (Manual Rescue)...');

function download(url, dest) {
    const finalUrl = url.includes('googleapis.com') && !url.includes('key=')
        ? `${url}&key=${API_KEY}`
        : url;

    console.log(`   URL: ${finalUrl.substring(0, 60)}...`);

    https.get(finalUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            console.log(`   🔀 Redirecting...`);
            download(res.headers.location, dest);
            return;
        }

        if (res.statusCode === 200) {
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`   ✅ Video saved to ${dest}`);
            });
        } else {
            console.error(`   ❌ Failed: ${res.statusCode}`);
            res.resume();
        }
    }).on('error', (e) => console.error(`   ❌ Error: ${e.message}`));
}

download(FILE_URI, OUTPUT_FILE);
