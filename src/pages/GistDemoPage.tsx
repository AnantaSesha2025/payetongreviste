import { useState } from 'react';
import { GistProfileWriter } from '../components/GistProfileWriter';
import { GistProfileReader } from '../components/GistProfileReader';
import { useGistProfiles } from '../hooks/useGistProfiles';
import { SwipeDeck } from '../components/SwipeDeck';
import type { Profile } from '../store';
import './GistDemoPage.css';

export function GistDemoPage() {
  const [gistId, setGistId] = useState('');
  const [showReader, setShowReader] = useState(false);

  const { profiles, error } = useGistProfiles({
    gistId: showReader ? gistId : undefined,
    autoLoad: false,
  });

  const handleUploadSuccess = (gistUrl: string) => {
    // Extract Gist ID from URL
    const id = gistUrl.split('/').pop();
    if (id) {
      setGistId(id);
      setShowReader(true);
    }
  };

  const handleProfilesLoaded = (loadedProfiles: Profile[]) => {
    console.log('Profils chargés:', loadedProfiles);
  };

  const handleError = (error: string) => {
    console.error('Erreur:', error);
  };

  return (
    <div className="gist-demo-page">
      <div className="gist-demo-header">
        <h1>GitHub Gist - Gestion des Profils</h1>
        <p>
          Générez des profils d'activistes et chargez-les depuis GitHub Gist
        </p>
      </div>

      <div className="gist-demo-content">
        <section className="gist-demo-section">
          <h2>1. Générer et Uploader des Profils</h2>
          <GistProfileWriter
            onSuccess={handleUploadSuccess}
            onError={handleError}
          />
        </section>

        {gistId && (
          <section className="gist-demo-section">
            <h2>2. Charger des Profils depuis Gist</h2>
            <GistProfileReader
              gistId={gistId}
              onProfilesLoaded={handleProfilesLoaded}
              onError={handleError}
              autoLoad={false}
            />
          </section>
        )}

        {profiles.length > 0 && (
          <section className="gist-demo-section">
            <h2>3. Aperçu des Profils Chargés</h2>
            <div className="gist-demo-preview">
              <p className="gist-demo-stats">
                {profiles.length} profils chargés depuis le Gist
              </p>

              <div className="gist-demo-cards">
                <SwipeDeck
                  onCreateProfile={() => console.log('Create profile clicked')}
                />
              </div>
            </div>
          </section>
        )}

        {error && (
          <section className="gist-demo-section">
            <div className="gist-demo-error">
              <h3>Erreur</h3>
              <p>{error}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
