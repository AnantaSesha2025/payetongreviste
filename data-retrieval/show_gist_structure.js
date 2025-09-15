import fs from 'fs';

// Read the converted profiles
const gistProfiles = JSON.parse(fs.readFileSync('./gist_profiles.json', 'utf8'));

console.log('📊 Strike Funds Data Summary:');
console.log(`Total profiles: ${gistProfiles.length}`);
console.log('');

// Group by category
const categories = gistProfiles.reduce((acc, profile) => {
  const category = profile.strikeFund.category;
  acc[category] = (acc[category] || 0) + 1;
  return acc;
}, {});

console.log('📈 By Category:');
Object.entries(categories).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} funds`);
});

console.log('');

// Show some sample profiles
console.log('👥 Sample Profiles:');
gistProfiles.slice(0, 3).forEach((profile, index) => {
  console.log(`\n${index + 1}. ${profile.name}`);
  console.log(`   Age: ${profile.age}`);
  console.log(`   Location: ${profile.location.lat}, ${profile.location.lon}`);
  console.log(`   Strike Fund: ${profile.strikeFund.title}`);
  console.log(`   URL: ${profile.strikeFund.url}`);
  console.log(`   Category: ${profile.strikeFund.category}`);
  console.log(`   Urgency: ${profile.strikeFund.urgency}`);
  console.log(`   Target: €${profile.strikeFund.targetAmount.toLocaleString()}`);
});

console.log('\n🔗 All profiles use thispersondoesnotexist.com for photos');
console.log('📝 Ready to push to GitHub Gist!');

// Show the gist structure that would be created
const gistStructure = {
  description: "PayeTonGréviste - Caisses de grève et profils d'activistes",
  public: true,
  files: {
    'profiles.json': {
      content: JSON.stringify(gistProfiles, null, 2)
    }
  }
};

console.log('\n📁 Gist Structure:');
console.log(JSON.stringify(gistStructure, null, 2));
