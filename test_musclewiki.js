import https from 'https';
import fs from 'fs';

const MUSCLEWIKI_BASE = 'musclewiki.com';

console.log('🔍 Testing MuscleWiki API...\n');

// Test 1: Get exercises for a muscle group
const testMuscle = (muscle) => {
    return new Promise((resolve) => {
        const options = {
            hostname: MUSCLEWIKI_BASE,
            port: 443,
            path: `/newapi/exercise/muscles/${muscle}/`,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };

        https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ muscle, status: res.statusCode, count: json.length || 0, sample: json[0] });
                } catch (e) {
                    resolve({ muscle, status: res.statusCode, error: 'Parse error' });
                }
            });
        }).on('error', (e) => resolve({ muscle, error: e.message })).end();
    });
};

// Test multiple muscle groups
const muscles = ['glutes', 'biceps', 'chest', 'quads', 'back'];

Promise.all(muscles.map(testMuscle)).then(results => {
    console.log('=== RESULTS ===\n');

    let totalExercises = 0;
    let hasGifs = false;

    results.forEach(r => {
        if (r.count) {
            console.log(`✅ ${r.muscle.toUpperCase()}: ${r.count} exercises`);
            totalExercises += r.count;

            if (r.sample) {
                console.log(`   Sample: "${r.sample.exercise_name}"`);
                if (r.sample.videoURL || r.sample.gifURL) {
                    console.log(`   GIF URL: ${r.sample.videoURL || r.sample.gifURL}`);
                    hasGifs = true;
                }
                console.log('   Keys:', Object.keys(r.sample).join(', '));
            }
        } else {
            console.log(`❌ ${r.muscle}: ${r.error || 'No data'}`);
        }
        console.log('');
    });

    console.log('=== SUMMARY ===');
    console.log(`Total Exercises: ${totalExercises}`);
    console.log(`Has GIF URLs: ${hasGifs ? 'YES ✅' : 'NO ❌'}`);
    console.log('\nSample Full Object:');
    const sample = results.find(r => r.sample)?.sample;
    if (sample) {
        console.log(JSON.stringify(sample, null, 2));
    }
});
