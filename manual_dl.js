import https from 'https';
import fs from 'fs';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
// Extracted from log output manually
const FILE_URI = 'https://generativelanguage.googleapis.com/v1beta/files/w2983794h1s8:download?alt=media';
const OUTPUT_FILE = 'public/test_anatomical.mp4';

console.log('⬇️ Downloading Anatomical Video...');

function download(url, dest) {
    // Append Key if needed
    const finalUrl = url.includes('googleapis.com') && !url.includes('key=') ? `${url}&key=${API_KEY}` : url;

    https.get(finalUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            console.log(`   🔀 Redirecting...`);
            download(res.headers.location, dest);
            return;
        }
        res.pipe(fs.createWriteStream(dest));
        res.on('end', () => console.log(`   ✅ Saved to ${dest}`));
    });
}

// NOTE: Since I can't guarantee the URI from the truncated log is exactly valid/fresh, 
// I'll try to re-run the *generation* script one more time with BETTER logging 
// if this manual attempt is too risky. 
// BUT, let's try to parse the previous log better? No, let's re-run generation quickly
// to be safe, as signed URLs expire. 
// ACTUALLY: The log showed the start of the URI but it was truncated. 
// I MUST re-run the generation script with better logging to capture the full URI.

console.log('⚠️ Log was truncated. Re-running generation to capture full URI.');
