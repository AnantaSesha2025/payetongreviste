import fs from 'fs';

// Test the updated gist service
const GIST_ID = '2198c40a1181db1edc86727df7f86260';

async function testUpdatedGistService() {
  console.log('🔍 Testing Updated Gist Service...');
  console.log(`Gist ID: ${GIST_ID}`);
  console.log('');

  try {
    // Test the raw content URL directly
    const rawUrl = `https://gist.githubusercontent.com/AnantaSesha2025/${GIST_ID}/raw/profiles.json`;
    console.log(`Raw URL: ${rawUrl}`);
    
    const response = await fetch(rawUrl);
    console.log(`Response Status: ${response.status}`);
    console.log(`Response OK: ${response.ok}`);
    console.log('');

    if (!response.ok) {
      console.log('❌ Raw URL failed:', response.statusText);
      return;
    }

    const profilesContent = await response.text();
    console.log('✅ Raw content loaded!');
    console.log(`Content length: ${profilesContent.length} characters`);
    
    try {
      const profiles = JSON.parse(profilesContent);
      console.log(`Number of profiles: ${profiles.length}`);
      
      if (profiles.length > 0) {
        console.log('Sample profile:');
        console.log(JSON.stringify(profiles[0], null, 2));
      }
    } catch (parseError) {
      console.log('❌ Error parsing profiles:');
      console.log(parseError.message);
    }

  } catch (error) {
    console.log('❌ Network Error:');
    console.log(error.message);
  }
}

// Run test
testUpdatedGistService();
