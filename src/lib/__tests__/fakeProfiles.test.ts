/**
 * Tests for fake profiles generation
 */

import {
  generateFakeProfile,
  generateFakeProfiles,
  convertGistProfileToAppProfile,
} from '../fakeProfiles';
import type { GistProfile } from '../../types/gist';

describe('Fake Profiles Generation', () => {
  describe('generateFakeProfile', () => {
    it('should generate a profile with all required fields', () => {
      const profile = generateFakeProfile();

      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('age');
      expect(profile).toHaveProperty('bio');
      expect(profile).toHaveProperty('photoUrl');
      expect(profile).toHaveProperty('strikeFund');

      expect(typeof profile.id).toBe('string');
      expect(profile.id).toMatch(/^profile-/);
      expect(typeof profile.name).toBe('string');
      expect(profile.name).toContain(' ');
      expect(typeof profile.age).toBe('number');
      expect(profile.age).toBeGreaterThanOrEqual(18);
      expect(profile.age).toBeLessThanOrEqual(65);
      expect(typeof profile.bio).toBe('string');
      expect(profile.bio.length).toBeGreaterThan(0);
      expect(typeof profile.photoUrl).toBe('string');
      expect(profile.photoUrl).toMatch(/^https:\/\/images\.unsplash\.com/);
    });

    it('should generate a valid strike fund', () => {
      const profile = generateFakeProfile();
      const { strikeFund } = profile;

      expect(strikeFund).toHaveProperty('id');
      expect(strikeFund).toHaveProperty('url');
      expect(strikeFund).toHaveProperty('title');
      expect(strikeFund).toHaveProperty('description');
      expect(strikeFund).toHaveProperty('category');
      expect(strikeFund).toHaveProperty('urgency');
      expect(strikeFund).toHaveProperty('currentAmount');
      expect(strikeFund).toHaveProperty('targetAmount');

      expect(typeof strikeFund.id).toBe('string');
      expect(strikeFund.id).toMatch(/^fund-/);
      expect(typeof strikeFund.url).toBe('string');
      expect(strikeFund.url).toMatch(/^https:\/\/www\.helloasso\.com/);
      expect(typeof strikeFund.title).toBe('string');
      expect(strikeFund.title.length).toBeGreaterThan(0);
      expect(typeof strikeFund.description).toBe('string');
      expect(strikeFund.description.length).toBeGreaterThan(0);
      expect(typeof strikeFund.category).toBe('string');
      expect(strikeFund.category.length).toBeGreaterThan(0);
      expect(['Faible', 'Moyenne', 'Élevée', 'Critique']).toContain(
        strikeFund.urgency
      );
      expect(typeof strikeFund.currentAmount).toBe('number');
      expect(typeof strikeFund.targetAmount).toBe('number');
      expect(strikeFund.currentAmount).toBeGreaterThanOrEqual(0);
      expect(strikeFund.targetAmount).toBeGreaterThan(0);
      expect(strikeFund.currentAmount).toBeLessThanOrEqual(
        strikeFund.targetAmount
      );
    });

    it('should generate different profiles on multiple calls', () => {
      const profile1 = generateFakeProfile();
      const profile2 = generateFakeProfile();

      // Very unlikely to be identical due to random generation
      expect(profile1.id).not.toBe(profile2.id);
      expect(profile1.strikeFund.id).not.toBe(profile2.strikeFund.id);
    });
  });

  describe('generateFakeProfiles', () => {
    it('should generate the correct number of profiles', () => {
      const profiles = generateFakeProfiles(5);
      expect(profiles).toHaveLength(5);
    });

    it('should generate 0 profiles when count is 0', () => {
      const profiles = generateFakeProfiles(0);
      expect(profiles).toHaveLength(0);
    });

    it('should generate valid profiles', () => {
      const profiles = generateFakeProfiles(3);

      profiles.forEach(profile => {
        expect(profile).toHaveProperty('id');
        expect(profile).toHaveProperty('name');
        expect(profile).toHaveProperty('age');
        expect(profile).toHaveProperty('bio');
        expect(profile).toHaveProperty('photoUrl');
        expect(profile).toHaveProperty('strikeFund');
      });
    });

    it('should generate unique profile IDs', () => {
      const profiles = generateFakeProfiles(10);
      const ids = profiles.map(p => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('convertGistProfileToAppProfile', () => {
    const mockGistProfile: GistProfile = {
      id: 'profile-123',
      name: 'Test User',
      age: 30,
      bio: 'Test bio',
      photoUrl: 'https://example.com/photo.jpg',
      strikeFund: {
        id: 'fund-456',
        url: 'https://example.com/fund',
        title: 'Test Fund',
        description: 'Test description',
        category: 'Test',
        urgency: 'Moyenne',
        currentAmount: 1000,
        targetAmount: 5000,
      },
    };

    it('should convert GistProfile to app Profile format', () => {
      const appProfile = convertGistProfileToAppProfile(mockGistProfile);

      expect(appProfile.id).toBe(mockGistProfile.id);
      expect(appProfile.name).toBe(mockGistProfile.name);
      expect(appProfile.age).toBe(mockGistProfile.age);
      expect(appProfile.bio).toBe(mockGistProfile.bio);
      expect(appProfile.photoUrl).toBe(mockGistProfile.photoUrl);
      expect(appProfile.strikeFund).toEqual(mockGistProfile.strikeFund);

      // Should add location property
      expect(appProfile).toHaveProperty('location');
      expect(appProfile.location).toEqual({ lat: 48.8566, lon: 2.3522 });
    });

    it('should preserve all strike fund properties', () => {
      const appProfile = convertGistProfileToAppProfile(mockGistProfile);

      expect(appProfile.strikeFund.id).toBe(mockGistProfile.strikeFund.id);
      expect(appProfile.strikeFund.url).toBe(mockGistProfile.strikeFund.url);
      expect(appProfile.strikeFund.title).toBe(
        mockGistProfile.strikeFund.title
      );
      expect(appProfile.strikeFund.description).toBe(
        mockGistProfile.strikeFund.description
      );
      expect(appProfile.strikeFund.category).toBe(
        mockGistProfile.strikeFund.category
      );
      expect(appProfile.strikeFund.urgency).toBe(
        mockGistProfile.strikeFund.urgency
      );
      expect(appProfile.strikeFund.currentAmount).toBe(
        mockGistProfile.strikeFund.currentAmount
      );
      expect(appProfile.strikeFund.targetAmount).toBe(
        mockGistProfile.strikeFund.targetAmount
      );
    });
  });

  describe('Profile validation', () => {
    it('should generate profiles with valid French names', () => {
      const profiles = generateFakeProfiles(20);

      profiles.forEach(profile => {
        const nameParts = profile.name.split(' ');
        expect(nameParts).toHaveLength(2);

        // Check if names are from the predefined lists
        const validFirstNames = [
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
        const validLastNames = [
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

        expect(validFirstNames).toContain(nameParts[0]);
        expect(validLastNames).toContain(nameParts[1]);
      });
    });

    it('should generate profiles with valid strike fund categories', () => {
      const profiles = generateFakeProfiles(20);
      const validCategories = [
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

      profiles.forEach(profile => {
        expect(validCategories).toContain(profile.strikeFund.category);
      });
    });

    it('should generate profiles with valid urgency levels', () => {
      const profiles = generateFakeProfiles(20);
      const validUrgencies = ['Faible', 'Moyenne', 'Élevée', 'Critique'];

      profiles.forEach(profile => {
        expect(validUrgencies).toContain(profile.strikeFund.urgency);
      });
    });
  });
});
