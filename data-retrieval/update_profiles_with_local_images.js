import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const PROFILES_FILE = path.join(__dirname, 'strike_funds_data.json');
const MANIFEST_FILE = path.join(__dirname, '..', 'public', 'assets', 'profiles', 'manifest.json');
const OUTPUT_FILE = path.join(__dirname, 'profiles_with_local_images.json');

/**
 * Load the manifest to get available images
 */
function loadManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    throw new Error('Manifest file not found. Please run download_profile_images.js first.');
  }
  
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  console.log(`📋 Loaded manifest with ${manifest.images.length} images`);
  return manifest;
}

/**
 * Load existing profiles data
 */
function loadProfiles() {
  if (!fs.existsSync(PROFILES_FILE)) {
    throw new Error('Profiles file not found. Please ensure strike_funds_data.json exists.');
  }
  
  const profiles = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8'));
  console.log(`👥 Loaded ${profiles.length} profiles`);
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

    return {
      ...profile,
      photoUrl: localImageUrl,
      localImageIndex: imageIndex,
      localImageFilename: `profile-${imageIndex.toString().padStart(3, '0')}.jpg`
    };
  });

  console.log(`🔄 Updated ${updatedProfiles.length} profiles with local image URLs`);
  return updatedProfiles;
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
    imageUsage: {}
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
 * Main execution
 */
async function main() {
  try {
    console.log('🖼️  Profile Image Updater');
    console.log('=========================');
    console.log('');

    // Load data
    const manifest = loadManifest();
    const profiles = loadProfiles();

    // Update profiles
    const updatedProfiles = updateProfilesWithLocalImages(profiles, manifest);

    // Generate statistics
    const stats = generateStats(updatedProfiles, manifest);

    // Save updated profiles
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedProfiles, null, 2));
    console.log(`💾 Saved updated profiles to: ${OUTPUT_FILE}`);

    // Display statistics
    console.log('');
    console.log('📊 Update Statistics:');
    console.log(`   Total profiles: ${stats.totalProfiles}`);
    console.log(`   Profiles with local images: ${stats.profilesWithLocalImages}`);
    console.log(`   Profiles with original images: ${stats.profilesWithOriginalImages}`);
    console.log(`   Available images: ${stats.totalImages}`);
    
    // Show image usage distribution
    const usageEntries = Object.entries(stats.imageUsage);
    if (usageEntries.length > 0) {
      console.log('');
      console.log('🔄 Image Usage Distribution:');
      usageEntries
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([index, count]) => {
          console.log(`   Image ${index}: used ${count} times`);
        });
    }

    console.log('');
    console.log('✅ Profile update completed!');
    console.log(`📁 Output file: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error('💥 Update failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
