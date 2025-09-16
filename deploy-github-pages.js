#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // Copy _headers file to dist for proper MIME types
  const headersSource = path.join('public', '_headers');
  const headersDest = path.join('dist', '_headers');
  
  if (fs.existsSync(headersSource)) {
    fs.copyFileSync(headersSource, headersDest);
    console.log('✅ Copied _headers file to dist/');
  }

  // Copy fallback loader to dist
  const fallbackSource = path.join('public', 'fallback-loader.js');
  const fallbackDest = path.join('dist', 'fallback-loader.js');
  
  if (fs.existsSync(fallbackSource)) {
    fs.copyFileSync(fallbackSource, fallbackDest);
    console.log('✅ Copied fallback-loader.js to dist/');
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
