/**
 * Utility to populate your existing Gist with sample profiles
 */

import { githubGistService } from '../lib/githubGist';
import { generateFakeProfiles } from '../lib/fakeProfiles';

// const YOUR_GIST_ID = '139d04b67dba1da44d2c088d19dba628';

/**
 * Populate your Gist with sample profiles
 * Call this function in the browser console to add sample data
 */
export async function populateYourGist() {
  try {
    console.log('Generating sample profiles...');
    const sampleProfiles = generateFakeProfiles(5); // Generate 5 sample profiles

    console.log('Uploading to your Gist...');
    // Replace 'YOUR_GITHUB_TOKEN_HERE' with your actual token
    const result = await githubGistService.updateGist(
      sampleProfiles,
      'YOUR_GITHUB_TOKEN_HERE'
    );

    if (result.success) {
      console.log('✅ Successfully populated your Gist!');
      console.log('Gist URL:', result.gistUrl);
      console.log('Profiles added:', sampleProfiles.length);
    } else {
      console.error('❌ Failed to populate Gist:', result.error);
    }
  } catch (error) {
    console.error('❌ Error populating Gist:', error);
  }
}

// Make it available globally for console use
if (typeof window !== 'undefined') {
  (window as { populateYourGist: typeof populateYourGist }).populateYourGist =
    populateYourGist;
}
