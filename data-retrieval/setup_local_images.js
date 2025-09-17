import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(exec);

/**
 * Run a script and handle output
 */
async function runScript(scriptName, description) {
  console.log(`\n🔄 ${description}...`);
  console.log('='.repeat(50));
  
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptName}`, {
      cwd: __dirname
    });
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

/**
 * Check if required files exist
 */
function checkPrerequisites() {
  const requiredFiles = [
    '../src/lib/githubGist.js',
    '../src/lib/constants.js',
    'strike_funds_data.json'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const filePath = path.join(__dirname, file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    return false;
  }
  
  return true;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎭 Local Images Setup Script');
  console.log('============================');
  console.log('This script will:');
  console.log('1. Download 139 images from thispersondoesnotexist.com');
  console.log('2. Update profile data with local image URLs');
  console.log('3. Update GitHub Gist with new profile data');
  console.log('');

  // Check prerequisites
  if (!checkPrerequisites()) {
    console.error('💥 Prerequisites not met. Please ensure all required files exist.');
    process.exit(1);
  }

  console.log('✅ Prerequisites check passed');
  console.log('');

  const steps = [
    {
      script: 'download_profile_images.js',
      description: 'Downloading 139 images from thispersondoesnotexist.com'
    },
    {
      script: 'update_profiles_with_local_images.js',
      description: 'Updating profiles with local image URLs'
    },
    {
      script: 'update_gist_with_local_images.js',
      description: 'Updating GitHub Gist with new profile data'
    }
  ];

  let allSuccessful = true;

  for (const step of steps) {
    const success = await runScript(step.script, step.description);
    if (!success) {
      allSuccessful = false;
      console.error(`\n💥 Step failed: ${step.description}`);
      console.error('🛑 Stopping execution. Please fix the error and run again.');
      break;
    }
  }

  console.log('\n' + '='.repeat(50));
  
  if (allSuccessful) {
    console.log('🎉 All steps completed successfully!');
    console.log('');
    console.log('📁 Files created:');
    console.log('   - public/assets/profiles/ (139 images)');
    console.log('   - public/assets/profiles/manifest.json');
    console.log('   - data-retrieval/profiles_with_local_images.json');
    console.log('   - data-retrieval/update_summary.json');
    console.log('');
    console.log('🔗 Your app should now use local images instead of external URLs.');
    console.log('📊 Check the update_summary.json for detailed statistics.');
  } else {
    console.log('💥 Setup incomplete. Please check the errors above and try again.');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
