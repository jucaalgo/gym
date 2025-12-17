import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

const KEYWORDS = [
    'Squat', 'Deadlift', 'Bench Press', 'Lunge', 'Overhead Press',
    'Pull Up', 'Row', 'Push Up', 'Curl', 'Triceps',
    'Extension', 'Fly', 'Raise', 'Crunch', 'Plank',
    'Thrust', 'Bridge', 'Dip', 'Chin Up', 'Press'
];

let allExercises = [];
let completedRequests = 0;

console.log(`🚀 Starting Core GIF Fetch (${KEYWORDS.length} keywords)...`);

KEYWORDS.forEach((term, index) => {
    // Stagger requests slightly to be nice
    setTimeout(() => {
        fetchExercises(term);
    }, index * 500);
});

function fetchExercises(term) {
    const options = {
        hostname: HOST,
        port: 443,
        path: `/exercises/name/${encodeURIComponent(term.toLowerCase())}`, // Default limit is 10, lowercase required?
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': HOST
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);

        res.on('end', () => {
            try {
                if (res.statusCode === 200) {
                    const results = JSON.parse(data);
                    console.log(`✅ "${term}": Found ${results.length}`);
                    allExercises = [...allExercises, ...results];
                } else {
                    console.error(`❌ "${term}": Status ${res.statusCode}`);
                }
            } catch (e) {
                console.error(`❌ "${term}": Parse Error`);
            }

            checkCompletion();
        });
    });

    req.on('error', (e) => console.error(`❌ "${term}": Network Error`));
    req.end();
}

function checkCompletion() {
    completedRequests++;
    if (completedRequests === KEYWORDS.length) {
        saveData();
    }
}

function saveData() {
    console.log('\n📦 Deduplicating results...');

    // Remove duplicates by ID
    const uniqueExercises = Array.from(new Map(allExercises.map(ex => [ex.id, ex])).values());

    console.log(`🎉 Total Unique GIFs Fetched: ${uniqueExercises.length}`);

    const outputPath = path.join(__dirname, 'src', 'data', 'exercisedb_exercises.json');
    fs.writeFileSync(outputPath, JSON.stringify(uniqueExercises, null, 2));
    console.log(`💾 Saved to ${outputPath}`);
}
