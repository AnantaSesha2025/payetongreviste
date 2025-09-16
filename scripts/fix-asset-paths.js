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
  content = content.replace(/\/payetongreviste\/\//g, '/payetongreviste/');
  
  // Ensure all asset paths start with the correct base path
  content = content.replace(/href="\/(?!payetongreviste\/)/g, 'href="/payetongreviste/');
  content = content.replace(/src="\/(?!payetongreviste\/)/g, 'src="/payetongreviste/');
  
  // Write the fixed content back
  fs.writeFileSync(indexPath, content);
  
  console.log('✅ Fixed asset paths in index.html');
  
  // Create/update 404.html for SPA routing
  const notFoundPath = path.join(distDir, '404.html');
  
  // Read the fixed index.html content
  const fixedIndexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Add SPA routing script to the end of the body
  const redirectScript = `
    <script>
      // GitHub Pages SPA routing fix
      (function() {
        'use strict';
        
        const currentPath = window.location.pathname;
        const searchParams = window.location.search;
        const hash = window.location.hash;
        const basePath = '/payetongreviste/';
        
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
  
  // Create 404.html with all assets and SPA routing
  const notFoundContent = fixedIndexContent.replace('</body>', redirectScript + '\n  </body>');
  
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log('✅ Created/updated 404.html with all assets and SPA routing');
  
  console.log('🎉 Asset path fixes completed!');
  
} catch (error) {
  console.error('❌ Error fixing asset paths:', error.message);
  process.exit(1);
}
