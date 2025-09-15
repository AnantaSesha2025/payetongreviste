import fs from 'fs';
import { githubGistService } from './src/lib/githubGist.js';

// Read the converted profiles
const gistProfiles = JSON.parse(fs.readFileSync('gist_profiles.json', 'utf8'));

// You'll need to set your GitHub token here
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'your_github_token_here';

async function pushToGist() {
  console.log(`Pushing ${gistProfiles.length} profiles to GitHub Gist...`);
  
  // Set the gist ID from constants
  const { DEFAULT_GIST_ID } = await import('./src/lib/constants.js');
  githubGistService.setGistId(DEFAULT_GIST_ID);
  
  // Try to update the existing gist first
  const updateResult = await githubGistService.updateGist(gistProfiles, GITHUB_TOKEN);
  
  if (updateResult.success) {
    console.log('✅ Successfully updated existing gist!');
    console.log(`Gist URL: ${updateResult.gistUrl}`);
  } else {
    console.log('❌ Failed to update existing gist, trying to create a new one...');
    console.log(`Error: ${updateResult.error}`);
    
    // Try to create a new gist
    const createResult = await githubGistService.createGist(
      gistProfiles, 
      GITHUB_TOKEN, 
      "PayeTonGréviste - Caisses de grève et profils d'activistes"
    );
    
    if (createResult.success) {
      console.log('✅ Successfully created new gist!');
      console.log(`Gist URL: ${createResult.gistUrl}`);
    } else {
      console.log('❌ Failed to create gist');
      console.log(`Error: ${createResult.error}`);
    }
  }
}

// Check if GitHub token is provided
if (GITHUB_TOKEN === 'YOUR TOKEN HERE') {
  console.log('❌ Please set your GitHub token:');
  console.log('1. Set GITHUB_TOKEN environment variable, or');
  console.log('2. Replace "your_github_token_here" in this script');
  console.log('');
  console.log('You can get a token from: https://github.com/settings/tokens');
  console.log('Make sure to give it "gist" permissions.');
} else {
  pushToGist().catch(console.error);
}
