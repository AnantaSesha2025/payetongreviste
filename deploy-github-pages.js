#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting GitHub Pages deployment...');

try {
  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Ensure .nojekyll file exists in dist
  const nojekyllSource = path.join('public', '.nojekyll');
  const nojekyllDest = path.join('dist', '.nojekyll');
  
  if (fs.existsSync(nojekyllSource)) {
    fs.copyFileSync(nojekyllSource, nojekyllDest);
    console.log('✅ Copied .nojekyll file to dist/');
  } else {
    // Create .nojekyll file if it doesn't exist
    fs.writeFileSync(nojekyllDest, '');
    console.log('✅ Created .nojekyll file in dist/');
  }

  // Setup SPA routing for GitHub Pages
  const indexSource = path.join('dist', 'index.html');
  const notFoundDest = path.join('dist', '404.html');
  
  if (fs.existsSync(indexSource)) {
    fs.copyFileSync(indexSource, notFoundDest);
    console.log('✅ Created 404.html for SPA routing');
  } else {
    console.error('❌ index.html not found in dist/');
    process.exit(1);
  }

  // Deploy to GitHub Pages
  console.log('🌐 Deploying to GitHub Pages...');
  execSync('gh-pages -d dist', { stdio: 'inherit' });

  console.log('🎉 Deployment completed successfully!');
  console.log('🔗 Your app should be available at: https://anantasesha2025.github.io/payetogreviste/');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
