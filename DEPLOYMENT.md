# Deployment Guide - PayeTonGréviste

This guide covers how to deploy the PayeTonGréviste Strike fund discovery app to various hosting platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Static Hosting](#static-hosting)
- [Environment Configuration](#environment-configuration)
- [Domain Setup](#domain-setup)
- [Monitoring & Analytics](#monitoring--analytics)
- [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- Git repository access
- Hosting platform account (Vercel, Netlify, etc.)
- Domain name (optional)

## 🏗️ Build Process

### 1. Prepare for Production

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build for production
npm run build
```

### 2. Verify Build

```bash
# Preview production build locally
npm run preview
```

The build creates a `dist/` folder with:

- `index.html` - Main HTML file
- `assets/` - Bundled CSS and JS files
- `vite.svg` - Static assets

### 3. Build Configuration

The app uses Vite for building. Configuration in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
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
});
```

## 🌐 Static Hosting

### Vercel (Recommended)

Vercel provides excellent React support with automatic deployments.

#### Setup

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add production variables

#### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### GitHub Integration

1. Connect GitHub repository to Vercel
2. Enable automatic deployments
3. Configure branch protection rules

### Netlify

Netlify offers drag-and-drop deployment and Git integration.

#### Setup

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Deploy**

   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod --dir=dist
   ```

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages

Free hosting for public repositories.

#### Setup

1. **Install gh-pages**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**

   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**

   ```bash
   npm run build
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

### Firebase Hosting

Google's hosting platform with global CDN.

#### Setup

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**

   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "/assets/**",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "public, max-age=31536000, immutable"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## ⚙️ Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Production Configuration
VITE_APP_TITLE=PayeTonGréviste
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# API Configuration
VITE_API_BASE_URL=https://api.payetongreviste.com
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false

# Strike Fund Configuration
VITE_DEFAULT_FUND_CATEGORIES=transport,education,health,environment
VITE_MAX_PROFILES_PER_LOAD=20
VITE_FUND_UPDATE_INTERVAL=3600000
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

### Vite Environment Modes

Create different config files:

- `.env` - Default
- `.env.local` - Local overrides
- `.env.development` - Development
- `.env.production` - Production
- `.env.staging` - Staging

## 🌍 Domain Setup

### Custom Domain

1. **Purchase Domain**
   - Use providers like Namecheap, GoDaddy, or Cloudflare
   - Choose a memorable name related to the cause

2. **Configure DNS**
   - Add CNAME record pointing to hosting platform
   - Example: `www.payetongreviste.com` → `your-app.vercel.app`

3. **SSL Certificate**
   - Most hosting platforms provide free SSL
   - Ensure HTTPS is enabled

### Domain Configuration Examples

#### Vercel

```bash
# Add domain in Vercel dashboard
# Or via CLI
vercel domains add payetongreviste.com
vercel domains add www.payetongreviste.com
```

#### Netlify

```bash
# Add domain in Netlify dashboard
# Or via CLI
netlify sites:create --name payetongreviste
netlify domains:add payetongreviste.com
```

## 📊 Monitoring & Analytics

### Performance Monitoring

#### Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to main.tsx
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  )
}
```

#### Web Vitals

```bash
# Install web-vitals
npm install web-vitals

# Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### Error Tracking

#### Sentry

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
})
```

### Analytics

#### Google Analytics

```html
<!-- Add to index.html -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Privacy-First Analytics

```bash
# Install Plausible Analytics
npm install plausible-tracker

# Add to main.tsx
import { trackPageview } from 'plausible-tracker'

trackPageview()
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures

1. **TypeScript Errors**

   ```bash
   # Check TypeScript compilation
   npx tsc --noEmit

   # Fix type errors
   npm run lint -- --fix
   ```

2. **Memory Issues**

   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **Dependency Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

#### Deployment Issues

1. **404 Errors**
   - Ensure SPA routing is configured
   - Check redirect rules in hosting config

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values

3. **Build Output**
   - Ensure `dist/` folder contains all files
   - Check for missing assets

#### Performance Issues

1. **Large Bundle Size**

   ```bash
   # Analyze bundle
   npm run build -- --analyze

   # Check bundle size
   npx vite-bundle-analyzer dist
   ```

2. **Slow Loading**
   - Enable gzip compression
   - Optimize images
   - Use CDN for static assets

### Debugging

#### Local Production Build

```bash
# Build and serve locally
npm run build
npm run preview

# Check console for errors
# Test all functionality
```

#### Network Issues

```bash
# Check network requests
# Open browser DevTools
# Go to Network tab
# Look for failed requests
```

#### Environment Variables

```bash
# Check environment variables
console.log(import.meta.env)

# Verify in production
# Check hosting platform dashboard
```

## 🚀 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vercel Integration

1. Connect GitHub repository
2. Enable automatic deployments
3. Configure environment variables
4. Set up branch protection rules

### Netlify Integration

1. Connect GitHub repository
2. Configure build settings
3. Set up environment variables
4. Enable automatic deployments

## 📱 Mobile Deployment

### PWA Configuration

Add to `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'PayeTonGréviste',
        short_name: 'PayeTonGréviste',
        description: 'Découvrez les fonds de grève',
        theme_color: '#F9E25B',
        background_color: '#121214',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

### App Store Deployment

1. **React Native Conversion**
   - Use Expo or React Native CLI
   - Convert web components to mobile
   - Test on real devices

2. **App Store Preparation**
   - Create app icons
   - Write app descriptions
   - Prepare screenshots
   - Submit for review

## 🔒 Security Considerations

### Content Security Policy

Add to `index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https:;
  font-src 'self' data:;
"
/>
```

### HTTPS Enforcement

Ensure all traffic uses HTTPS:

```javascript
// Add to main.tsx
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(
    'https:' + window.location.href.substring(window.location.protocol.length)
  );
}
```

### Environment Variables Security

- Never commit `.env` files
- Use hosting platform secrets
- Rotate API keys regularly
- Monitor for exposed secrets

---

This deployment guide should help you successfully deploy PayeTonGréviste to production. For specific platform issues, consult the hosting provider's documentation or open an issue.
