import { GoogleAuth } from 'google-auth-library';

async function testAuth() {
    console.log('🔐 Testing Service Account Authentication...\n');

    try {
        const auth = new GoogleAuth({
            keyFile: './vertex-service-account.json',
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
        } else {
            console.log('❌ FAILED: No token generated');
        }
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        console.log('\nFull error:', error);
    }
}

testAuth();
