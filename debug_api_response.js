import https from 'https';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

const options = {
    hostname: HOST,
    port: 443,
    path: '/exercises/exercise/0001', // Fetch specific ID
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': HOST
    }
};

console.log('🕵️‍♀️ Inspecting full object structure for ID 0001...');

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('KEYS:', Object.keys(json));
            if (json.gifUrl) {
                console.log('✅ gifUrl FOUND:', json.gifUrl);
            } else {
                console.log('❌ gifUrl MISSING in response');
            }
            console.log('Full Object:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Error parsing');
        }
    });
});
req.end();
