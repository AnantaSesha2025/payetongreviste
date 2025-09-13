import { useState, useEffect, useCallback } from 'react';
import { githubGistService } from '../lib/githubGist';
import { convertGistProfileToAppProfile } from '../lib/fakeProfiles';
import type { Profile } from '../store';

interface UseGistProfilesOptions {
  gistId?: string;
  autoLoad?: boolean;
  onError?: (error: string) => void;
}

interface UseGistProfilesReturn {
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  loadProfiles: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  setGistId: (gistId: string) => void;
}

export function useGistProfiles({
  gistId,
  autoLoad = true,
  onError,
}: UseGistProfilesOptions = {}): UseGistProfilesReturn {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGistId, setCurrentGistId] = useState<string | undefined>(
    gistId
  );

  const loadProfiles = useCallback(async () => {
    if (!currentGistId) {
      setError('Aucun Gist ID fourni');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await githubGistService.readProfiles(currentGistId);

      if (result.success && result.profiles) {
        // Convert Gist profiles to app format
        const appProfiles = result.profiles.map(convertGistProfileToAppProfile);
        setProfiles(appProfiles);
        setError(null);
      } else {
        const errorMessage =
          result.error || 'Erreur lors du chargement des profils';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentGistId, onError]);

  const refreshProfiles = useCallback(async () => {
    await loadProfiles();
  }, [loadProfiles]);

  const handleSetGistId = useCallback((gistId: string) => {
    setCurrentGistId(gistId);
    githubGistService.setGistId(gistId);
  }, []);

  // Auto-load on mount or when gistId changes
  useEffect(() => {
    if (autoLoad && currentGistId) {
      loadProfiles();
    }
  }, [autoLoad, currentGistId, loadProfiles]);

  // Update gistId when prop changes
  useEffect(() => {
    if (gistId && gistId !== currentGistId) {
      handleSetGistId(gistId);
    }
  }, [gistId, currentGistId, handleSetGistId]);

  return {
    profiles,
    isLoading,
    error,
    loadProfiles,
    refreshProfiles,
    setGistId: handleSetGistId,
  };
}
