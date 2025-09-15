import fs from 'fs';

// Read the converted profiles
const gistProfiles = JSON.parse(fs.readFileSync('./gist_profiles.json', 'utf8'));

console.log('📊 Gist Data Preview');
console.log('==================');
console.log(`Total profiles: ${gistProfiles.length}`);
console.log('');

// Show the gist structure that would be sent
const gistData = {
  description: "PayeTonGréviste - Caisses de grève et profils d'activistes",
  public: true,
  files: {
    'profiles.json': {
      content: JSON.stringify(gistProfiles, null, 2)
    }
  }
};

console.log('📁 Gist Structure:');
console.log(JSON.stringify({
  description: gistData.description,
  public: gistData.public,
  files: {
    'profiles.json': {
      content: `[${gistProfiles.length} profiles...]`
    }
  }
}, null, 2));

console.log('');
console.log('👥 Sample Profiles:');
gistProfiles.slice(0, 5).forEach((profile, index) => {
  console.log(`\n${index + 1}. ${profile.name}`);
  console.log(`   Age: ${profile.age}`);
  console.log(`   Location: ${profile.location.lat}, ${profile.location.lon}`);
  console.log(`   Strike Fund: ${profile.strikeFund.title}`);
  console.log(`   URL: ${profile.strikeFund.url}`);
  console.log(`   Category: ${profile.strikeFund.category}`);
  console.log(`   Urgency: ${profile.strikeFund.urgency}`);
  console.log(`   Target: €${profile.strikeFund.targetAmount.toLocaleString()}`);
  console.log(`   Current: €${profile.strikeFund.currentAmount.toLocaleString()}`);
});

console.log('\n🔗 All profiles use: https://thispersondoesnotexist.com/');
console.log('📝 Ready to push to GitHub Gist!');
console.log('');
console.log('To push to gist, run: node push_to_gist_simple.js');
