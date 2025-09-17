/**
 * Utility functions for generating fake profiles for testing
 */

import type { GistProfile } from '../types/gist';

const FRENCH_NAMES = [
  'Marie',
  'Jean',
  'Sophie',
  'Pierre',
  'Camille',
  'Lucas',
  'Emma',
  'Antoine',
  'Léa',
  'Thomas',
  'Chloé',
  'Nicolas',
  'Manon',
  'Alexandre',
  'Julie',
  'Maxime',
  'Sarah',
  'Julien',
  'Laura',
  'Romain',
  'Clara',
  'Baptiste',
  'Océane',
  'Quentin',
  'Léonie',
  'Hugo',
  'Inès',
  'Louis',
  'Zoé',
  'Gabriel',
  'Anaïs',
  'Paul',
];

const FRENCH_SURNAMES = [
  'Martin',
  'Bernard',
  'Thomas',
  'Petit',
  'Robert',
  'Richard',
  'Durand',
  'Dubois',
  'Moreau',
  'Laurent',
  'Simon',
  'Michel',
  'Lefebvre',
  'Leroy',
  'Roux',
  'David',
  'Bertrand',
  'Morel',
  'Fournier',
  'Girard',
  'André',
  'Lefèvre',
  'Mercier',
  'Dupont',
  'Lambert',
  'Bonnet',
  'François',
  'Martinez',
  'Legrand',
  'Garnier',
  'Faure',
  'Rousseau',
];

const STRIKE_CATEGORIES = [
  'Transport',
  'Éducation',
  'Santé',
  'Environnement',
  'Social',
  'Culture',
  'Alimentation',
  'Commerce',
  'Technologie',
  'Autre',
];

const URGENCY_LEVELS = ['Faible', 'Moyenne', 'Élevée', 'Critique'];

const STRIKE_FUND_TITLES = [
  'Fonds de Grève des Transports Parisiens',
  'Soutien aux Enseignants en Lutte',
  'Aide aux Soignants en Grève',
  'Fonds de Solidarité Écologique',
  'Soutien aux Travailleurs Sociaux',
  'Fonds Culturel de Grève',
  'Aide aux Restaurateurs en Lutte',
  'Soutien aux Employés de Commerce',
  'Fonds Technologique de Grève',
  'Solidarité Générale',
];

const STRIKE_DESCRIPTIONS = [
  'Soutenez notre mouvement pour des conditions de travail justes et équitables.',
  'Ensemble, nous luttons pour préserver nos droits et améliorer nos conditions.',
  'Votre soutien nous aide à maintenir la pression pour obtenir des réponses.',
  'Chaque don compte dans notre combat pour la justice sociale.',
  'Rejoignez-nous dans cette lutte pour un avenir meilleur.',
  'Notre grève est légitime et nécessaire pour faire entendre notre voix.',
  'Soutenez notre cause et participez au changement.',
  'Ensemble, nous pouvons faire la différence.',
  'Votre solidarité nous donne la force de continuer.',
  'Luttons ensemble pour nos droits et notre dignité.',
];

const BIO_TEMPLATES = [
  "Passionné(e) par la justice sociale et l'égalité des droits.",
  'Militant(e) engagé(e) pour un monde plus juste et équitable.',
  'Défenseur(se) des droits des travailleurs et de la solidarité.',
  'Activiste convaincu(e) que le changement est possible.',
  'Lutteur(se) infatigable pour la dignité et les droits fondamentaux.',
  "Engagé(e) dans la construction d'une société plus humaine.",
  'Déterminé(e) à faire entendre la voix des sans-voix.',
  "Convaincu(e) que l'union fait la force dans nos combats.",
  "Passionné(e) par l'action collective et la solidarité.",
  'Militant(e) pour un avenir meilleur pour tous et toutes.',
];

/**
 * Generate a random French name
 */
function getRandomName(): string {
  const firstName =
    FRENCH_NAMES[Math.floor(Math.random() * FRENCH_NAMES.length)];
  const lastName =
    FRENCH_SURNAMES[Math.floor(Math.random() * FRENCH_SURNAMES.length)];
  return `${firstName} ${lastName}`;
}

/**
 * Generate a random age between 18 and 65
 */
function getRandomAge(): number {
  return Math.floor(Math.random() * (65 - 18 + 1)) + 18;
}

/**
 * Generate a random bio
 */
