import { useState } from 'react';
import { GitHub, CheckCircle, AlertCircle, Loader, Users } from 'react-feather';
import { githubGistService } from '../lib/githubGist';
import { generateFakeProfiles } from '../lib/fakeProfiles';
import './GistProfileWriter.css';

interface GistProfileWriterProps {
  onSuccess?: (gistUrl: string) => void;
  onError?: (error: string) => void;
}

export function GistProfileWriter({
  onSuccess,
  onError,
}: GistProfileWriterProps) {
  const [githubToken, setGithubToken] = useState('');
  const [gistDescription, setGistDescription] = useState(
    "PayeTonGréviste - Profils d'activistes"
  );
  const [profileCount, setProfileCount] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    message: string;
    gistUrl?: string;
  }>({ type: 'idle', message: '' });

  const handleUpload = async () => {
    if (!githubToken.trim()) {
      setUploadStatus({
        type: 'error',
        message: 'Veuillez entrer un token GitHub',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: 'idle', message: '' });

    try {
      // Generate fake profiles
      const profiles = generateFakeProfiles(profileCount);

      // Upload to Gist
      const result = await githubGistService.createGist(
        profiles,
        githubToken,
        gistDescription
      );

      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: `${profileCount} profils uploadés avec succès!`,
          gistUrl: result.gistUrl,
        });
        onSuccess?.(result.gistUrl!);
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || "Erreur lors de l'upload",
        });
        onError?.(result.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur inconnue';
      setUploadStatus({
        type: 'error',
        message: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const copyGistUrl = () => {
    if (uploadStatus.gistUrl) {
      navigator.clipboard.writeText(uploadStatus.gistUrl);
      setUploadStatus(prev => ({
        ...prev,
        message: 'URL copiée dans le presse-papiers!',
      }));
    }
  };

  const resetForm = () => {
    setUploadStatus({ type: 'idle', message: '' });
  };

  return (
    <div className="gist-profile-writer">
      <div className="gist-writer-header">
        <GitHub className="gist-icon" size={24} />
        <h3>Générer et Uploader des Profils</h3>
      </div>

      <div className="gist-writer-content">
        <div className="gist-form-grid">
          <div className="gist-form-group">
            <label htmlFor="github-token">
              Token GitHub <span className="required">*</span>
            </label>
            <input
              id="github-token"
              type="password"
              value={githubToken}
              onChange={e => setGithubToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="gist-input"
              disabled={isUploading}
            />
            <small className="gist-help-text">
              Votre token personnel GitHub avec les permissions 'gist'
            </small>
          </div>

          <div className="gist-form-group">
            <label htmlFor="gist-description">Description du Gist</label>
            <input
              id="gist-description"
              type="text"
              value={gistDescription}
              onChange={e => setGistDescription(e.target.value)}
              className="gist-input"
              disabled={isUploading}
            />
          </div>

          <div className="gist-form-group">
            <label htmlFor="profile-count">Nombre de profils à générer</label>
            <input
              id="profile-count"
              type="number"
              min="1"
              max="100"
              value={profileCount}
              onChange={e =>
                setProfileCount(
                  Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                )
              }
              className="gist-input"
              disabled={isUploading}
            />
            <small className="gist-help-text">Entre 1 et 100 profils</small>
          </div>
        </div>

        {uploadStatus.type !== 'idle' && (
          <div className={`gist-status gist-status--${uploadStatus.type}`}>
            {isUploading && <Loader className="gist-status-icon" size={16} />}
            {uploadStatus.type === 'success' && (
              <CheckCircle className="gist-status-icon" size={16} />
            )}
            {uploadStatus.type === 'error' && (
              <AlertCircle className="gist-status-icon" size={16} />
            )}
            <span>{uploadStatus.message}</span>
          </div>
        )}

        {uploadStatus.type === 'success' && uploadStatus.gistUrl && (
          <div className="gist-success-actions">
            <a
              href={uploadStatus.gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gist-link-button"
            >
              <GitHub size={16} />
              Voir le Gist
            </a>
            <button onClick={copyGistUrl} className="gist-copy-button">
              Copier l'URL
            </button>
          </div>
        )}

        <div className="gist-actions">
          {uploadStatus.type === 'idle' || uploadStatus.type === 'error' ? (
            <button
              onClick={handleUpload}
              disabled={isUploading || !githubToken.trim()}
              className="gist-upload-button"
            >
              {isUploading ? (
                <>
                  <Loader size={16} />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Users size={16} />
                  Générer et Uploader {profileCount} Profils
                </>
              )}
            </button>
          ) : (
            <button onClick={resetForm} className="gist-reset-button">
              Nouvelle Génération
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
