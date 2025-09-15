// Simple test script to check if the build works
const { execSync } = require('child_process');

console.log('Testing build process...');

try {
  console.log('Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
  
  // Check if dist folder exists and has content
  const fs = require('fs');
  const path = require('path');
  
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('✅ Dist folder exists');
    const files = fs.readdirSync(distPath);
    console.log('Files in dist:', files);
  } else {
    console.log('❌ Dist folder does not exist');
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
