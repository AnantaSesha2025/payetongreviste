#!/usr/bin/env node

import { generateFakeProfiles } from './src/lib/fakeProfiles.js';
import { githubGistService } from './src/lib/githubGist.js';

async function createWorkingGist() {
  console.log('🚀 Creating a working Gist with sample profiles...');
  
  try {
    // Generate sample profiles
    const sampleProfiles = generateFakeProfiles(5);
    console.log(`📝 Generated ${sampleProfiles.length} sample profiles`);
    
    // Create a new Gist
    const result = await githubGistService.createGist(
      sampleProfiles,
      '', // No token needed for public Gist creation via raw URL
      "PayeTonGréviste - Sample Profiles for Testing"
    );
    
    if (result.success) {
      console.log('✅ Gist created successfully!');
      console.log(`🔗 Gist URL: ${result.gistUrl}`);
      
      // Extract Gist ID from URL
      const gistId = result.gistUrl.split('/').pop();
      console.log(`🆔 Gist ID: ${gistId}`);
      console.log('');
      console.log('📋 Next steps:');
      console.log(`1. Update src/lib/constants.ts with the new Gist ID: ${gistId}`);
      console.log('2. Test the connection in your app');
      
      return gistId;
    } else {
      console.error('❌ Failed to create Gist:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating Gist:', error.message);
    return null;
  }
}

// Run the script
createWorkingGist();
