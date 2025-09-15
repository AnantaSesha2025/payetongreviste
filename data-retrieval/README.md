# Data Retrieval Tools

This folder contains all the tools and scripts for extracting strike funds data from the French strike funds website and converting it to the GistProfile format for the PayeTonGréviste app.

## 📁 Files

### Data Files

- `strike_funds_data.json` - Raw extracted data from the HTML page
- `gist_profiles.json` - Converted data in GistProfile format

### Scripts

- `strike_data_extractor.py` - Python script to extract data from HTML
- `push_strike_data_to_gist.js` - Converts raw data to GistProfile format
- `push_to_gist.js` - Pushes data to GitHub Gist (TypeScript version)
- `push_to_gist_simple.js` - Pushes data to GitHub Gist (standalone version)
- `preview_gist_data.js` - Shows summary and structure without API calls
- `show_gist_structure.js` - Shows data summary and sample profiles
- `extract_strike_data.js` - Alternative extraction script

## 📊 Data Summary

- **Total profiles**: 139
- **Local funds**: 123 (with specific coordinates)
- **Thematic funds**: 16 (no specific location)
- **Photo source**: All profiles use `https://thispersondoesnotexist.com/`

## 🚀 How to Use

### 1. Convert Data to GistProfile Format

```bash
cd data-retrieval
node push_strike_data_to_gist.js
```

### 2. View Data Summary

```bash
node show_gist_structure.js
```

### 3. Preview Gist Data (Safe)

```bash
node preview_gist_data.js
```

### 4. Push to GitHub Gist

```bash
# Set your GitHub token
export GITHUB_TOKEN=your_token_here

# Push to gist
node push_to_gist_simple.js
```

## 🔧 Setup

1. **Install dependencies** (if needed):

   ```bash
   npm install
   ```

2. **Get GitHub token**:
   - Go to https://github.com/settings/tokens
   - Create a new token with "gist" permissions
   - Set it as environment variable: `export GITHUB_TOKEN=your_token`

## 📝 GistProfile Format

Each profile contains:

- `id`: Unique identifier
- `name`: Strike fund name
- `age`: Random age (25-65)
- `bio`: Generated bio based on fund type
- `photoUrl`: `https://thispersondoesnotexist.com/`
- `location`: Coordinates (lat/lon) or default Paris
- `strikeFund`: Fund details including URL, category, urgency, amounts

## 🎯 Gist Integration

The data is designed to work with the existing PayeTonGréviste app:

- Uses the gist ID from `src/lib/constants.ts`
- Compatible with the existing `GistProfile` type
- Integrates with the app's gist reading functionality

## 📈 Workflow

1. **Extract** → `strike_data_extractor.py` → `strike_funds_data.json`
2. **Convert** → `push_strike_data_to_gist.js` → `gist_profiles.json`
3. **Preview** → `preview_gist_data.js` (optional)
4. **Push** → `push_to_gist_simple.js` → GitHub Gist
5. **Use** → App reads from gist automatically
