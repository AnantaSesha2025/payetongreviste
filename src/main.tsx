import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './utils/populateGist.ts'; // Load the utility
import App from './App.tsx';

// Debug logging for deployment
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Current pathname:', window.location.pathname);

// Use the same base URL as Vite configuration for consistency
const basename = import.meta.env.BASE_URL;
console.log('Router basename:', basename);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
