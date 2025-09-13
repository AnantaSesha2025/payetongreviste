/**
 * Tests for GitHub Gist service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { githubGistService } from '../githubGist';
import type { GistProfile } from '../../types/gist';

// Mock fetch globally
(globalThis as { fetch: ReturnType<typeof vi.fn> }).fetch = vi.fn();

const mockFetch = fetch as ReturnType<typeof vi.fn>;

describe('GitHubGistService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    githubGistService.setGistId('');
  });

  describe('setGistId', () => {
    it('should set the gist ID', () => {
      const gistId = 'test-gist-id';
      githubGistService.setGistId(gistId);
      expect(githubGistService.getGistId()).toBe(gistId);
    });
  });

  describe('createGist', () => {
    const mockProfiles: GistProfile[] = [
      {
        id: 'profile-1',
        name: 'Test User',
        age: 25,
        bio: 'Test bio',
        photoUrl: 'https://example.com/photo.jpg',
        strikeFund: {
          id: 'fund-1',
          url: 'https://example.com/fund',
          title: 'Test Fund',
          description: 'Test description',
          category: 'Test',
          urgency: 'Moyenne',
          currentAmount: 1000,
          targetAmount: 5000,
        },
      },
    ];

    it('should create a gist successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          html_url: 'https://gist.github.com/test-gist-id',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.createGist(
        mockProfiles,
        'test-token'
      );

      expect(result.success).toBe(true);
      expect(result.gistUrl).toBe('https://gist.github.com/test-gist-id');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/gists',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'token test-token',
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Test User'),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: 'Bad credentials',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.createGist(
        mockProfiles,
        'invalid-token'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Bad credentials');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await githubGistService.createGist(
        mockProfiles,
        'test-token'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('updateGist', () => {
    const mockProfiles: GistProfile[] = [
      {
        id: 'profile-1',
        name: 'Updated User',
        age: 30,
        bio: 'Updated bio',
        photoUrl: 'https://example.com/photo.jpg',
        strikeFund: {
          id: 'fund-1',
          url: 'https://example.com/fund',
          title: 'Updated Fund',
          description: 'Updated description',
          category: 'Test',
          urgency: 'Élevée',
          currentAmount: 2000,
          targetAmount: 10000,
        },
      },
    ];

    beforeEach(() => {
      githubGistService.setGistId('test-gist-id');
    });

    it('should update a gist successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          html_url: 'https://gist.github.com/test-gist-id',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.updateGist(
        mockProfiles,
        'test-token'
      );

      expect(result.success).toBe(true);
      expect(result.gistUrl).toBe('https://gist.github.com/test-gist-id');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/gists/test-gist-id',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            Authorization: 'token test-token',
          }),
        })
      );
    });

    it('should fail when no gist ID is set', async () => {
      githubGistService.setGistId('');

      const result = await githubGistService.updateGist(
        mockProfiles,
        'test-token'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Aucun Gist ID configuré');
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: 'Gist not found',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.updateGist(
        mockProfiles,
        'test-token'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Gist not found');
    });
  });

  describe('readProfiles', () => {
    it('should read profiles successfully', async () => {
      const mockProfiles: GistProfile[] = [
        {
          id: 'profile-1',
          name: 'Test User',
          age: 25,
          bio: 'Test bio',
          photoUrl: 'https://example.com/photo.jpg',
          strikeFund: {
            id: 'fund-1',
            url: 'https://example.com/fund',
            title: 'Test Fund',
            description: 'Test description',
            category: 'Test',
            urgency: 'Moyenne',
            currentAmount: 1000,
            targetAmount: 5000,
          },
        },
      ];

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          files: {
            'profiles.json': {
              content: JSON.stringify(mockProfiles),
            },
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.readProfiles('test-gist-id');

      expect(result.success).toBe(true);
      expect(result.profiles).toEqual(mockProfiles);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/gists/test-gist-id',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
          }),
        })
      );
    });

    it('should handle missing profiles.json file', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          files: {},
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.readProfiles('test-gist-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Aucun fichier profiles.json trouvé dans le Gist'
      );
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: 'Not Found',
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.readProfiles('invalid-gist-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not Found');
    });

    it('should handle invalid JSON', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          files: {
            'profiles.json': {
              content: 'invalid json',
            },
          },
        }),
      };
      mockFetch.mockResolvedValue(mockResponse as Response);

      const result = await githubGistService.readProfiles('test-gist-id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
