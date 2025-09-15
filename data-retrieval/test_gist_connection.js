import fs from 'fs';

// Test script to check gist connection and debug issues
const GIST_ID = '2198c40a1181db1edc86727df7f86260';
const BASE_URL = 'https://api.github.com/gists';

async function testGistConnection() {
  console.log('🔍 Testing Gist Connection...');
  console.log(`Gist ID: ${GIST_ID}`);
  console.log(`API URL: ${BASE_URL}/${GIST_ID}`);
  console.log('');

  try {
    const response = await fetch(`${BASE_URL}/${GIST_ID}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    console.log(`Response Status: ${response.status}`);
    console.log(`Response OK: ${response.ok}`);
    console.log('');

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Error Response:');
      console.log(JSON.stringify(errorData, null, 2));
      return;
    }

    const result = await response.json();
    console.log('✅ Gist found!');
    console.log(`Description: ${result.description}`);
    console.log(`Public: ${result.public}`);
    console.log(`Files: ${Object.keys(result.files).join(', ')}`);
    console.log('');

    // Check if profiles.json exists
    if (result.files['profiles.json']) {
      const profilesContent = result.files['profiles.json'].content;
      console.log('✅ profiles.json found!');
      console.log(`Content length: ${profilesContent.length} characters`);
      
      try {
        const profiles = JSON.parse(profilesContent);
        console.log(`Number of profiles: ${profiles.length}`);
        
        if (profiles.length > 0) {
          console.log('Sample profile:');
          console.log(JSON.stringify(profiles[0], null, 2));
        }
      } catch (parseError) {
        console.log('❌ Error parsing profiles.json:');
        console.log(parseError.message);
      }
    } else {
      console.log('❌ profiles.json not found in gist');
      console.log('Available files:', Object.keys(result.files));
    }

  } catch (error) {
    console.log('❌ Network Error:');
    console.log(error.message);
  }
}

// Also test with our local data
async function testLocalData() {
  console.log('\n🔍 Testing Local Data...');
  
  try {
    const localData = JSON.parse(fs.readFileSync('./gist_profiles.json', 'utf8'));
    console.log(`✅ Local data loaded: ${localData.length} profiles`);
    
    if (localData.length > 0) {
      console.log('Sample local profile:');
      console.log(JSON.stringify(localData[0], null, 2));
    }
  } catch (error) {
    console.log('❌ Error loading local data:');
    console.log(error.message);
  }
}

// Run tests
testGistConnection();
testLocalData();
