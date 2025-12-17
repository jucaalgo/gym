import https from 'https';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

const PATHS = [
    `/exercises/exercise/0001/image?rapidapi-key=${API_KEY}`,
    `/exercises/exercise/0001/gif?rapidapi-key=${API_KEY}`,
    `/image/0001?rapidapi-key=${API_KEY}`
];

console.log('🕵️‍♀️ Testing Image Query Param Authentication...');

PATHS.forEach((pathUrl) => {
    testPath(pathUrl);
});

function testPath(pathUrl) {
    const options = {
        hostname: HOST,
        port: 443,
        path: pathUrl,
        method: 'GET',
        // NO HEADERS - We want to test query param auth!
    };

    const req = https.request(options, (res) => {
        console.log(`path: ${pathUrl.split('?')[0]}... => Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log('✅ FOUND WORKING ENDPOINT!');
            console.log('Content-Type:', res.headers['content-type']);
        }
    });
    req.end();
}
