const fs = require('fs');

// Read the HTML file (you'll need to save the HTML content to a file first)
const htmlContent = fs.readFileSync('strike_page.html', 'utf8');

// Function to extract coordinates from transform3d style
function extractCoordinates(transform3d) {
  const match = transform3d.match(/translate3d\((\d+(?:\.\d+)?)px,\s*(\d+(?:\.\d+)?)px/);
  if (match) {
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2])
    };
  }
  return null;
}

// Function to convert pixel coordinates to lat/lng
// Based on the map center [46.2276,2.2137] and zoom level 6
function pixelToLatLng(x, y, mapWidth = 1536, mapHeight = 700) {
  // Map bounds for France at zoom level 6
  const minLat = 41.0;
  const maxLat = 51.5;
  const minLng = -5.5;
  const maxLng = 9.5;
  
  const lat = maxLat - (y / mapHeight) * (maxLat - minLat);
  const lng = minLng + (x / mapWidth) * (maxLng - minLng);
  
  return { lat, lng };
}

// Extract data from the HTML
function extractStrikeFundsData() {
  const strikeFunds = [];
  
  // Extract map markers from the HTML
  const markerRegex = /<img[^>]*class="leaflet-marker-icon[^"]*"[^>]*style="[^"]*transform: translate3d\(([^)]+)\)[^"]*"[^>]*alt="([^"]*)"[^>]*>/g;
  
  let match;
  while ((match = markerRegex.exec(htmlContent)) !== null) {
    const transform3d = match[1];
    const altText = match[2];
    
    const coords = extractCoordinates(transform3d);
    if (coords) {
      const latLng = pixelToLatLng(coords.x, coords.y);
      
      // Extract link and name from alt text
      const linkMatch = altText.match(/<a href='([^']+)'[^>]*>([^<]+)<\/a>/);
      if (linkMatch) {
        strikeFunds.push({
          name: linkMatch[2].trim(),
          url: linkMatch[1],
          coordinates: {
            lat: latLng.lat,
            lng: latLng.lng,
            pixel: coords
          }
        });
      }
    }
  }
  
  // Also extract thematic funds from the list
  const listRegex = /<li><a href="([^"]+)"[^>]*>([^<]+)<\/a>\s*(?:\([^)]+\))?\s*<\/li>/g;
  while ((match = listRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    const name = match[2].trim();
    
    // Skip if already in map markers
    if (!strikeFunds.some(fund => fund.url === url)) {
      strikeFunds.push({
        name: name,
        url: url,
        coordinates: null,
        type: 'thematic'
      });
    }
  }
  
  return strikeFunds;
}

// Main execution
try {
  const strikeFundsData = extractStrikeFundsData();
  
  console.log(`Found ${strikeFundsData.length} strike funds`);
  
  // Save to JSON file
  fs.writeFileSync('strike_funds_data.json', JSON.stringify(strikeFundsData, null, 2));
  
  console.log('Data saved to strike_funds_data.json');
  
  // Display summary
  const withCoordinates = strikeFundsData.filter(fund => fund.coordinates);
  const thematic = strikeFundsData.filter(fund => fund.type === 'thematic');
  
  console.log(`- ${withCoordinates.length} funds with coordinates`);
  console.log(`- ${thematic.length} thematic funds`);
  
} catch (error) {
  console.error('Error extracting data:', error);
}
