#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Deploying to GitHub Pages (gh-pages branch)...');

try {
  // Ensure we're on master branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'master') {
    console.log(`⚠️  Currently on ${currentBranch} branch, switching to master...`);
    execSync('git checkout master', { stdio: 'inherit' });
  }

  // Build the project
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify the build
  console.log('🔍 Verifying build...');
  execSync('node scripts/verify-deployment.js', { stdio: 'inherit' });

  // Deploy to gh-pages branch
  console.log('🌐 Deploying to gh-pages branch...');
  execSync('npx gh-pages -d dist -b gh-pages', { stdio: 'inherit' });

  console.log('🎉 Deployment completed successfully!');
  console.log('🔗 Your app should be available at: https://anantasesha2025.github.io/payetogreviste/');
  console.log('📁 Assets should be available at: https://anantasesha2025.github.io/payetogreviste/assets/');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
