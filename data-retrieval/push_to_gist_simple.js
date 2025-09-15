import fs from 'fs';

// Read the converted profiles
const gistProfiles = JSON.parse(fs.readFileSync('./gist_profiles.json', 'utf8'));

// GitHub Gist API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GIST_ID = '2198c40a1181db1edc86727df7f86260'; // From constants.ts
const BASE_URL = 'https://api.github.com/gists';

async function pushToGist() {
  console.log(`Pushing ${gistProfiles.length} profiles to GitHub Gist...`);
  
  try {
    // Try to update the existing gist first
    const updateResult = await updateGist();
    
    if (updateResult.success) {
      console.log('✅ Successfully updated existing gist!');
      console.log(`Gist URL: ${updateResult.gistUrl}`);
    } else {
      console.log('❌ Failed to update existing gist, trying to create a new one...');
      console.log(`Error: ${updateResult.error}`);
      
      // Try to create a new gist
      const createResult = await createGist();
      
      if (createResult.success) {
        console.log('✅ Successfully created new gist!');
        console.log(`Gist URL: ${createResult.gistUrl}`);
      } else {
        console.log('❌ Failed to create gist');
        console.log(`Error: ${createResult.error}`);
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function updateGist() {
  const gistData = {
    files: {
      'profiles.json': {
        content: JSON.stringify(gistProfiles, null, 2),
      },
    },
  };

  const response = await fetch(`${BASE_URL}/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(gistData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      error: errorData.message || 'Erreur lors de la mise à jour du Gist',
    };
  }

  const result = await response.json();
  return {
    success: true,
    gistUrl: result.html_url,
  };
}

async function createGist() {
  const gistData = {
    description: "PayeTonGréviste - Caisses de grève et profils d'activistes",
    public: true,
    files: {
      'profiles.json': {
        content: JSON.stringify(gistProfiles, null, 2),
      },
    },
  };

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(gistData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      error: errorData.message || 'Erreur lors de la création du Gist',
    };
  }

  const result = await response.json();
  return {
    success: true,
    gistUrl: result.html_url,
  };
}

// Run the script
pushToGist();
