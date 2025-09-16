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

  // Copy redirect.js to dist for SPA routing
  const redirectSource = path.join('public', 'redirect.js');
  const redirectDest = path.join('dist', 'redirect.js');
  
  if (fs.existsSync(redirectSource)) {
    fs.copyFileSync(redirectSource, redirectDest);
    console.log('✅ Copied redirect.js to dist/');
  }

  // Setup SPA routing for GitHub Pages
  const indexSource = path.join('dist', 'index.html');
  const notFoundDest = path.join('dist', '404.html');
  
  if (fs.existsSync(indexSource)) {
    // Read the index.html content
    let indexContent = fs.readFileSync(indexSource, 'utf8');
    
    // Add the redirect script to the 404.html
    const redirectScript = `
    <script>
      // GitHub Pages SPA routing fix
      // This script runs immediately to handle routing before React loads
      (function() {
        'use strict';
        
        const currentPath = window.location.pathname;
        const searchParams = window.location.search;
        const hash = window.location.hash;
        const basePath = '/payetogreviste/';
        
        console.log('404.html: Current path:', currentPath);
        
        // If we're not on the correct base path, redirect
        if (!currentPath.startsWith(basePath)) {
          console.log('404.html: Redirecting to base path...');
          const redirectUrl = basePath + currentPath.replace(basePath, '') + searchParams + hash;
          window.location.replace(redirectUrl);
          return;
        }
        
        // If we're on the base path, let React Router handle it
        console.log('404.html: Path is correct, React Router will handle routing');
      })();
    </script>`;
    
    // Insert the script before the closing body tag
    const updatedContent = indexContent.replace('</body>', redirectScript + '\n  </body>');
    
    // Write the enhanced 404.html
    fs.writeFileSync(notFoundDest, updatedContent);
    console.log('✅ Created enhanced 404.html for SPA routing');
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
