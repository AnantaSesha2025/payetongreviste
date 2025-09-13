import { useState, useEffect, useCallback } from 'react';
import {
  GitHub,
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
} from 'react-feather';
import { githubGistService } from '../lib/githubGist';
import { convertGistProfileToAppProfile } from '../lib/fakeProfiles';
import type { Profile } from '../store';
import './GistProfileReader.css';

interface GistProfileReaderProps {
  gistId: string;
  onProfilesLoaded?: (profiles: Profile[]) => void;
  onError?: (error: string) => void;
  autoLoad?: boolean;
}

export function GistProfileReader({
  gistId,
  onProfilesLoaded,
  onError,
  autoLoad = true,
}: GistProfileReaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    message: string;
    profilesCount?: number;
  }>({ type: 'idle', message: '' });

  const loadProfiles = useCallback(async () => {
    if (!gistId.trim()) {
      setLoadStatus({
        type: 'error',
        message: 'Aucun Gist ID fourni',
      });
      return;
    }

    setIsLoading(true);
    setLoadStatus({ type: 'idle', message: '' });

    try {
      const result = await githubGistService.readProfiles(gistId);

      if (result.success && result.profiles) {
        // Convert Gist profiles to app format
        const appProfiles = result.profiles.map(convertGistProfileToAppProfile);

        setLoadStatus({
          type: 'success',
          message: `${result.profiles.length} profils chargés avec succès!`,
          profilesCount: result.profiles.length,
        });

        onProfilesLoaded?.(appProfiles);
      } else {
        setLoadStatus({
          type: 'error',
          message: result.error || 'Erreur lors du chargement',
        });
        onError?.(result.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      setLoadStatus({
        type: 'error',
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gistId, onProfilesLoaded, onError]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && gistId) {
      loadProfiles();
    }
  }, [gistId, autoLoad, loadProfiles]);

  return (
    <div className="gist-profile-reader">
      <div className="gist-reader-header">
        <GitHub className="gist-icon" size={20} />
        <h4>Charger des Profils depuis GitHub Gist</h4>
      </div>

      <div className="gist-reader-content">
        <div className="gist-gist-info">
          <span className="gist-gist-id">
            <strong>Gist ID:</strong> {gistId}
          </span>
          <a
            href={`https://gist.github.com/${gistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gist-view-link"
          >
            <GitHub size={14} />
            Voir le Gist
          </a>
        </div>

        {loadStatus.type !== 'idle' && (
          <div className={`gist-status gist-status--${loadStatus.type}`}>
            {isLoading && <Loader className="gist-status-icon" size={14} />}
            {loadStatus.type === 'success' && (
              <CheckCircle className="gist-status-icon" size={14} />
            )}
            {loadStatus.type === 'error' && (
              <AlertCircle className="gist-status-icon" size={14} />
            )}
            <span>{loadStatus.message}</span>
            {loadStatus.profilesCount && (
              <span className="gist-count">
                ({loadStatus.profilesCount} profils)
              </span>
            )}
          </div>
        )}

        <div className="gist-actions">
          <button
            onClick={loadProfiles}
            disabled={isLoading || !gistId.trim()}
            className="gist-load-button"
          >
            {isLoading ? (
              <>
                <Loader size={14} />
                Chargement...
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Recharger les Profils
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
