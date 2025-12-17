import https from 'https';

const options = {
    hostname: 'exercisedb.p.rapidapi.com',
    port: 443,
    path: '/exercises?limit=10',
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
};

console.log('Testing ExerciseDB API Key...');

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY SAMPLE:');
        console.log(data.substring(0, 200));

        if (res.statusCode === 200) {
            console.log('\n✅ SUCCESS: API Key is valid and working.');
        } else if (res.statusCode === 429) {
            console.log('\n❌ ERROR: Rate Limit Exceeded (429). You have used all your free requests.');
        } else if (res.statusCode === 403 || res.statusCode === 401) {
            console.log('\n❌ ERROR: Unauthorized (401/403). check API key subscription.');
        } else {
            console.log('\n⚠️ UNKNOWN STATUS');
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
