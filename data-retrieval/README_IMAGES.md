# Profile Images Setup

This directory contains scripts to download and set up local profile images for the PayeTonGréviste app.

## Overview

The scripts will:

1. Download 139 unique images from thispersondoesnotexist.com
2. Save them to `public/assets/profiles/`
3. Update profile data to use local image URLs
4. Update the GitHub Gist with the new profile data

## Quick Start

### Option 1: Run All Scripts (Recommended)

```bash
# Windows
cd data-retrieval
setup_images.bat

# Or manually
node setup_local_images.js
```

### Option 2: Run Scripts Individually

1. **Download Images**

   ```bash
   node download_profile_images.js
   ```

2. **Update Profiles**

   ```bash
   node update_profiles_with_local_images.js
   ```

3. **Update Gist**
   ```bash
   node update_gist_with_local_images.js
   ```

## Scripts Description

### `download_profile_images.js`

- Downloads 139 images from thispersondoesnotexist.com
- Saves them as `profile-001.jpg` to `profile-139.jpg`
- Includes retry logic and rate limiting
- Generates a manifest.json file
- Skips already downloaded images

### `update_profiles_with_local_images.js`

- Reads existing profile data from `strike_funds_data.json`
- Updates photoUrl to use local image paths
- Cycles through the 139 images for all profiles
- Generates statistics about image usage

### `update_gist_with_local_images.js`

- Updates the GitHub Gist with new profile data
- Uses the existing GitHub Gist service from the app
- Converts profiles to the correct Gist format

### `setup_local_images.js`

- Master script that runs all steps in sequence
- Includes error handling and progress reporting
- Checks prerequisites before starting

## Output Files

After running the scripts, you'll have:

```
public/assets/profiles/
├── profile-001.jpg
├── profile-002.jpg
├── ...
├── profile-139.jpg
└── manifest.json

data-retrieval/
├── profiles_with_local_images.json
└── update_summary.json
```

## Configuration

You can modify these settings in the scripts:

- **TOTAL_IMAGES**: Number of images to download (default: 139)
- **DELAY_BETWEEN_DOWNLOADS**: Delay in ms between downloads (default: 1000)
- **MAX_RETRIES**: Number of retry attempts for failed downloads (default: 3)

## Troubleshooting

### Images not downloading

- Check your internet connection
- The service might be rate limiting - increase DELAY_BETWEEN_DOWNLOADS
- Some images might fail - the script will retry automatically

### Gist update fails

- Ensure you have valid GitHub credentials
- Check that the Gist ID is correct in constants.js
- Verify the Gist exists and you have write access

### Missing files

- Ensure `strike_funds_data.json` exists in the data-retrieval directory
- Check that all required app files are present

## Performance Notes

- Downloading 139 images takes approximately 2-3 minutes
- Each image is ~50-100KB
- Total storage needed: ~10-15MB
- Images are served from the app's public directory

## Image Quality

The images from thispersondoesnotexist.com are:

- 1024x1024 pixels
- High quality AI-generated faces
- Unique for each request
- Perfect for profile pictures

## Integration

Once the setup is complete:

1. The app will automatically use local images
2. No external dependencies for images
3. Faster loading times
4. Better reliability
5. Images are cached by the browser
