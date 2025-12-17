import https from 'https';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

const PATHS = [
    '/exercises?limit=50',
    '/exercises?limit=50&offset=0',
    '/exercises?first=50',
    '/exercises/bodyPart/back?limit=50',
    '/exercises/target/abs?limit=50'
];

console.log('🕵️‍♀️ Investigating API Limit behavior...');

PATHS.forEach((pathUrl, i) => {
    setTimeout(() => {
        testPath(pathUrl);
    }, i * 1000);
});

function testPath(pathUrl) {
    const options = {
        hostname: HOST,
        port: 443,
        path: pathUrl,
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
                const json = JSON.parse(data);
                const count = Array.isArray(json) ? json.length : 'Not Array';
                console.log(`👉 ${pathUrl.padEnd(40)} : Returned ${count} items`);
            } catch (e) {
                console.log(`❌ ${pathUrl.padEnd(40)} : Error ${res.statusCode}`);
            }
        });
    });
    req.end();
}
