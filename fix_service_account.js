import fs from 'fs';

// Read the original JSON
const original = JSON.parse(fs.readFileSync('./vertex-service-account.json', 'utf8'));

// The private_key field has literal \n that need to be actual newlines
// JSON.parse already handles this automatically when reading,
// so we just need to write it back properly

// Write it back with proper formatting
fs.writeFileSync('./vertex-service-account-fixed.json', JSON.stringify(original, null, 2));

console.log('✅ Fixed service account JSON created: vertex-service-account-fixed.json');
console.log('\nTesting authentication...\n');

// Now test with the fixed version
import { GoogleAuth } from 'google-auth-library';

async function testAuth() {
    try {
        const auth = new GoogleAuth({
            keyFile: './vertex-service-account-fixed.json',
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        console.log('📋 Loading service account...');
        const client = await auth.getClient();

        console.log('🎟️  Generating access token...');
        const tokenResponse = await client.getAccessToken();

        if (tokenResponse.token) {
            console.log('✅ SUCCESS! Authentication working correctly.');
            console.log(`Token preview: ${tokenResponse.token.substring(0, 50)}...`);
            console.log(`\n✨ You can now use Vertex AI!`);

            // Replace the old file with the fixed one
            fs.copyFileSync('./vertex-service-account-fixed.json', './vertex-service-account.json');
            console.log('\n📝 Updated vertex-service-account.json with correct format');
        } else {
            console.log('❌ FAILED: No token generated');
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
    }
}

testAuth();
