// GitHub Pages routing fix
// This script handles the routing issues with GitHub Pages

(function() {
  'use strict';
  
  // Get the current pathname
  const currentPath = window.location.pathname;
  const basePath = '/payetogreviste/';
  
  console.log('Current path:', currentPath);
  console.log('Base path:', basePath);
  
  // Only redirect if we're NOT on the correct base path
  if (!currentPath.startsWith(basePath)) {
    console.log('Redirecting to correct base path...');
    window.location.replace(basePath);
    return;
  }
  
  console.log('Path is correct, continuing...');
})();
