// Fallback script loader for GitHub Pages MIME type issues
(function() {
  'use strict';
  
  // Check if we're on GitHub Pages and assets are failing
  if (window.location.hostname.includes('github.io')) {
    console.log('🔧 GitHub Pages detected - checking asset loading...');
    
    // Try to load the main script with fallback
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/payetogreviste/assets/index-DE_QOLij.js';
    
    script.onerror = function() {
      console.warn('⚠️ Main script failed to load, trying alternative approach...');
      
      // Create a simple fallback app
      const root = document.getElementById('root');
      if (root) {
        root.innerHTML = `
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h1>🚧 App Loading Issue</h1>
            <p>The JavaScript assets are not loading properly on GitHub Pages.</p>
            <p>This is likely due to MIME type issues or missing assets.</p>
            <p>Please try refreshing the page or check the deployment status.</p>
            <button onclick="window.location.reload()" style="padding: 10px 20px; margin: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Refresh Page
            </button>
          </div>
        `;
      }
    };
    
    script.onload = function() {
      console.log('✅ Main script loaded successfully');
    };
    
    document.head.appendChild(script);
  }
})();
