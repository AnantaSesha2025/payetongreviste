import fs from 'fs';

// Read the strike funds data
const strikeFundsData = JSON.parse(fs.readFileSync('./strike_funds_data.json', 'utf8'));

// Convert strike funds data to GistProfile format
function convertToGistProfiles(strikeFunds) {
  return strikeFunds.map((fund, index) => {
    // Generate a unique ID
    const id = `strike-fund-${index + 1}`;
    
    // Extract name and clean it up
    const name = fund.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    
    // Generate a random age between 25 and 65
    const age = Math.floor(Math.random() * 40) + 25;
    
    // Create bio based on the fund name and type
    const bio = fund.type === 'thematic' 
      ? `Membre actif de ${name}, engagé dans la lutte sociale et la solidarité.`
      : `Gréviste de ${name}, en lutte pour nos droits et notre avenir.`;
    
    // Use the thispersondoesnotexist.com URL for photos
    const photoUrl = 'https://thispersondoesnotexist.com/';
    
    // Location data
    const location = fund.lat && fund.lng 
      ? { lat: fund.lat, lon: fund.lng }
      : { lat: 48.8566, lon: 2.3522 }; // Default to Paris if no coordinates
    
    // Strike fund data
    const strikeFund = {
      id: `fund-${index + 1}`,
      url: fund.url,
      title: name,
      description: fund.type === 'thematic' 
        ? `Caisse de grève thématique : ${name}`
        : `Caisse de grève locale : ${name}`,
      category: fund.type === 'thematic' ? 'Thématique' : 'Locale',
      urgency: Math.random() > 0.5 ? 'Élevée' : 'Moyenne',
      currentAmount: Math.floor(Math.random() * 50000) + 1000, // Random amount between 1000-51000
      targetAmount: Math.floor(Math.random() * 100000) + 50000, // Random target between 50000-150000
    };
    
    return {
      id,
      name,
      age,
      bio,
      photoUrl,
      location,
      strikeFund
    };
  });
}

// Convert the data
const gistProfiles = convertToGistProfiles(strikeFundsData);

// Save the converted data
fs.writeFileSync('./gist_profiles.json', JSON.stringify(gistProfiles, null, 2));

console.log(`Converted ${gistProfiles.length} strike funds to GistProfile format`);
console.log('Data saved to gist_profiles.json');

// Display some statistics
const withCoordinates = gistProfiles.filter(profile => profile.location.lat !== 48.8566 || profile.location.lon !== 2.3522);
const thematic = gistProfiles.filter(profile => profile.strikeFund.category === 'Thématique');
const local = gistProfiles.filter(profile => profile.strikeFund.category === 'Locale');

console.log(`- ${withCoordinates.length} profiles with specific coordinates`);
console.log(`- ${thematic.length} thematic funds`);
console.log(`- ${local.length} local funds`);

// Display a sample profile
console.log('\nSample profile:');
console.log(JSON.stringify(gistProfiles[0], null, 2));
