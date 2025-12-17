import https from 'https';

const API_KEY = '9209f66f2bmsh248ed806697d269p19d56fjsn9d0bd3a1902e';
const HOST = 'exercisedb.p.rapidapi.com';

console.log('🕵️‍♀️ Testing Offset Pagination...');

const req1 = fetchUrl('/exercises?limit=1&offset=0');
const req2 = fetchUrl('/exercises?limit=1&offset=1');

Promise.all([req1, req2]).then(([res1, res2]) => {
    const id1 = res1[0]?.id;
    const name1 = res1[0]?.name;

    const id2 = res2[0]?.id;
    const name2 = res2[0]?.name;

    console.log(`Page 1 (Offset 0): ${id1} - ${name1}`);
    console.log(`Page 2 (Offset 1): ${id2} - ${name2}`);

    if (id1 !== id2) {
        console.log('✅ Pagination WORKS! We can download everything.');
    } else {
        console.log('❌ Pagination IGNORED. API returns same data.');
    }
});

function fetchUrl(pathUrl) {
    return new Promise((resolve) => {
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

        https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        }).end();
    });
}