function getRandomBio(): string {
  const template =
    BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)];
  return template;
}

/**
 * Generate a random photo URL (using Unsplash)
 */
function getRandomPhotoUrl(): string {
  // Use different base images for variety
  const baseImages = [
    '1507003211169-0a1dd7228f2d', // Person 1
    '1494790108755-2616b612b786', // Person 2
    '1500648767791-00dcc994a43e', // Person 3
    '1472099645785-5658abf4ff4e', // Person 4
    '1507003211169-0a1dd7228f2d', // Person 5
    '1494790108755-2616b612b786', // Person 6
    '1500648767791-00dcc994a43e', // Person 7
    '1472099645785-5658abf4ff4e', // Person 8
    '1507003211169-0a1dd7228f2d', // Person 9
    '1494790108755-2616b612b786', // Person 10
  ];

  const randomImage = baseImages[Math.floor(Math.random() * baseImages.length)];
  const randomId = Math.floor(Math.random() * 1000) + 1;
  return `https://images.unsplash.com/photo-${randomImage}?w=400&h=400&fit=crop&crop=face&auto=format&q=80&ixid=${randomId}`;
}

/**
 * Generate a random location in France (roughly within French borders)
 */
function getRandomLocation() {
  // French territory bounds (approximate)
  const minLat = 41.0; // Southern France
  const maxLat = 51.5; // Northern France
  const minLon = -5.5; // Western France
  const maxLon = 9.5; // Eastern France

  return {
    lat: Math.random() * (maxLat - minLat) + minLat,
    lon: Math.random() * (maxLon - minLon) + minLon,
  };
}

/**
 * Generate a random strike fund
 */
function getRandomStrikeFund() {
  const category =
    STRIKE_CATEGORIES[Math.floor(Math.random() * STRIKE_CATEGORIES.length)];
  const urgency =
    URGENCY_LEVELS[Math.floor(Math.random() * URGENCY_LEVELS.length)];
  const title =
    STRIKE_FUND_TITLES[Math.floor(Math.random() * STRIKE_FUND_TITLES.length)];
  const description =
    STRIKE_DESCRIPTIONS[Math.floor(Math.random() * STRIKE_DESCRIPTIONS.length)];

  const targetAmount = Math.floor(Math.random() * 50000) + 10000; // 10k to 60k
  const currentAmount = Math.floor(Math.random() * targetAmount * 0.8); // 0 to 80% of target

  return {
    id: `fund-${Math.random().toString(36).substr(2, 9)}`,
    url: `https://www.helloasso.com/associations/solidarite-greve/campagnes/fonds-${category.toLowerCase()}`,
    title,
    description,
    category,
    urgency,
    currentAmount,
    targetAmount,
  };
}

/**
 * Generate a single fake profile
 */
export function generateFakeProfile(): GistProfile {
  return {
    id: `profile-${Math.random().toString(36).substr(2, 9)}`,
    name: getRandomName(),
    age: getRandomAge(),
    bio: getRandomBio(),
    photoUrl: getRandomPhotoUrl(),
    location: getRandomLocation(),
    strikeFund: getRandomStrikeFund(),
  };
}

/**
 * Generate multiple fake profiles
 */
export function generateFakeProfiles(count: number): GistProfile[] {
  const profiles: GistProfile[] = [];

  for (let i = 0; i < count; i++) {
    profiles.push(generateFakeProfile());
  }

  return profiles;
}

/**
 * Convert GistProfile to the app's Profile format
 */
export function convertGistProfileToAppProfile(gistProfile: GistProfile) {
  // Handle photoUrl to ensure it works with the app's base URL
  let photoUrl = gistProfile.photoUrl;

  // If it's a relative URL starting with /assets/, prepend the base URL
  if (photoUrl && photoUrl.startsWith('/assets/')) {
    // Get the base URL from import.meta.env.BASE_URL (handled by Vite)
    const baseUrl = import.meta.env.BASE_URL || '/';
    photoUrl = baseUrl + photoUrl.substring(1); // Remove leading slash and add base URL
  }

  return {
    id: gistProfile.id,
    name: gistProfile.name,
    age: gistProfile.age,
    bio: gistProfile.bio,
    photoUrl: photoUrl,
    location: gistProfile.location || { lat: 48.8566, lon: 2.3522 }, // Use actual location from Gist or default to Paris
    strikeFund: gistProfile.strikeFund,
  };
}
