import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/payetongreviste/' : '/',
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 3000, // Default port
    strictPort: true, // Exit if port is already in use
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  // Ensure proper handling of static assets for GitHub Pages
  publicDir: 'public',
}));
