#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing asset paths for GitHub Pages...');

const distDir = 'dist';
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist/');
  process.exit(1);
}

try {
  // Read the index.html content
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Fix double slashes in asset paths
  content = content.replace(/\/payetogreviste\/\//g, '/payetogreviste/');
  
  // Ensure all asset paths start with the correct base path
  content = content.replace(/href="\/(?!payetogreviste\/)/g, 'href="/payetogreviste/');
  content = content.replace(/src="\/(?!payetogreviste\/)/g, 'src="/payetogreviste/');
  
  // Write the fixed content back
  fs.writeFileSync(indexPath, content);
  
  console.log('✅ Fixed asset paths in index.html');
  
  // Also fix 404.html if it exists
  const notFoundPath = path.join(distDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    let notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
    notFoundContent = notFoundContent.replace(/\/payetogreviste\/\//g, '/payetogreviste/');
    notFoundContent = notFoundContent.replace(/href="\/(?!payetogreviste\/)/g, 'href="/payetogreviste/');
    notFoundContent = notFoundContent.replace(/src="\/(?!payetogreviste\/)/g, 'src="/payetogreviste/');
    
    // Add the SPA routing script if it's missing
    if (!notFoundContent.includes('GitHub Pages SPA routing fix')) {
      const redirectScript = `
    <script>
      // GitHub Pages SPA routing fix
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
      
      // Replace the redirect.js script with the inline script
      notFoundContent = notFoundContent.replace(
        /<script src="\/payetogreviste\/redirect\.js"><\/script>/,
        redirectScript
      );
    }
    
    fs.writeFileSync(notFoundPath, notFoundContent);
    console.log('✅ Fixed asset paths and SPA routing in 404.html');
  }
  
  console.log('🎉 Asset path fixes completed!');
  
} catch (error) {
  console.error('❌ Error fixing asset paths:', error.message);
  process.exit(1);
}
