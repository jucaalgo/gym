import https from 'https';

const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg';

console.log(`Testing Image Access: ${url}`);

https.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
}).on('error', (e) => console.error('Error:', e.message));
