import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

// 1400 is enough for 1324 exercises
const TOTAL_PAGES = 140;
const LIMIT = 10;
let allExercises = [];
let activeRequests = 0;
let pageIndex = 0;

console.log(`🚀 Starting Full Catalog Download (${TOTAL_PAGES * LIMIT} max item check)...`);

// Start the loop
nextBatch();

function nextBatch() {
    if (pageIndex >= TOTAL_PAGES) {
        finish();
        return;
    }

    const currentOffset = pageIndex * LIMIT;
    fetchPage(currentOffset);
    pageIndex++;

    // Simple rate limiter: wait 250ms before NEXT request
    setTimeout(nextBatch, 250);
}

function fetchPage(offset) {
    const options = {
        hostname: HOST,
        port: 443,
        path: `/exercises?limit=${LIMIT}&offset=${offset}`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': HOST
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            try {
                if (res.statusCode === 200) {
                    const results = JSON.parse(data);
                    if (Array.isArray(results) && results.length > 0) {
                        process.stdout.write('+'); // Success dot
                        allExercises.push(...results);
                    } else {
                        process.stdout.write('-'); // Empty dot
                    }
                } else {
                    process.stdout.write('x'); // Error dot
                }
            } catch (e) {
                process.stdout.write('!'); // Parse error
            }
        });
    });

    req.on('error', (e) => console.error('NetErr'));
    req.end();
}

function finish() {
    // Wait a bit for pending requests
    setTimeout(() => {
        console.log('\n\n📦 Deduplicating...');
        const unique = Array.from(new Map(allExercises.map(ex => [ex.id, ex])).values());

        console.log(`🎉 Download Complete!`);
        console.log(`📊 Total Raw: ${allExercises.length}`);
        console.log(`✨ Total Unique: ${unique.length}`);

        if (unique.length > 1000) {
            const outputPath = path.join(__dirname, 'src', 'data', 'exercisedb_exercises.json');
            fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2));
            console.log(`💾 Saved to ${outputPath}`);
        } else {
            console.error('⚠️ Warning: Download count seems low (<1000). Check API limits.');
        }
    }, 5000);
}
