import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

const options = {
    hostname: HOST,
    port: 443,
    path: '/exercises?limit=50', // Testing limit=50
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST
    }
};

console.log('🚀 Starting ExerciseDB Data Prefetch...');
console.log('Target: src/data/exercisedb_exercises.json');

const req = https.request(options, (res) => {
    console.log(`📡 API Status: ${res.statusCode}`);

    if (res.statusCode !== 200) {
        console.error(`❌ Failed with status ${res.statusCode}`);
        process.exit(1);
    }

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
        process.stdout.write('.'); // Progress indicator
    });

    res.on('end', () => {
        console.log('\n✅ Download complete.');

        try {
            const exercises = JSON.parse(data);
            console.log(`📦 Processed ${exercises.length} exercises.`);

            const outputPath = path.join(__dirname, 'src', 'data', 'exercisedb_exercises.json');

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(outputPath, JSON.stringify(exercises, null, 2));
            console.log(`💾 Saved to ${outputPath}`);
            console.log('🎉 You can now use this file locally!');

        } catch (e) {
            console.error('❌ JSON Parse Error:', e);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
});

req.end();
