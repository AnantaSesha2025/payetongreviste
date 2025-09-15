# Strike Funds Data to Gist

This directory contains scripts to extract strike funds data from the French strike funds website and convert it to the GistProfile format for the PayeTonGréviste app.

## Files Created

- `strike_funds_data.json` - Raw extracted data from the HTML page
- `gist_profiles.json` - Converted data in GistProfile format
- `strike_data_extractor.py` - Python script to extract data from HTML
- `push_strike_data_to_gist.js` - Converts raw data to GistProfile format
- `push_to_gist.js` - Pushes data to GitHub Gist (requires token)
- `show_gist_structure.js` - Shows summary and structure

## Data Summary

- **Total profiles**: 139
- **Local funds**: 123 (with specific coordinates)
- **Thematic funds**: 16 (no specific location)
- **Photo source**: All profiles use `https://thispersondoesnotexist.com/`

## How to Use

### 1. Convert Data to GistProfile Format

```bash
node push_strike_data_to_gist.js
```

### 2. View Data Summary

```bash
node show_gist_structure.js
```

### 3. Push to GitHub Gist

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_token_here

# Push to gist
node push_to_gist.js
```

## GistProfile Format

Each profile contains:

- `id`: Unique identifier
- `name`: Strike fund name
- `age`: Random age (25-65)
- `bio`: Generated bio based on fund type
- `photoUrl`: `https://thispersondoesnotexist.com/`
- `location`: Coordinates (lat/lon) or default Paris
- `strikeFund`: Fund details including URL, category, urgency, amounts

## GitHub Token Setup

1. Go to https://github.com/settings/tokens
2. Create a new token with "gist" permissions
3. Set it as environment variable: `export GITHUB_TOKEN=your_token`
4. Or replace `your_github_token_here` in `push_to_gist.js`

## Gist ID

The default gist ID is set in `src/lib/constants.ts`:

```typescript
export const DEFAULT_GIST_ID = '2198c40a1181db1edc86727df7f86260';
```

The script will try to update this existing gist, or create a new one if it fails.
