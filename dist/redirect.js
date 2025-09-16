// GitHub Pages routing fix
// This script handles the routing issues with GitHub Pages

(function() {
  'use strict';
  
  // Get the current pathname and search params
  const currentPath = window.location.pathname;
  const searchParams = window.location.search;
  const hash = window.location.hash;
  const basePath = '/payetogreviste/';
  
  console.log('Current path:', currentPath);
  console.log('Search params:', searchParams);
  console.log('Hash:', hash);
  console.log('Base path:', basePath);
  
  // If we're on a 404 page or a route that doesn't start with the base path,
  // redirect to the base path and let React Router handle the routing
  if (!currentPath.startsWith(basePath)) {
    console.log('Redirecting to correct base path...');
    const redirectUrl = basePath + (searchParams || '') + (hash || '');
    window.location.replace(redirectUrl);
    return;
  }
  
  // If we're already on the correct base path, let React Router handle the rest
  console.log('Path is correct, React Router will handle the routing...');
  
  // Additional check: if we're on the base path but React Router hasn't loaded yet,
  // wait for it to initialize
  if (currentPath === basePath && !window.React) {
    console.log('Waiting for React Router to initialize...');
    // This will be handled by the React app once it loads
  }
})();
