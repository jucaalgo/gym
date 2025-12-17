import https from 'https';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';
const TERM = 'squat';

const options = {
    hostname: HOST,
    port: 443,
    path: `/exercises/name/${TERM}?limit=100`,
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST
    }
};

console.log(`🔎 Testing search for "${TERM}"...`);

const req = https.request(options, (res) => {
    console.log(`📡 API Status: ${res.statusCode}`);

    let data = '';
    res.on('data', chunk => data += chunk);

    res.on('end', () => {
        try {
            const results = JSON.parse(data);
            console.log(`📦 Found ${results.length} exercises for "${TERM}"`);
            if (results.length > 0) {
                console.log('Sample:', results[0].name);
            }
        } catch (e) {
            console.error('❌ Parse Error');
        }
    });
});

req.end();
