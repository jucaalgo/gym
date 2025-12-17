import https from 'https';

const url = 'https://d205bpvrqc9yn1.cloudfront.net/0001.gif';

console.log(`Testing CDN access: ${url}`);

https.get(url, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('✅ CDN is accessible!');
    } else {
        console.log('❌ CDN Blocked/Invalid');
    }
}).on('error', (e) => {
    console.error('Network Error:', e.message);
});
