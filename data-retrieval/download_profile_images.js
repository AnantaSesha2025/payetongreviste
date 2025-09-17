import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TOTAL_IMAGES = 139;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'profiles');
const DELAY_BETWEEN_DOWNLOADS = 1000; // 1 second delay to be respectful
const MAX_RETRIES = 3;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Download a single image from thispersondoesnotexist.com
 * @param {number} index - Image index (1-139)
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<boolean>} - Success status
 */
async function downloadImage(index, retryCount = 0) {
  const filename = `profile-${index.toString().padStart(3, '0')}.jpg`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`✅ Skipping ${filename} (already exists)`);
    return true;
  }

  return new Promise((resolve) => {
    const url = 'https://thispersondoesnotexist.com/';
    
    console.log(`📥 Downloading ${filename} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
    
    const file = fs.createWriteStream(filepath);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded ${filename}`);
          resolve(true);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete partial file
          console.error(`❌ File write error for ${filename}:`, err.message);
          resolve(false);
        });
      } else {
        console.error(`❌ HTTP ${response.statusCode} for ${filename}`);
        resolve(false);
      }
    });
    
    request.on('error', (err) => {
      console.error(`❌ Request error for ${filename}:`, err.message);
      resolve(false);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      console.error(`❌ Timeout for ${filename}`);
      resolve(false);
    });
  });
}

/**
 * Download all images with retry logic and rate limiting
 */
async function downloadAllImages() {
  console.log(`🚀 Starting download of ${TOTAL_IMAGES} images...`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`⏱️  Delay between downloads: ${DELAY_BETWEEN_DOWNLOADS}ms`);
  console.log('');

  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };

  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    let success = false;
    let retryCount = 0;

    // Try downloading with retries
    while (!success && retryCount <= MAX_RETRIES) {
      success = await downloadImage(i, retryCount);
      
      if (!success) {
        retryCount++;
        if (retryCount <= MAX_RETRIES) {
          console.log(`🔄 Retrying ${i} in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (success) {
      results.success++;
    } else {
      results.failed++;
      console.error(`💥 Failed to download image ${i} after ${MAX_RETRIES + 1} attempts`);
    }

    // Rate limiting delay (except for the last image)
    if (i < TOTAL_IMAGES) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_DOWNLOADS));
    }

    // Progress update every 10 images
    if (i % 10 === 0) {
      console.log(`📊 Progress: ${i}/${TOTAL_IMAGES} (${Math.round((i/TOTAL_IMAGES)*100)}%)`);
    }
  }

  console.log('');
  console.log('🎉 Download completed!');
  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  
  if (results.failed > 0) {
    console.log('');
    console.log('⚠️  Some images failed to download. You can run the script again to retry failed downloads.');
  }

  return results;
}

/**
 * Generate a manifest file with all downloaded images
 */
function generateManifest() {
  const manifest = {
    totalImages: TOTAL_IMAGES,
    downloadDate: new Date().toISOString(),
    images: []
  };

  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const filename = `profile-${i.toString().padStart(3, '0')}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      manifest.images.push({
        index: i,
        filename: filename,
        url: `/assets/profiles/${filename}`,
        size: stats.size,
        lastModified: stats.mtime.toISOString()
      });
    }
  }

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📋 Generated manifest: ${manifestPath}`);
  
  return manifest;
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🎭 Profile Image Downloader');
    console.log('============================');
    console.log('');

    const results = await downloadAllImages();
    
    if (results.success > 0) {
      console.log('');
      console.log('📋 Generating manifest...');
      const manifest = generateManifest();
      console.log(`📊 Manifest contains ${manifest.images.length} images`);
    }

    console.log('');
    console.log('🏁 Script completed!');
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
