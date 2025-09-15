# GitHub Pages Deployment Instructions

Your app is now configured for GitHub Pages deployment! Here's what has been set up:

## ✅ What's Already Configured

1. **Vite Configuration**: Updated to use the correct base path for GitHub Pages (`/payetogreviste/`)
2. **Package.json**: Added `gh-pages` dependency and `deploy` script
3. **GitHub Actions**: Workflow is set up to automatically deploy on push to main branch
4. **Build Process**: Tested and working locally

## 🚀 How to Deploy

### Option 1: Automatic Deployment (Recommended)

1. Push your changes to the `main` branch
2. The GitHub Actions workflow will automatically build and deploy your app
3. Your app will be available at: `https://yourusername.github.io/payetogreviste/`

### Option 2: Manual Deployment

If you want to deploy manually:

```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## ⚙️ Enable GitHub Pages

To enable GitHub Pages in your repository:

1. Go to your GitHub repository
2. Click on **Settings** (in the repository menu)
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy your app

## 🔗 Your App URL

Once deployed, your app will be available at:
`https://yourusername.github.io/payetogreviste/`

Replace `yourusername` with your actual GitHub username.

## 📝 Notes

- The app is configured to work with the `/payetogreviste/` subpath
- All assets and routing are properly configured for GitHub Pages
- The build process creates optimized bundles for production
- GitHub Actions will automatically redeploy when you push changes to main

## 🐛 Troubleshooting

If deployment fails:

1. Check the **Actions** tab in your GitHub repository
2. Look for any error messages in the workflow logs
3. Ensure your repository is public (required for free GitHub Pages)
4. Make sure the workflow file is in `.github/workflows/ci.yml`

## 🎉 Success!

Once everything is set up, your PayeTonGréviste app will be live on GitHub Pages!
