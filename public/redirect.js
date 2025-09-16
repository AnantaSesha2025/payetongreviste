// GitHub Pages routing fix
// This script handles the routing issues with GitHub Pages

(function() {
  'use strict';
  
  // Get the current pathname
  const currentPath = window.location.pathname;
  const basePath = '/payetogreviste/';
  
  console.log('Current path:', currentPath);
  console.log('Base path:', basePath);
  
  // If we're not on the correct base path, redirect
  if (currentPath !== basePath && !currentPath.startsWith(basePath)) {
    console.log('Redirecting to correct base path...');
    window.location.replace(basePath);
    return;
  }
  
  // If we're on the root of the base path, ensure we have the trailing slash
  if (currentPath === basePath.slice(0, -1)) {
    console.log('Adding trailing slash...');
    window.location.replace(basePath);
    return;
  }
  
  console.log('Path is correct, continuing...');
})();
