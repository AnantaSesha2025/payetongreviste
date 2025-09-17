# Gist Image Updater

This script updates your GitHub Gist with local profile images instead of the randomuser.me URLs.

## Prerequisites

1. **GitHub Personal Access Token**: You need a GitHub personal access token with `gist` permissions.
2. **Local Images**: Make sure you have run the image download script first to have local images in `public/assets/profiles/`.

## Setup

### 1. Set up GitHub Token

**Option A: Environment Variable (Recommended)**

```bash
# Windows
set GITHUB_TOKEN=your_token_here

# Or permanently
setx GITHUB_TOKEN "your_token_here"

# Linux/Mac
export GITHUB_TOKEN=your_token_here
```

**Option B: Create .env file**
Create a `.env` file in the `data-retrieval` folder:

```
GITHUB_TOKEN=your_token_here
```

### 2. Get GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `gist` (Full control of gists)
4. Copy the token and use it in the setup above

## Usage

### Method 1: Using the batch file (Windows)

```bash
cd data-retrieval
update_gist_images.bat
```

### Method 2: Direct Node.js execution

```bash
cd data-retrieval
node update_gist_with_local_images.js
```

## What the script does

1. **Fetches current Gist data** from GitHub API
2. **Loads local image manifest** from `public/assets/profiles/manifest.json`
3. **Replaces photo URLs** in profiles:
   - From: `https://randomuser.me/api/portraits/women/1.jpg`
   - To: `/assets/profiles/profile-001.jpg`
4. **Cycles through 139 local images** for the 139 profiles
5. **Updates the Gist** with new data
6. **Creates a backup** file with the updated data

## Output Files

- `updated_gist_data.json`: Backup of the updated profile data
- Console output with statistics and progress

## Gist Information

- **Gist ID**: `2198c40a1181db1edc86727df7f86260`
- **File**: `profiles.json`
- **URL**: https://gist.github.com/AnantaSesha2025/2198c40a1181db1edc86727df7f86260

## Troubleshooting

### Error: "GITHUB_TOKEN environment variable is required"

- Make sure you've set the `GITHUB_TOKEN` environment variable
- Verify the token has `gist` permissions

### Error: "Manifest file not found"

- Run `download_profile_images.js` first to download and create local images

### Error: "Failed to fetch Gist"

- Check your internet connection
- Verify the Gist ID is correct
- Ensure your token has the right permissions

### Error: "Failed to update Gist"

- Check if you have write permissions to the Gist
- Verify the Gist belongs to your account or you have collaborator access

## Image Mapping

The script maps profiles to local images using a cycling pattern:

- Profile 1 → profile-001.jpg
- Profile 2 → profile-002.jpg
- ...
- Profile 139 → profile-139.jpg
- Profile 140 → profile-001.jpg (cycles back)

This ensures all profiles get unique local images while cycling through the available 139 images.
