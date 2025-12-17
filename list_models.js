
import https from 'https';

const API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCLW9eXuvNAwafbES2N7iryCVZWBqCMXsE';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (data.models) {
                console.log("Available Models:");

                data.models.forEach(m => {
                    if (m.name.includes('imagen')) {
                        console.log(m.name);
                    }
                });
            } else {
                console.log("No models found or error:", data);
            }
        } catch (e) {
            console.log("Error parsing JSON:", e);
            console.log("Body:", body);
        }
    });
});
