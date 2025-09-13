/**
 * GitHub Gist API service for managing fake profiles
 */

import type { GistProfile, GistResponse, GistError } from '../types/gist';

// Re-export types for backward compatibility
export type { GistProfile, GistResponse, GistError };

class GitHubGistService {
  private baseUrl = 'https://api.github.com/gists';
  private gistId: string | null = null;

  /**
   * Set the Gist ID to use for reading/writing profiles
   */
  setGistId(gistId: string) {
    this.gistId = gistId;
  }

  /**
   * Create a new Gist with fake profiles
   */
  async createGist(
    profiles: GistProfile[],
    githubToken: string,
    description: string = "PayeTonGréviste - Profils d'activistes"
  ): Promise<{ success: boolean; gistUrl?: string; error?: string }> {
    try {
      const gistData = {
        description,
        public: true,
        files: {
          'profiles.json': {
            content: JSON.stringify(profiles, null, 2),
          },
        },
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `token ${githubToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify(gistData),
      });

      if (!response.ok) {
        const errorData: GistError = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la création du Gist',
        };
      }

      const result: GistResponse = await response.json();
      this.gistId = result.html_url.split('/').pop() || null;

      return {
        success: true,
        gistUrl: result.html_url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Update an existing Gist with new profiles
   */
  async updateGist(
    profiles: GistProfile[],
    githubToken: string
  ): Promise<{ success: boolean; gistUrl?: string; error?: string }> {
    if (!this.gistId) {
      return {
        success: false,
        error: 'Aucun Gist ID configuré',
      };
    }

    try {
      const gistData = {
        files: {
          'profiles.json': {
            content: JSON.stringify(profiles, null, 2),
          },
        },
      };

      const response = await fetch(`${this.baseUrl}/${this.gistId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${githubToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify(gistData),
      });

      if (!response.ok) {
        const errorData: GistError = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la mise à jour du Gist',
        };
      }

      const result: GistResponse = await response.json();

      return {
        success: true,
        gistUrl: result.html_url,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Read profiles from a Gist
   */
  async readProfiles(
    gistId: string
  ): Promise<{ success: boolean; profiles?: GistProfile[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${gistId}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        const errorData: GistError = await response.json();
        return {
          success: false,
          error: errorData.message || 'Erreur lors de la lecture du Gist',
        };
      }

      const result: GistResponse = await response.json();
      const profilesContent = result.files['profiles.json']?.content;

      if (!profilesContent) {
        return {
          success: false,
          error: 'Aucun fichier profiles.json trouvé dans le Gist',
        };
      }

      const profiles = JSON.parse(profilesContent) as GistProfile[];

      return {
        success: true,
        profiles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Get the current Gist ID
   */
  getGistId(): string | null {
    return this.gistId;
  }
}

// Export singleton instance
export const githubGistService = new GitHubGistService();
