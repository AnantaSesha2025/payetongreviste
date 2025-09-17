import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GIST_ID = '2198c40a1181db1edc86727df7f86260';
const GIST_FILENAME = 'profiles.json';
const MANIFEST_FILE = path.join(__dirname, '..', 'public', 'assets', 'profiles', 'manifest.json');
const OUTPUT_FILE = path.join(__dirname, 'updated_gist_data.json');

// GitHub API configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Load the manifest to get available local images
 */
function loadManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    throw new Error('Manifest file not found. Please run download_profile_images.js first.');
  }
  
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  console.log(`📋 Loaded manifest with ${manifest.images.length} local images`);
  return manifest;
}

/**
 * Fetch current Gist data from GitHub
 */
async function fetchGistData() {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required. Please set it with your GitHub personal access token.');
  }

  console.log(`🔍 Fetching Gist data from GitHub...`);
  
  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PayeTonGreviste-ImageUpdater'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Gist: ${response.status} ${response.statusText}`);
  }

  const gistData = await response.json();
  
  if (!gistData.files[GIST_FILENAME]) {
    throw new Error(`File ${GIST_FILENAME} not found in Gist`);
  }

  const profiles = JSON.parse(gistData.files[GIST_FILENAME].content);
  console.log(`👥 Fetched ${profiles.length} profiles from Gist`);
  
  return profiles;
}

/**
 * Update profiles with local image URLs
 */
function updateProfilesWithLocalImages(profiles, manifest) {
  const imageMap = new Map();
  manifest.images.forEach(img => {
    imageMap.set(img.index, img.url);
  });

  const updatedProfiles = profiles.map((profile, index) => {
    const imageIndex = (index % 139) + 1; // Cycle through 139 images
    const localImageUrl = imageMap.get(imageIndex);
    
    if (!localImageUrl) {
      console.warn(`⚠️  No local image found for profile ${profile.id} (index ${imageIndex})`);
      return profile; // Keep original photoUrl
    }

    // Replace the randomuser.me URL with local asset URL
    const updatedProfile = {
      ...profile,
      photoUrl: localImageUrl,
      localImageIndex: imageIndex,
      localImageFilename: `profile-${imageIndex.toString().padStart(3, '0')}.jpg`
    };

    console.log(`🔄 Updated ${profile.name} (${profile.id}) with local image: ${localImageUrl}`);
    return updatedProfile;
  });

  console.log(`✅ Updated ${updatedProfiles.length} profiles with local image URLs`);
  return updatedProfiles;
}

/**
 * Push updated data back to Gist
 */
async function updateGist(updatedProfiles) {
  console.log(`📤 Updating Gist with new data...`);
  
  const gistData = {
    description: "PayeTonGréviste - Profils d'activistes (Updated with local images)",
    files: {
      [GIST_FILENAME]: {
        content: JSON.stringify(updatedProfiles, null, 2)
      }
    }
  };

  const response = await fetch(`${GITHUB_API_BASE}/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PayeTonGreviste-ImageUpdater',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gistData)
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to update Gist: ${response.status} ${response.statusText}\n${errorData}`);
  }

  const updatedGist = await response.json();
  console.log(`✅ Gist updated successfully!`);
  console.log(`🔗 Gist URL: ${updatedGist.html_url}`);
  
  return updatedGist;
}

/**
 * Generate statistics about the update
 */
function generateStats(profiles, manifest) {
  const stats = {
    totalProfiles: profiles.length,
    totalImages: manifest.images.length,
    profilesWithLocalImages: 0,
    profilesWithOriginalImages: 0,
    imageUsage: {},
    updatedAt: new Date().toISOString()
  };

  profiles.forEach(profile => {
    if (profile.photoUrl && profile.photoUrl.startsWith('/assets/profiles/')) {
      stats.profilesWithLocalImages++;
      
      if (profile.localImageIndex) {
        stats.imageUsage[profile.localImageIndex] = (stats.imageUsage[profile.localImageIndex] || 0) + 1;
      }
    } else {
      stats.profilesWithOriginalImages++;
    }
  });

  return stats;
}

/**
 * Save backup of updated data
 */
function saveBackup(updatedProfiles, stats) {
  const backupData = {
    metadata: {
      updatedAt: new Date().toISOString(),
      gistId: GIST_ID,
      totalProfiles: updatedProfiles.length,
      stats: stats
    },
    profiles: updatedProfiles
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(backupData, null, 2));
  console.log(`💾 Backup saved to: ${OUTPUT_FILE}`);
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🖼️  Gist Image Updater');
    console.log('======================');
    console.log('');

    // Load local images manifest
    const manifest = loadManifest();

    // Fetch current Gist data
    const profiles = await fetchGistData();

    // Update profiles with local image URLs
    const updatedProfiles = updateProfilesWithLocalImages(profiles, manifest);

    // Generate statistics
    const stats = generateStats(updatedProfiles, manifest);

    // Update the Gist
    const updatedGist = await updateGist(updatedProfiles);

    // Save backup
    saveBackup(updatedProfiles, stats);

    // Display statistics
    console.log('');
    console.log('📊 Update Statistics:');
    console.log(`   Total profiles: ${stats.totalProfiles}`);
    console.log(`   Profiles with local images: ${stats.profilesWithLocalImages}`);
    console.log(`   Profiles with original images: ${stats.profilesWithOriginalImages}`);
    console.log(`   Available local images: ${stats.totalImages}`);
    
    // Show image usage distribution
    const usageEntries = Object.entries(stats.imageUsage);
    if (usageEntries.length > 0) {
      console.log('');
      console.log('🔄 Image Usage Distribution (top 10):');
      usageEntries
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([index, count]) => {
          console.log(`   Image ${index}: used ${count} times`);
        });
    }

    console.log('');
    console.log('✅ Gist update completed successfully!');
    console.log(`🔗 Updated Gist: ${updatedGist.html_url}`);
    console.log(`📁 Backup file: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('💥 Update failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();